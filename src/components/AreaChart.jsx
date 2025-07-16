// src/components/AreaChart.jsx
// npm install @visx/drag @visx/zoom d3-interpolate --legacy-peer-deps // You'll need to install these new dependencies

import React, { useMemo, useCallback, useState, useRef } from 'react';
import { AreaClosed, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array'; // Import bisector for finding closest data point
import { localPoint } from '@visx/event';
// Removed withTooltip and TooltipWithBounds as we're implementing a custom tooltip
import { timeFormat } from 'd3-time-format'; // Corrected import for timeFormat
import { timeWeek, timeMonth, timeDay } from 'd3-time'; // Corrected import for timeWeek, timeMonth, added timeDay
import { ParentSize } from '@visx/responsive';
import { curveMonotoneX } from '@visx/curve';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme
} from "@mui/material";
import { tokens } from "../theme.js";
import { mockDailyRevenueData } from "../data/mockData.js";

// Data Accessors
const getDate = (d) => new Date(d.date);
const getRevenueValue = (d) => d.value;

// Margin constants
const MARGIN = { top: 20, right: 30, bottom: 80, left: 60 };

// Bisector for finding the closest data point
const bisectDate = bisector(getDate).left;

// Helper to aggregate daily data to weekly
const aggregateDailyToWeekly = (dailyData) => {
  const weeklyMap = new Map();
  dailyData.forEach(d => {
    const date = getDate(d);
    const weekStart = timeWeek.floor(date);
    const weekKey = timeFormat('%Y-W%U')(weekStart);

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { date: weekStart, value: 0 });
    }
    weeklyMap.get(weekKey).value += getRevenueValue(d);
  });
  return Array.from(weeklyMap.values()).sort((a, b) => getDate(a).getTime() - getDate(b).getTime());
};

// Helper to aggregate daily data to monthly
const aggregateDailyToMonthly = (dailyData) => {
  const monthlyMap = new Map();
  dailyData.forEach(d => {
    const date = getDate(d);
    const monthStart = timeMonth.floor(date);
    const monthKey = timeFormat('%Y-%m')(monthStart);

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { date: monthStart, value: 0 });
    }
    monthlyMap.get(monthKey).value += getRevenueValue(d);
  });
  return Array.from(monthlyMap.values()).sort((a, b) => getDate(a).getTime() - getDate(b).getTime());
};

