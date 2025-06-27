//npm install @nivo/core @nivo/line @mui/material @emotion/react @emotion/styled .installed --added theme.js--Updated App.js and mockData.js
// src/components/LineChart.jsx
import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import {
  Box,
  FormControl, // For wrapping Select
  InputLabel,   // For the label of the Select
  Select,      // The dropdown component
  MenuItem,    // Options within the Select
  Typography,
} from "@mui/material";
import { mockLineData } from "../data/mockData";


const LineChart = ({ isCustomLineColors = false, isDashboard = false, title = "Chart Title" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.dark ?? '#212121';


  const [timeframe, setTimeframe] = useState('monthly');

  // Dynamically filter data based on the selected timeframe
  const selectedData = mockLineData.filter(series => {
    const seriesType = series.id.split(' ')[0].toLowerCase(); // Extracts "daily", "weekly", "monthly"
    return seriesType === timeframe;
  });

  const handleChangeTimeframe = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <Box>
      {/* Chart Heading and Timeframe selection dropdown in one row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="1rem">
        {/* Chart Heading */}
        <Typography
          variant="h6" // You can adjust the variant (e.g., h4, h5) as needed
          color={neutralDark}
          sx={{ flexGrow: 1, textAlign: 'center', mr: 2 }} // Center heading and push dropdown to right
        >
          {title}
        </Typography>

        {/* Timeframe selection dropdown - Re-enabled */}
        <FormControl variant="outlined" sx={{ minWidth: 100, maxWidth: 120 }}>
          <InputLabel id="timeframe-select-label" sx={{ color: neutralDark }}>Timeframe</InputLabel>
          <Select
            labelId="timeframe-select-label"
            id="timeframe-select"
            value={timeframe}
            label="Timeframe"
            onChange={handleChangeTimeframe}
            size="small" // Make the select input smaller
            sx={{
              color: neutralDark,
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: neutralDark,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: neutralDark,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: neutralDark,
              },
              '.MuiSvgIcon-root': {
                color: neutralDark, // Dropdown arrow color
              },
            }}
            MenuProps={{
                PaperProps: {
                    sx: {
                        backgroundColor: colors.primary[400], // Background of dropdown menu
                        color: neutralDark,
                    },
                },
            }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Line Chart */}
      <Box height={isDashboard ? "250px" : "400px"}>
        <ResponsiveLine
          data={selectedData}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: neutralDark,
                },
              },
              legend: {
                text: {
                  fill: neutralDark,
                },
              },
              ticks: {
                line: {
                  stroke: neutralDark,
                  strokeWidth: 1,
                },
                text: {
                  fill: neutralDark,
                },
              },
            },
            legends: {
              text: {
                fill: neutralDark,
              },
            },
            tooltip: {
              container: {
                color: primaryDark,
              },
            },
          }}
          colors={isCustomLineColors ? { datum: "color" } : { scheme: "nivo" }}
          margin={{ top: 50, right: 30, bottom: 100, left: 60 }} // Increased bottom margin to 120 (from 100), right to 30
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Period`,
            legendOffset: 50, // Adjusted legendOffset for axis label
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: isDashboard ? undefined : "Count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          // Nivo's built-in legends prop, adjusted for bottom placement
          legends={[
            {
              anchor: "bottom", // Anchor to the bottom of the chart container
              direction: "row", // Horizontal layout
              justify: false,
              translateX: 0, // Centered horizontally
              translateY: 100, // Move down further into the increased bottom margin
              itemsSpacing: 10,
              itemDirection: "left-to-right",
              itemWidth: 100,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default LineChart;
