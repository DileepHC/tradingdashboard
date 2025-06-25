// src/components/PieChart.jsx
import React from 'react';
// Assuming you would integrate a charting library like Recharts or Nivo here.

/**
 * Placeholder Pie Chart component.
 * Would typically render a pie chart using a library like Recharts.
 * @param {object} props - Component props.
 * @param {number} props.paid - Value for paid subscribers.
 * @param {number} props.demo - Value for demo subscribers.
 * @param {string} props.title - Title for the chart.
 * @param {string[]} props.colors - Array of colors for slices.
 */
function PieChart({ paid = 0, demo = 0, title = "Pie Chart", colors = ["#82ca9d", "#ffc658"] }) {
  // In a real implementation, you would use a charting library like Recharts
  // For example, using Recharts:
  /*
  import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

  const data = [
    { name: 'Paid', value: paid },
    { name: 'Demo', value: demo },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-base)' }}
          labelStyle={{ color: 'var(--secondary-color)' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
  */
  // For now, it's a simple placeholder:
  const total = paid + demo;
  const paidAngle = (paid / total) * 360;
  const demoAngle = (demo / total) * 360;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  let cumulativePercent = 0;
  const slices = [
    { value: paid, color: colors[0], label: 'Paid' },
    { value: demo, color: colors[1], label: 'Demo' },
  ].map(slice => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slice.value / total;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
    const pathData = [
      `M ${startX * 40 + 50},${startY * 40 + 50}`, // Move to outer arc start point
      `A 40,40 0 ${largeArcFlag} 1 ${endX * 40 + 50},${endY * 40 + 50}`, // Arc
      `L 50,50`, // Line to center
      `Z` // Close path
    ].join(' ');

    return { pathData, color: slice.color, label: slice.label, percent: (slice.value / total * 100).toFixed(0) + '%' };
  });


  return (
    <div className="flex justify-center items-center h-full bg-bg-base rounded-lg text-text-light text-center p-4 relative">
      {/* Visual representation of a Pie Chart */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-50">
        {slices.map((slice, index) => (
          <path key={index} d={slice.pathData} fill={slice.color} />
        ))}
        {/* Labels for slices (simplified) */}
        {slices.map((slice, index) => {
          const midAngle = (cumulativePercent - (slice.value / total) / 2) * 360;
          const [labelX, labelY] = getCoordinatesForPercent(cumulativePercent - (slice.value / total) / 2);
          const textX = labelX * 25 + 50; // Adjust position for text
          const textY = labelY * 25 + 50;
          return (
            <text key={index} x={textX} y={textY} fill="white" textAnchor="middle" fontSize="6">
              {slice.label} ({slice.percent})
            </text>
          );
        })}
      </svg>
      <div className="absolute text-center">
        <h4 className="font-semibold text-secondary mb-2">{title}</h4>
        <p className="text-text-base text-sm">Chart data available.</p>
      </div>
    </div>
  );
}

export default PieChart;