// Inner component to encapsulate chart logic and hooks that depend on width/height
function AreaChartContent({ width, height, tooltipProps, timeframe, selectedMonth, selectedWeek, weeksInSelectedMonth }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.[400] ?? '#424242';
  const accentColor = colors.primary?.main ?? '#3498db';

  // Destructure tooltip props from the parent
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } = tooltipProps;

  // Process data based on selected timeframe, month, and week
  const processedData = useMemo(() => {
    let data = mockDailyRevenueData;

    // Filter by selected month first
    if (selectedMonth !== '') {
      const currentYear = new Date().getFullYear();
      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);
      data = data.filter(d => {
        const date = getDate(d);
        return date >= monthStart && date <= monthEnd;
      });
    }

    // Then filter by selected week if a week is chosen
    if (selectedWeek !== '' && selectedMonth !== '') {
      const weekInfo = weeksInSelectedMonth.find(w => w.value === selectedWeek);
      if (weekInfo) {
        data = data.filter(d => {
          const date = getDate(d);
          return date >= weekInfo.startDate && date <= weekInfo.endDate;
        });
      }
    }

    // Aggregate based on timeframe
    switch (timeframe) {
      case 'daily':
        return data;
      case 'weekly':
        return aggregateDailyToWeekly(data);
      case 'monthly':
        return aggregateDailyToMonthly(data);
      default:
        return data;
    }
  }, [timeframe, selectedMonth, selectedWeek, weeksInSelectedMonth]);

  const filteredData = processedData;

  const mainChartRef = useRef(null);

  // Dimensions for the main chart
  const xMax = Math.max(0, width - MARGIN.left - MARGIN.right);
  const yMax = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  // Scales for the main chart
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredData, getDate),
      }),
    [xMax, filteredData],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredData, getRevenueValue) || 0],
        nice: true,
      }),
    [yMax, filteredData],
  );

  // Tooltip event handlers
  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const xCoordinate = x - MARGIN.left;
      const x0 = xScale.invert(xCoordinate); // Date corresponding to cursor X

      // Find the index of the data point whose date is closest to x0
      const index = bisectDate(filteredData, x0, 1);

      let d = null;
      if (index < filteredData.length) {
        // Check the point at 'index'
        d = filteredData[index];
      }
      if (index > 0 && filteredData[index - 1]) {
        // Also check the point before 'index'
        const dPrev = filteredData[index - 1];
        // If d is null (meaning index was 0) or if dPrev is closer to x0, use dPrev
        if (!d || (Math.abs(x0.getTime() - getDate(dPrev).getTime()) < Math.abs(getDate(d).getTime() - x0.getTime()))) {
          d = dPrev;
        }
      }

      if (d) {
        showTooltip({
          tooltipData: d,
          tooltipLeft: xScale(getDate(d)) + MARGIN.left,
          tooltipTop: yScale(getRevenueValue(d)) + MARGIN.top,
        });
      } else {
        hideTooltip();
      }
    },
    [showTooltip, hideTooltip, xScale, yScale, filteredData],
  );

  // Date formatters based on timeframe
  const formatAxisDate = useCallback((date) => {
    switch (timeframe) {
      case 'daily': return timeFormat('%b %d')(date);
      case 'weekly': return `Week ${timeFormat('%U')(date)}`;
      case 'monthly': return timeFormat('%b %Y')(date);
      default: return timeFormat('%Y')(date);
    }
  }, [timeframe]);

  const formatTooltipDate = useCallback((date) => {
    switch (timeframe) {
      case 'daily': return timeFormat('%b %d, %Y')(date);
      case 'weekly': return `Week ${timeFormat('%U, %Y')(date)}`;
      case 'monthly': return timeFormat('%b %Y')(date);
      default: return timeFormat('%Y')(date);
    }
  }, [timeframe]);

  if (width < 10 || height < 10) {
    return null;
  }

  return (
    <svg width={width} height={height}>
      <LinearGradient id="area-gradient" from={accentColor} fromOpacity={0.4} to={accentColor} toOpacity={0} />

      <Group left={MARGIN.left} top={MARGIN.top} ref={mainChartRef}>
        <AreaClosed
          data={filteredData}
          x={(d) => xScale(getDate(d))}
          y={(d) => yScale(getRevenueValue(d))}
          yScale={yScale}
          strokeWidth={2}
          stroke={accentColor}
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />

        <LinePath
          data={filteredData}
          x={(d) => xScale(getDate(d))}
          y={(d) => yScale(getRevenueValue(d))}
          stroke={accentColor}
          strokeWidth={2}
          curve={curveMonotoneX}
        />

        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 500 ? 10 : 5}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 10,
            textAnchor: 'middle',
          })}
          tickFormat={formatAxisDate}
        />

        <AxisLeft
          scale={yScale}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 10,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          })}
          tickFormat={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
        />

        <rect
          x={0}
          y={0}
          width={xMax}
          height={yMax}
          fill="transparent"
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onTouchEnd={() => hideTooltip()}
        />

        {tooltipOpen && tooltipData && (
          <g>
            <LinePath
              data={[
                { x: tooltipLeft - MARGIN.left, y: 0 },
                { x: tooltipLeft - MARGIN.left, y: yMax },
              ]}
              x={(d) => d.x}
              y={(d) => d.y}
              stroke={primaryDark}
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft - MARGIN.left}
              cy={tooltipTop - MARGIN.top}
              r={4}
              fill={accentColor}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </Group>
    </svg>
  );
}

