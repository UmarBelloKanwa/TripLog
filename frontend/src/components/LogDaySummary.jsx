import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

export default function LogDaySummary({ log }) {
  const items = [
    { label: "Off Duty", value: log.totals.OFF },
    { label: "Sleeper Berth", value: log.totals.SB },
    { label: "Driving", value: log.totals.D },
    { label: "On Duty", value: log.totals.ON },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 0 }}>
      {items.map((item) => (
        <Grid item xs={6} md={3} key={item.label} sx={{ m: 0 }}>
          <Paper elevation={1} sx={{ p: 2, pl: 1, pr: 1, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
