//https://airbnb.io/visx/gallery
import React, { useMemo, useCallback } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { withTooltip, TooltipWithBounds } from '@visx/tooltip';
import { max } from 'd3-array';
import { ParentSize } from '@visx/responsive';

import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockMonthlyBarData } from "../data/mockData";

// Data Accessors
const getMonth = (d) => d.month;
const getCommission = (d) => d.commission;

// Margin constants
const MARGIN = { top: 20, right: 20, bottom: 60, left: 60 };

// Inner component to encapsulate chart logic and hooks that depend on width/height
function BarChartContent({ width, height, title, showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.[400] ?? '#424242';
  const barColor = colors.greenAccent?.[500] ?? '#66bb6a'; // Using a green accent for bars

  // Moved conditional return from here.
  // The ParentSize component ensures width/height are valid before rendering this.

  // --- FIX APPLIED HERE ---
  // Ensure effective dimensions are non-negative by using Math.max(0, ...)
  const chartWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const chartHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  // Scales
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, chartWidth],
        domain: mockMonthlyBarData.map(getMonth),
        padding: 0.3, // Padding between bars
      }),
    [chartWidth] // Removed mockMonthlyBarData from dependency as it's a constant
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [chartHeight, 0],
        domain: [0, (max(mockMonthlyBarData, getCommission) || 0) * 1.2], // 20% padding above max
        nice: true,
      }),
    [chartHeight] // Removed mockMonthlyBarData from dependency as it's a constant
  );

  // Tooltip event handlers
  const handleMouseMove = useCallback(
    (event, datum) => {
      const coords = localPoint(event.target.ownerSVGElement, event);
      showTooltip({
        tooltipData: datum,
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
      });
    },
    [showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  return (
    <svg width={width} height={height}>
      {/* Background Rectangle with rounded corners */}
      <rect width={width} height={height} fill={colors.background.paper} rx={14} ry={14} />

      <Group left={MARGIN.left} top={MARGIN.top}>
        {/* Bars */}
        {mockMonthlyBarData.map((d) => {
          const month = getMonth(d);
          const commission = getCommission(d);
          const barWidth = xScale.bandwidth();
          const barHeight = chartHeight - (yScale(commission) ?? 0);
          const x = xScale(month);
          const y = yScale(commission);

          return (
            <Bar
              key={`bar-${month}`}
              x={x}
              y={y}
              width={barWidth} // This will now be non-negative
              height={barHeight}
              fill={barColor}
              onMouseMove={(event) => handleMouseMove(event, d)}
              onMouseLeave={handleMouseLeave}
              rx={4} // Rounded corners for bars
            />
          );
        })}

        {/* X-Axis */}
        <AxisBottom
          top={chartHeight}
          scale={xScale}
          numTicks={mockMonthlyBarData.length}
          stroke={neutralDark}
          tickStroke={neutralDark}
          tickLabelProps={() => ({
            fill: neutralDark,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />

        {/* Y-Axis */}
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
      </Group>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            backgroundColor: primaryDark,
            color: neutralDark,
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, -100%)', // Adjust tooltip position
          }}
        >
          <div>
            <strong>Month:</strong> {getMonth(tooltipData)}
          </div>
          <div>
            <strong>Commission:</strong> {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(getCommission(tooltipData))}
          </div>
        </TooltipWithBounds>
      )}
    </svg>
  );
}

// Main BarChart component (now a wrapper for ParentSize)
function BarChart({ title = "Monthly Commission Distribution" }) {
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
          {({ width, height }) => {
            // Conditional return now happens here, before BarChartContent is rendered
            if (width < 10 || height < 10) return null;
            return (
              <BarChartContent
                width={width}
                height={height}
                title={title}
                // Correctly destructure and pass props from withTooltip
                showTooltip={arguments[0].showTooltip}
                hideTooltip={arguments[0].hideTooltip}
                tooltipData={arguments[0].tooltipData}
                tooltipLeft={arguments[0].tooltipLeft}
                tooltipTop={arguments[0].tooltipTop}
                tooltipOpen={arguments[0].tooltipOpen}
              />
            );
          }}
        </ParentSize>
      </Box>
    </Box>
  );
}

export default withTooltip(BarChart);