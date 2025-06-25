// scenes/indicators/index.jsx
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, X, Upload } from 'lucide-react';

/**
 * Indicators component displays a list of indicators with details,
 * and provides an admin form for adding/editing indicators.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of indicator data.
 */
function Indicators({ data = [] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null); // Indicator being edited
  const [formErrors, setFormErrors] = useState({});

  // Dummy form state
  const [indicatorName, setIndicatorName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [planAssociation, setPlanAssociation] = useState('Basic');

  // Dummy filter/sort state for table (not fully implemented in placeholder)
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleOpenForm = (indicator = null) => {
    setIsFormOpen(true);
    setEditIndicator(indicator);
    setFormErrors({});
    if (indicator) {
      setIndicatorName(indicator.name);
      setDescription(indicator.description);
      setPlanAssociation(indicator.associatedPlan);
      setImageFile(null); // Don't pre-fill file input
    } else {
      setIndicatorName('');
      setDescription('');
      setPlanAssociation('Basic');
      setImageFile(null);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditIndicator(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!indicatorName.trim()) {
      errors.indicatorName = 'Indicator Name is required.';
    }
    if (!description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!editIndicator && !imageFile) {
        errors.imageFile = 'Image is required for new indicators.';
    } else if (imageFile) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(imageFile.type)) {
            errors.imageFile = 'Only PNG/JPG images are allowed.';
        }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const newIndicator = {
      id: editIndicator ? editIndicator.id : `IND${Date.now()}`,
      name: indicatorName,
      imagePreview: editIndicator ? editIndicator.imagePreview : (imageFile ? URL.createObjectURL(imageFile) : 'https://placehold.co/150x100/gray/white?text=New'), // Placeholder for new images
      description: description,
      associatedPlan: planAssociation,
    };
    console.log('Saving/Updating Indicator:', newIndicator);
    // In a real app, you'd send this data to an API
    handleCloseForm();
  };

  const handleDelete = (id) => {
    console.log('Deleting Indicator with ID:', id);
    // In a real app, you'd send delete request to API
  };

  // Dummy data for tabbed display
  const indicatorTabs = [
    { id: 'ind1', name: 'Indicator 1', data: data[0] },
    { id: 'ind2', name: 'Indicator 2', data: data[1] },
    { id: 'ind3', name: 'Indicator 3', data: data[2] },
    { id: 'ind4', name: 'Indicator 4', data: {id:'IND004', name: 'Volume Analysis', imagePreview: 'https://placehold.co/150x100/A0A0F0/white?text=Vol', description: 'Tracks trading volume for confirmation.', associatedPlan: 'Premium'}},
    { id: 'ind5', name: 'Trend Line Breakout', data: {id:'IND005', name: 'Trend Line', imagePreview: 'https://placehold.co/150x100/F0F0A0/white?text=Trend', description: 'Identifies breakouts from trend lines.', associatedPlan: 'Basic'}},
  ];
  const [activeTab, setActiveTab] = useState(indicatorTabs[0]?.id || null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        Indicators Management
      </h2>

      {/* Tabbed Display for Indicators */}
      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-4">Indicator Details</h3>
        <div className="flex border-b border-border-base mb-4 overflow-x-auto custom-scrollbar">
          {indicatorTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-light hover:text-text-base'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        {activeTab && indicatorTabs.find(tab => tab.id === activeTab)?.data && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={indicatorTabs.find(tab => tab.id === activeTab).data.imagePreview}
              alt={indicatorTabs.find(tab => tab.id === activeTab).data.name}
              className="w-full md:w-1/3 rounded-lg shadow-medium object-cover h-auto"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x100/gray/white?text=No+Image'; }}
            />
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-secondary mb-2">
                {indicatorTabs.find(tab => tab.id === activeTab).data.name}
              </h4>
              <p className="text-text-base mb-3">
                {indicatorTabs.find(tab => tab.id === activeTab).data.description}
              </p>
              <p className="text-sm text-text-light mb-4">
                Associated Plan: <span className="font-medium text-primary">
                  {indicatorTabs.find(tab => tab.id === activeTab).data.associatedPlan}
                </span>
              </p>
              <button className="action-button-custom">Demo Preview</button>
            </div>
          </div>
        )}
      </div>


      {/* Admin Input: Form for Adding/Editing Indicators */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        <PlusCircle className="w-7 h-7 text-accent" /> Manage Indicators
      </h3>
      <div className="kpi-card-custom p-6">
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom mb-4"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Indicator
        </button>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card rounded-lg p-8 shadow-strong max-w-lg w-full relative">
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="dashboard-widget-title mb-6">
                {editIndicator ? 'Edit Indicator' : 'Add New Indicator'}
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="indicatorName" className="block text-sm font-medium text-text-base mb-1">
                    Indicator Name (Required)
                  </label>
                  <input
                    type="text"
                    id="indicatorName"
                    value={indicatorName}
                    onChange={(e) => setIndicatorName(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                  {formErrors.indicatorName && <p className="text-danger text-sm mt-1">{formErrors.indicatorName}</p>}
                </div>
                <div>
                  <label htmlFor="imageUpload" className="block text-sm font-medium text-text-base mb-1">
                    Image Upload (PNG/JPG) {editIndicator ? '' : '(Required)'}
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                  />
                  {imageFile && <p className="text-text-light text-sm mt-1">Selected: {imageFile.name}</p>}
                  {formErrors.imageFile && <p className="text-danger text-sm mt-1">{formErrors.imageFile}</p>}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-base mb-1">
                    Description (Required)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
                    required
                  ></textarea>
                  {formErrors.description && <p className="text-danger text-sm mt-1">{formErrors.description}</p>}
                </div>
                <div>
                  <label htmlFor="planAssociation" className="block text-sm font-medium text-text-base mb-1">
                    Plan Association
                  </label>
                  <select
                    id="planAssociation"
                    value={planAssociation}
                    onChange={(e) => setPlanAssociation(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="form-actions-custom">
                  <button type="button" onClick={handleCloseForm} className="action-button-custom cancel-button-custom">
                    Cancel
                  </button>
                  <button type="submit" className="action-button-custom">
                    {editIndicator ? 'Update Indicator' : 'Add Indicator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Table: Editable list of indicators */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        Indicator List
      </h3>
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex justify-between items-center mb-4 p-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Name"
              className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            {/* Add more filter inputs here */}
          </div>
          <div className="flex space-x-2">
            <button className="action-button-custom py-2 px-4 bg-accent">
              Column Toggle
            </button>
            <button className="action-button-custom py-2 px-4 bg-accent">
              Export XLS
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {data.map((indicator) => (
              <tr key={indicator.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <div className="flex items-center gap-2">
                    <img src={indicator.imagePreview} alt={indicator.name} className="w-10 h-8 rounded object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x32/gray/white?text=Img'; }} />
                    {indicator.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{indicator.associatedPlan}</td>
                <td className="px-6 py-4 text-sm text-text-base max-w-xs truncate">{indicator.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenForm(indicator)}
                    className="text-primary hover:text-primary-dark mr-3 transition-colors"
                    aria-label={`Edit ${indicator.name}`}
                  >
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(indicator.id)}
                    className="text-danger hover:text-danger-dark transition-colors"
                    aria-label={`Delete ${indicator.name}`}
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Indicators;
