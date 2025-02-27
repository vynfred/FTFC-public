document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('intakeForm');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress');
    let currentStep = 0;

    // Loading indicator
    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        document.body.appendChild(loader);
    }

    function hideLoading() {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove();
    }

    // Form validation
    function validateStep(step) {
        const currentStepEl = document.getElementById(`step${step + 1}`);
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            if (input.required && !input.value) {
                isValid = false;
                errors.push(`${input.labels[0].textContent} is required`);
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }

            // Specific validation for email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    errors.push('Please enter a valid email address');
                    input.classList.add('error');
                }
            }

            // Validation for numbers
            if (input.type === 'number' && input.value) {
                if (parseFloat(input.value) < 0) {
                    isValid = false;
                    errors.push(`${input.labels[0].textContent} cannot be negative`);
                    input.classList.add('error');
                }
            }
        });

        // Show validation errors
        const errorContainer = currentStepEl.querySelector('.error-messages') || 
            (() => {
                const div = document.createElement('div');
                div.className = 'error-messages';
                currentStepEl.insertBefore(div, currentStepEl.firstChild);
                return div;
            })();

        errorContainer.innerHTML = errors.map(err => `<p class="error-message">${err}</p>`).join('');
        
        return isValid;
    }

    // Show current step
    function showStep(step) {
        steps.forEach((s, index) => {
            s.style.display = index === step ? 'block' : 'none';
        });
        updateProgressBar();
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Next button click handler
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function () {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Back button click handler
    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', function () {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Revenue status change handler
    const revenueStatusEl = document.getElementById('revenueStatus');
    const postRevenueFields = document.getElementById('postRevenueFields');
    
    revenueStatusEl.addEventListener('change', function() {
        postRevenueFields.style.display = this.value === 'post' ? 'block' : 'none';
        document.getElementById('arr').required = this.value === 'post';
    });

    // Form submission handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            showLoading();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                vision: document.getElementById('vision').value,
                teamMembers: parseInt(document.getElementById('teamMembers').value, 10),
                industry: Array.from(document.getElementById('industry').selectedOptions)
                    .map(option => option.value),
                revenueStatus: document.getElementById('revenueStatus').value,
                arr: document.getElementById('arr').value ? 
                    parseFloat(document.getElementById('arr').value) : null,
                capitalRaised: document.getElementById('capitalRaised').value ? 
                    parseFloat(document.getElementById('capitalRaised').value) : 0,
                raiseGoal: parseFloat(document.getElementById('raiseGoal').value),
                prepStage: document.getElementById('prepStage').value,
                timestamp: new Date().toISOString()
            };

            try {
                await db.collection('leads').add(formData);
                window.location.href = '/thankyou.html';
            } catch (error) {
                console.error('Error saving form:', error);
                hideLoading();
                const errorContainer = document.createElement('div');
                errorContainer.className = 'error-messages';
                errorContainer.innerHTML = `
                    <p class="error-message">
                        There was an error submitting your form. Please try again.
                    </p>`;
                form.insertBefore(errorContainer, form.firstChild);
            }
        }
    });

    // Add inline validation feedback
    function addInlineValidation(input) {
        input.addEventListener('blur', function() {
            const feedback = document.createElement('div');
            feedback.className = 'inline-feedback';
            
            if (input.checkValidity()) {
                feedback.className += ' valid';
                feedback.textContent = '✓';
            } else {
                feedback.className += ' invalid';
                feedback.textContent = getValidationMessage(input);
            }
            
            input.parentNode.appendChild(feedback);
        });
    }

    // Initialize first step
    showStep(currentStep);
}); 