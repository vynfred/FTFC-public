import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import Table from '../ui/data/Table';
import Modal from '../ui/feedback/Modal';
import { useToast } from '../../context/ToastContext';
import { FormButton, FormInput, FormSelect, FormTextarea } from '../ui/form';
import styles from './Examples.module.css';

const ComponentsExamples = () => {
  const { showInfo, showSuccess, showWarning, showError } = useToast();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('md');
  const [modalTitle, setModalTitle] = useState('Example Modal');
  
  // Table data
  const [tableData, setTableData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-03-15T10:30:00' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '2024-03-14T14:45:00' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2024-03-10T09:15:00' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Active', lastLogin: '2024-03-13T16:20:00' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-03-12T11:10:00' },
    { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'User', status: 'Pending', lastLogin: '2024-03-11T13:30:00' },
    { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'Editor', status: 'Active', lastLogin: '2024-03-09T15:45:00' },
    { id: 8, name: 'Fiona Wilson', email: 'fiona@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-03-08T10:20:00' },
    { id: 9, name: 'George Taylor', email: 'george@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-03-07T14:15:00' },
    { id: 10, name: 'Hannah Moore', email: 'hannah@example.com', role: 'User', status: 'Active', lastLogin: '2024-03-06T09:30:00' },
    { id: 11, name: 'Ian Clark', email: 'ian@example.com', role: 'Editor', status: 'Pending', lastLogin: '2024-03-05T16:45:00' },
    { id: 12, name: 'Julia Adams', email: 'julia@example.com', role: 'User', status: 'Active', lastLogin: '2024-03-04T11:10:00' }
  ]);
  
  // Table columns
  const tableColumns = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'role', label: 'Role', sortable: true, filterType: 'select', filterOptions: [
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
      { value: 'Editor', label: 'Editor' }
    ]},
    { id: 'status', label: 'Status', sortable: true, filterType: 'select', filterOptions: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Pending', label: 'Pending' }
    ], render: (value) => {
      let color;
      switch (value) {
        case 'Active':
          color = 'var(--color-success)';
          break;
        case 'Inactive':
          color = 'var(--color-error)';
          break;
        case 'Pending':
          color = 'var(--color-warning)';
          break;
        default:
          color = 'var(--color-text-secondary)';
      }
      return (
        <span style={{ color, fontWeight: 'var(--font-weight-medium)' }}>
          {value}
        </span>
      );
    }},
    { id: 'lastLogin', label: 'Last Login', sortable: true, render: (value) => {
      const date = new Date(value);
      return date.toLocaleString();
    }},
    { id: 'actions', label: 'Actions', sortable: false, render: (_, row) => (
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewUser(row);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-info)',
            cursor: 'pointer'
          }}
        >
          <FaEye />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditUser(row);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            cursor: 'pointer'
          }}
        >
          <FaEdit />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(row);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-error)',
            cursor: 'pointer'
          }}
        >
          <FaTrash />
        </button>
      </div>
    )}
  ];
  
  // Table actions
  const tableActions = (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
      <FormButton
        variant="primary"
        icon={<FaPlus />}
        onClick={() => {
          setModalTitle('Add User');
          setIsModalOpen(true);
        }}
      >
        Add User
      </FormButton>
    </div>
  );
  
  // Handle row click
  const handleRowClick = (row) => {
    showInfo(`Clicked on ${row.name}`);
  };
  
  // Handle view user
  const handleViewUser = (user) => {
    setModalTitle(`View User: ${user.name}`);
    setModalSize('md');
    setIsModalOpen(true);
    showInfo(`Viewing ${user.name}`);
  };
  
  // Handle edit user
  const handleEditUser = (user) => {
    setModalTitle(`Edit User: ${user.name}`);
    setModalSize('md');
    setIsModalOpen(true);
    showWarning(`Editing ${user.name}`);
  };
  
  // Handle delete user
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setTableData(tableData.filter(item => item.id !== user.id));
      showSuccess(`Deleted ${user.name}`);
    } else {
      showError('Delete cancelled');
    }
  };
  
  // Modal footer
  const modalFooter = (
    <>
      <Modal.Button
        variant="secondary"
        onClick={() => setIsModalOpen(false)}
      >
        Cancel
      </Modal.Button>
      <Modal.Button
        variant="primary"
        onClick={() => {
          setIsModalOpen(false);
          showSuccess('Changes saved successfully!');
        }}
      >
        Save
      </Modal.Button>
    </>
  );
  
  return (
    <Container className={styles.examplesContainer}>
      <h1 className={styles.examplesTitle}>Component Examples</h1>
      
      <div className={styles.examplesSection}>
        <h2 className={styles.examplesSectionTitle}>Table Component</h2>
        <p className={styles.examplesDescription}>
          The Table component provides a powerful way to display, sort, filter, and paginate tabular data.
        </p>
        
        <Table
          columns={tableColumns}
          data={tableData}
          title="Users"
          actions={tableActions}
          onRowClick={handleRowClick}
          pagination={true}
          filterable={true}
          emptyMessage="No users found"
        />
      </div>
      
      <div className={styles.examplesSection}>
        <h2 className={styles.examplesSectionTitle}>Modal Component</h2>
        <p className={styles.examplesDescription}>
          The Modal component provides a way to display content in a dialog that overlays the page.
        </p>
        
        <Grid columns={5} mdColumns={3} smColumns={1} gap="md">
          <FormButton
            onClick={() => {
              setModalTitle('Small Modal');
              setModalSize('sm');
              setIsModalOpen(true);
            }}
          >
            Small Modal
          </FormButton>
          
          <FormButton
            onClick={() => {
              setModalTitle('Medium Modal');
              setModalSize('md');
              setIsModalOpen(true);
            }}
          >
            Medium Modal
          </FormButton>
          
          <FormButton
            onClick={() => {
              setModalTitle('Large Modal');
              setModalSize('lg');
              setIsModalOpen(true);
            }}
          >
            Large Modal
          </FormButton>
          
          <FormButton
            onClick={() => {
              setModalTitle('Extra Large Modal');
              setModalSize('xl');
              setIsModalOpen(true);
            }}
          >
            XL Modal
          </FormButton>
          
          <FormButton
            onClick={() => {
              setModalTitle('Full Screen Modal');
              setModalSize('full');
              setIsModalOpen(true);
            }}
          >
            Full Screen
          </FormButton>
        </Grid>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle}
          size={modalSize}
          footer={modalFooter}
        >
          <div>
            <p>This is an example modal with a form.</p>
            
            <Grid columns={2} mdColumns={2} smColumns={1} gap="md">
              <FormInput
                id="name"
                name="name"
                label="Name"
                placeholder="Enter name"
                required
              />
              
              <FormInput
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Enter email"
                required
              />
              
              <FormSelect
                id="role"
                name="role"
                label="Role"
                options={[
                  { value: '', label: 'Select role' },
                  { value: 'Admin', label: 'Admin' },
                  { value: 'User', label: 'User' },
                  { value: 'Editor', label: 'Editor' }
                ]}
                required
              />
              
              <FormSelect
                id="status"
                name="status"
                label="Status"
                options={[
                  { value: '', label: 'Select status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Pending', label: 'Pending' }
                ]}
                required
              />
            </Grid>
            
            <FormTextarea
              id="notes"
              name="notes"
              label="Notes"
              placeholder="Enter notes"
              rows={4}
            />
          </div>
        </Modal>
      </div>
      
      <div className={styles.examplesSection}>
        <h2 className={styles.examplesSectionTitle}>Toast Component</h2>
        <p className={styles.examplesDescription}>
          The Toast component provides a way to display notifications to the user.
        </p>
        
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md">
          <FormButton
            onClick={() => showInfo('This is an info toast')}
          >
            Show Info
          </FormButton>
          
          <FormButton
            onClick={() => showSuccess('This is a success toast')}
          >
            Show Success
          </FormButton>
          
          <FormButton
            onClick={() => showWarning('This is a warning toast')}
          >
            Show Warning
          </FormButton>
          
          <FormButton
            onClick={() => showError('This is an error toast')}
          >
            Show Error
          </FormButton>
          
          <FormButton
            onClick={() => showInfo('This is a toast with a title', { title: 'Info Title' })}
          >
            With Title
          </FormButton>
          
          <FormButton
            onClick={() => showInfo('This toast will stay until dismissed', { duration: 0 })}
          >
            No Auto-Close
          </FormButton>
          
          <FormButton
            onClick={() => showInfo('This toast will close quickly', { duration: 2000 })}
          >
            Quick Close
          </FormButton>
          
          <FormButton
            onClick={() => showInfo('This toast has no progress bar', { showProgress: false })}
          >
            No Progress
          </FormButton>
        </Grid>
      </div>
    </Container>
  );
};

export default ComponentsExamples;