// Main AreaChart component
function AreaChart({ title = "Revenue Over Time" }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const neutralDark = colors.neutral?.dark ?? '#212121';
  const accentColor = colors.primary?.main ?? '#3498db';
  const primaryDark = colors.primary?.[400] ?? '#424242'; // Added for tooltip background
  const cardBackground = colors['--card-background'] || '#ffffff';

  const [timeframe, setTimeframe] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

  // State for custom tooltip
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const tooltipProps = {
    showTooltip: useCallback(({ tooltipData, tooltipLeft, tooltipTop }) => {
      setTooltipData(tooltipData);
      setTooltipLeft(tooltipLeft);
      setTooltipTop(tooltipTop);
      setTooltipOpen(true);
    }, []),
    hideTooltip: useCallback(() => {
      setTooltipData(null);
      setTooltipOpen(false);
    }, []),
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
  };

  // Generate a list of months for the dropdown
  const months = useMemo(() => {
    const monthNames = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      monthNames.push({ value: i, label: timeFormat('%b')(date) });
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

    // Date formatters based on timeframe (moved here for tooltip outside AreaChartContent)
    const formatTooltipDate = useCallback((date) => {
      switch (timeframe) {
        case 'daily': return timeFormat('%b %d, %Y')(date);
        case 'weekly': return `Week ${timeFormat('%U, %Y')(date)}`;
        case 'monthly': return timeFormat('%b %Y')(date);
        default: return timeFormat('%Y')(date);
      }
    }, [timeframe]);


  return (
    <Box sx={{ position: 'relative' }}>
      <div className="flex justify-between items-center mb-4 px-4">
        <Typography variant="h6" color={neutralDark} sx={{ whiteSpace: 'nowrap', marginRight: '16px' }}>
          {title}
        </Typography>
        <div className="flex space-x-2">
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
              value={timeframe}
              onChange={(e) => {
                setTimeframe(e.target.value);
                setSelectedMonth('');
                setSelectedWeek('');
              }}
              label="Timeframe"
              sx={{
                color: neutralDark,
                '.MuiOutlinedInput-notchedOutline': { borderColor: neutralDark },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                '.MuiSvgIcon-root': { color: neutralDark },
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

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
                  setSelectedWeek('');
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

          {timeframe === 'daily' && selectedMonth !== '' && (
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
              disabled={selectedMonth === ''}
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
      </div>

      <Box className="flex flex-col items-center justify-center p-4" height="400px" sx={{ position: 'relative' }}>
        <ParentSize>
          {({ width, height }) => (
            <AreaChartContent
              width={width}
              height={height}
              timeframe={timeframe}
              selectedMonth={selectedMonth}
              selectedWeek={selectedWeek}
              weeksInSelectedMonth={weeksInSelectedMonth}
              tooltipProps={tooltipProps} // Pass tooltip props down
            />
          )}
        </ParentSize>

        {/* Custom Tooltip rendered directly in the parent Box */}
        {tooltipOpen && tooltipData && (
          <div
            style={{
              position: 'absolute',
              top: tooltipTop,
              left: tooltipLeft,
              backgroundColor: primaryDark, // Use primaryDark for background
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              pointerEvents: 'none', // Ensure tooltip doesn't block mouse events
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px',
              zIndex: 1000,
              transform: 'translate(-50%, -100%)', // Adjust to position above and centered on the point
              whiteSpace: 'nowrap', // Prevent text from wrapping
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: accentColor, borderRadius: '50%', marginRight: '8px' }}></span>
              <span>
                <strong style={{ color: 'white' }}>x:</strong> {formatTooltipDate(getDate(tooltipData))}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: accentColor, borderRadius: '50%', marginRight: '8px' }}></span>
              <span>
                <strong style={{ color: 'white' }}>y:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(getRevenueValue(tooltipData))}
              </span>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}

// Removed withTooltip HOC as we are managing tooltip state directly
export default AreaChart;
