//npm install @visx/shape @visx/group @visx/text @visx/tooltip @visx/event @visx/scale @visx/gradient @visx/axis @visx/grid @visx/responsive @visx/brush @visx/pattern d3-array d3-format d3-time-format --legacy-peer-deps .installed and edited mockData.js that's it
//https://airbnb.io/visx/gallery this is we used
import React, { useMemo, useCallback, useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { withTooltip, TooltipWithBounds } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { scaleOrdinal } from '@visx/scale';
import { ParentSize } from '@visx/responsive';
// Removed LinearGradient import as it's no longer used for the background

import {
  Box,
  Typography,
  useTheme
} from "@mui/material";
import { tokens } from "../theme";
import { mockNestedPieData } from '../data/mockData'; // Import the new nested pie data

// Accessor functions
const getLabel = (d) => d.label;
const getValue = (d) => d.value;

// PieChart component now receives showTooltip, hideTooltip, tooltipData, etc. as props
function PieChart({ title = "Subscriber Split", showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.[400] ?? '#424242';

  // State to manage the currently selected outer segment for drill-down
  const [selectedOuterSegment, setSelectedOuterSegment] = useState(null);

  // Determine the data for the inner pie based on selection
  const currentInnerSegmentsData = useMemo(() => {
    return selectedOuterSegment ? selectedOuterSegment.breakdown : mockNestedPieData.overallSubscribers;
  }, [selectedOuterSegment]);

  // Data for the outer pie remains constant
  const outerSegmentsData = mockNestedPieData.outerSegments;

  // Calculate total for percentages based on current inner data
  const totalInnerValue = useMemo(() => {
    return currentInnerSegmentsData.reduce((sum, d) => sum + getValue(d), 0);
  }, [currentInnerSegmentsData]);


  const handleArcHover = useCallback((event, arc) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipData: arc.data,
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
    });
  }, [showTooltip]); // Depend on showTooltip received as prop

  const handleArcLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]); // Depend on hideTooltip received as prop

  const handleOuterArcClick = useCallback((event, arc) => {
    // If the same segment is clicked, deselect it
    if (selectedOuterSegment && selectedOuterSegment.label === arc.data.label) {
      setSelectedOuterSegment(null);
    } else {
      setSelectedOuterSegment(arc.data);
    }
  }, [selectedOuterSegment]);

  // Define color scales for inner and outer pies
  // Adjusted colors to be more distinct and vibrant, similar to the image
  const innerPieColors = useMemo(() => scaleOrdinal({
    domain: currentInnerSegmentsData.map(getLabel),
    // Using shades of purple/pink for Paid/Demo within a segment
    range: ['#9c27b0', '#e91e63'], // Example: Paid (purple), Demo (pink)
  }), [currentInnerSegmentsData]);

  const outerPieColors = useMemo(() => scaleOrdinal({
    domain: outerSegmentsData.map(getLabel),
    // Using distinct colors for browser segments, including some from the image
    range: ['#42a5f5', '#66bb6a', '#ffee58', '#ef5350', '#ab47bc'], // Google Chrome, Firefox, Safari, IE, Edge
  }), [outerSegmentsData]);


  return (
    <Box height="400px" sx={{ position: 'relative' }}>
      {/* Chart Heading */}
      <Typography
        variant="h6"
        color={neutralDark}
        align="center"
        mb="1rem"
      >
        {title}
      </Typography>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10) return null;

          const centerX = width / 2;
          const centerY = height / 2;

          // Define radii for the inner and outer pies
          const outerPieOuterRadius = Math.min(width, height) / 2.5; // Outer ring's outer radius
          const outerPieInnerRadius = outerPieOuterRadius * 0.8; // Outer ring's inner radius

          // Corrected order and calculation for inner pie radii
          const innerPieInnerRadius = 0; // Inner ring's inner radius (solid center)
          const innerPieOuterRadius = outerPieInnerRadius * 0.7; // Inner ring's outer radius

          // Legend spacing parameters for horizontal layout
          const legendItemWidth = 100; // Approximate width of each legend item (color box + text)
          const legendSpacing = 20; // Space between legend items
          const totalLegendWidth = outerSegmentsData.length * legendItemWidth + (outerSegmentsData.length - 1) * legendSpacing;


          return (
            <svg width={width} height={height}>
              {/* Using theme's paper background */}
              <rect
                width={width}
                height={height}
                fill={colors.background.paper} // Use theme's paper background
                rx={14}
                ry={14}
              />

              <Group top={centerY} left={centerX}>
                {/* Inner Pie */}
                <Pie
                  data={currentInnerSegmentsData}
                  pieValue={getValue}
                  outerRadius={innerPieOuterRadius}
                  innerRadius={innerPieInnerRadius}
                  padAngle={0.01}
                  cornerRadius={3}
                >
                  {(pie) =>
                    pie.arcs.map((arc, index) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      // Determine the label based on data.label
                      let displayLabel = arc.data.label;
                      if (arc.data.label === 'Paid Subscribers') {
                        displayLabel = 'Paid';
                      } else if (arc.data.label === 'Demo Subscribers') {
                        displayLabel = 'Demo';
                      }
                      return (
                        <g key={`inner-arc-${arc.data.label}-${index}`}>
                          <path
                            d={pie.path(arc)}
                            fill={innerPieColors(getLabel(arc.data))}
                            onMouseMove={(event) => handleArcHover(event, arc)}
                            onMouseLeave={handleArcLeave}
                          />
                          {/* Label for inner pie segments */}
                          <Text
                            fill="white" // White text for visibility on dark colors
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`translate(${centroidX}, ${centroidY})`}
                            fontSize={14}
                            fontWeight="bold"
                            pointerEvents="none"
                          >
                            {displayLabel}
                          </Text>
                        </g>
                      );
                    })
                  }
                </Pie>

                {/* Outer Pie */}
                <Pie
                  data={outerSegmentsData}
                  pieValue={getValue}
                  outerRadius={outerPieOuterRadius}
                  innerRadius={outerPieInnerRadius}
                  padAngle={0.01}
                  cornerRadius={3}
                  startAngle={-Math.PI / 2} // Start from top for a common convention
                >
                  {(pie) =>
                    pie.arcs.map((arc, index) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      const midAngle = (arc.startAngle + arc.endAngle) / 2;
                      const x = outerPieOuterRadius * 1.1 * Math.cos(midAngle); // Position labels slightly outside
                      const y = outerPieOuterRadius * 1.1 * Math.sin(midAngle); // Position labels slightly outside

                      return (
                        <g key={`outer-arc-${arc.data.label}-${index}`}>
                          <path
                            d={pie.path(arc)}
                            fill={outerPieColors(getLabel(arc.data))}
                            onClick={(event) => handleOuterArcClick(event, arc)} // Handle click for drill-down
                            onMouseMove={(event) => handleArcHover(event, arc)}
                            onMouseLeave={handleArcLeave}
                            style={{
                                cursor: 'pointer',
                                opacity: selectedOuterSegment && selectedOuterSegment.label !== arc.data.label ? 0.4 : 1 // Dim unselected segments
                            }}
                          />
                          {/* Outer Pie Labels (if desired, these are typically removed when external legends are added) */}
                          {/* <Text
                            fill={neutralDark}
                            textAnchor={x > 0 ? 'start' : 'end'}
                            dominantBaseline="middle"
                            transform={`translate(${x}, ${y})`}
                            fontSize={12}
                            pointerEvents="none"
                          >
                            {getLabel(arc.data)}
                          </Text> */}
                        </g>
                      );
                    })
                  }
                </Pie>

                {/* Center Text for current view */}
                <Text
                  fill={neutralDark}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={selectedOuterSegment ? 20 : 16}
                  fontWeight="bold"
                  y={-20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedOuterSegment(null)} // Click to reset
                >
                  {selectedOuterSegment ? selectedOuterSegment.label : 'Total'}
                </Text>
                <Text
                  fill={neutralDark}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={selectedOuterSegment ? 16 : 14}
                  y={10}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedOuterSegment(null)} // Click to reset
                >
                  {selectedOuterSegment ? `(Click to reset)` : `Subscribers`}
                </Text>

              </Group>

              {/* Legends for Outer Pie (positioned below and horizontally) */}
              <Group
                left={centerX - totalLegendWidth / 2} // Center horizontally
                top={height - 20} // Position 20px from the bottom (moved down from 50)
              >
                {outerSegmentsData.map((segment, i) => {
                  // Calculate x position for each legend item
                  let currentXOffset = 0;
                  if (i > 0) {
                    for (let j = 0; j < i; j++) {
                      currentXOffset += legendItemWidth + legendSpacing;
                    }
                  }
                  return (
                    <g
                      key={`legend-${segment.label}`}
                      transform={`translate(${currentXOffset}, 0)`} // Position horizontally
                      onClick={() => handleOuterArcClick(null, { data: segment })} // Simulate arc click
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        width={16}
                        height={16}
                        fill={outerPieColors(getLabel(segment))}
                        rx={4}
                        ry={4}
                        style={{
                            opacity: selectedOuterSegment && selectedOuterSegment.label !== segment.label ? 0.4 : 1
                        }}
                      />
                      <Text
                        x={24}
                        y={8}
                        fill={neutralDark}
                        dominantBaseline="middle"
                        fontSize={13}
                        style={{
                            opacity: selectedOuterSegment && selectedOuterSegment.label !== segment.label ? 0.4 : 1
                        }}
                      >
                        {getLabel(segment)}
                      </Text>
                    </g>
                  );
                })}
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
                  }}
                >
                  <div>
                    <strong>{getLabel(tooltipData)}:</strong> {getValue(tooltipData)}
                    {tooltipData.label === 'Paid' || tooltipData.label === 'Demo' || tooltipData.label === 'Paid Subscribers' || tooltipData.label === 'Demo Subscribers' ?
                      ` (${((getValue(tooltipData) / totalInnerValue) * 100).toFixed(1)}%)` : ''
                    }
                  </div>
                </TooltipWithBounds>
              )}
            </svg>
          );
        }}
      </ParentSize>
    </Box>
  );
}

export default withTooltip(PieChart);
