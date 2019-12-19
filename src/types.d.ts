export interface ICalendar {
    id: string;
    name: string;
    accessRole: AccessRole;
}

type AccessRole = "reader" | "owner" | "freeBusyReader" | "writer";