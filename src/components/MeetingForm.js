import React, { useRef, useState } from "react";
import MeetingTimer from "./MeetingTimer";
import styles from "./MeetingForm.module.css";

function MeetingForm() {

  const attendees= useRef()
  const salary= useRef()
  const duration= useRef()
  const [startTime, setStartTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);


  const handleInitiateMeeting = () => {
    setStartTime(new Date());
    setShowTimer(true);
  };

  const handleClose = () => {
    setShowTimer(false);
  };
  return (
    <>
      <div className={styles.form}>
        <div>
          <h1>Meeting Form</h1>
          <form>
            <label htmlFor="attendees">Number of attendees:</label>
            <input
              type="number"
              id="attendees"
              ref={attendees}
            />
            <br />
            <label htmlFor="salary">Salary per hour:</label>
            <input
              type="number"
              id="salary"
              ref={salary}
            />
            <label htmlFor="duration">Meting duration (minutes):</label>
            <input
              type="number"
              id="duration"
              ref={duration}
            />
          </form>
          <button onClick={handleInitiateMeeting}>Initiate Meeting</button>
        </div>
      </div>
      {showTimer && (
        <MeetingTimer
          startTime={startTime}
          spentPerHour={attendees.current.value*salary.current.value}
          expectedPrice = {(duration.current.value / 60)*salary.current.value*attendees.current.value}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default MeetingForm;
