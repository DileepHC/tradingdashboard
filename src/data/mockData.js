// src/data/mockData.js
import { timeFormat } from 'd3-time-format'; // Import timeFormat for use in data generation

/**
 * @typedef {Object} KpiData
 * @property {string} totalProfit - Total profit in INR.
 * @property {string} monthlyProfit - Monthly profit in INR.
 * @property {string} dailyProfit - Daily Profit in INR.
 * @property {number} totalPaidSubscribers - Total count of paid subscribers.
 * @property {number} totalDemoSubscribers - Total count of demo subscribers.
 * @property {string} monthlyRevenue - Monthly revenue in INR.
 * @property {string} weeklyRevenue - Weekly revenue in INR.
 * @property {string} monthlyCommissionPaid - Monthly commission paid in INR.
 * @property {number} activeUsers - Number of currently active users.
 * @property {number} sessions - Number of active sessions.
 */

/**
 * @typedef {Object} ChartData
 * @property {string[]} labels - Labels for the X-axis (e.g., months, days).
 * @property {number[]} data - Data points for the chart.
 */

/**
 * @typedef {Object} IndicatorData
 * @property {string} id - Unique identifier for the indicator.
 * @property {string} name - Name of the indicator.
 * @property {string} imagePreview - URL for the image preview.
 * @property {string} description - Description text for the indicator.
 * @property {string} associatedPlan - The plan associated with the indicator.
 */

/**
 * @typedef {Object} PricingPlanData
 * @property {string} id - Unique identifier for the plan.
 * @property {string} name - Name of the plan (e.g., "Basic Plan", "Premium Plan").
 * @property {number} price - Price of the plan.
 * @property {string[]} features - Array of features included in the plan.
 * @property {string} buttonText - Text for the action button (e.g., "Buy Now", "Start Demo").
 */

/**
 * @typedef {Object} UserData
 * @property {string} userId - Unique user ID.
 * @property {string} tradingViewId - TradingView ID.
 * @property {string} name - User's name. // Added name property
 * @property {string} phoneEmail - Phone number or email.
 * @property {string} referralId - Optional referral ID.
 * @property {string} plan - User's plan (e.g., "Paid", "Demo").
 * @property {string} expiryDate - Expiry date of the plan.
 * @property {number} remainingDays - Remaining days on the plan.
 * @property {string} status - User status (e.g., "Active", "Inactive").
 * @property {string} joinedDate - Date the user joined. // Added joinedDate property
 */

/**
 * @typedef {Object} ReferralDetail
 * @property {string} id - Referral ID.
 * @property {string} referrer - Name of the referrer.
 * @property {number} countOfReferrals - Number of referrals made by this referrer.
 * @property {string} commissionEarned - Commission earned by this referrer.
 * @property {string} referralStatus - Status of the referral (e.g., "Active", "Pending").
 */

/**
 * @typedef {Object} MessageDetail
 * @property {number} id - Message ID.
 * @property {string} sender - Sender of the message.
 * @property {string} text - Message content.
 * @property {string} timestamp - Timestamp of the message.
 */

/**
 * @typedef {Object} PaymentRecord
 * @property {string} id - Payment ID.
 * @property {string} upiUsed - UPI ID used for payment.
 * @property {string} user - User associated with the payment.
 * @property {string} amount - Amount of the payment.
 * @property {string} date - Date of the payment.
 * @property {string} status - Payment status (e.g., "Completed", "Pending").
 */

