import React, { useEffect, useState } from 'react';
import { FaBuilding, FaEdit, FaEnvelope, FaEye, FaFilter, FaPhone, FaPlus, FaTrash, FaUser } from 'react-icons/fa';
import { SearchBar } from '../ui/form';
import './ContactList.css';

/**
 * Contact List Component
 *
 * A reusable component for displaying a list of contacts with filtering and sorting.
 */
const ContactList = ({
  contacts = [],
  companies = [],
  investmentFirms = [],
  partnerFirms = [],
  onViewContact,
  onEditContact,
  onDeleteContact,
  onCreateContact,
  isLoading = false
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterFirm, setFilterFirm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });

  // Filtered and sorted contacts
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...contacts];

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(contact =>
        contact.firstName.toLowerCase().includes(lowerCaseSearch) ||
        contact.lastName.toLowerCase().includes(lowerCaseSearch) ||
        contact.email.toLowerCase().includes(lowerCaseSearch) ||
        (contact.title && contact.title.toLowerCase().includes(lowerCaseSearch))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      switch (filterType) {
        case 'company':
          result = result.filter(contact =>
            contact.associations?.companies && contact.associations.companies.length > 0
          );
          break;
        case 'investor':
          result = result.filter(contact =>
            contact.associations?.investmentFirms && contact.associations.investmentFirms.length > 0
          );
          break;
        case 'partner':
          result = result.filter(contact =>
            contact.associations?.partnerFirms && contact.associations.partnerFirms.length > 0
          );
          break;
        default:
          break;
      }
    }

    // Apply company filter
    if (filterCompany) {
      result = result.filter(contact =>
        contact.associations?.companies &&
        contact.associations.companies.some(company => company.companyId === filterCompany)
      );
    }

    // Apply firm filter
    if (filterFirm) {
      result = result.filter(contact =>
        (contact.associations?.investmentFirms &&
         contact.associations.investmentFirms.some(firm => firm.firmId === filterFirm)) ||
        (contact.associations?.partnerFirms &&
         contact.associations.partnerFirms.some(firm => firm.firmId === filterFirm))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredContacts(result);
  }, [contacts, searchTerm, filterType, filterCompany, filterFirm, sortConfig]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Get primary company for a contact
  const getPrimaryCompany = (contact) => {
    if (!contact.associations?.companies || contact.associations.companies.length === 0) {
      return null;
    }

    const primaryCompany = contact.associations.companies.find(company => company.isPrimary);
    if (primaryCompany) {
      const company = companies.find(c => c.id === primaryCompany.companyId);
      return company ? company.name : 'Unknown Company';
    }

    // If no primary company, return the first one
    const firstCompany = companies.find(c => c.id === contact.associations.companies[0].companyId);
    return firstCompany ? firstCompany.name : 'Unknown Company';
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCompany('');
    setFilterFirm('');
  };

  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <h2>Contacts</h2>
        <button
          className="create-button"
          onClick={onCreateContact}
        >
          <FaPlus /> Add Contact
        </button>
      </div>

      <div className="contact-list-filters">
        <div className="search-container">
          <SearchBar
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="contact-search"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label>
              <FaFilter /> Type:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Contacts</option>
              <option value="company">Company Contacts</option>
              <option value="investor">Investor Contacts</option>
              <option value="partner">Partner Contacts</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaBuilding /> Company:
            </label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <FaBuilding /> Firm:
            </label>
            <select
              value={filterFirm}
              onChange={(e) => setFilterFirm(e.target.value)}
            >
              <option value="">All Firms</option>
              <optgroup label="Investment Firms">
                {investmentFirms.map(firm => (
                  <option key={firm.id} value={firm.id}>
                    {firm.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Partner Firms">
                {partnerFirms.map(firm => (
                  <option key={firm.id} value={firm.id}>
                    {firm.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            className="reset-button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="empty-state">
          <FaUser className="empty-icon" />
          <p>No contacts found</p>
          {(searchTerm || filterType !== 'all' || filterCompany || filterFirm) && (
            <button
              className="reset-button"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="contact-table-container">
          <table className="contact-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('lastName')}>
                  Name {getSortIcon('lastName')}
                </th>
                <th onClick={() => requestSort('title')}>
                  Title {getSortIcon('title')}
                </th>
                <th>Company</th>
                <th onClick={() => requestSort('email')}>
                  Email {getSortIcon('email')}
                </th>
                <th onClick={() => requestSort('phone')}>
                  Phone {getSortIcon('phone')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id}>
                  <td>
                    <div className="contact-name">
                      <span className="contact-avatar">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </span>
                      <span>
                        {contact.firstName} {contact.lastName}
                      </span>
                    </div>
                  </td>
                  <td>{contact.title || '-'}</td>
                  <td>{getPrimaryCompany(contact) || '-'}</td>
                  <td>
                    <a href={`mailto:${contact.email}`} className="contact-email">
                      <FaEnvelope className="email-icon" />
                      {contact.email}
                    </a>
                  </td>
                  <td>
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="contact-phone">
                        <FaPhone className="phone-icon" />
                        {contact.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="contact-actions">
                      <button
                        className="action-button view"
                        onClick={() => onViewContact(contact.id)}
                        title="View Contact"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-button edit"
                        onClick={() => onEditContact(contact.id)}
                        title="Edit Contact"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => onDeleteContact(contact.id)}
                        title="Delete Contact"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="contact-list-footer">
        <p>Showing {filteredContacts.length} of {contacts.length} contacts</p>
      </div>
    </div>
  );
};

export default ContactList;
