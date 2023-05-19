import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

function PositionForm(props) {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const formSchema = Yup.object().shape({
    position: Yup.string()
      .typeError("Must be a word")
      .required("Position is required"),
    salary: Yup.number()
      .typeError("Must be a number")
      .required("Rate is required"),
  });

  const methods = useForm({
    resolver: yupResolver(formSchema),
  });

  const submitFormHandler = (data) => {
    setLoading(true);
    props.onSubmit(data);
    setLoading(false);
    setSnackbarMessage("Position successfully added!");
    setSnackbarOpen(true);
    setSnackbarSeverity("success");
    methods.reset({
      position: "",
      salary: "",
    });
    //Pass the data to parent component
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitFormHandler)}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Add a new Job position</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
            <TextField
              name="newPosition"
              label="New Position"
              variant="outlined"
              {...methods.register("position")}
              error={!!methods.formState.errors.position}
              helperText={methods.formState.errors.position?.message ?? ""}
            />
            <TextField
              name="newSalary"
              label="New Hourly Rate (€)"
              variant="outlined"
              {...methods.register("salary")}
              error={!!methods.formState.errors.salary}
              helperText={methods.formState.errors.salary?.message ?? ""}
            />
          </Box>
          <Button
            type="submit"
            sx={{ mt: 2, backgroundColor: "#8bc34a" }}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </FormProvider>
  );
}

export default PositionForm;