/**
 * @typedef {Object} DashboardData
 * @property {KpiData} kpis - Key Performance Indicator data.
 * @property {Object} charts - Data for various charts.
 * @property {ChartData} charts.revenueOverTime - Data for the Revenue Over Time Area Chart.
 * @property {Object} charts.subscriberSplit - Data for the Subscriber Split Pie Chart.
 * @property {number} charts.subscriberSplit.paid - Number of paid subscribers for the pie chart.
 * @property {number} charts.subscriberSplit.demo - Number of demo subscribers for the pie chart.
 * @property {ChartData} charts.dailyNewUsers - Data for the Daily New Users Line Chart.
 * @property {ChartData} charts.referralCommissionDistribution - Data for the Referral Commission Distribution Bar Chart.
 * @property {Array<Object>} recentActivity - Array of recent activity objects.
 * @property {Array<IndicatorData>} indicators - Array of indicator data.
 * @property {Array<PricingPlanData>} pricingPlans - Array of pricing plan data.
 * @property {Object} users - User-related data.
 * @property {Array<UserData>} users.mainUsers - List of all users.
 * @property {Array<UserData>} users.paidSubscribers - List of paid subscribers.
 * @property {Array<UserData>} users.demoSubscribers - List of demo subscribers.
 * @property {Array<UserData>} users.dailyNewSubscribers - List of daily new subscribers.
 * @property {Array<ReferralDetail>} referrals - Array of referral details.
 * @property {Array<MessageDetail>} messages - Array of message details.
 * @property {Array<PaymentRecord>} payments - Array of payment records.
 * @property {Object} settings - Settings data.
 * @property {Object} authControl - Auth control data.
 */

/**
 * Mock data for the dashboard.
 * @type {DashboardData}
 */
