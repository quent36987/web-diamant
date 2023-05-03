import React, { useState, useEffect } from "react";
import "./countdown.css";


interface IProps {
    count: number;
    launch: boolean;
}

function Countdown(props: IProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setSeconds(props.count);
    }, [props.count, props.launch]);

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
