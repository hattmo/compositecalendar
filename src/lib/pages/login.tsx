import React from "react";

const googleUri = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=1080184656423-2ue1gt1t85mhe98mac7nqipqhl2c55d4.apps.googleusercontent.com&redirect_uri=http://compositecalendar.hattmo.com/auth&scope=email&response_type=code';
interface IProps {
    isFailedLogin: boolean;
}

export default ({ isFailedLogin }: IProps) => {
    return (
        <div>
            <h1>
                Login
            </h1 >
            <button onClick={() => { location.href = googleUri; }}>Login</button>
            {isFailedLogin ? <p>Failed to login</p> : undefined}
        </div >
    );
};
