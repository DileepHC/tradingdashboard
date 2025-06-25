// data/mockData.js

/**
 * @typedef {Object} KpiData
 * @property {string} totalProfit - Total profit in INR.
 * @property {string} monthlyProfit - Monthly profit in INR.
 * @property {string} dailyProfit - Daily profit in INR.
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
 * @property {string} phoneEmail - Phone number or email.
 * @property {string} referralId - Optional referral ID.
 * @property {string} plan - User's plan (e.g., "Paid", "Demo").
 * @property {string} expiryDate - Expiry date of the plan.
 * @property {number} remainingDays - Remaining days on the plan.
 * @property {string} status - User status (e.g., "Active", "Inactive").
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
    subscriberSplit: {
      paid: 800,
      demo: 700,
    },
    dailyNewUsers: {
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
      { userId: 'USR001', tradingViewId: 'TV1234', phoneEmail: 'user1@example.com', referralId: 'REF001', plan: 'Paid', expiryDate: '2025-12-31', remainingDays: 160, status: 'Active' },
      { userId: 'USR002', tradingViewId: 'TV5678', phoneEmail: 'user2@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-15', remainingDays: 20, status: 'Inactive' },
      { userId: 'USR003', tradingViewId: 'TV9101', phoneEmail: 'user3@example.com', referralId: 'REF002', plan: 'Paid', expiryDate: '2026-06-30', remainingDays: 365, status: 'Active' },
      { userId: 'USR004', tradingViewId: 'TV1121', phoneEmail: 'user4@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-07-28', remainingDays: 3, status: 'Active' },
    ],
    paidSubscribers: [
      { userId: 'USR001', tradingViewId: 'TV1234', phoneEmail: 'user1@example.com', referralId: 'REF001', plan: 'Paid', expiryDate: '2025-12-31', remainingDays: 160, status: 'Active' },
      { userId: 'USR003', tradingViewId: 'TV9101', phoneEmail: 'user3@example.com', referralId: 'REF002', plan: 'Paid', expiryDate: '2026-06-30', remainingDays: 365, status: 'Active' },
    ],
    demoSubscribers: [
      { userId: 'USR002', tradingViewId: 'TV5678', phoneEmail: 'user2@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-15', remainingDays: 20, status: 'Inactive' },
      { userId: 'USR004', tradingViewId: 'TV1121', phoneEmail: 'user4@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-07-28', remainingDays: 3, status: 'Active' },
    ],
    dailyNewSubscribers: [
      { userId: 'USR005', tradingViewId: 'TV2233', phoneEmail: 'newuser1@example.com', referralId: '', plan: 'Demo', expiryDate: '2024-08-25', remainingDays: 30, status: 'Active' },
      { userId: 'USR006', tradingViewId: 'TV4455', phoneEmail: 'newuser2@example.com', referralId: 'REF003', plan: 'Paid', expiryDate: '2025-07-24', remainingDays: 365, status: 'Active' },
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
    { id: 'PAY001', upiUsed: 'userx@upi', user: 'User X', amount: '₹ 999.00', date: '2024-07-20', status: 'Completed' },
    { id: 'PAY002', upiUsed: 'usery@upi', user: 'User Y', amount: '₹ 4999.00', date: '2024-07-15', status: 'Completed' },
    { id: 'PAY003', upiUsed: 'userz@upi', user: 'User Z', amount: '₹ 999.00', date: '2024-07-22', status: 'Pending' },
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
