
terraform {
  backend "gcs" {
    bucket = "compositecalendar-tf"
    prefix = "client"
  }
}

data "terraform_remote_state" "infrastructure" {
  backend = "gcs"
  config = {
    bucket = "compositecalendar-tf"
    prefix = "infrastructure"
  }
}

provider "google" {
  project = "compositecalendar"
}

provider "google-beta" {
  project = "compositecalendar"
}

provider "kubernetes" {
  load_config_file       = "false"
  host                   = data.terraform_remote_state.infrastructure.outputs.host
  client_certificate     = base64decode(data.terraform_remote_state.infrastructure.outputs.client_certificate)
  client_key             = base64decode(data.terraform_remote_state.infrastructure.outputs.client_key)
  cluster_ca_certificate = base64decode(data.terraform_remote_state.infrastructure.outputs.ca_certificate)
}

locals {
  version   = jsondecode(file("./package.json")).version
  appname   = trimprefix(jsondecode(file("./package.json")).name, "@hattmo/")
  imagename = trimprefix(jsondecode(file("./package.json")).name, "@")
}


resource "kubernetes_deployment" "app" {
  metadata {
    name = local.appname
    labels = {
      app = local.appname
    }
  }
  spec {
    replicas = 3
    selector {
      match_labels = {
        app = local.appname
      }
    }
    template {
      metadata {
        labels = {
          app = local.appname
        }
      }
      spec {
        container {
          name  = local.appname
          image = local.imagename
        }
      }
    }
  }
}

resource "google_dns_managed_zone" "compositecalendar-zone" {
  name     = "compositecalendar"
  dns_name = "compositecalendar.com."
  dnssec_config {
    kind          = "dns#managedZoneDnsSecConfig"
    non_existence = "nsec3"
    state         = "on"

    default_key_specs {
      algorithm  = "rsasha256"
      key_length = 2048
      key_type   = "keySigning"
      kind       = "dns#dnsKeySpec"
    }
    default_key_specs {
      algorithm  = "rsasha256"
      key_length = 1024
      key_type   = "zoneSigning"
      kind       = "dns#dnsKeySpec"
    }
  }
}

resource "google_dns_record_set" "compositecalendar-record" {
  name         = "compositecalendar.com."
  rrdatas      = ["34.102.171.222"]
  ttl          = "300"
  type         = "A"
  managed_zone = google_dns_managed_zone.compositecalendar-zone.name
}


resource "google_compute_managed_ssl_certificate" "compositecalendar-cert" {
  provider = google-beta

  name = "compositecalendar"

  managed {
    domains = ["compositecalendar.com."]
  }
}