export const dashboardData = {
  kpis: {
    totalProfit: '₹ 2,50,000',
    monthlyProfit: '₹ 50,000',
    dailyProfit: '₹ 1,600',
    totalPaidSubscribers: 800,
    totalDemoSubscribers: 700,
    monthlyRevenue: '₹ 1,20,000',
    weeklyRevenue: '₹ 30,000',
    monthlyCommissionPaid: '₹ 15,000',
    activeUsers: 120,
    sessions: 350,
  },
  charts: {
    revenueOverTime: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [30000, 32000, 35000, 38000, 42000, 45000, 40000, 48000, 52000, 55000, 60000, 65000],
    },
    subscriberSplit: { // This will be used by the new PieChart for the outer ring as default
      paid: 800,
      demo: 700,
    },
    dailyNewUsers: { // Kept for existing BarChart and AreaChart data structure if needed
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      data: [10, 15, 8, 12, 20, 18, 25],
    },
    referralCommissionDistribution: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [2500, 3000, 2800, 3500, 3200, 4000],
    },
  },
  recentActivity: [
    { date: '2024-07-26', action: 'Buy', symbol: 'XYZ', quantity: 10, price: 100.00, value: 1000.00 },
    { date: '2024-07-25', action: 'Sell', symbol: 'ABC', quantity: 5, price: 50.00, value: 250.00 },
    { date: '2024-07-24', action: 'Buy', symbol: 'DEF', quantity: 20, price: 25.00, value: 500.00 },
    { date: '2024-07-23', action: 'Sell', symbol: 'GHI', quantity: 15, price: 75.00, value: 1125.00 },
    { date: '2024-07-22', action: 'Buy', symbol: 'JKL', quantity: 8, price: 125.00, value: 1000.00 },
  ],
  indicators: [
    { id: 'IND001', name: 'RSI Divergence', imagePreview: 'https://placehold.co/150x100/A0DCF0/white?text=RSI', description: 'Identifies potential trend reversals.', associatedPlan: 'Premium' },
    { id: 'IND002', name: 'Moving Average Crossover', imagePreview: 'https://placehold.co/150x100/F0DCA0/white?text=MA', description: 'Signals buy/sell opportunities based on MA.', associatedPlan: 'Basic' },
    { id: 'IND003', name: 'Bollinger Bands Squeeze', imagePreview: 'https://placehold.co/150x100/DCF0A0/white?text=BB', description: 'Indicates periods of low volatility.', associatedPlan: 'Premium' },
  ],
  pricingPlans: [
    { id: 'PLAN001', name: 'Basic Plan', price: 999, features: ['Access to basic indicators', 'Email support', '5 daily signals'], buttonText: 'Buy Basic' },
    { id: 'PLAN002', name: 'Premium Plan', price: 4999, features: ['Access to all indicators', '24/7 priority support', 'Unlimited signals', 'Exclusive webinars'], buttonText: 'Upgrade Now' },
  ],
  users: {
    mainUsers: [
      { userId: 'USR001', tradingViewId: 'TV1234', name: 'Alice Smith', phoneEmail: 'user1@example.com', referralId: 'REF001', plan: 'Paid', expiryDate: '2025-12-31', remainingDays: 160, status: 'Active', joinedDate: '2024-01-10' },
      { userId: 'USR002', tradingViewId: 'TV5678', name: 'Bob Johnson', phoneEmail: 'user2@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-15', remainingDays: 20, status: 'Inactive', joinedDate: '2024-02-20' },
      { userId: 'USR003', tradingViewId: 'TV9101', name: 'Charlie Brown', phoneEmail: 'user3@example.com', referralId: 'REF002', plan: 'Paid', expiryDate: '2026-06-30', remainingDays: 365, status: 'Active', joinedDate: '2024-03-05' },
      { userId: 'USR004', tradingViewId: 'TV1121', name: 'Diana Prince', phoneEmail: 'user4@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-07-28', remainingDays: 3, status: 'Active', joinedDate: '2024-04-12' },
    ],
    paidSubscribers: [
      { userId: 'USR001', tradingViewId: 'TV1234', name: 'Alice Smith', phoneEmail: 'user1@example.com', referralId: 'REF001', plan: 'Paid', expiryDate: '2025-12-31', remainingDays: 160, status: 'Active', joinedDate: '2024-01-10' },
      { userId: 'USR003', tradingViewId: 'TV9101', name: 'Charlie Brown', phoneEmail: 'user3@example.com', referralId: 'REF002', plan: 'Paid', expiryDate: '2026-06-30', remainingDays: 365, status: 'Active', joinedDate: '2024-03-05' },
      { userId: 'USR006', tradingViewId: 'TV4455', name: 'Frank White', phoneEmail: 'newuser2@example.com', referralId: 'REF003', plan: 'Paid', expiryDate: '2025-07-24', remainingDays: 365, status: 'Active', joinedDate: '2024-07-20' }, // Added joinedDate
    ],
    demoSubscribers: [
      { userId: 'USR002', tradingViewId: 'TV5678', name: 'Bob Johnson', phoneEmail: 'user2@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-15', remainingDays: 20, status: 'Inactive', joinedDate: '2024-02-20' },
      { userId: 'USR004', tradingViewId: 'TV1121', name: 'Diana Prince', phoneEmail: 'user4@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-07-28', remainingDays: 3, status: 'Active', joinedDate: '2024-04-12' },
      { userId: 'USR005', tradingViewId: 'TV2233', name: 'Eve Adams', phoneEmail: 'newuser1@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-25', remainingDays: 30, status: 'Active', joinedDate: '2024-07-26' }, // Added joinedDate
    ],
    dailyNewSubscribers: [
      { userId: 'USR005', tradingViewId: 'TV2233', name: 'Eve Adams', phoneEmail: 'newuser1@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-25', remainingDays: 30, status: 'Active', joinedDate: '2024-07-26' },
      { userId: 'USR006', tradingViewId: 'TV4455', name: 'Frank White', phoneEmail: 'newuser2@example.com', referralId: 'REF003', plan: 'Paid', expiryDate: '2025-07-24', remainingDays: 365, status: 'Active', joinedDate: '2024-07-20' },
      { userId: 'USR007', tradingViewId: 'TV6789', name: 'Grace Lee', phoneEmail: 'newuser3@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-09-10', remainingDays: 45, status: 'Active', joinedDate: '2024-07-27' },
      { userId: 'USR008', tradingViewId: 'TV9876', name: 'Harry Potter', phoneEmail: 'newuser4@example.com', referralId: 'REF004', plan: 'Paid', expiryDate: '2025-08-01', remainingDays: 370, status: 'Active', joinedDate: '2024-07-28' },
    ],
  },
  referrals: [
    { id: 'REF001', referrer: 'User A', countOfReferrals: 5, commissionEarned: '₹ 5000', referralStatus: 'Active' },
    { id: 'REF002', referrer: 'User B', countOfReferrals: 3, commissionEarned: '₹ 3000', referralStatus: 'Active' },
    { id: 'REF003', referrer: 'User C', countOfReferrals: 1, commissionEarned: '₹ 1000', referralStatus: 'Pending' },
  ],
  messages: [
    { id: 1, sender: 'System', text: 'Welcome to your trading dashboard!', timestamp: '2024-07-26 10:00 AM' },
    { id: 2, sender: 'Admin', text: 'New feature update released.', timestamp: '2024-07-25 03:00 PM' },
    { id: 3, sender: 'User A', text: 'When is the next webinar?', timestamp: '2024-07-26 11:30 AM' },
  ],
  payments: [
    { id: 'PAY001', upiUsed: 'userx@upi', user: 'User X', amount: '999.00', date: '2024-07-20', status: 'Completed' },
    { id: 'PAY002', upiUsed: 'usery@upi', user: 'User Y', amount: '4999.00', date: '2024-07-15', status: 'Completed' },
    { id: 'PAY003', upiUsed: 'userz@upi', user: 'User Z', amount: '999.00', date: '2024-07-22', status: 'Pending' },
  ],
  settings: {
    demoModeVisible: true,
    authPageVisible: true,
    heroBannerText: 'Welcome to the Advanced Admin Dashboard!',
    footerDisclaimer: 'All rights reserved. Data may be delayed.',
    planDescriptions: {
      basic: 'Affordable access to essential tools.',
      premium: 'Unleash full potential with advanced features.',
    },
    commissionPercentage: 10,
    languageDefaults: 'English',
  },
  authControl: {
    showSignInPage: true,
    customizeSignUpFields: {
      referralInputEnabled: true,
    },
    passwordResetFlowEnabled: true,
  },
};

