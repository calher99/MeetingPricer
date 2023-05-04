import React, { useEffect, useState } from "react";
import styles from "./MeetingTimer.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MeetingSummary from "./MeetingSummary";

function MeetingTimer({ startTime, spentPerHour, onClose, expectedPrice }) {
  const [price, setPrice] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!stopTimer) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const elapsedHours = (now.getTime() - startTime.getTime()) / 3600000;
        const price = elapsedHours * spentPerHour;
        setPrice(price.toFixed(2));
        setProgress((price / expectedPrice) * 100);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, spentPerHour, expectedPrice, stopTimer]);

  useEffect(() => {
    if (!stopTimer) {
      const intervalId = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [stopTimer]);

  const handleMeetingFinished = () => {
    setStopTimer(true);
    setHasFinished(true);
  };
  const handleReturn = () => {
    setStopTimer(true);
    onClose();
  };
  const handleCloseSummary = () => {
    setHasFinished(false)
  }

  const formatTime = (time) => {
    const padTime = (time) => {
      return time.toString().padStart(2, "0");
    };
  
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;
  
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };
  return (
    <>
      <div className={styles.meetingTimer}>
        <div className={styles.header}>Expected price: {Math.round(expectedPrice*100)/100} €</div>
        <div className={styles.header}>{formatTime(seconds)}</div>
        <div className={styles.progress}>
          <CircularProgressbar
            value={progress}
            text={`${price}€`}
            styles={buildStyles({
              pathColor: "#4caf50",
            })}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleMeetingFinished}>
            Meeting Finished
          </button>
          <button className={styles.button} onClick={handleReturn}>
            Return
          </button>
        </div>
      </div>
      {hasFinished && (
        <MeetingSummary totalCost={price} expectedCost={expectedPrice} onClose={handleCloseSummary}/>
      )}
    </>
  );
}

export default MeetingTimer;