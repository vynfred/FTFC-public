import React, { useState } from 'react';
import { FaEdit, FaEye, FaSave, FaTimes } from 'react-icons/fa';
import styles from './PublicPagesManager.module.css';

const PublicPagesManager = () => {
  const [activePageTab, setActivePageTab] = useState('home');
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample data for public pages content
  const [pagesContent, setPagesContent] = useState({
    home: {
      title: 'Welcome to FTFC',
      subtitle: 'Your Partner in Financial Growth',
      heroText: 'We help businesses secure the funding they need to grow and succeed.',
      ctaText: 'Schedule a Consultation',
      sections: [
        {
          title: 'Our Services',
          content: 'FTFC offers a range of financial services designed to help businesses at every stage of growth.'
        },
        {
          title: 'Why Choose Us',
          content: 'With years of experience and a dedicated team, we provide personalized solutions for your business needs.'
        }
      ]
    },
    about: {
      title: 'About FTFC',
      subtitle: 'Our Story',
      content: 'Founded in 2010, FTFC has been helping businesses secure funding and achieve their financial goals for over a decade.',
      teamSection: {
        title: 'Our Team',
        description: 'Meet the experienced professionals behind FTFC.'
      },
      missionStatement: 'Our mission is to empower businesses with the financial resources they need to innovate and grow.'
    },
    services: {
      title: 'Our Services',
      subtitle: 'How We Can Help',
      services: [
        {
          title: 'Startup Funding',
          description: 'We help early-stage companies secure the capital they need to launch and grow.'
        },
        {
          title: 'Growth Capital',
          description: 'For established businesses looking to expand, we provide access to growth capital solutions.'
        },
        {
          title: 'Financial Advisory',
          description: 'Our team offers expert financial guidance to help you make informed decisions.'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in Touch',
      formFields: ['Name', 'Email', 'Phone', 'Message'],
      contactInfo: {
        email: 'info@ftfc.com',
        phone: '+1 (555) 123-4567'
      }
    },
    consultation: {
      title: 'Schedule a Consultation',
      subtitle: 'Take the First Step',
      description: 'Fill out the form below to schedule a free consultation with one of our financial advisors.',
      formFields: ['Name', 'Email', 'Phone', 'Company', 'Preferred Date', 'Message']
    },
    team: {
      title: 'Our Team',
      subtitle: 'Meet the Experts',
      description: 'Our team of experienced professionals is dedicated to helping your business succeed.',
      teamMembers: [
        {
          name: 'John Doe',
          title: 'CEO',
          bio: 'John has over 20 years of experience in financial services.'
        },
        {
          name: 'Jane Smith',
          title: 'CTO',
          bio: 'Jane leads our technology initiatives with expertise in fintech solutions.'
        }
      ]
    }
  });
  
  // Current page content being edited
  const [currentPageContent, setCurrentPageContent] = useState(pagesContent[activePageTab]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    if (isEditing) {
      if (window.confirm('You have unsaved changes. Are you sure you want to switch pages?')) {
        setIsEditing(false);
        setActivePageTab(tab);
        setCurrentPageContent(pagesContent[tab]);
      }
    } else {
      setActivePageTab(tab);
      setCurrentPageContent(pagesContent[tab]);
    }
  };
  
  // Handle edit mode toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle content change
  const handleContentChange = (e, field, index = null, subfield = null) => {
    const { value } = e.target;
    
    if (index !== null && subfield) {
      // Handle nested array objects (like services or sections)
      setCurrentPageContent(prev => {
        const newArray = [...prev[field]];
        newArray[index] = { ...newArray[index], [subfield]: value };
        return { ...prev, [field]: newArray };
      });
    } else if (subfield && typeof currentPageContent[field] === 'object') {
      // Handle nested objects
      setCurrentPageContent(prev => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: value }
      }));
    } else {
      // Handle simple fields
      setCurrentPageContent(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    setPagesContent(prev => ({
      ...prev,
      [activePageTab]: currentPageContent
    }));
    setIsEditing(false);
    // In a real app, this would save to an API
    alert('Page content saved successfully!');
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setCurrentPageContent(pagesContent[activePageTab]);
    setIsEditing(false);
  };
  
  // Render form fields based on page type and content
  const renderFormFields = () => {
    switch (activePageTab) {
      case 'home':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Hero Text</label>
              <textarea
                value={currentPageContent.heroText}
                onChange={(e) => handleContentChange(e, 'heroText')}
                disabled={!isEditing}
                rows={3}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label>CTA Text</label>
              <input
                type="text"
                value={currentPageContent.ctaText}
                onChange={(e) => handleContentChange(e, 'ctaText')}
                disabled={!isEditing}
              />
            </div>
            
            <h3>Sections</h3>
            {currentPageContent.sections.map((section, index) => (
              <div key={index} className={styles.sectionItem}>
                <div className={styles.formGroup}>
                  <label>Section {index + 1} Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleContentChange(e, 'sections', index, 'title')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Section {index + 1} Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => handleContentChange(e, 'sections', index, 'content')}
                    disabled={!isEditing}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'about':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Main Content</label>
              <textarea
                value={currentPageContent.content}
                onChange={(e) => handleContentChange(e, 'content')}
                disabled={!isEditing}
                rows={5}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label>Team Section Title</label>
              <input
                type="text"
                value={currentPageContent.teamSection.title}
                onChange={(e) => handleContentChange(e, 'teamSection', null, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Team Section Description</label>
              <textarea
                value={currentPageContent.teamSection.description}
                onChange={(e) => handleContentChange(e, 'teamSection', null, 'description')}
                disabled={!isEditing}
                rows={3}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label>Mission Statement</label>
              <textarea
                value={currentPageContent.missionStatement}
                onChange={(e) => handleContentChange(e, 'missionStatement')}
                disabled={!isEditing}
                rows={3}
              ></textarea>
            </div>
          </div>
        );
        
      case 'services':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <h3>Services</h3>
            {currentPageContent.services.map((service, index) => (
              <div key={index} className={styles.sectionItem}>
                <div className={styles.formGroup}>
                  <label>Service {index + 1} Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleContentChange(e, 'services', index, 'title')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Service {index + 1} Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleContentChange(e, 'services', index, 'description')}
                    disabled={!isEditing}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'contact':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Contact Email</label>
              <input
                type="email"
                value={currentPageContent.contactInfo.email}
                onChange={(e) => handleContentChange(e, 'contactInfo', null, 'email')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Contact Phone</label>
              <input
                type="text"
                value={currentPageContent.contactInfo.phone}
                onChange={(e) => handleContentChange(e, 'contactInfo', null, 'phone')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Form Fields (comma-separated)</label>
              <input
                type="text"
                value={currentPageContent.formFields.join(', ')}
                onChange={(e) => handleContentChange(e, 'formFields')}
                disabled={!isEditing}
              />
            </div>
          </div>
        );
        
      case 'consultation':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={currentPageContent.description}
                onChange={(e) => handleContentChange(e, 'description')}
                disabled={!isEditing}
                rows={3}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label>Form Fields (comma-separated)</label>
              <input
                type="text"
                value={currentPageContent.formFields.join(', ')}
                onChange={(e) => handleContentChange(e, 'formFields')}
                disabled={!isEditing}
              />
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Page Title</label>
              <input
                type="text"
                value={currentPageContent.title}
                onChange={(e) => handleContentChange(e, 'title')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                type="text"
                value={currentPageContent.subtitle}
                onChange={(e) => handleContentChange(e, 'subtitle')}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={currentPageContent.description}
                onChange={(e) => handleContentChange(e, 'description')}
                disabled={!isEditing}
                rows={3}
              ></textarea>
            </div>
            
            <h3>Team Members</h3>
            {currentPageContent.teamMembers.map((member, index) => (
              <div key={index} className={styles.sectionItem}>
                <div className={styles.formGroup}>
                  <label>Member {index + 1} Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleContentChange(e, 'teamMembers', index, 'name')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Member {index + 1} Title</label>
                  <input
                    type="text"
                    value={member.title}
                    onChange={(e) => handleContentChange(e, 'teamMembers', index, 'title')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Member {index + 1} Bio</label>
                  <textarea
                    value={member.bio}
                    onChange={(e) => handleContentChange(e, 'teamMembers', index, 'bio')}
                    disabled={!isEditing}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.publicPagesManager}>
      <div className={styles.header}>
        <h2>Public Pages Manager</h2>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button className={styles.cancelButton} onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSaveChanges}>
                <FaSave /> Save Changes
              </button>
            </>
          ) : (
            <button className={styles.editButton} onClick={handleEditToggle}>
              <FaEdit /> Edit Content
            </button>
          )}
          <button className={styles.previewButton}>
            <FaEye /> Preview
          </button>
        </div>
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.pageTabs}>
          <button
            className={`${styles.pageTab} ${activePageTab === 'home' ? styles.active : ''}`}
            onClick={() => handleTabChange('home')}
          >
            Home
          </button>
          <button
            className={`${styles.pageTab} ${activePageTab === 'about' ? styles.active : ''}`}
            onClick={() => handleTabChange('about')}
          >
            About
          </button>
          <button
            className={`${styles.pageTab} ${activePageTab === 'services' ? styles.active : ''}`}
            onClick={() => handleTabChange('services')}
          >
            Services
          </button>
          <button
            className={`${styles.pageTab} ${activePageTab === 'contact' ? styles.active : ''}`}
            onClick={() => handleTabChange('contact')}
          >
            Contact
          </button>
          <button
            className={`${styles.pageTab} ${activePageTab === 'consultation' ? styles.active : ''}`}
            onClick={() => handleTabChange('consultation')}
          >
            Consultation
          </button>
          <button
            className={`${styles.pageTab} ${activePageTab === 'team' ? styles.active : ''}`}
            onClick={() => handleTabChange('team')}
          >
            Team
          </button>
        </div>
        
        <div className={styles.pageContent}>
          <div className={styles.pageForm}>
            {renderFormFields()}
          </div>
          
          <div className={styles.pageLivePreview}>
            <h3>Live Preview</h3>
            <div className={styles.previewContainer}>
              <h1>{currentPageContent.title}</h1>
              <h2>{currentPageContent.subtitle}</h2>
              
              {activePageTab === 'home' && (
                <>
                  <p className={styles.heroText}>{currentPageContent.heroText}</p>
                  <button className={styles.ctaButton}>{currentPageContent.ctaText}</button>
                  
                  {currentPageContent.sections.map((section, index) => (
                    <div key={index} className={styles.previewSection}>
                      <h3>{section.title}</h3>
                      <p>{section.content}</p>
                    </div>
                  ))}
                </>
              )}
              
              {activePageTab === 'about' && (
                <>
                  <p>{currentPageContent.content}</p>
                  <div className={styles.previewSection}>
                    <h3>{currentPageContent.teamSection.title}</h3>
                    <p>{currentPageContent.teamSection.description}</p>
                  </div>
                  <blockquote>{currentPageContent.missionStatement}</blockquote>
                </>
              )}
              
              {activePageTab === 'services' && (
                <div className={styles.servicesPreview}>
                  {currentPageContent.services.map((service, index) => (
                    <div key={index} className={styles.serviceCard}>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {activePageTab === 'contact' && (
                <>
                  <div className={styles.contactInfo}>
                    <p>Email: {currentPageContent.contactInfo.email}</p>
                    <p>Phone: {currentPageContent.contactInfo.phone}</p>
                  </div>
                  <div className={styles.formPreview}>
                    <h3>Contact Form</h3>
                    <ul>
                      {currentPageContent.formFields.map((field, index) => (
                        <li key={index}>{field} field</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {activePageTab === 'consultation' && (
                <>
                  <p>{currentPageContent.description}</p>
                  <div className={styles.formPreview}>
                    <h3>Consultation Form</h3>
                    <ul>
                      {currentPageContent.formFields.map((field, index) => (
                        <li key={index}>{field} field</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {activePageTab === 'team' && (
                <>
                  <p>{currentPageContent.description}</p>
                  <div className={styles.teamPreview}>
                    {currentPageContent.teamMembers.map((member, index) => (
                      <div key={index} className={styles.teamMemberCard}>
                        <h3>{member.name}</h3>
                        <p className={styles.memberTitle}>{member.title}</p>
                        <p>{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPagesManager;