// Helper function to generate a date string for a given day
const formatDate = (date) => date.toISOString().split('T')[0];

// Generate mock data for a full year (365 days)
const generateDailyData = (year) => {
  const data = [];
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const today = new Date(); // Get current date
  today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

  for (let i = 0; ; i++) { // Loop indefinitely
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Stop if the current date is in the future
    if (currentDate > today) {
      break;
    }

    data.push({
      date: formatDate(currentDate),
      value: Math.floor(Math.random() * 5000) + 1000, // Revenue between 1000 and 6000
    });
  }
  return data;
};

// Generate daily new paid and demo subscribers data
const generateDailySubscribersData = (year) => {
  const paidData = [];
  const demoData = [];
  const startDate = new Date(`${year}-01-01T00:00:00Z`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; ; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    if (currentDate > today) {
      break;
    }

    paidData.push({
      x: formatDate(currentDate),
      y: Math.floor(Math.random() * 10) + 1, // 1-10 new paid users daily
    });
    demoData.push({
      x: formatDate(currentDate),
      y: Math.floor(Math.random() * 15) + 5, // 5-20 new demo users daily
    });
  }
  return { paidData, demoData };
};

// Aggregate daily data to weekly
const aggregateDailyToWeeklySubscribers = (dailyData) => {
  const weeklyMap = new Map();
  dailyData.forEach(d => {
    const date = new Date(d.x);
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()); // Sunday start of week
    const weekKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;

    if (!weeklyMap.has(weekKey)) {
      // Use timeFormat for consistent week labeling
      weeklyMap.set(weekKey, { x: timeFormat('%b %d')(weekStart), y: 0 });
    }
    weeklyMap.get(weekKey).y += d.y;
  });
  // Sort by date to ensure correct order
  return Array.from(weeklyMap.values()).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};

// Aggregate daily data to monthly
const aggregateDailyToMonthlySubscribers = (dailyData) => {
  const monthlyMap = new Map();
  dailyData.forEach(d => {
    const date = new Date(d.x);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthKey = `${monthStart.getFullYear()}-${monthStart.getMonth()}`;

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { x: timeFormat('%b %Y')(monthStart), y: 0 });
    }
    monthlyMap.get(monthKey).y += d.y;
  });
  // Sort by date to ensure correct order
  return Array.from(monthlyMap.values()).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
};


