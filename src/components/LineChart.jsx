//npm install @nivo/core @nivo/line @mui/material @emotion/react @emotion/styled .installed --added theme.js--Updated App.js and mockData.js
// src/components/LineChart.jsx
import React, { useState, useMemo, useCallback } from "react";
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
import { timeFormat } from 'd3-time-format'; // Import timeFormat for axis and tooltip
import { timeWeek, timeMonth, timeDay } from 'd3-time'; // Import d3-time for aggregation


// Helper to aggregate daily data to weekly
const aggregateDailyToWeekly = (dailyData) => {
  const weeklyMap = new Map();
  dailyData.forEach(d => {
    const date = new Date(d.x);
    // Get the start of the week (Sunday)
    const weekStart = timeWeek.floor(date);
    const weekKey = timeFormat('%Y-%m-%d')(weekStart); // Use date string as key and x-value

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { x: weekKey, y: 0 }); // Store date string as x
    }
    weeklyMap.get(weekKey).y += d.y;
  });
  // Sort by date to ensure correct order
  return Array.from(weeklyMap.values()).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};

// Helper to aggregate daily data to monthly
const aggregateDailyToMonthly = (dailyData) => {
  const monthlyMap = new Map();
  dailyData.forEach(d => {
    const date = new Date(d.x);
    const monthStart = timeMonth.floor(date);
    const monthKey = timeFormat('%Y-%m-%d')(monthStart); // Use date string as key and x-value

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { x: monthKey, y: 0 }); // Store date string as x
    }
    monthlyMap.get(monthKey).y += d.y;
  });
  // Sort by date to ensure correct order
  return Array.from(monthlyMap.values()).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};


