import React from 'react';
import styles from './MeetingSummary.module.css';

const MeetingSummary = ({ totalCost, expectedCost, onClose }) => {
  const savedAmount = (expectedCost - totalCost).toFixed(2);
  const savedPercentage = ((savedAmount / expectedCost) * 100).toFixed(2);
    const handleClose= () => {
        onClose()
    }
  return (
    <div className={styles.meetingSummary}>
      <h2 className={styles.title}>Meeting Summary</h2>
      <p>Total cost: {totalCost} €</p>
      <p>Expected cost: {expectedCost.toFixed(2)} €</p>
      {savedAmount > 0 ? (
        <p>You saved {savedAmount} € ({savedPercentage}%)</p>
      ) : (
        <p>You went over the expected cost by {Math.abs(savedAmount)} €</p>
      )}
      <button className={styles.button} onClick={handleClose}>
            Return
          </button>
    </div>
  );
};

export default MeetingSummary;