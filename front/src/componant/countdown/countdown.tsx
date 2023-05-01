import React, { useState, useEffect } from "react";
import "./countdown.css";

function Countdown(count: number) {
    const [seconds, setSeconds] = useState(count);

    useEffect(() => {

        if(seconds > 0){
            const interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [seconds]);

    const formatSeconds = () => {
        const remainingSeconds = seconds % 60;
        return `${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div className="countdown-container">
            <div className="countdown-timer">{formatSeconds()}</div>
        </div>
    );
}

export { Countdown };
