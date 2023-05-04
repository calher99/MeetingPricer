import React from "react";
import ReactDom from "react-dom";
import styles from "./MeetingSummary.module.css";
import Confetti from "../components/Confetti";
import Emoji from "../components/Emoji";

const MeetingSummary = ({ totalCost, expectedCost, onClose }) => {
  const savedAmount = (expectedCost - totalCost).toFixed(2);
  const savedPercentage = ((savedAmount / expectedCost) * 100).toFixed(2);
  const handleClose = () => {
    onClose();
  };
 
  return ReactDom.createPortal(
    <>
      {savedAmount > 0  && <Confetti></Confetti>}
      <div className={styles.overlay}></div>
      <div className={styles.meetingSummary}>
        <h2 className={styles.title}>Meeting Summary</h2>
        <div className={styles.cost}>
          <div>
            <Emoji label="money" symbol="💰"></Emoji>
          </div>
          <div>Total cost: {totalCost} €</div>
          <div><Emoji label="money" symbol="💰"></Emoji></div>
          
          </div>
          
        {savedAmount > 0 ? (
          
          <div className={styles.saved}>
            You saved {savedAmount} € ({savedPercentage}%)
          </div>
        ) : (
          <div className={styles.saved}>You went over the expected cost by {Math.abs(savedAmount)} €</div>
        )}
        <button className={styles.button} onClick={handleClose}>
          Return
        </button>
      </div>
    </>,
    document.querySelector("#overlays")
  );
};

export default MeetingSummary;
