import React from 'react';
import ContentSection from './ContentSection';
import TextField from './TextField';
import ImageUpload from './ImageUpload';
import ArrayField from './ArrayField';

/**
 * TeamContent component for editing the team page content
 */
const TeamContent = ({ data, onFieldChange, onArrayFieldChange, onAddArrayItem, onRemoveArrayItem }) => {
  // Handle text field change
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };
  
  // Handle team member change
  const handleMemberChange = (index, field, value) => {
    onArrayFieldChange('teamMembers', index, field, value);
  };
  
  // Add team member
  const addTeamMember = () => {
    onAddArrayItem('teamMembers', {
      name: '',
      title: '',
      bio: '',
      image: null
    });
  };
  
  return (
    <div className="content-section">
      <h3>Team Page Content</h3>
      
      <ContentSection title="Page Header">
        <TextField 
          name="pageTitle" 
          label="Page Title" 
          value={data.pageTitle || ''} 
          onChange={handleTextChange}
        />
        <TextField 
          name="pageSubtitle" 
          label="Page Subtitle" 
          value={data.pageSubtitle || ''} 
          onChange={handleTextChange}
          multiline
        />
        <ImageUpload 
          name="headerImage" 
          label="Header Image" 
          value={data.headerImage} 
          onChange={handleImageChange}
        />
      </ContentSection>

      <ContentSection title="Team Members">
        <ArrayField 
          name="teamMembers"
          items={data.teamMembers || []}
          onAdd={addTeamMember}
          onRemove={(name, index) => onRemoveArrayItem(name, index)}
          addLabel="Add Team Member"
        >
          {(field, index) => (
            <div className="member-item">
              <TextField 
                name={`${field}-name`}
                label="Name" 
                value={data.teamMembers[index]?.name || ''} 
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
              />
              <TextField 
                name={`${field}-title`}
                label="Title/Position" 
                value={data.teamMembers[index]?.title || ''} 
                onChange={(e) => handleMemberChange(index, 'title', e.target.value)}
              />
              <TextField 
                name={`${field}-bio`}
                label="Bio" 
                value={data.teamMembers[index]?.bio || ''} 
                onChange={(e) => handleMemberChange(index, 'bio', e.target.value)}
                multiline
              />
              <ImageUpload 
                name={`${field}-image`}
                label="Profile Image" 
                value={data.teamMembers[index]?.image} 
                onChange={(e) => handleMemberChange(index, 'image', e.target.value)}
              />
              <div className="field-row">
                <TextField 
                  name={`${field}-email`}
                  label="Email (Optional)" 
                  value={data.teamMembers[index]?.email || ''} 
                  onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                />
                <TextField 
                  name={`${field}-linkedin`}
                  label="LinkedIn URL (Optional)" 
                  value={data.teamMembers[index]?.linkedin || ''} 
                  onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
                />
              </div>
            </div>
          )}
        </ArrayField>
      </ContentSection>
      
      <style jsx>{`
        .field-row {
          display: flex;
          gap: 16px;
        }
        
        @media (max-width: 768px) {
          .field-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamContent;
