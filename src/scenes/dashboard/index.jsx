// scenes/dashboard/index.jsx
import React, { useState } from 'react'; // Import useState
import {
  DollarSign, Users, TrendingUp, ClipboardList, SlidersHorizontal, Download // Removed Wallet and CheckCircle
} from 'lucide-react';

// Import your custom chart components
import AreaChart from '../../components/AreaChart.jsx';
import BarChart from '../../components/BarChart.jsx';
import LineChart from '../../components/LineChart.jsx';
import PieChart from '../../components/PieChart.jsx';


/**
 * Dashboard component displaying KPIs, charts, and recent activity.
 * It receives dashboard data as props.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - The dashboard data containing KPIs, charts, and other lists.
 * @param {object} props.data.kpis - KPI data like totalProfit, monthlyProfit, etc.
 * @param {Array<object>} props.data.recentActivity - List of recent activities.
 */
function Dashboard({ data }) {
  // Safely destructure data, providing default empty objects/arrays
  const {
    kpis = {},
    charts = {},
    recentActivity = []
  } = data || {}; // If data itself is undefined, default to an empty object

  // State for filtering text input for the recent activity table.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage the visibility of each table column in the recent activity.
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    action: true,
    symbol: true,
    quantity: true,
    price: true,
    value: true,
  });
  // State to control the open/close state of the column toggle dropdown for recent activity.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  /**
   * Toggles the sorting direction for a given column key in the recent activity table.
   * @param {string} key - The column key to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the recent activity data based on current filterText and sortConfig.
   * @returns {Array<object>} The filtered and sorted array of activity records.
   */
  const sortedAndFilteredActivity = [...recentActivity]
    .filter(activity =>
      Object.values(activity).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  /**
   * Toggles the visibility of a specific column in the recent activity table.
   * @param {string} column - The key of the column to toggle.
   */
  const handleColumnToggleVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  /**
   * Helper function to format date to DD/MM/YYYY.
   * @param {string} dateString - The date string to format (e.g., 'YYYY-MM-DD').
   * @returns {string} Formatted date string (DD/MM/YYYY).
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  /**
   * Handles exporting table data to XLS (CSV) or PDF (plain text).
   * @param {string} format - The desired export format ('xls' for CSV, 'pdf' for text file).
   */
  const handleExport = (format) => {
    let fileContent = '';
    let fileName = '';
    let mimeType = '';

    const displayHeaders = {
      date: 'Date',
      action: 'Action',
      symbol: 'Symbol',
      quantity: 'Quantity',
      price: 'Price',
      value: 'Value',
    };

    const headers = Object.keys(visibleColumns)
      .filter(key => visibleColumns[key] && displayHeaders[key])
      .map(key => displayHeaders[key])
      .join(',');

    const rows = sortedAndFilteredActivity.map(row =>
      Object.keys(visibleColumns)
        .filter(key => visibleColumns[key] && displayHeaders[key])
        .map(key => {
          let value = row[key];
          if (key === 'price' || key === 'value') {
            value = parseFloat(value).toFixed(2); // Ensure consistent formatting
          } else if (key === 'date') {
            value = formatDate(value); // Format date for export
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    ).join('\n');

    if (format === 'xls') {
      fileContent = `${headers}\n${rows}`;
      fileName = 'recent_activity.csv';
      mimeType = 'text/csv';
      console.log('Exporting recent activity data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Recent Activity Report\n\n';
      sortedAndFilteredActivity.forEach(activity => {
        fileContent += `Date: ${formatDate(activity.date)}\n`; // Format date for PDF
        fileContent += `Action: ${activity.action}\n`;
        fileContent += `Symbol: ${activity.symbol}\n`;
        fileContent += `Quantity: ${activity.quantity}\n`;
        fileContent += `Price: ₹${activity.price.toFixed(2)}\n`; // Changed to ₹
        fileContent += `Value: ₹${activity.value.toFixed(2)}\n`; // Changed to ₹
        fileContent += '--------------------\n';
      });
      fileName = 'recent_activity_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting recent activity data to PDF (text format).');
      console.warn('Note: For full PDF generation with rich formatting, a dedicated client-side PDF library (e.g., jspdf, html2pdf) would be required.');
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Returns the sort icon (▲ for ascending, ▼ for descending) for a given column key.
   * @param {string} key - The column key.
   * @returns {string|null} The sort icon character or null if not sorted by this key.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      {/* KPI Cards Section */}
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-primary" /> Key Performance Indicators
      </h2>
      <div className="kpi-cards-custom">
        {/* Total Profit */}
        <div className="kpi-card-custom">
          <h3>Total Profit</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.totalProfit}</p>
            <span className="kpi-trend-custom up">
              <TrendingUp className="w-4 h-4 mr-1" /> +15%
            </span>
          </div>
        </div>

        {/* Monthly Profit */}
        <div className="kpi-card-custom">
          <h3>Monthly Profit</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.monthlyProfit}</p>
            <span className="kpi-trend-custom up">
              <TrendingUp className="w-4 h-4 mr-1" /> +5%
            </span>
          </div>
        </div>

        {/* Daily Profit */}
        <div className="kpi-card-custom">
          <h3>Daily Profit</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.dailyProfit}</p>
            <span className="kpi-trend-custom down">
              <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" /> -2%
            </span>
          </div>
        </div>

        {/* Total Paid Subscribers */}
        <div className="kpi-card-custom">
          <h3>Paid Subscribers</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.totalPaidSubscribers}</p>
            <span className="kpi-trend-custom up">
              <Users className="w-4 h-4 mr-1" /> +10
            </span>
          </div>
        </div>

        {/* Total Demo Subscribers */}
        <div className="kpi-card-custom">
          <h3>Demo Subscribers</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.totalDemoSubscribers}</p>
            <span className="kpi-trend-custom up">
              <Users className="w-4 h-4 mr-1" /> +5
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="kpi-card-custom">
          <h3>Monthly Revenue</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.monthlyRevenue}</p>
            <span className="kpi-trend-custom up">
              <DollarSign className="w-4 h-4 mr-1" /> +8%
            </span>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="kpi-card-custom">
          <h3>Weekly Revenue</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.weeklyRevenue}</p>
            <span className="kpi-trend-custom up">
              <DollarSign className="w-4 h-4 mr-1" /> +1%
            </span>
          </div>
        </div>

        {/* Monthly Commission Paid - REMOVED */}
        {/* Active Users */}
        <div className="kpi-card-custom">
          <h3>Active Users</h3>
          <div className="kpi-metric-custom">
            <p className="kpi-value-custom">{kpis.activeUsers}</p>
            <span className="kpi-trend-custom up">
              <Users className="w-4 h-4 mr-1" /> +15
            </span>
          </div>
        </div>

        {/* Sessions - REMOVED */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Revenue Over Time (Area Chart) */}
        <div className="kpi-card-custom">
          {/* Passed props to the AreaChart component */}
          <AreaChart
            title="Revenue Over Time"
            labels={charts?.revenueOverTime?.labels || []}
            data={charts?.revenueOverTime?.data || []}
            color="var(--accent-color)"
          />
        </div>

        {/* Subscriber Split (Pie Chart) */}
        <div className="kpi-card-custom">
          {/* Passed props to the PieChart component */}
          <PieChart
            title="Subscriber Split"
            paid={charts?.subscriberSplit?.paid || 0}
            demo={charts?.subscriberSplit?.demo || 0}
            colors={['var(--primary-color)', 'var(--warning-color)']}
          />
        </div>

        {/* Daily New Users (Line Chart) */}
        <div className="kpi-card-custom">
          {/* Passed props to the LineChart component */}
          <LineChart
            title="Daily New Users"
            labels={charts?.dailyNewUsers?.labels || []}
            data={charts?.dailyNewUsers?.data || []}
            color="var(--primary-color)"
          />
        </div>

        {/* Referral Commission Distribution (Bar Chart) */}
        <div className="kpi-card-custom">
          {/* Passed props to the BarChart component */}
          <BarChart
            title="Referral Commission Distribution"
            labels={charts?.referralCommissionDistribution?.labels || []}
            data={charts?.referralCommissionDistribution?.data || []}
            color="var(--danger-color)"
          />
        </div>
      </div>

      {/* Recent Activity Table */}
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3 mt-8">
        <ClipboardList className="w-8 h-8 text-primary" /> Recent Activity
      </h2>
      <div className="kpi-card-custom overflow-x-auto">
        {/* Table Controls (Filter, Column Toggle, Export) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Search/Filter Input */}
          <input
            type="text"
            placeholder="Filter recent activity..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
            aria-label="Filter recent activity"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button and Dropdown */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="recent-activity-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {isColumnToggleOpen && (
              <div
                id="recent-activity-column-toggle-dropdown"
                className="column-toggle-dropdown-custom"
              >
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggleVisibility(colKey)}
                      className="form-checkbox text-primary rounded"
                    />
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            )}
            {/* Export Buttons */}
            <button
              onClick={() => handleExport('xls')}
              className="action-button-custom py-2 px-4 bg-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export XLS
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="action-button-custom py-2 px-4 bg-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Recent Activity Table */}
        <table className="table-custom divide-y divide-border-base"> {/* Changed from min-w-full to table-custom */}
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.date && <th style={{ width: '120px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('date')}>Date {getSortIcon('date')}</th>}
              {visibleColumns.action && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('action')}>Action {getSortIcon('action')}</th>}
              {visibleColumns.symbol && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('symbol')}>Symbol {getSortIcon('symbol')}</th>}
              {visibleColumns.quantity && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('quantity')}>Quantity {getSortIcon('quantity')}</th>}
              {visibleColumns.price && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('price')}>Price {getSortIcon('price')}</th>}
              {visibleColumns.value && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('value')}>Value {getSortIcon('value')}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {sortedAndFilteredActivity.map((activity, index) => (
              <tr key={index}>
                {visibleColumns.date && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{formatDate(activity.date)}</td>} {/* Formatted date */}
                {visibleColumns.action && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.action}</td>}
                {visibleColumns.symbol && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.symbol}</td>}
                {visibleColumns.quantity && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.quantity}</td>}
                {visibleColumns.price && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">₹{activity.price.toFixed(2)}</td>}
                {visibleColumns.value && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">₹{activity.value.toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
