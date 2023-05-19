import { IconButton, TableCell, TableRow } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function PositionRow({ position, onSubmit }) {
  return (
    <TableRow key={position.id}>
      <TableCell component="th" scope="row" >
        {position.position}
      </TableCell>
      <TableCell align="right">{position.salary}</TableCell>
      <TableCell>
        <IconButton
          size="small"
          sx={{ '&:hover': { color: 'red' } }} // Change color to red when hovered
          onClick={() => {
            onSubmit(position.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default PositionRow;