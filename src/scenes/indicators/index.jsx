import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, X, Eye, Download, SlidersHorizontal } from 'lucide-react';

/**
 * Indicators component displays a list of indicators with details,
 * and provides an admin form for adding/editing indicators.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of indicator data from mockData.js.
 */
function Indicators({ data = [] }) {
  // State to manage the actual list of indicators, initialized from props.data
  // This allows for client-side deletion and potential adding/editing without direct prop mutation.
  const [indicatorsData, setIndicatorsData] = useState(data);

  // State to control the visibility of the add/edit indicator form modal.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to hold the indicator object being edited. Null if adding a new indicator.
  const [editIndicator, setEditIndicator] = useState(null);
  // State to store validation errors for the form.
  const [formErrors, setFormErrors] = useState({});

  // States for the form inputs (dummy state for now, would be connected to actual data in a real app).
  const [indicatorName, setIndicatorName] = useState('');
  const [imageFile, setImageFile] = useState(null); // Stores the selected file object for upload.
  const [description, setDescription] = useState('');
  const [planAssociation, setPlanAssociation] = useState('Basic'); // Default to 'Basic' plan.

  // State for table filtering and sorting
  const [filterText, setFilterText] = useState(''); // Text input for filtering
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sorting configuration
  // State to manage the visibility of each table column.
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    plan: true,
    description: true,
    actions: true, // Actions column is typically always visible
  });
  // State to control the open/close state of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState(null); // Stores the ID of the indicator to delete

  // Dynamically generate indicatorTabs from indicatorsData
  const indicatorTabs = useMemo(() => {
    return indicatorsData.map(ind => ({
      id: ind.id,
      name: ind.name,
      data: ind,
    }));
  }, [indicatorsData]);

  // State to manage the currently active tab in the indicator details section.
  const [activeTab, setActiveTab] = useState(indicatorTabs[0]?.id || null);

  // Effect to set the active tab when indicatorsData changes (e.g., after adding/deleting)
  useEffect(() => {
    if (!activeTab && indicatorTabs.length > 0) {
      // If no active tab is set and there are tabs, set the first one as active
      setActiveTab(indicatorTabs[0].id);
    } else if (activeTab && !indicatorTabs.some(tab => tab.id === activeTab)) {
      // If the current active tab was deleted, set the first tab as active (or null if no tabs)
      setActiveTab(indicatorTabs[0]?.id || null);
    }
  }, [indicatorsData, activeTab, indicatorTabs]);


  /**
   * Opens the indicator form modal.
   * If an indicator object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new indicator.
   * @param {object|null} indicator - The indicator object to edit, or null to add new.
   */
  const handleOpenForm = (indicator = null) => {
    setIsFormOpen(true);
    setEditIndicator(indicator);
    setFormErrors({}); // Clear any previous form errors.

    // Populate form fields if an indicator is being edited.
    if (indicator) {
      setIndicatorName(indicator.name);
      setDescription(indicator.description);
      setPlanAssociation(indicator.associatedPlan);
      setImageFile(null); // File input cannot be pre-filled for security reasons.
    } else {
      // Reset form fields for a new indicator.
      setIndicatorName('');
      setDescription('');
      setPlanAssociation('Basic');
      setImageFile(null);
    }
  };

  /**
   * Closes the indicator form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditIndicator(null);
    setFormErrors({}); // Clear errors when closing.
  };

  /**
   * Validates the Indicator Name field in real-time.
   * Updates the formErrors state for 'indicatorName'.
   * @param {string} name - The current value of the indicator name input.
   */
  const validateIndicatorName = (name) => {
    const minNameLength = 3;
    const maxNameLength = 50;
    let error = '';
    if (!name.trim()) {
      error = 'Indicator Name is required.';
    } else if (name.trim().length < minNameLength || name.trim().length > maxNameLength) {
      error = `Indicator Name must be between ${minNameLength} and ${maxNameLength} characters.`;
    }
    setFormErrors(prevErrors => ({ ...prevErrors, indicatorName: error }));
  };

  /**
   * Validates the Description field in real-time.
   * Updates the formErrors state for 'description'.
   * @param {string} desc - The current value of the description input.
   */
  const validateDescription = (desc) => {
    const minDescriptionLength = 10;
    const maxDescriptionLength = 200;
    let error = '';
    if (!desc.trim()) {
      error = 'Description is required.';
    } else if (desc.trim().length < minDescriptionLength || desc.trim().length > maxDescriptionLength) {
      error = `Description must be between ${minDescriptionLength} and ${maxDescriptionLength} characters.`;
    }
    setFormErrors(prevErrors => ({ ...prevErrors, description: error }));
  };

  /**
   * Validates the Image File field in real-time.
   * Updates the formErrors state for 'imageFile'.
   * @param {File|null} file - The selected file object.
   */
  const validateImageFile = (file) => {
    let error = '';
    if (!editIndicator && !file) { // Image is required only for new indicators
        error = 'Image is required for new indicators.';
    } else if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            error = 'Only PNG/JPG images are allowed.';
        }
    }
    setFormErrors(prevErrors => ({ ...prevErrors, imageFile: error }));
  };


  /**
   * Validates all form fields before submission.
   * This is a comprehensive check for the submit button.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateFormOnSubmit = () => {
    const errors = {};
    const minNameLength = 3;
    const maxNameLength = 50;
    const minDescriptionLength = 10;
    const maxDescriptionLength = 200;

    // Validate Indicator Name
    if (!indicatorName.trim()) {
      errors.indicatorName = 'Indicator Name is required.';
    } else if (indicatorName.trim().length < minNameLength || indicatorName.trim().length > maxNameLength) {
      errors.indicatorName = `Indicator Name must be between ${minNameLength} and ${maxNameLength} characters.`;
    }

    // Validate Description
    if (!description.trim()) {
      errors.description = 'Description is required.';
    } else if (description.trim().length < minDescriptionLength || description.trim().length > maxDescriptionLength) {
      errors.description = `Description must be between ${minDescriptionLength} and ${maxDescriptionLength} characters.`;
    }

    // Validate Image File
    if (!editIndicator && !imageFile) {
        errors.imageFile = 'Image is required for new indicators.';
    } else if (imageFile) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        // Corrected: Use imageFile.type instead of file.type
        if (!allowedTypes.includes(imageFile.type)) {
            errors.imageFile = 'Only PNG/JPG images are allowed.';
        }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  /**
   * Handles the form submission for adding or updating an indicator.
   * Performs validation and logs the new/updated indicator data.
   * In a real application, this would send data to an API.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    if (!validateFormOnSubmit()) { // Use the comprehensive validation for submission
      console.log('Form validation failed. Please check the errors.');
      return; // Stop if validation fails.
    }

    // Construct the indicator object based on form data.
    const newIndicator = {
      id: editIndicator ? editIndicator.id : `IND${Date.now()}`, // Use existing ID or generate new.
      name: indicatorName,
      // If editing and no new image, keep old image. If new image, create URL.
      imagePreview: imageFile ? URL.createObjectURL(imageFile) : (editIndicator ? editIndicator.imagePreview : 'https://placehold.co/150x100/gray/white?text=New'),
      description: description,
      associatedPlan: planAssociation,
    };

    // Update the indicatorsData state
    if (editIndicator) {
      setIndicatorsData(indicatorsData.map(ind => ind.id === newIndicator.id ? newIndicator : ind));
      console.log('Indicator Updated:', newIndicator);
    } else {
      setIndicatorsData([...indicatorsData, newIndicator]);
      console.log('New Indicator Added:', newIndicator);
    }

    // Set the newly added/edited indicator as the active tab
    setActiveTab(newIndicator.id);

    handleCloseForm(); // Close the form after submission.
  };

  /**
   * Opens the delete confirmation modal.
   * @param {string} id - The unique ID of the indicator to delete.
   */
  const handleDeleteClick = (id) => {
    setIndicatorToDelete(id);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of an indicator.
   */
  const confirmDelete = () => {
    setIndicatorsData(indicatorsData.filter(indicator => indicator.id !== indicatorToDelete));
    console.log('Deleting Indicator with ID:', indicatorToDelete);
    setShowDeleteConfirm(false);
    setIndicatorToDelete(null);
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setIndicatorToDelete(null);
  };

  /**
   * Handles the click for the "Demo Preview" button.
   * Opens a new tab with a placeholder URL.
   * @param {string} indicatorName - The name of the indicator to preview.
   */
  const handleDemoPreview = (indicatorName) => {
    console.log(`Showing demo preview for: ${indicatorName}`);
    // In a real app, you would replace this with a dynamic URL or a modal demo.
    window.open(`https://example.com/demo/${encodeURIComponent(indicatorName.replace(/\s+/g, '-').toLowerCase())}`, '_blank');
  };

  /**
   * Toggles the sorting direction for a given column key.
   * If the same column is clicked consecutively, it alternates between ascending and descending.
   * @param {string} key - The data key of the column to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    // If currently sorting by the same key and in ascending order, switch to descending.
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the provided 'indicatorsData' array based on the current 'filterText'
   * and 'sortConfig' states.
   * @returns {Array<object>} The filtered and sorted array of indicator objects.
   */
  const sortedAndFilteredData = [...indicatorsData] // Create a shallow copy to prevent direct mutation
    .filter(indicator =>
      // Check if any of the indicator's property values (converted to string)
      // includes the filterText (case-insensitive search).
      Object.values(indicator).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Apply sorting logic only if a 'sortConfig.key' is set.
      if (sortConfig.key) {
        // Note: 'plan' in table header corresponds to 'associatedPlan' in data
        const dataKeyA = sortConfig.key === 'plan' ? a.associatedPlan : a[sortConfig.key];
        const dataKeyB = sortConfig.key === 'plan' ? b.associatedPlan : b[sortConfig.key];

        const valA = String(dataKeyA || '').toLowerCase();
        const valB = String(dataKeyB || '').toLowerCase();

        // Perform comparison based on the sorting direction.
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0; // If values are equal or no sorting is applied, maintain original relative order.
    });

  /**
   * Toggles the visibility of a specific column in the table.
   * @param {string} column - The key of the column whose visibility is to be toggled.
   */
  const handleColumnToggleVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column], // Flip the boolean value for the specified column.
    }));
    // Close the dropdown after a selection is made
    // setIsColumnToggleOpen(false); // Uncomment this if you want the dropdown to close immediately after a toggle
  };

  /**
   * Handles exporting table data to XLS or PDF.
   * @param {string} format - The desired export format ('xls' for CSV, 'pdf' for text file).
   */
  const handleExport = (format) => {
    let fileContent = '';
    let fileName = '';
    let mimeType = '';

    if (format === 'xls') {
      // Generate CSV content
      const headers = Object.keys(visibleColumns).filter(key => visibleColumns[key] && key !== 'actions').map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(',');
      const rows = sortedAndFilteredData.map(row =>
        Object.keys(visibleColumns)
          .filter(key => visibleColumns[key] && key !== 'actions')
          .map(key => {
            let value = row[key];
            if (key === 'plan') { // Special handling for 'plan' column which maps to 'associatedPlan'
              value = row.associatedPlan;
            }
            return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
          })
          .join(',')
      ).join('\n');
      fileContent = `${headers}\n${rows}`;
      fileName = 'indicators_data.csv'; // Use .csv for Excel compatibility
      mimeType = 'text/csv';
      console.log('Exporting data to XLS (CSV format).');
    } else if (format === 'pdf') {
      // Generate plain text content for PDF simulation
      fileContent = 'Indicator Report\n\n';
      sortedAndFilteredData.forEach(indicator => {
        fileContent += `Name: ${indicator.name}\n`;
        fileContent += `Plan: ${indicator.associatedPlan}\n`;
        fileContent += `Description: ${indicator.description}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'indicators_report.txt'; // Simulating PDF with a text file
      mimeType = 'text/plain';
      console.log('Exporting data to PDF (text format).');
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
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  /**
   * Returns a sort icon (▲ for ascending, ▼ for descending) next to the column header
   * if the table is currently sorted by that column.
   * @param {string} key - The data key of the column.
   * @returns {string|null} The sort icon string or null.
   */
  const getSortIcon = (key) => {
    // Note: 'plan' in table header corresponds to 'associatedPlan' in data
    const dataKey = key === 'plan' ? 'associatedPlan' : key;
    if (sortConfig.key !== dataKey) return null; // If not sorting by this key, return null.
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'; // Return appropriate icon with a leading space.
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        Indicators Management
      </h2>

      {/* Tabbed Display Section for Indicator Details */}
      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-4">Indicator Details</h3>
        <div className="flex border-b border-border-base mb-4 overflow-x-auto custom-scrollbar">
          {indicatorTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary' // Active tab styling
                  : 'text-text-light hover:text-text-base' // Inactive tab styling
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        {/* Display details of the active indicator tab */}
        {activeTab && indicatorTabs.find(tab => tab.id === activeTab)?.data && (
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={indicatorTabs.find(tab => tab.id === activeTab).data.imagePreview}
              alt={indicatorTabs.find(tab => tab.id === activeTab).data.name}
              className="w-full md:w-1/3 rounded-lg shadow-medium object-cover h-auto"
              // Fallback for image loading errors.
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
              <button
                className="action-button-custom"
                onClick={() => handleDemoPreview(indicatorTabs.find(tab => tab.id === activeTab).data.name)}
              >
                <Eye className="w-5 h-5 mr-2" /> {/* Added Eye icon */}
                Demo Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Table: Editable list of indicators */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <PlusCircle className="w-7 h-7 text-accent" /> Manage Indicators
        </h3>
        {/* Button to open the form for adding a new indicator, moved here */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Indicator
        </button>
      </div>

      <div className="kpi-card-custom overflow-x-auto">
        {/* Table controls: Filter Input, Column Toggle, Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Filter Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Filter indicators..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 pl-4 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none w-full"
              aria-label="Filter indicators"
            />
            {/* Filter icon removed */}
          </div>

          <div className="flex space-x-2 relative">
            {/* Column Toggle Button */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="indicator-list-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="indicator-list-column-toggle-dropdown"
                className="column-toggle-dropdown-custom" // Using custom class from index.css
              >
                {/* Dynamically render checkboxes for each column visibility */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggleVisibility(colKey)}
                      className="form-checkbox text-primary rounded"
                      // Disable toggle for 'actions' column if it should always be visible
                      disabled={colKey === 'actions'}
                    />
                    {/* Convert camelCase key to a more readable Title Case for display */}
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.charAt(0).toUpperCase() + str.slice(1))}</span>
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

        {/* Main Indicator Table */}
        <table className="table-custom divide-y divide-border-base"> {/* Changed from min-w-full to table-custom */}
          <thead className="bg-bg-base">
            <tr>
              {/* Conditionally render table headers based on column visibility and apply fixed widths */}
              {visibleColumns.name && <th style={{ width: '250px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer table-sticky-col" onClick={() => sortData('name')}>Name {getSortIcon('name')}</th>}
              {visibleColumns.plan && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.description && <th style={{ width: '400px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('description')}>Description {getSortIcon('description')}</th>}
              {visibleColumns.actions && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>} {/* Changed text-right to text-left */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each indicator row */}
            {sortedAndFilteredData.map((indicator, index) => (
              <tr key={indicator.id || index}>{/* Use id as key for better performance, fallback to index */}
                {visibleColumns.name && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base table-sticky-col">
                    <div className="flex items-center gap-2">
                      <img
                        src={indicator.imagePreview}
                        alt={indicator.name}
                        className="w-10 h-8 rounded object-cover"
                        // Fallback for image loading errors
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x32/gray/white?text=Img'; }}
                      />
                      {indicator.name}
                    </div>
                  </td>
                )}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{indicator.associatedPlan}</td>}
                {/* Truncate long descriptions to prevent layout issues */}
                {visibleColumns.description && <td className="px-6 py-4 text-sm text-text-base max-w-xs truncate">{indicator.description}</td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left"> {/* Removed flex, items-center, justify-end and changed text-right to text-left */}
                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenForm(indicator)} // Pass the indicator object to pre-fill form
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${indicator.name}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteClick(indicator.id)} // Use handleDeleteClick for confirmation modal
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${indicator.name}`}
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

      {/* Modal/Overlay for the Add/Edit Indicator Form */}
      {isFormOpen && (
        <div className="modal"> {/* Changed className to "modal" */}
          <div className="modal-content"> {/* Changed className to "modal-content" */}
            {/* Close button for the form modal */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Form title based on whether it's an edit or add operation */}
            <h3 className="dashboard-widget-title mb-6">
              {editIndicator ? 'Edit Indicator' : 'Add New Indicator'}
            </h3>
            {/* Indicator Add/Edit Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="indicatorName" className="block text-sm font-medium text-text-base mb-1">
                  Indicator Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="indicatorName"
                  value={indicatorName}
                  onChange={(e) => {
                    setIndicatorName(e.target.value);
                    validateIndicatorName(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.indicatorName ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.indicatorName && <p className="text-danger text-xs mt-1">{formErrors.indicatorName}</p>}
              </div>
              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-text-base mb-1">
                  Image Upload (PNG/JPG) {(!editIndicator || imageFile) && <span className="text-danger">*</span>}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept=".png, .jpg, .jpeg" // Restrict file types
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file); // Store the file object
                    validateImageFile(file); // Real-time validation
                  }}
                  className={`w-full text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer ${formErrors.imageFile ? 'border border-danger rounded-md' : ''}`}
                />
                {/* Display selected file name */}
                {imageFile && <p className="text-text-light text-xs mt-1">Selected: {imageFile.name}</p>}
                {/* Display error message for image file */}
                {formErrors.imageFile && <p className="text-danger text-xs mt-1">{formErrors.imageFile}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-base mb-1">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    validateDescription(e.target.value); // Real-time validation
                  }}
                  rows="4"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.description ? 'border-danger' : 'border-border-base'}`}
                  required
                ></textarea>
                {/* Display error message for description */}
                {formErrors.description && <p className="text-danger text-xs mt-1">{formErrors.description}</p>}
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
              <div className="form-actions-custom flex justify-end"> {/* Custom styling for form action buttons */}
                <button type="submit" className="action-button-custom">
                  {editIndicator ? 'Update Indicator' : 'Add Indicator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-sm w-full relative text-center">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete indicator ID: <span className="font-semibold text-danger">{indicatorToDelete}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="action-button-custom bg-danger hover:bg-danger-dark"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="action-button-custom cancel-button-custom"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Indicators;
