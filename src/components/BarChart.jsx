// src/components/BarChart.jsx
import React from 'react';
// Assuming you would integrate a charting library like Recharts or Nivo here.

/**
 * Placeholder Bar Chart component.
 * Would typically render a bar chart using a library like Recharts.
 * @param {object} props - Component props.
 * @param {string[]} props.labels - Labels for the x-axis (e.g., months, categories).
 * @param {number[]} props.data - Data points for the chart bars.
 * @param {string} props.title - Title for the chart.
 * @param {string} props.color - Color for the chart bars.
 */
function BarChart({ labels = [], data = [], title = "Bar Chart", color = "#4ade80" }) {
  // In a real implementation, you would use a charting library like Recharts
  // For example, using Recharts:
  /*
  import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index]
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
        <XAxis dataKey="name" stroke="var(--text-light)" />
        <YAxis stroke="var(--text-light)" />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-base)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-base)' }}
          labelStyle={{ color: 'var(--secondary-color)' }}
        />
        <Bar dataKey="value" fill={color} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
  */
  // For now, it's a simple placeholder:
  const maxVal = Math.max(...data) || 1;
  const barWidth = 80 / (labels.length * 1.5); // Adjust for spacing

  return (
    <div className="flex justify-center items-center h-full bg-bg-base rounded-lg text-text-light text-center p-4">
      {/* Visual representation of a Bar Chart */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-50">
        {data.map((val, i) => (
          <rect
            key={i}
            x={10 + i * (barWidth + 5)}
            y={100 - (val / maxVal) * 80}
            width={barWidth}
            height={(val / maxVal) * 80}
            fill={color}
            rx="2" ry="2"
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <h4 className="font-semibold text-secondary mb-2">{title}</h4>
        <p className="text-text-base text-sm">Chart data available.</p>
      </div>
    </div>
  );
}

export default BarChart;
