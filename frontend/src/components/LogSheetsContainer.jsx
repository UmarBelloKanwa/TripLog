import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import LogDayCanvas from "./LogDayCanvas";
import LogDaySummary from "./LogDaySummary";

export default function LogSheetsContainer({ logsData }) {
  const [logData, setLogData] = useState([]);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const logs = logsData["canvas_logs"];
    if (logs && logs.length > 0) {
      setLogData(logs);
      setActiveDay(logs[0].log_day);
    }
  }, [logsData]);

  const handleChange = (event, newValue) => {
    setActiveDay(newValue);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ m: 0 }}>
          Driver Hours of Service
        </Typography>
      </Box>

      {logData.length > 0 && (
        <>
          <Tabs
            value={activeDay}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {logData.map((log) => (
              <Tab
                key={log.log_day}
                label={`Day ${log.log_day}`}
                value={log.log_day}
              />
            ))}
          </Tabs>

          {logData.map((log) =>
            log.log_day === activeDay ? (
              <Card key={log.log_day} sx={{ p: 0 }} elevation={0}>
                <CardMedia
                  component="div"
                  sx={{
                    height: "fit-content",
                    width: "100%",
                    m: "0",
                    borderRadius: 9,
                    p: 0,
                  }}
                >
                  <LogDayCanvas log={log} />
                </CardMedia>
                <CardContent>
                  <LogDaySummary log={log} />
                </CardContent>
              </Card>
            ) : null
          )}
        </>
      )}
    </Box>
  );
}
