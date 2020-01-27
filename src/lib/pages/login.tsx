import React from "react";
import loginNormal from "../../assets/loginNormal.png";
import { Link } from "react-router-dom";

const clientId = "1080184656423-ck1cjti8dmkl9sh2q8k3m0buk2ql01de.apps.googleusercontent.com";
const redirectUri = "https://compositecalendar.com/auth";
const scope = "https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/drive.appdata";
const googleUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    message: string;
}

export default ({ message, style, ...rest }: IProps) => {
    return (
        <div style={{ ...defaultStyle, ...rest }} {...rest}>
            <div style={panelStyle}>
                <div style={{
                    fontSize: "30pt",
                }}>
                    Composite Calendar
                </div >
                <a href={googleUri}>
                    <img style={{ width: "150px" }} src={loginNormal} />
                </a>
                {message}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    padding: "4px",
                    gap: "4px",
                }}>
                    <Link to="/terms">Terms</Link>
                    <Link to="/privacy">Privacy</Link>
                </div>
            </div>
        </div >
    );
};

const defaultStyle: React.CSSProperties = {
    display: "grid",
    height: "100%",
    placeItems: "center",
};

const panelStyle: React.CSSProperties = {
    display: "grid",
    placeItems: "center",
    gap: "10px",
    padding: "40px",
    border: "1px solid black",
    borderRadius: "8px",
    backgroundColor: "lavender",
};
