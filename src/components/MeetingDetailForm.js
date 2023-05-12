import React, { useRef, useState } from "react";
import MeetingTimer from "../pages/MeetingTimer";
import styles from "./MeetingDetailForm.module.css";

function MeetingDetailForm() {
  const [values, setValues] = useState({ val: ["", "", ""] });
  const [expectedPrice, setExpectedPrice] = useState();
  const [hourlyRate, setHourlyRate] = useState();
  const [startTime, setStartTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const duration = useRef();

  function createInputs() {
    return values.val.map((el, i) => {
      const isJobCategory = i % 3 === 0;
      const isAttendees = i % 3 === 1;
      const isHourlyRate = i % 3 === 2;
      return (
        
          <div key={i} className={styles.dynamicFormAll}>
            <div className={styles.dynamicFormLabelInput}>
              {isJobCategory && (
                <label
                  className={styles.dynamicFormLabel}
                  htmlFor={`job-category-${i}`}
                >
                  Job Category:
                </label>
              )}
              {isAttendees && (
                <label
                  className={styles.dynamicFormLabel}
                  htmlFor={`attendees-${i}`}
                >
                  Number of Attendees:
                </label>
              )}
              {isHourlyRate && (
                <label
                  className={styles.dynamicFormLabel}
                  htmlFor={`hourly-rate-${i}`}
                >
                  Hourly Rate:
                </label>
              )}
              <input
                className={styles.dynamicFormInput}
                type={isAttendees || isHourlyRate ? "number" : "text"}
                id={
                  isJobCategory
                    ? `job-category-${i}`
                    : isAttendees
                    ? `attendees-${i}`
                    : `hourly-rate-${i}`
                }
                value={el || ""}
                onChange={handleChange.bind(i)}
              />
            </div>
            
            <div className={styles.dynamicFormRemove}>
              {isHourlyRate && (
                <input
                  type="button"
                  value="remove"
                  name={i}
                  onClick={removeClick.bind(i)}
                />
              )}
            </div>
            
          </div>
      
        
      );
    });
  }

  function handleChange(event) {
    let vals = [...values.val];
    vals[this] = event.target.value;
    console.log(vals)
    console.log(vals.length)
    if(parseInt(vals[1])<0){
      
    }
    setValues({ val: vals });
  }

  const addClick = () => {
    setValues({ val: [...values.val, "", "", ""] });
  };

  const removeClick = (event) => {
    let vals = [...values.val];
    let index = Number(event.target.name);
    vals.splice(index - 2, 3);
    setValues({ val: vals });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let loops = 0;
    let sum = 0;
    for (let i = 0; i < values.val.length; i++) {
      if (i === 2 + 3 * loops) {
        loops++;
        sum = sum + values.val[i - 1] * values.val[i];
      }
    }
    setHourlyRate(sum);
    setExpectedPrice((duration.current.value / 60) * sum);
    setStartTime(new Date());
    setShowTimer(true);
  };
  const handleClose = () => {
    setShowTimer(false);
  };

  return (
    <>
      <div className={styles.form}>
        <h1>Meeting Form</h1>
        <form className={styles.fullForm} onSubmit={handleSubmit}>
          <div className={styles.durationForm}>
            <label htmlFor="duration">Meting duration (minutes):</label>
            <input type="number" id="duration" ref={duration} />
          </div>
          <div className={styles.dynamicForm}>{createInputs()}</div>
          <div className={styles.buttonDiv}>
            <input type="button" value="add more" onClick={addClick} />
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
      {showTimer && (
        <MeetingTimer
          startTime={startTime}
          spentPerHour={hourlyRate}
          expectedPrice={expectedPrice}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default MeetingDetailForm;
