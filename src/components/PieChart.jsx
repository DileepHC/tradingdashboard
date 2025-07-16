// npm install @visx/shape @visx/group @visx/text @visx/tooltip @visx/event @visx/scale @visx/gradient @visx/axis @visx/grid @visx/responsive @visx/brush @visx/pattern d3-array d3-format d3-time-format --legacy-peer-deps .installed and edited mockData.js that's it
// https://airbnb.io/visx/gallery this is we used
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

// Accessor functions for Visx
const getLabel = (d) => d.label;
const getValue = (d) => d.value;

/**
 * PieChart component displays a nested pie chart with drill-down functionality.
 * The outer pie represents different access methods (e.g., Web Access, Mobile App),
 * and the inner pie shows the breakdown of Paid vs. Demo subscribers for the selected outer segment.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the chart.
 * @param {function} props.showTooltip - Function to show the tooltip (provided by withTooltip HOC).
 * @param {function} props.hideTooltip - Function to hide the tooltip (provided by withTooltip HOC).
 * @param {object} props.tooltipData - Data for the currently hovered segment (provided by withTooltip HOC).
 * @param {number} props.tooltipLeft - X-coordinate for the tooltip position (provided by withTooltip HOC).
 * @param {number} props.tooltipTop - Y-coordinate for the tooltip position (provided by withTooltip HOC).
 * @param {boolean} props.tooltipOpen - Boolean indicating if the tooltip is open (provided by withTooltip HOC).
 */