const LineChart = ({ isCustomLineColors = false, isDashboard = false, title = "New Subscribers Growth" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.dark ?? '#212121';
  const accentColor = colors.primary?.main ?? '#3498db'; // For dropdown styling
  const cardBackground = colors['--card-background'] || '#ffffff'; // Get card background color


  const [timeframe, setTimeframe] = useState('monthly'); // Default to monthly
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month (0-indexed)
  const [selectedWeek, setSelectedWeek] = useState(''); // State for selected week (1-indexed)

  // Generate a list of months for the dropdown
  const months = useMemo(() => {
    const monthNames = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      monthNames.push({ value: i, label: timeFormat('%b')(date) }); // Value is 0-indexed month
    }
    return monthNames;
  }, []);

  // Generate a list of weeks for the dropdown based on the selected month
  const weeksInSelectedMonth = useMemo(() => {
    if (selectedMonth === '') return [];

    const weeks = [];
    const currentYear = new Date().getFullYear();
    const firstDayOfMonth = new Date(currentYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);

    let currentWeekStart = timeWeek.floor(firstDayOfMonth);
    let weekCounter = 1;

    while (currentWeekStart <= lastDayOfMonth) {
      const weekEnd = timeDay.offset(currentWeekStart, 6);
      weeks.push({
        value: weekCounter,
        label: `Week ${weekCounter}`,
        startDate: currentWeekStart,
        endDate: weekEnd > lastDayOfMonth ? lastDayOfMonth : weekEnd
      });
      currentWeekStart = timeDay.offset(currentWeekStart, 7);
      weekCounter++;
    }
    return weeks;
  }, [selectedMonth]);


  // Dynamically process data based on the selected timeframe, month, and week
  const processedData = useMemo(() => {
    // Separate paid and demo data from mockLineData
    const paidUsersSeries = mockLineData.find(series => series.id === "Paid Users");
    const demoUsersSeries = mockLineData.find(series => series.id === "Demo Users");

    if (!paidUsersSeries || !demoUsersSeries) {
      return []; // Return empty if data is missing
    }

    let paidData = paidUsersSeries.data;
    let demoData = demoUsersSeries.data;

    // Filter by selected month first for daily/weekly data
    if (selectedMonth !== '') {
      const currentYear = new Date().getFullYear();
      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);

      paidData = paidData.filter(d => {
        const date = new Date(d.x);
        return date >= monthStart && date <= monthEnd;
      });
      demoData = demoData.filter(d => {
        const date = new Date(d.x);
        return date >= monthStart && date <= monthEnd;
      });
    }

    // Then filter by selected week if a week is chosen (only applicable for daily data)
    if (selectedWeek !== '' && selectedMonth !== '' && timeframe === 'daily') {
      const weekInfo = weeksInSelectedMonth.find(w => w.value === selectedWeek);
      if (weekInfo) {
        paidData = paidData.filter(d => {
          const date = new Date(d.x);
          return date >= weekInfo.startDate && date <= weekInfo.endDate;
        });
        demoData = demoData.filter(d => {
          const date = new Date(d.x);
          return date >= weekInfo.startDate && date <= weekInfo.endDate;
        });
      }
    }

    switch (timeframe) {
      case 'daily':
        // Daily data is already in the correct format
        break;
      case 'weekly':
        paidData = aggregateDailyToWeekly(paidData);
        demoData = aggregateDailyToWeekly(demoData);
        break;
      case 'monthly':
        paidData = aggregateDailyToMonthly(paidData);
        demoData = aggregateDailyToMonthly(demoData);
        break;
      default:
        break;
    }

    return [
      { id: "Paid Users", color: paidUsersSeries.color, data: paidData },
      { id: "Demo Users", color: demoUsersSeries.color, data: demoData },
    ];
  }, [timeframe, selectedMonth, selectedWeek, weeksInSelectedMonth]);


  const handleChangeTimeframe = (event) => {
    setTimeframe(event.target.value);
    // Reset month and week selections when timeframe changes
    setSelectedMonth('');
    setSelectedWeek('');
  };

  // Date formatters based on timeframe for tooltip and axis
  const formatXAxisTick = useCallback((value) => {
    const date = new Date(value); // Always parse as a date
    if (timeframe === 'daily') {
      return timeFormat('%b %d')(date);
    } else if (timeframe === 'weekly') {
      return timeFormat('Week %U')(date); // Format as "Week XX"
    } else if (timeframe === 'monthly') {
      return timeFormat('%b %Y')(date);
    }
    return value;
  }, [timeframe]);

  // Removed formatTooltipX as it was unused.
  // const formatTooltipX = useCallback((value) => {
  //   const date = new Date(value); // Always parse as a date
  //   if (timeframe === 'daily') {
  //     return timeFormat('%b %d, %Y')(date);
  //   } else if (timeframe === 'weekly') {
  //     return `Week ${timeFormat('%U, %Y')(date)}`;
  //   } else if (timeframe === 'monthly') {
  //     return timeFormat('%b %Y')(date);
  //   }
  //   return value;
  // }, [timeframe]);

  // Determine tick values for the x-axis
  const xAxisTickValues = useMemo(() => {
    // Get all unique x-values (dates) from the processed data
    const allXValues = processedData.flatMap(series => series.data.map(d => d.x));
    const uniqueDates = Array.from(new Set(allXValues)).sort(); // Sort date strings

    const maxTicks = 7; // Target maximum number of ticks to display

    // If a specific month or week is selected, show all ticks for that period
    // Otherwise, apply spacing for "All" view
    if (selectedMonth !== '' || selectedWeek !== '') {
      return undefined; // Let Nivo determine the ticks, which for 'point' scale will show all
    }

    const ticks = [];
    let step;

    if (timeframe === 'daily') {
      // For daily, if many days, show fewer ticks (e.g., every 5th or 7th day)
      step = Math.ceil(uniqueDates.length / maxTicks);
      // Ensure step is at least 1, and potentially round up to a "nice" number like 5 or 7
      step = Math.max(1, Math.ceil(step / 5) * 5); // Round up to nearest multiple of 5 for daily
    } else if (timeframe === 'weekly') {
      // For weekly, show fewer ticks if many weeks
      step = Math.ceil(uniqueDates.length / maxTicks);
      step = Math.max(1, Math.ceil(step / 2) * 2); // Round up to nearest multiple of 2 for weekly
    } else if (timeframe === 'monthly') {
      // For monthly, show fewer ticks if many months
      step = Math.ceil(uniqueDates.length / Math.min(uniqueDates.length, 6)); // Aim for max 6-12 months
      step = Math.max(1, step);
    } else {
      // Default fallback
      step = Math.ceil(uniqueDates.length / maxTicks);
    }

    for (let i = 0; i < uniqueDates.length; i += step) {
      ticks.push(uniqueDates[i]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return ticks;
  }, [timeframe, processedData, selectedMonth, selectedWeek]); // selectedMonth and selectedWeek are necessary dependencies here.


  // Custom tooltip format function
  const customTooltip = useCallback(({ point }) => {
    const { serieId, data } = point;
    const formattedX = formatXAxisTick(data.x);
    const formattedY = data.yFormatted;

    return (
      <div
        style={{
          backgroundColor: primaryDark,
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          whiteSpace: 'nowrap', // Prevent text from wrapping
        }}
      >
        {/* Display the series ID (e.g., "Paid Users") and the count */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: point.serieColor, borderRadius: '50%', marginRight: '8px' }}></span>
          <span>
            <strong style={{ color: 'white' }}>{serieId} Count:</strong> {formattedY}
          </span>
        </div>
        {/* Display the date */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '10px', height: '10px', backgroundColor: point.serieColor, borderRadius: '50%', marginRight: '8px' }}></span>
          <span>
            <strong style={{ color: 'white' }}>Date:</strong> {formattedX}
          </span>
        </div>
      </div>
    );
  }, [primaryDark, formatXAxisTick]);


  return (
    <Box>
      {/* Chart Heading and Timeframe selection dropdowns in one row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="1rem" px="1rem">
        {/* Chart Heading */}
        <Typography
          variant="h6"
          color={neutralDark}
          sx={{ whiteSpace: 'nowrap', marginRight: '16px' }}
        >
          {title}
        </Typography>

        <div className="flex space-x-2"> {/* Container for dropdowns */}
          {/* Timeframe selection dropdown */}
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 90,
              backgroundColor: cardBackground,
              borderRadius: '8px',
              boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)',
              '& .MuiOutlinedInput-root': {
                color: neutralDark,
                '& fieldset': { borderColor: neutralDark },
                '&:hover fieldset': { borderColor: accentColor, borderWidth: '2px' },
                '&.Mui-focused fieldset': { borderColor: accentColor, borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': { color: neutralDark },
              '& .MuiSelect-icon': { color: neutralDark },
            }}
          >
            <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
            <Select
              labelId="timeframe-select-label"
              id="timeframe-select"
              value={timeframe}
              label="Timeframe"
              onChange={handleChangeTimeframe}
              sx={{
                color: neutralDark,
                '.MuiOutlinedInput-notchedOutline': { borderColor: neutralDark },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                '.MuiSvgIcon-root': { color: neutralDark },
              }}
              MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: colors.primary[400],
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

          {/* Conditional rendering for Month dropdown */}
          {timeframe !== 'monthly' && (
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 90,
                backgroundColor: cardBackground,
                borderRadius: '8px',
                boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)',
                '& .MuiOutlinedInput-root': {
                  color: neutralDark,
                  '& fieldset': { borderColor: neutralDark },
                  '&:hover fieldset': { borderColor: accentColor, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: accentColor, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: neutralDark },
                '& .MuiSelect-icon': { color: neutralDark },
              }}
            >
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedWeek(''); // Reset week when month changes
                }}
                label="Month"
                sx={{
                  color: neutralDark,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: neutralDark },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                  '.MuiSvgIcon-root': { color: neutralDark },
                }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Conditional rendering for Week dropdown */}
          {timeframe === 'daily' && selectedMonth !== '' && ( // Only visible for Daily timeframe and when a month is selected
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 90,
                backgroundColor: cardBackground,
                borderRadius: '8px',
                boxShadow: theme.palette.mode === 'dark' ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)',
                '& .MuiOutlinedInput-root': {
                  color: neutralDark,
                  '& fieldset': { borderColor: neutralDark },
                  '&:hover fieldset': { borderColor: accentColor, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: accentColor, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: neutralDark },
                '& .MuiSelect-icon': { color: neutralDark },
              }}
              disabled={selectedMonth === ''} // Still disable if no month is selected
            >
              <InputLabel id="week-select-label">Week</InputLabel>
              <Select
                labelId="week-select-label"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                label="Week"
                sx={{
                  color: neutralDark,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: neutralDark },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                  '.MuiSvgIcon-root': { color: neutralDark },
                }}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {weeksInSelectedMonth.map((week) => (
                  <MenuItem key={week.value} value={week.value}>
                    {week.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </Box>

      {/* Line Chart */}
      <Box height={isDashboard ? "250px" : "400px"}>
        <ResponsiveLine
          data={processedData} // Use processedData
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
                color: primaryDark, // This sets the default tooltip background
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
            format: formatXAxisTick, // Use custom format for x-axis ticks
            tickValues: xAxisTickValues, // Apply dynamic tick values
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
          tooltip={customTooltip} // Use the custom tooltip component
        />
      </Box>
    </Box>
  );
};

export default LineChart;
