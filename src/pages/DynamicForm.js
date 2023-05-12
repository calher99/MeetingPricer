import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { v4 as uuidv4 } from "uuid";
import MeetingTimer from "./MeetingTimer";

const REGEX_TEST = /^\d+$/;
export default function DynamicForm() {
  const [inputFields, setInputFields] = useState([
    {
      id: uuidv4(),
      position: "",
      attendees: "",
      attendeesError: false,
      salaryError: false,
      salary: "",
    },
  ]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState(false);
  const [expectedPrice, setExpectedPrice] = useState();
  const [startTime, setStartTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [hourlyRate, setHourlyRate] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    let sum = 0;
    inputFields.forEach((input) => {
      sum = sum + parseInt(input.salary) * parseInt(input.attendees);
    });
    setHourlyRate(sum);
    setExpectedPrice(sum * (duration / 60));
    setStartTime(new Date());
    setShowTimer(true);
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map((input) => {
      if (id === input.id) {
        input[event.target.name] = event.target.value;
        //Validation
        if (event.target.name === "attendees") {
          if (!REGEX_TEST.test(event.target.value)) {
            input.attendeesError = true;
          } else {
            input.attendeesError = false;
          }
        }
        if (event.target.name === "salary") {
          if (!REGEX_TEST.test(event.target.value)) {
            input.salaryError = true;
          } else {
            input.salaryError = false;
          }
        }
      }
      return input;
    });

    setInputFields(newInputFields);
    checkValid(inputFields);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { id: uuidv4(), firstName: "", lastName: "" },
    ]);
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  const checkValid = (values) => {
    values.forEach((value) => {
      if (value.attendeesError || value.salaryError) {
        setButtonDisabled(true);
      } else {
        setButtonDisabled(false);
      }
    });
  };
  const handleDurationChange = (e) => {
    setDuration(e.target.value);

    if (!REGEX_TEST.test(e.target.value)) {
      setDurationError(true);
    } else {
      setDurationError(false);
    }
  };

  const handleClose = () => {
    setShowTimer(false);
  };
  return (
    <>
      <Container>
        <h1>Meeting Form</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Box>
            <TextField
              name="duration"
              label="Duration of meeting"
              error={durationError}
              helperText={durationError ? "Must be a number" : ""}
              variant="outlined"
              required
              value={duration}
              onChange={handleDurationChange}
              sx={{ mr: 2 }}
            />
          </Box>
          {inputFields.map((inputField) => (
            <Box key={inputField.id} sx={{ display: "flex", mt: 2 }}>
              <TextField
                name="position"
                label="Position"
                variant="outlined"
                value={inputField.position}
                onChange={(event) => handleChangeInput(inputField.id, event)}
                sx={{ mr: 2 }}
              />
              <TextField
                name="attendees"
                label="Number of attendees"
                error={inputField.attendeesError}
                helperText={inputField.attendeesError ? "Must be a number" : ""}
                variant="outlined"
                required
                value={inputField.attendees}
                onChange={(event) => handleChangeInput(inputField.id, event)}
                sx={{ mr: 2 }}
              />
              <TextField
                name="salary"
                label="Salary (€)"
                variant="outlined"
                error={inputField.salaryError}
                helperText={inputField.salaryError ? "Must be a number" : ""}
                required
                value={inputField.salary}
                onChange={(event) => handleChangeInput(inputField.id, event)}
              />
              <IconButton
                disabled={inputFields.length === 1}
                onClick={() => handleRemoveFields(inputField.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={handleAddFields}>
                <AddIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            
            type="submit"
            endIcon={<Icon>send</Icon>}
            onClick={handleSubmit}
            sx={{ mt: 3 , backgroundColor: "#8bc34a"}}
            disabled={buttonDisabled}
          >
            Start Meeting
          </Button>
        </form>
      </Container>
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