function PieChart({ title = "Subscriber Split", showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen }) {
  const theme = useTheme();
  // Accessing theme colors for consistent styling
  const colors = tokens(theme.palette.mode) || {};

  const neutralDark = colors.neutral?.dark ?? '#212121';
  const primaryDark = colors.primary?.[400] ?? '#424242';

  // State to manage the currently selected outer segment for drill-down.
  // If null, the inner pie shows overall subscriber data.
  const [selectedOuterSegment, setSelectedOuterSegment] = useState(null);

  // Memoized data for the inner pie.
  // It dynamically changes based on whether an outer segment is selected.
  const currentInnerSegmentsData = useMemo(() => {
    // If an outer segment is selected, use its 'breakdown' data.
    // Otherwise, default to the 'overallSubscribers' data from mockNestedPieData.
    return selectedOuterSegment ? selectedOuterSegment.breakdown : mockNestedPieData.overallSubscribers;
  }, [selectedOuterSegment]);

  // Data for the outer pie, which remains constant for the outer ring's structure.
  const outerSegmentsData = mockNestedPieData.outerSegments;

  // Calculate the total value of the current inner pie segments.
  // This is crucial for calculating percentages in the tooltip for inner segments.
  const totalInnerValue = useMemo(() => {
    return currentInnerSegmentsData.reduce((sum, d) => sum + getValue(d), 0);
  }, [currentInnerSegmentsData]);

  // Calculate the total value of the outer pie segments.
  // This is crucial for calculating percentages in the tooltip for outer segments.
  const totalOuterValue = useMemo(() => {
    return outerSegmentsData.reduce((sum, d) => sum + getValue(d), 0);
  }, [outerSegmentsData]);

  /**
   * Handles mouse movement over an arc to display the tooltip.
   * @param {object} event - The mouse event.
   * @param {object} arc - The arc data being hovered over.
   */
  const handleArcHover = useCallback((event, arc) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipData: arc.data,
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
    });
  }, [showTooltip]);

  /**
   * Handles mouse leaving an arc to hide the tooltip.
   */
  const handleArcLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  /**
   * Handles click on an outer arc for drill-down functionality.
   * If the same segment is clicked, it deselects and resets the view.
   * Otherwise, it selects the new segment and updates the inner pie.
   * @param {object} event - The click event (can be null if triggered by legend click).
   * @param {object} arc - The arc data that was clicked.
   */
  const handleOuterArcClick = useCallback((event, arc) => {
    // If the currently selected outer segment is the same as the clicked one, deselect it.
    if (selectedOuterSegment && selectedOuterSegment.label === arc.data.label) {
      setSelectedOuterSegment(null); // Reset to overall view
    } else {
      // Otherwise, select the new segment for drill-down.
      setSelectedOuterSegment(arc.data);
    }
  }, [selectedOuterSegment]);

  // Memoized color scale for the inner pie segments (Paid/Demo).
  const innerPieColors = useMemo(() => scaleOrdinal({
    domain: currentInnerSegmentsData.map(getLabel),
    range: ['#9c27b0', '#e91e63'], // Distinct colors for Paid (purple) and Demo (pink)
  }), [currentInnerSegmentsData]);

  // Memoized color scale for the outer pie segments (e.g., browsers).
  const outerPieColors = useMemo(() => scaleOrdinal({
    domain: outerSegmentsData.map(getLabel),
    range: ['#42a5f5', '#66bb6a', '#ffee58', '#ef5350', '#ab47bc'], // Vibrant colors for different access methods
  }), [outerSegmentsData]);


  return (
    // Box component from Material-UI for responsive sizing and positioning
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
      {/* ParentSize from @visx/responsive ensures the chart scales with its parent container */}
      <ParentSize>
        {({ width, height }) => {
          // Don't render if width is too small
          if (width < 10) return null;

          const centerX = width / 2;
          const centerY = height / 2;

          // Define radii for the outer and inner pies based on available space
          const outerPieOuterRadius = Math.min(width, height) / 2.5;
          const outerPieInnerRadius = outerPieOuterRadius * 0.8;

          const innerPieInnerRadius = 0; // Inner pie is solid in the center
          const innerPieOuterRadius = outerPieInnerRadius * 0.7; // Inner pie's outer radius

          // Calculate dimensions for horizontal legend positioning
          const legendItemWidth = 100; // Approximate width of each legend item
          const legendSpacing = 20; // Space between legend items
          const totalLegendWidth = outerSegmentsData.length * legendItemWidth + (outerSegmentsData.length - 1) * legendSpacing;


          return (
            <svg width={width} height={height}>
              {/* Background rectangle for the chart area, using theme's paper background */}
              <rect
                width={width}
                height={height}
                fill={colors.background.paper}
                rx={14}
                ry={14}
              />

              {/* Group to center the pie charts */}
              <Group top={centerY} left={centerX}>
                {/* Inner Pie Chart */}
                <Pie
                  data={currentInnerSegmentsData} // Data changes based on selectedOuterSegment
                  pieValue={getValue}
                  outerRadius={innerPieOuterRadius}
                  innerRadius={innerPieInnerRadius}
                  padAngle={0.01} // Small padding between segments
                  cornerRadius={3} // Rounded corners for segments
                >
                  {(pie) =>
                    pie.arcs.map((arc, index) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      // Adjust label for display (e.g., "Paid Subscribers" to "Paid")
                      let displayLabel = arc.data.label;
                      if (arc.data.label === 'Paid Subscribers') {
                        displayLabel = 'Paid';
                      } else if (arc.data.label === 'Demo Subscribers') {
                        displayLabel = 'Demo';
                      }
                      // Calculate percentage for the inner pie segment
                      const percentage = ((getValue(arc.data) / totalInnerValue) * 100).toFixed(1);
                      const labelWithPercentage = `${displayLabel}: ${percentage}%`;

                      return (
                        <g key={`inner-arc-${arc.data.label}-${index}`}>
                          <path
                            d={pie.path(arc)}
                            fill={innerPieColors(getLabel(arc.data))}
                            onMouseMove={(event) => handleArcHover(event, arc)}
                            onMouseLeave={handleArcLeave}
                          />
                          {/* Label text for inner pie segments with percentage */}
                          <Text
                            fill="white" // White text for contrast on dark segment colors
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`translate(${centroidX}, ${centroidY})`}
                            fontSize={12} // Reduced font size
                            // Removed fontWeight="bold"
                            pointerEvents="none" // Ensures text doesn't interfere with mouse events on path
                          >
                            {labelWithPercentage}
                          </Text>
                        </g>
                      );
                    })
                  }
                </Pie>

                {/* Outer Pie Chart */}
                <Pie
                  // If an outer segment is selected, only render that specific segment as a full circle.
                  // Otherwise, render all outer segments.
                  data={selectedOuterSegment ? [selectedOuterSegment] : outerSegmentsData}
                  pieValue={getValue}
                  outerRadius={outerPieOuterRadius}
                  innerRadius={outerPieInnerRadius}
                  padAngle={0.01}
                  cornerRadius={3}
                  startAngle={-Math.PI / 2} // Common convention to start from the top
                >
                  {(pie) =>
                    pie.arcs.map((arc, index) => {
                      return (
                        <g key={`outer-arc-${arc.data.label}-${index}`}>
                          <path
                            d={pie.path(arc)}
                            fill={outerPieColors(getLabel(arc.data))}
                            onClick={(event) => handleOuterArcClick(event, arc)} // Enable drill-down on click
                            onMouseMove={(event) => handleArcHover(event, arc)}
                            onMouseLeave={handleArcLeave}
                            style={{
                              cursor: 'pointer',
                              // Make unselected outer segments disappear completely during drill-down
                              opacity: selectedOuterSegment && selectedOuterSegment.label !== arc.data.label ? 0 : 1,
                              transition: 'opacity 0.3s ease-in-out', // Smooth transition for visual effect
                            }}
                          />
                        </g>
                      );
                    })
                  }
                </Pie>

              </Group>

              {/* Legends for Outer Pie (positioned horizontally below the chart) */}
              <Group
                left={centerX - totalLegendWidth / 2} // Center legends horizontally
                top={height - 20} // Position near the bottom of the SVG
              >
                {outerSegmentsData.map((segment, i) => {
                  // Calculate x-offset for each legend item to arrange them horizontally
                  let currentXOffset = 0;
                  if (i > 0) {
                    for (let j = 0; j < i; j++) {
                      currentXOffset += legendItemWidth + legendSpacing;
                    }
                  }
                  return (
                    <g
                      key={`legend-${segment.label}`}
                      transform={`translate(${currentXOffset}, 0)`}
                      onClick={() => handleOuterArcClick(null, { data: segment })} // Allow clicking legend to trigger drill-down
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        width={16}
                        height={16}
                        fill={outerPieColors(getLabel(segment))}
                        rx={4}
                        ry={4}
                        style={{
                          // Highlight selected legend, dim others when a segment is selected.
                          // Otherwise, all legends are fully visible.
                          opacity: selectedOuterSegment
                            ? (selectedOuterSegment.label === segment.label ? 1 : 0.4)
                            : 1,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      />
                      <Text
                        x={24} // Position text next to the color box
                        y={8} // Vertically center text with color box
                        fill={neutralDark}
                        dominantBaseline="middle"
                        fontSize={13}
                        style={{
                          // Highlight selected legend text, dim others when a segment is selected.
                          // Otherwise, all legend texts are fully visible.
                          opacity: selectedOuterSegment
                            ? (selectedOuterSegment.label === segment.label ? 1 : 0.4)
                            : 1,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      >
                        {getLabel(segment)}
                      </Text>
                    </g>
                  );
                })}
              </Group>


              {/* Tooltip for displaying segment information on hover */}
              {tooltipOpen && tooltipData && (
                <TooltipWithBounds
                  top={tooltipTop}
                  left={tooltipLeft}
                  style={{
                    backgroundColor: primaryDark, // Dark background for tooltip
                    color: neutralDark, // Light text for contrast
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <div>
                    <strong>{getLabel(tooltipData)}:</strong> {getValue(tooltipData)}
                    {/* Display percentage based on whether it's an inner or outer segment */}
                    {(tooltipData.label === 'Paid' || tooltipData.label === 'Demo' || tooltipData.label === 'Paid Subscribers' || tooltipData.label === 'Demo Subscribers') ?
                      // Percentage for inner pie segments
                      ` (${((getValue(tooltipData) / totalInnerValue) * 100).toFixed(1)}%)`
                      :
                      // Percentage for outer pie segments
                      ` (${((getValue(tooltipData) / totalOuterValue) * 100).toFixed(1)}%)`
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

// Export the component wrapped with withTooltip HOC to enable tooltip functionality
export default withTooltip(PieChart);
