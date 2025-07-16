import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// TRADINGDASHBOARD/
// ├── node_modules/ (Contains installed npm packages)
// ├── public/
// │   ├── assets/
// │   │   ├── Company logo.jpg
// │   │   └── John.jpg
// │   ├── favicon.ico
// │   ├── index.html
// │   ├── logo192.png
// │   ├── logo512.png
// │   ├── manifest.json
// │   └── robots.txt
// ├── src/
// │   ├── components/
// │   │   ├── AIAssistant.jsx
// │   │   ├── AreaChart.jsx
// │   │   ├── BarChart.jsx
// │   │   ├── Header.jsx
// │   │   ├── LineChart.jsx
// │   │   ├── PieChart.jsx
// │   │   └── Sidebar.jsx
// │   ├── data/
// │   │   └── mockData.js
// │   ├── scenes/
// │   │   ├── auth/
// │   │   │   ├── AuthControl.jsx
// │   │   │   └── SignIn.jsx and SignUp.jsx
// │   │   ├── dashboard/
// │   │   │   └── index.jsx
// │   │   ├── indicators/
// │   │   │   └── index.jsx
// │   │   ├── logout/
// │   │   │   └── index.jsx
// │   │   ├── messages/
// │   │   │   └── index.jsx
// │   │   ├── payments/
// │   │   │   └── index.jsx
// │   │   ├── pricing/
// │   │   │   └── index.jsx
// │   │   ├── profile/
// │   │   │   └── index.jsx
// │   │   ├── referrals/
// │   │   │   └── index.jsx
// │   │   ├── settings/
// │   │   │   └── index.jsx
// │   │   └── users/
// │   │       ├── DailyPaidDemo.jsx
// │   │       ├── DemoSubscribers.jsx
// │   │       ├── MainUsers.jsx
// │   │       └── PaidSubscribers.jsx
// │   ├── App.css
// │   ├── App.js
// │   ├── App.test.js
// │   ├── index.css
// │   ├── index.js
// │   ├── logo.svg
// │   ├── reportWebVitals.js
// │   └── setupTests.js
// │   └── theme.js
// ├── .gitignore
// ├── package-lock.json
// ├── package.json
// ├── postcss.config.js
// ├── README.md
// └── tailwind.config.js