const { paidData: dailyPaidUsers, demoData: dailyDemoUsers } = generateDailySubscribersData(new Date().getFullYear());

export const mockLineData = [
  {
    id: "Paid Users",
    color: "hsl(210, 70%, 50%)",
    data: dailyPaidUsers,
  },
  {
    id: "Demo Users",
    color: "hsl(0, 70%, 50%)",
    data: dailyDemoUsers,
  },
];

// Base daily revenue data for the Area Chart
export const mockDailyRevenueData = generateDailyData(new Date().getFullYear());


// Data for nested Pie Chart (Visx-compatible structure) - Updated for drill-down
export const mockNestedPieData = {
  // Initial inner segments for overall Paid/Demo
  overallSubscribers: [
    { label: 'Paid Subscribers', value: dashboardData.kpis.totalPaidSubscribers },
    { label: 'Demo Subscribers', value: dashboardData.kpis.totalDemoSubscribers },
  ],
  // Outer segments, each with a 'breakdown' of Paid and Demo subscribers for that segment
  outerSegments: [
    {
      label: 'Web Access',
      value: Math.floor((dashboardData.kpis.totalPaidSubscribers + dashboardData.kpis.totalDemoSubscribers) * 0.5),
      breakdown: [
        { label: 'Paid', value: Math.floor(dashboardData.kpis.totalPaidSubscribers * 0.6) },
        { label: 'Demo', value: Math.floor(dashboardData.kpis.totalDemoSubscribers * 0.7) },
      ]
    },
    {
      label: 'Mobile App',
      value: Math.floor((dashboardData.kpis.totalPaidSubscribers + dashboardData.kpis.totalDemoSubscribers) * 0.3),
      breakdown: [
        { label: 'Paid', value: Math.floor(dashboardData.kpis.totalPaidSubscribers * 0.3) },
        { label: 'Demo', value: Math.floor(dashboardData.kpis.totalDemoSubscribers * 0.2) },
      ]
    },
    {
      label: 'Desktop App',
      value: Math.floor((dashboardData.kpis.totalPaidSubscribers + dashboardData.kpis.totalDemoSubscribers) * 0.2),
      breakdown: [
        { label: 'Paid', value: Math.floor(dashboardData.kpis.totalPaidSubscribers * 0.1) },
        { label: 'Demo', value: Math.floor(dashboardData.kpis.totalDemoSubscribers * 0.1) },
      ]
    },
  ],
};

// New data for Visx Bar Chart (e.g., monthly referral commissions)
export const mockMonthlyBarData = [
  { month: 'Jan', commission: 2500 },
  { month: 'Feb', commission: 3000 },
  { month: 'Mar', commission: 2800 },
  { month: 'Apr', commission: 3500 },
  { month: 'May', commission: 3200 },
  { month: 'Jun', commission: 4000 },
  { month: 'Jul', commission: 3800 },
  { month: 'Aug', commission: 4200 },
  { month: 'Sep', commission: 4500 },
  { month: 'Oct', commission: 4100 },
  { month: 'Nov', commission: 4800 },
  { month: 'Dec', commission: 5000 },
];

export const mockWeeklyPaidUsers = aggregateDailyToWeeklySubscribers(dailyPaidUsers);
export const mockMonthlyPaidUsers = aggregateDailyToMonthlySubscribers(dailyPaidUsers);
export const mockWeeklyDemoUsers = aggregateDailyToWeeklySubscribers(dailyDemoUsers);
export const mockMonthlyDemoUsers = aggregateDailyToMonthlySubscribers(dailyDemoUsers);

// Dummy names for the Name column
export const dummyNames = [
  "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Eve Adams",
  "Frank White", "Grace Lee", "Harry Potter", "Ivy Green", "Jack Black",
  "Karen King", "Liam Scott", "Mia Taylor", "Noah Clark", "Olivia Hall"
];
