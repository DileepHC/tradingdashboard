//https://airbnb.io/visx/gallery
import React, { useMemo, useCallback, useState, useRef } from 'react';
import { AreaClosed, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { Brush } from '@visx/brush';
import { max, extent } from 'd3-array';
import { localPoint } from '@visx/event';
import { withTooltip, TooltipWithBounds } from '@visx/tooltip';
import { timeFormat } from 'd3-time-format';
import { ParentSize } from '@visx/responsive';
import { curveMonotoneX } from '@visx/curve'; // Import a curve function

import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockRevenueOverTimeDataForBrush } from "../data/mockData"; // Ensure this path is correct

// Data Accessors
const getDate = (d) => new Date(d.date); // Ensure date is parsed as a Date object
const getRevenueValue = (d) => d.value;

// Date formatters
const formatBrushDate = timeFormat('%b %Y');
const formatMainChartDate = timeFormat('%b %d, %Y');

// Brush colors (can use theme colors too)
const brushColor = '#a0aec0'; // Example default, ideally from theme
const brushAccentColor = '#42a5f5'; // Example default, ideally from theme

// Margin constants
const MARGIN = { top: 20, right: 30, bottom: 80, left: 60 };
const BRUSH_HEIGHT = 70;

// Inner component to encapsulate chart logic and hooks that depend on width/height
function AreaChartContent({ width, height, title, showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.[400] ?? '#424242';
  const accentColor = colors.primary?.main ?? '#3498db';

  const [filteredData, setFilteredData] = useState(mockRevenueOverTimeDataForBrush);
  const brushRef = useRef(null);

  const mainChartData = mockRevenueOverTimeDataForBrush; // Full dataset for brush

  // Ensure effective dimensions are non-negative
  const mainChartWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const mainChartHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom - BRUSH_HEIGHT - 20);

  // Scales for the main chart (filtered data)
  const xScale = useMemo(
    () => {
      const domainX = extent(filteredData, getDate);
      // Fallback for empty filteredData to prevent NaN in scales if necessary
      const finalDomainX = domainX[0] && domainX[1] ? domainX : [new Date(), new Date(Date.now() + 86400000)]; // Default to a day range
      return scaleTime({
        range: [0, mainChartWidth],
        domain: finalDomainX,
      });
    },
    [mainChartWidth, filteredData]
  );

  const yScale = useMemo(
    () => {
      const maxVal = max(filteredData, getRevenueValue) || 0;
      // Ensure the domain is not [0,0] which can cause issues with nice()
      const domainY = [0, maxVal > 0 ? maxVal * 1.2 : 1];
      return scaleLinear({
        range: [mainChartHeight, 0],
        domain: domainY,
        nice: true,
      });
    },
    [mainChartHeight, filteredData]
  );

  // Scales for the brush chart (full data extent)
  const brushXScale = useMemo(
    () => {
      const domainX = extent(mainChartData, getDate);
      const finalDomainX = domainX[0] && domainX[1] ? domainX : [new Date(), new Date(Date.now() + 86400000)]; // Default to a day range
      return scaleTime({
        range: [0, mainChartWidth], // Brush chart also uses mainChartWidth
        domain: finalDomainX,
      });
    },
    [mainChartWidth, mainChartData]
  );

  const brushYScale = useMemo(
    () => {
      const maxVal = max(mainChartData, getRevenueValue) || 0;
      const domainY = [0, maxVal > 0 ? maxVal * 1.2 : 1];
      return scaleLinear({
        range: [BRUSH_HEIGHT, 0],
        domain: domainY,
        nice: true,
      });
    },
    [BRUSH_HEIGHT, mainChartData]
  );

  // Brush event handler
  const handleBrushChange = useCallback(
    (domain) => {
      if (!domain) {
        setFilteredData(mainChartData); // If brush is cleared, show all data
        return;
      }
      const newFilteredData = mainChartData.filter((s) => {
        const x = getDate(s).getTime();
        return x >= domain.x[0].getTime() && x <= domain.x[1].getTime();
      });
      setFilteredData(newFilteredData);

      // Optionally, if you want the main chart's Y-axis to dynamically adjust to the
      // *brushed* data's max value, you would also trigger a re-render
      // which is already handled by `setFilteredData` changing the dependency of yScale.
    },
    [mainChartData]
  );

  // Tooltip event handlers for the main chart
  const handleMouseMove = useCallback(
    (event) => {
      // Ensure mainChartWidth is positive before inverse scale calculation
      if (mainChartWidth < 1) return;

      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x - MARGIN.left);

      // Find the closest data point
      const closestDatum = filteredData.reduce((prev, curr) => {
        const prevDiff = Math.abs(getDate(prev).getTime() - x0.getTime());
        const currDiff = Math.abs(getDate(curr).getTime() - x0.getTime());
        return prevDiff < currDiff ? prev : curr;
      });

      showTooltip({
        tooltipData: closestDatum,
        tooltipLeft: xScale(getDate(closestDatum)) + MARGIN.left,
        tooltipTop: yScale(getRevenueValue(closestDatum)) + MARGIN.top,
      });
    },
    [showTooltip, xScale, yScale, filteredData, MARGIN.left, MARGIN.top, mainChartWidth]
  );

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // If width or height are too small, render nothing or a message
  if (width < 10 || height < 10) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="body2" color={neutralDark}>
          Chart too small to render.
        </Typography>
      </Box>
    );
  }


  return (
    <svg width={width} height={height}>
      {/* Background Rectangle with rounded corners, using theme's background.paper */}
      <rect width={width} height={height} fill={colors.background.paper} rx={14} ry={14} />

      {/* Main Chart Area */}
      <Group left={MARGIN.left} top={MARGIN.top} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <LinearGradient id="area-gradient" from={accentColor} to={colors.background.paper} />
        {filteredData.length > 0 && ( // Only render if there's data
            <>
                <AreaClosed
                    data={filteredData}
                    x={(d) => xScale(getDate(d))}
                    y={(d) => yScale(getRevenueValue(d))}
                    yScale={yScale}
                    fill="url(#area-gradient)"
                    strokeWidth={1}
                    stroke={accentColor}
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
            </>
        )}

        {/* X-Axis for Main Chart */}
        <AxisBottom
          top={mainChartHeight}
          scale={xScale}
          numTicks={width > 768 ? 8 : 4}
          tickFormat={formatMainChartDate}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />

        {/* Y-Axis for Main Chart */}
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 11,
            textAnchor: 'end',
          })}
          tickFormat={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
        />

        {/* Tooltip Line (if tooltip is open) */}
        {tooltipOpen && tooltipData && (
          <Group>
            <line
              x1={xScale(getDate(tooltipData))}
              y1={0}
              x2={xScale(getDate(tooltipData))}
              y2={mainChartHeight}
              stroke={neutralDark}
              strokeDasharray="2,2"
            />
            <circle
              cx={xScale(getDate(tooltipData))}
              cy={yScale(getRevenueValue(tooltipData))}
              r={4}
              fill={accentColor}
              stroke="white"
              strokeWidth={2}
            />
          </Group>
        )}
      </Group>

      {/* Brush Chart Area */}
      <Group left={MARGIN.left} top={MARGIN.top + mainChartHeight + 20}>
        <LinearGradient id="brush-area-gradient" from={brushAccentColor} to={colors.background.paper} />
        {mainChartData.length > 0 && ( // Only render if there's data
            <>
                <AreaClosed
                    data={mainChartData}
                    x={(d) => brushXScale(getDate(d))}
                    y={(d) => brushYScale(getRevenueValue(d))}
                    yScale={brushYScale}
                    fill="url(#brush-area-gradient)"
                    strokeWidth={1}
                    stroke={brushAccentColor}
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={mainChartData}
                    x={(d) => brushXScale(getDate(d))}
                    y={(d) => brushYScale(getRevenueValue(d))}
                    stroke={brushAccentColor}
                    strokeWidth={1}
                    curve={curveMonotoneX}
                />
            </>
        )}
        <Brush
          xScale={brushXScale}
          yScale={brushYScale}
          width={mainChartWidth} // This width is crucial and can cause negative rect errors
          height={BRUSH_HEIGHT}
          handleSize={8}
          innerRef={brushRef}
          resizeTriggerAreas={['left', 'right']}
          brushDirection="horizontal"
          onChange={handleBrushChange}
          selectedBoxStyle={{
            fill: accentColor,
            fillOpacity: 0.2,
            stroke: accentColor,
            strokeWidth: 1,
          }}
        >
          {/* Default brush handles are rendered if no custom renderBrush is provided. */}
          {/* Leaving this empty <g> is fine if you're using default. */}
          {(brush) => <g />}
        </Brush>
        {/* X-Axis for Brush Chart */}
        <AxisBottom
          top={BRUSH_HEIGHT}
          scale={brushXScale}
          numTicks={5}
          tickFormat={formatBrushDate}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 10,
            textAnchor: 'middle',
          })}
        />
      </Group>

      {/* Tooltip for Main Chart */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            backgroundColor: primaryDark,
            color: neutralDark, // Changed to neutralDark for better visibility based on your theme
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div>
            <strong>Date:</strong> {formatMainChartDate(getDate(tooltipData))}
          </div>
          <div>
            <strong>Revenue:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getRevenueValue(tooltipData))}
          </div>
        </TooltipWithBounds>
      )}
    </svg>
  );
}

// Main AreaChart component (now a wrapper for ParentSize)
function AreaChart({ title = "Revenue Over Time", ...tooltipProps }) { // Destructure tooltip props here
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const neutralDark = colors.neutral?.dark ?? '#212121';

  return (
    <Box>
      <Typography variant="h6" color={neutralDark} align="center" mb="1rem">
        {title}
      </Typography>
      <Box className="flex flex-col items-center justify-center p-4" height="400px">
        <ParentSize>
          {({ width, height }) => (
            <AreaChartContent
              width={width}
              height={height}
              title={title}
              {...tooltipProps} // Spread all tooltip props down
            />
          )}
        </ParentSize>
      </Box>
    </Box>
  );
}

// This needs to be wrapped with withTooltip at the outer level, not the inner
export default withTooltip(AreaChart);