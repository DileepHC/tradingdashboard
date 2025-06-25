// scenes/dashboard/index.jsx
import React from 'react';
import {
  DollarSign, Users, TrendingUp, Wallet, CheckCircle, ClipboardList
} from 'lucide-react'; // Removed chart icons from here, as they're now in imported components

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
 * @param {object} props.data.charts - Chart data for various visualizations.
 * @param {Array<object>} props.data.recentActivity - List of recent activities.
 */
function Dashboard({ data }) {
  // Safely destructure data, providing default empty objects/arrays
  const {
    kpis = {},
    charts = {},
    recentActivity = []
  } = data || {}; // If data itself is undefined, default to an empty object

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

      {/* Recent Activity Table (Existing) */}
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3 mt-8">
        <ClipboardList className="w-8 h-8 text-primary" /> Recent Activity
      </h2>
      <div className="kpi-card-custom overflow-x-auto">
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">${activity.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">${activity.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
