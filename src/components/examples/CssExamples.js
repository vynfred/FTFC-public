import React from 'react';
import TailwindButton from '../common/TailwindButton';
import VariableStyledCard from '../common/VariableStyledCard';
import './CssExamples.css';

const CssExamples = () => {
  return (
    <div className="css-examples">
      <h2 className="text-2xl font-bold mb-6">CSS Styling Examples</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Tailwind CSS Examples</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <TailwindButton variant="primary">Primary Button</TailwindButton>
          <TailwindButton variant="secondary">Secondary Button</TailwindButton>
          <TailwindButton variant="outline">Outline Button</TailwindButton>
          <TailwindButton variant="dark">Dark Button</TailwindButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-bg-dark p-4 rounded-lg border border-white/10">
            <h4 className="text-lg font-medium mb-2">Tailwind Card</h4>
            <p className="text-gray-400">This card is styled using Tailwind classes</p>
          </div>
          
          <div className="bg-bg-light p-4 rounded-lg border border-white/10">
            <h4 className="text-lg font-medium mb-2">Tailwind Card</h4>
            <p className="text-gray-400">This card has a lighter background</p>
          </div>
          
          <div className="bg-primary text-bg-dark p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2">Tailwind Card</h4>
            <p className="text-bg-dark/80">This card uses the primary color</p>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">CSS Variables Examples</h3>
        <div className="variable-buttons-container">
          <button className="variable-button primary">Primary Button</button>
          <button className="variable-button secondary">Secondary Button</button>
          <button className="variable-button outline">Outline Button</button>
          <button className="variable-button dark">Dark Button</button>
        </div>
        
        <div className="variable-cards-container">
          <VariableStyledCard title="Variable Styled Card">
            <p>This card is styled using CSS variables</p>
          </VariableStyledCard>
          
          <VariableStyledCard title="Another Card" className="secondary-card">
            <p>This card has a different style using the same component</p>
          </VariableStyledCard>
          
          <VariableStyledCard title="Third Example" className="primary-card">
            <p>This card uses the primary color scheme</p>
          </VariableStyledCard>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Before and After Comparison</h3>
        <div className="comparison-container">
          <div className="comparison-column">
            <h4 className="text-lg font-medium mb-2">Before (!important)</h4>
            <div className="before-example">
              <div className="before-header">Header</div>
              <div className="before-content">
                <p>This example uses !important for styling</p>
              </div>
              <div className="before-footer">Footer</div>
            </div>
          </div>
          
          <div className="comparison-column">
            <h4 className="text-lg font-medium mb-2">After (CSS Variables)</h4>
            <div className="after-example">
              <div className="after-header">Header</div>
              <div className="after-content">
                <p>This example uses CSS variables for styling</p>
              </div>
              <div className="after-footer">Footer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CssExamples;
