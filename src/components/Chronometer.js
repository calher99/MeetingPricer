import React, { useState, useEffect } from "react";

import styles from "./Chronometer.module.css";

const Chronometer = (props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!props.onClose) {
      const intervalId = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [props.onClose]);

  const formatTime = () => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className={styles.timer}>
      <p className={styles.timer}>{formatTime()}</p>
    </div>
  );
};

export default Chronometer;
