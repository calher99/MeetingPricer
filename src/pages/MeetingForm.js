import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  createTheme,
  CircularProgress,
  Snackbar,
  Alert,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import MeetingTimer from "./MeetingTimer";
import PositionForm from "../components/PositionForm";
import PositionRow from "../components/PositionTable";

const REGEX_TEST = /^\d+$/;

const theme = createTheme({
  palette: {
    primary: {
      main: "#8bc34a",
    },
  },
});

export default function MeetingForm() {
  // Get initial saved positions from localStorage if any, else default to empty array
  const initialSavedPositions =
    JSON.parse(localStorage.getItem("meetingPricerInfo")) || [];

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
  const [savedPositions, setSavedPositions] = useState(initialSavedPositions);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState(false);
  const [expectedPrice, setExpectedPrice] = useState();
  const [startTime, setStartTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [hourlyRate, setHourlyRate] = useState();

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    // Save positions to localStorage whenever savedPositions state changes
    localStorage.setItem("meetingPricerInfo", JSON.stringify(savedPositions));
  }, [savedPositions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let sum = 0;
    inputFields.forEach((input) => {
      sum = sum + parseInt(input.salary) * parseInt(input.attendees);
    });
    checkValid(inputFields);
    setHourlyRate(sum);
    setExpectedPrice(sum * (duration / 60));
    setStartTime(new Date());
    setShowTimer(true);

    setLoading(false);
    setSnackbarMessage("Meeting successfully started!");
    setSnackbarOpen(true);
    setSnackbarSeverity("success");
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
    checkValid(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      {
        id: uuidv4(),
        position: "",
        attendees: "",
        attendeesError: false,
        salaryError: false,
        salary: "",
      },
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
    let isValid = true;
    if (duration === "" || durationError) {
      isValid = false;
    } else {
      values.forEach((value) => {
        if (value.attendeesError || value.salaryError) {
          isValid = false;
        }
      });
    }
    setButtonDisabled(!isValid);
  };
  const handleDurationChange = (e) => {
    setDuration(e.target.value);

    if (!REGEX_TEST.test(e.target.value)) {
      setDurationError(true);
    } else {
      setDurationError(false);
    }
    checkValid(inputFields);
  };

  const handleClose = () => {
    setShowTimer(false);
  };

  const handlePositionChange = (id, value) => {
    const newInputFields = inputFields.map((input) => {
      if (id === input.id) {
        input.position = value;

        const position = savedPositions.find(
          (savedPosition) => savedPosition.position === value
        );
        if (position) {
          input.salary = position.salary;
        }
      }
      return input;
    });

    setInputFields(newInputFields);
    checkValid(inputFields);
  };

  const handleNewPosition = (input) => {
    const pos = {
      id: uuidv4(),
      position: input.position,
      salary: input.salary,
    };
    setSavedPositions((prev) => {
      return [...prev, pos];
    });
  };

  const handleDeletePosition = (id) => {
    const values = [...savedPositions];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setSavedPositions(values);
  };
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h3" sx={{mt:5}}>Meeting Form</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          
          <Grid container direction="row" item  alignItems="stretch" spacing={1} sx={{mt:3}}>
              <Grid item xs={12} md={12} lg={8}>
              <form onSubmit={(e) => handleSubmit(e)}>
                <Box>
                  <TextField
                    name="duration"
                    label="Duration of meeting (minutes)"
                    error={durationError}
                    // helperText={durationError ? "Must be a number" : ""}
                    variant="outlined"
                    required
                    value={duration}
                    onChange={handleDurationChange}
                    sx={{ mr: 2 , width: "40%"}}
                  />
                </Box>
                {inputFields.map((inputField) => (
                  <Box key={inputField.id} sx={{ display: "flex", mt: 2 }}>
                    <Autocomplete
                      freeSolo
                      sx={{ mr: 2, width: "30%"}}
                      options={savedPositions.map(
                        (savedPosition) => savedPosition.position
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="position"
                          label="Job position"
                          variant="outlined"
                          value={inputField.position}
                         
                        />
                      )}
                      onInputChange={(event, value) =>
                        handlePositionChange(inputField.id, value)
                      }
                    />
                    <TextField
                      name="attendees"
                      label="Number of attendees"
                      error={inputField.attendeesError}
                      helperText={
                        inputField.attendeesError ? "Must be a number" : ""
                      }
                      variant="outlined"
                      required
                      value={inputField.attendees}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      name="salary"
                      label="Hourly rate (€)"
                      variant="outlined"
                      error={inputField.salaryError}
                      helperText={
                        inputField.salaryError ? "Must be a number" : ""
                      }
                      required
                      value={inputField.salary}
                      onChange={(event) =>
                        handleChangeInput(inputField.id, event)
                      }
                    />
                    <IconButton
                      disabled={inputFields.length === 1}
                      onClick={() => handleRemoveFields(inputField.id)}
                      sx={{
                        color: "primary.main",
                        "&:hover": { color: "primary.dark" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleAddFields}
                      sx={{
                        color: "primary.main",
                        "&:hover": { color: "primary.dark" },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<Icon>send</Icon>}
                  onClick={handleSubmit}
                  sx={{ mt: 3, backgroundColor: "#8bc34a" }}
                  disabled={buttonDisabled}
                >
                  Start Meeting
                </Button>
              </form>
              </Grid>
           
            <Grid item xs={12} md={12} lg={4} sx={{mt:3}}>
              <Typography variant="h5">Job positions & Hourly rates saved</Typography>
              {savedPositions.length > 0 ? (
                <TableContainer component={Paper} sx={{ border: '1px solid #ddd' , maxWidth: "550px"}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Position</TableCell>
                        <TableCell align="right">Hourly rate (€)</TableCell>
                        <TableCell sx={{ width: 2 }}>Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {savedPositions.map((position) => (
                        <PositionRow
                          position={position}
                          onSubmit={handleDeletePosition}
                          key={position.id}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No positions saved</Typography>
              )}
              <PositionForm onSubmit={handleNewPosition} />
            </Grid>
          </Grid>
        )}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      {showTimer && (
        <MeetingTimer
          startTime={startTime}
          spentPerHour={hourlyRate}
          expectedPrice={expectedPrice}
          onClose={handleClose}
        />
      )}
    </ThemeProvider>
  );
}
