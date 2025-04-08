import React, { useState, useEffect } from 'react';
import { FaGlobe, FaHome, FaInfoCircle, FaHandshake, FaEnvelope, FaUsers, FaFileAlt, FaShieldAlt, FaEye, FaSave } from 'react-icons/fa';
import HomeContent from './HomeContent';
import AboutContent from './AboutContent';
import ServicesContent from './ServicesContent';
import ContactContent from './ContactContent';
import ConsultationContent from './ConsultationContent';
import TeamContent from './TeamContent';
import TermsContent from './TermsContent';
import PrivacyContent from './PrivacyContent';

/**
 * PublicPagesManager component for managing public page content
 */
const PublicPagesManager = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [pageData, setPageData] = useState({
    home: {},
    about: {},
    services: {},
    contact: {},
    consultation: {},
    team: {},
    terms: {},
    privacy: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Load page data
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        const mockData = {
          home: {
            heroTitle: 'Financial Solutions for Growing Businesses',
            heroSubtitle: 'We help startups and small businesses secure the funding they need to grow and succeed.',
            ctaText: 'Get Started',
            ctaLink: '/consultation',
            serviceHighlights: [
              {
                title: 'Startup Funding',
                description: 'Access capital to launch your business idea.',
                icon: null
              },
              {
                title: 'Growth Capital',
                description: 'Secure funding to scale your operations.',
                icon: null
              },
              {
                title: 'Financial Consulting',
                description: 'Expert advice to optimize your finances.',
                icon: null
              }
            ],
            whyUsTitle: 'Why Choose FTFC',
            whyUsDescription: 'We bring years of experience and a personalized approach to every client relationship.',
            benefits: [
              { text: 'Tailored funding solutions' },
              { text: 'Expert financial guidance' },
              { text: 'Extensive investor network' },
              { text: 'Ongoing support and mentorship' }
            ]
          },
          about: {
            pageTitle: 'About Us',
            pageSubtitle: 'Our mission is to empower businesses with the financial resources they need to thrive.',
            companyStory: 'FTFC was founded in 2010 with a simple mission: to bridge the gap between promising businesses and the capital they need to succeed. Over the years, we have helped hundreds of companies secure funding and achieve their growth objectives.',
            missionStatement: 'To provide accessible, transparent, and effective financial solutions that empower businesses to reach their full potential.',
            visionStatement: 'A world where every viable business has access to the capital and resources it needs to succeed.',
            valuePropositions: [
              { title: 'Integrity', description: 'We operate with honesty and transparency in all our dealings.' },
              { title: 'Excellence', description: 'We strive for the highest standards in everything we do.' },
              { title: 'Innovation', description: 'We continuously seek new and better ways to serve our clients.' },
              { title: 'Partnership', description: 'We build lasting relationships based on mutual success.' }
            ]
          },
          services: {
            pageTitle: 'Our Services',
            pageSubtitle: 'Comprehensive financial solutions tailored to your business needs.',
            serviceCategories: [
              {
                title: 'Funding Solutions',
                services: [
                  { 
                    title: 'Startup Funding', 
                    description: 'Seed capital and early-stage funding to get your business off the ground.',
                    icon: null
                  },
                  { 
                    title: 'Growth Capital', 
                    description: 'Funding to scale your operations and expand your market reach.',
                    icon: null
                  },
                  { 
                    title: 'Acquisition Financing', 
                    description: 'Capital to support strategic acquisitions and business expansion.',
                    icon: null
                  }
                ]
              },
              {
                title: 'Financial Advisory',
                services: [
                  { 
                    title: 'Financial Planning', 
                    description: 'Strategic planning to optimize your financial resources and operations.',
                    icon: null
                  },
                  { 
                    title: 'Investment Strategy', 
                    description: 'Expert guidance on investment opportunities and portfolio management.',
                    icon: null
                  },
                  { 
                    title: 'Risk Management', 
                    description: 'Strategies to identify, assess, and mitigate financial risks.',
                    icon: null
                  }
                ]
              }
            ]
          },
          contact: {
            pageTitle: 'Contact Us',
            pageSubtitle: 'We\'re here to answer your questions and help you get started.',
            officeLocations: [
              {
                city: 'San Francisco',
                address: '123 Finance Street, San Francisco, CA 94105',
                phone: '+1 (555) 123-4567',
                email: 'sf@ftfc.com'
              },
              {
                city: 'New York',
                address: '456 Wall Street, New York, NY 10005',
                phone: '+1 (555) 987-6543',
                email: 'ny@ftfc.com'
              }
            ],
            contactFormTitle: 'Send Us a Message',
            contactFormSubtitle: 'Fill out the form below and we\'ll get back to you as soon as possible.'
          },
          consultation: {
            pageTitle: 'Request a Consultation',
            pageSubtitle: 'Take the first step towards securing the funding your business needs.',
            consultationSteps: [
              { title: 'Submit Request', description: 'Fill out our consultation request form with your business details.' },
              { title: 'Initial Call', description: 'We\'ll schedule a call to discuss your business and funding needs.' },
              { title: 'Proposal', description: 'We\'ll provide a customized funding proposal based on your requirements.' },
              { title: 'Implementation', description: 'We\'ll help you secure the funding and support your business growth.' }
            ],
            formTitle: 'Consultation Request Form',
            formSubtitle: 'Please provide the following information to help us understand your business and funding needs.'
          },
          team: {
            pageTitle: 'Our Team',
            pageSubtitle: 'Meet the experienced professionals dedicated to your success.',
            teamMembers: [
              {
                name: 'John Doe',
                title: 'CEO & Founder',
                bio: 'John has over 20 years of experience in finance and has helped numerous startups secure funding.',
                image: null
              },
              {
                name: 'Jane Smith',
                title: 'Chief Financial Officer',
                bio: 'Jane brings extensive expertise in financial planning and investment strategy.',
                image: null
              },
              {
                name: 'Michael Johnson',
                title: 'Head of Client Relations',
                bio: 'Michael ensures our clients receive personalized attention and exceptional service.',
                image: null
              },
              {
                name: 'Sarah Williams',
                title: 'Investment Specialist',
                bio: 'Sarah has a proven track record of connecting businesses with the right investors.',
                image: null
              }
            ]
          },
          terms: {
            pageTitle: 'Terms of Service',
            lastUpdated: '2024-01-01',
            sections: [
              {
                title: 'Introduction',
                content: 'These Terms of Service govern your use of the FTFC website and services. By accessing or using our services, you agree to be bound by these terms.'
              },
              {
                title: 'Use of Services',
                content: 'Our services are provided for business and informational purposes. You agree to use our services only for lawful purposes and in accordance with these Terms.'
              },
              {
                title: 'Privacy',
                content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.'
              },
              {
                title: 'Limitation of Liability',
                content: 'FTFC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.'
              }
            ]
          },
          privacy: {
            pageTitle: 'Privacy Policy',
            lastUpdated: '2024-01-01',
            sections: [
              {
                title: 'Information We Collect',
                content: 'We collect information you provide directly to us, such as when you create an account, request a consultation, or contact us.'
              },
              {
                title: 'How We Use Information',
                content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.'
              },
              {
                title: 'Information Sharing',
                content: 'We do not share your personal information with third parties except as described in this Privacy Policy.'
              },
              {
                title: 'Data Security',
                content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.'
              }
            ]
          }
        };
        
        setPageData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading page data:', error);
        setIsLoading(false);
      }
    };
    
    loadPageData();
  }, []);
  
  // Handle field change
  const handleFieldChange = (page, field, value) => {
    setPageData(prevData => ({
      ...prevData,
      [page]: {
        ...prevData[page],
        [field]: value
      }
    }));
  };
  
  // Handle array field change
  const handleArrayFieldChange = (page, field, index, subfield, value) => {
    setPageData(prevData => {
      const newArray = [...prevData[page][field]];
      
      if (subfield) {
        newArray[index] = {
          ...newArray[index],
          [subfield]: value
        };
      } else {
        newArray[index] = value;
      }
      
      return {
        ...prevData,
        [page]: {
          ...prevData[page],
          [field]: newArray
        }
      };
    });
  };
  
  // Handle adding array item
  const handleAddArrayItem = (page, field, template = {}) => {
    setPageData(prevData => ({
      ...prevData,
      [page]: {
        ...prevData[page],
        [field]: [...(prevData[page][field] || []), template]
      }
    }));
  };
  
  // Handle removing array item
  const handleRemoveArrayItem = (page, field, index) => {
    setPageData(prevData => {
      const newArray = [...prevData[page][field]];
      newArray.splice(index, 1);
      
      return {
        ...prevData,
        [page]: {
          ...prevData[page],
          [field]: newArray
        }
      };
    });
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // In a real app, this would save to an API
      console.log('Saving page data:', pageData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Page content saved successfully!');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving page data:', error);
      alert('Error saving page content. Please try again.');
      setIsSaving(false);
    }
  };
  
  // Handle preview
  const handlePreview = () => {
    const pageUrls = {
      home: '/',
      about: '/about',
      services: '/services',
      contact: '/contact',
      consultation: '/consultation',
      team: '/team',
      terms: '/terms',
      privacy: '/privacy'
    };
    
    const url = pageUrls[activeTab] || '/';
    setPreviewUrl(url);
    window.open(url, '_blank');
  };
  
  // Render active tab content
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading page content...</p>
        </div>
      );
    }
    
    const commonProps = {
      data: pageData[activeTab],
      onFieldChange: (field, value) => handleFieldChange(activeTab, field, value),
      onArrayFieldChange: (field, index, subfield, value) => 
        handleArrayFieldChange(activeTab, field, index, subfield, value),
      onAddArrayItem: (field, template) => handleAddArrayItem(activeTab, field, template),
      onRemoveArrayItem: (field, index) => handleRemoveArrayItem(activeTab, field, index)
    };
    
    switch (activeTab) {
      case 'home':
        return <HomeContent {...commonProps} />;
      case 'about':
        return <AboutContent {...commonProps} />;
      case 'services':
        return <ServicesContent {...commonProps} />;
      case 'contact':
        return <ContactContent {...commonProps} />;
      case 'consultation':
        return <ConsultationContent {...commonProps} />;
      case 'team':
        return <TeamContent {...commonProps} />;
      case 'terms':
        return <TermsContent {...commonProps} />;
      case 'privacy':
        return <PrivacyContent {...commonProps} />;
      default:
        return <div>Select a page to edit</div>;
    }
  };
  
  return (
    <div className="public-pages-manager">
      <div className="manager-header">
        <h3>Public Pages Content Management</h3>
        <div className="header-actions">
          <button 
            type="button" 
            className="preview-button"
            onClick={handlePreview}
            disabled={isLoading}
          >
            <FaEye className="button-icon" />
            Preview
          </button>
          <button 
            type="button" 
            className="save-button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
          >
            <FaSave className="button-icon" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      <div className="manager-content">
        <div className="page-tabs">
          <button
            className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <FaHome className="tab-icon" />
            <span>Home</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <FaInfoCircle className="tab-icon" />
            <span>About</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <FaHandshake className="tab-icon" />
            <span>Services</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FaEnvelope className="tab-icon" />
            <span>Contact</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'consultation' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultation')}
          >
            <FaGlobe className="tab-icon" />
            <span>Consultation</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <FaUsers className="tab-icon" />
            <span>Team</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <FaFileAlt className="tab-icon" />
            <span>Terms</span>
          </button>
          
          <button
            className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <FaShieldAlt className="tab-icon" />
            <span>Privacy</span>
          </button>
        </div>
        
        <div className="page-content">
          {renderTabContent()}
        </div>
      </div>
      
      <style jsx>{`
        .public-pages-manager {
          width: 100%;
        }
        
        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .manager-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
        }
        
        .preview-button, .save-button {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preview-button {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .preview-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .save-button {
          background-color: #f59e0b;
          color: #0f172a;
          border: none;
        }
        
        .save-button:hover {
          background-color: #d97706;
        }
        
        .button-icon {
          margin-right: 8px;
        }
        
        .manager-content {
          display: flex;
          gap: 24px;
        }
        
        .page-tabs {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          border-radius: 4px;
          color: #94a3b8;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }
        
        .tab-button.active {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        
        .tab-icon {
          margin-right: 12px;
          font-size: 16px;
        }
        
        .page-content {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 24px;
          max-height: 700px;
          overflow-y: auto;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(245, 158, 11, 0.1);
          border-radius: 50%;
          border-top: 4px solid #f59e0b;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PublicPagesManager;
