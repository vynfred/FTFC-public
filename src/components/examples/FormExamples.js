import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { FormButton, FormCheckbox, FormInput, FormSelect, FormTextarea } from '../ui/form';
import Container from '../ui/layout/Container';
import Grid from '../ui/layout/Grid';
import styles from './Examples.module.css';

const FormExamples = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    bio: '',
    agreeTerms: false
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Validate role
    if (!formData.role) {
      errors.role = 'Please select a role';
    }

    // Validate terms
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();

    // If there are errors, set them and prevent submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Form is valid, submit it
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  // Role options for select
  const roleOptions = [
    { value: '', label: 'Select a role' },
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  return (
    <Container className={styles.examplesContainer}>
      <h1 className={styles.examplesTitle}>Form Components</h1>

      <div className={styles.examplesSection}>
        <h2 className={styles.examplesSectionTitle}>Form Example</h2>
        <p className={styles.examplesDescription}>
          This is an example of a form using our form components. The form includes validation and responsive layout.
        </p>

        <form onSubmit={handleSubmit} className={styles.exampleForm}>
          <Grid columns={2} mdColumns={2} smColumns={1} gap="md">
            <div>
              <FormInput
                id="name"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                leftIcon={<FaUser />}
                error={formErrors.name}
              />
            </div>

            <div>
              <FormInput
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                leftIcon={<FaEnvelope />}
                error={formErrors.email}
              />
            </div>

            <div>
              <FormInput
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                leftIcon={<FaLock />}
                error={formErrors.password}
                helpText="Password must be at least 8 characters"
              />
            </div>

            <div>
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                leftIcon={<FaLock />}
                error={formErrors.confirmPassword}
              />
            </div>

            <div>
              <FormSelect
                id="role"
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                required
                error={formErrors.role}
              />
            </div>

            <div>
              <FormInput
                id="search"
                name="search"
                label="Search (Disabled)"
                value=""
                placeholder="Search..."
                disabled
                leftIcon={<FaUser />}
                helpText="This input is disabled for demonstration"
              />
            </div>
          </Grid>

          <FormTextarea
            id="bio"
            name="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows={4}
            helpText="Optional: Share some information about yourself"
          />

          <FormCheckbox
            id="agreeTerms"
            name="agreeTerms"
            label="I agree to the terms and conditions"
            checked={formData.agreeTerms}
            onChange={handleChange}
            error={formErrors.agreeTerms}
          />

          <div className={styles.formActions}>
            <FormButton
              type="submit"
              variant="primary"
              icon={<FaSave />}
            >
              Submit
            </FormButton>

            <FormButton
              type="button"
              variant="secondary"
              icon={<FaTimes />}
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  role: '',
                  bio: '',
                  agreeTerms: false
                });
                setFormErrors({});
              }}
            >
              Reset
            </FormButton>
          </div>
        </form>
      </div>

      <div className={styles.examplesSection}>
        <h2 className={styles.examplesSectionTitle}>Form Components</h2>

        <h3 className={styles.examplesSubtitle}>Text Inputs</h3>
        <Grid columns={3} mdColumns={2} smColumns={1} gap="md">
          <FormInput
            id="defaultInput"
            label="Default Input"
            placeholder="Default input"
          />

          <FormInput
            id="requiredInput"
            label="Required Input"
            placeholder="Required input"
            required
          />

          <FormInput
            id="disabledInput"
            label="Disabled Input"
            placeholder="Disabled input"
            disabled
          />

          <FormInput
            id="errorInput"
            label="Input with Error"
            placeholder="Input with error"
            error="This field has an error"
          />

          <FormInput
            id="helpTextInput"
            label="Input with Help Text"
            placeholder="Input with help text"
            helpText="This is some helpful text"
          />

          <FormInput
            id="iconInput"
            label="Input with Icon"
            placeholder="Input with icon"
            leftIcon={<FaUser />}
          />
        </Grid>

        <h3 className={styles.examplesSubtitle}>Select Inputs</h3>
        <Grid columns={2} mdColumns={2} smColumns={1} gap="md">
          <FormSelect
            id="defaultSelect"
            label="Default Select"
            options={roleOptions}
          />

          <FormSelect
            id="requiredSelect"
            label="Required Select"
            options={roleOptions}
            required
          />

          <FormSelect
            id="disabledSelect"
            label="Disabled Select"
            options={roleOptions}
            disabled
          />

          <FormSelect
            id="errorSelect"
            label="Select with Error"
            options={roleOptions}
            error="This field has an error"
          />
        </Grid>

        <h3 className={styles.examplesSubtitle}>Textarea</h3>
        <Grid columns={2} mdColumns={1} smColumns={1} gap="md">
          <FormTextarea
            id="defaultTextarea"
            label="Default Textarea"
            placeholder="Default textarea"
          />

          <FormTextarea
            id="errorTextarea"
            label="Textarea with Error"
            placeholder="Textarea with error"
            error="This field has an error"
          />
        </Grid>

        <h3 className={styles.examplesSubtitle}>Checkboxes</h3>
        <Grid columns={3} mdColumns={2} smColumns={1} gap="md">
          <FormCheckbox
            id="defaultCheckbox"
            label="Default Checkbox"
          />

          <FormCheckbox
            id="checkedCheckbox"
            label="Checked Checkbox"
            checked
          />

          <FormCheckbox
            id="disabledCheckbox"
            label="Disabled Checkbox"
            disabled
          />
        </Grid>

        <h3 className={styles.examplesSubtitle}>Buttons</h3>
        <Grid columns={4} mdColumns={2} smColumns={1} gap="md">
          <FormButton variant="primary">Primary</FormButton>
          <FormButton variant="secondary">Secondary</FormButton>
          <FormButton variant="danger">Danger</FormButton>
          <FormButton variant="primary" disabled>Disabled</FormButton>

          <FormButton variant="primary" icon={<FaSave />}>With Icon</FormButton>
          <FormButton variant="secondary" icon={<FaUser />}>Search</FormButton>
          <FormButton variant="danger" icon={<FaTimes />}>Cancel</FormButton>
          <FormButton variant="primary" icon={<FaUser />} disabled>Disabled</FormButton>
        </Grid>
      </div>
    </Container>
  );
};

export default FormExamples;
