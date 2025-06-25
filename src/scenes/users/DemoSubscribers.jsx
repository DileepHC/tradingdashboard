// scenes/users/DemoSubscribers.jsx
import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, Users } from 'lucide-react';

/**
 * DemoSubscribers component displays a table of only demo users.
 * Shares similar advanced table functionalities with MainUsers.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of demo subscriber data.
 */
function DemoSubscribers({ data = [] }) {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    phoneEmail: true,
    referralId: true,
    plan: true,
    expiryDate: true,
    remainingDays: true,
    status: true,
    actions: true,
  });
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = [...data]
    .filter(user =>
      Object.values(user).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const valA = String(a[sortConfig.key]).toLowerCase();
        const valB = String(b[sortConfig.key]).toLowerCase();

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const handleColumnToggle = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleExport = (format) => {
    console.log(`Exporting demo subscribers to ${format}...`);
    // In a real app, convert data to CSV/PDF and trigger download
  };

  const handleEdit = (user) => {
    console.log('Edit demo user:', user);
  };

  const handleDelete = (userId) => {
    console.log('Delete demo user with ID:', userId);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Users className="w-8 h-8 text-warning" /> Demo Subscribers
      </h2>

      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          <input
            type="text"
            placeholder="Filter demo subscribers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
          />
          <div className="flex space-x-2 relative">
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {isColumnToggleOpen && (
              <div className="absolute top-full right-0 mt-2 bg-bg-card border border-border-base rounded-lg shadow-strong z-10 p-4">
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
                    />
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            )}
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

        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.userId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('userId')}>User ID {getSortIcon('userId')}</th>}
              {visibleColumns.tradingViewId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('tradingViewId')}>TradingView ID {getSortIcon('tradingViewId')}</th>}
              {visibleColumns.phoneEmail && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('phoneEmail')}>Phone / Email {getSortIcon('phoneEmail')}</th>}
              {visibleColumns.referralId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralId')}>Referral ID {getSortIcon('referralId')}</th>}
              {visibleColumns.plan && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.expiryDate && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</th>}
              {visibleColumns.remainingDays && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('remainingDays')}>Remaining Days {getSortIcon('remainingDays')}</th>}
              {visibleColumns.status && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {sortedAndFilteredData.map((user, index) => (
              <tr key={user.userId || index}>
                {visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.userId}</td>}
                {visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.tradingViewId}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.referralId || '-'}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.expiryDate}</td>}
                {visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.remainingDays}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-danger-light text-danger'
                  }`}>
                    {user.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${user.userId}`}
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DemoSubscribers;
