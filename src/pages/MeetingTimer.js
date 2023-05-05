import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import styles from "./MeetingTimer.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MeetingSummary from "./MeetingSummary";
import Chronometer from "../components/Chronometer";

function MeetingTimer({ startTime, spentPerHour, onClose, expectedPrice }) {
  const [price, setPrice] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);

  useEffect(() => {
    if (!stopTimer) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const elapsedHours = (now.getTime() - startTime.getTime()) / 3600000;
        const price = elapsedHours * spentPerHour;
        setPrice(price.toFixed(2));
        setProgress((price / expectedPrice) * 100);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, spentPerHour, expectedPrice, stopTimer]);

  const handleMeetingFinished = () => {
    setStopTimer(true);
    setHasFinished(true);
  };
  const handleReturn = () => {
    setStopTimer(true);
    onClose();
  };
  const handleCloseSummary = () => {
    setHasFinished(false);
  };

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay}></div>
      <div className={styles.meetingTimer}>
        <div className={styles.header}>
          Estimated cost: {Math.round(expectedPrice * 100) / 100} €
        </div>
        <Chronometer onClose={stopTimer} />
        <div className={styles.progress}>
          {progress < 100 && (
            <CircularProgressbar
              value={progress}
              text={`${price}€`}
              styles={buildStyles({
                pathColor: "#4caf50",
                textSize: "14px",
              })}
            />
          )}
          {progress > 100 && (
            <CircularProgressbar
              value={progress}
              text={`${price}€`}
              styles={buildStyles({
                textColor: "red",
                pathColor: "red",
                textSize: "14px",
              })}
            />
          )}
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
        <MeetingSummary
          totalCost={price}
          expectedCost={expectedPrice}
          onClose={handleCloseSummary}
        />
      )}
    </>,
    document.querySelector("#overlays")
  );
}

export default MeetingTimer;
