// scenes/referrals/index.jsx
import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Download, Trash2, Link } from 'lucide-react';

/**
 * ReferralList component displays a table of all referral IDs and associated data.
 * Features advanced table functionalities like filter, sort, column toggle, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of referral data.
 */
function ReferralList({ data = [] }) {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    referrer: true,
    countOfReferrals: true,
    commissionEarned: true,
    referralStatus: true,
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
    .filter(referral =>
      Object.values(referral).some(val =>
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
    console.log(`Exporting referrals to ${format}...`);
    // In a real app, convert data to CSV/PDF and trigger download
  };

  const handleDelete = (referralId) => {
    console.log('Delete referral with ID:', referralId);
    // Send delete request to API
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Link className="w-8 h-8 text-primary" /> Referral List
      </h2>

      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          <input
            type="text"
            placeholder="Filter referrals..."
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
              {visibleColumns.id && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('id')}>Referral ID {getSortIcon('id')}</th>}
              {visibleColumns.referrer && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referrer')}>Referrer Name {getSortIcon('referrer')}</th>}
              {visibleColumns.countOfReferrals && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('countOfReferrals')}>Count of Referrals {getSortIcon('countOfReferrals')}</th>}
              {visibleColumns.commissionEarned && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('commissionEarned')}>Commission Earned {getSortIcon('commissionEarned')}</th>}
              {visibleColumns.referralStatus && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralStatus')}>Status {getSortIcon('referralStatus')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {sortedAndFilteredData.map((referral, index) => (
              <tr key={referral.id || index}>
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.id}</td>}
                {visibleColumns.referrer && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.referrer}</td>}
                {visibleColumns.countOfReferrals && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.countOfReferrals}</td>}
                {visibleColumns.commissionEarned && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.commissionEarned}</td>}
                {visibleColumns.referralStatus && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    referral.referralStatus === 'Active' ? 'bg-accent-light text-accent' : (referral.referralStatus === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                  }`}>
                    {referral.referralStatus}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(referral.id)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${referral.id}`}
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

export default ReferralList;
