// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Toggle display of ARR field based on revenue status selection
  const revenueStatusEl = document.getElementById('revenueStatus');
  const postRevenueFields = document.getElementById('postRevenueFields');
  
  revenueStatusEl.addEventListener('change', function() {
    if (this.value === 'post') {
      postRevenueFields.style.display = 'block';
      document.getElementById('arr').required = true;
    } else {
      postRevenueFields.style.display = 'none';
      document.getElementById('arr').required = false;
    }
  });

  // Handle lead form submission
  const leadForm = document.getElementById('leadForm');
  const formMessage = document.getElementById('formMessage');
  
  leadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form values
    const leadData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      company: document.getElementById('company').value,
      vision: document.getElementById('vision').value,
      industry: Array.from(document.getElementById('industry').selectedOptions).map(option => option.value),
      teamMembers: parseInt(document.getElementById('teamMembers').value, 10),
      revenueStatus: document.getElementById('revenueStatus').value,
      arr: document.getElementById('arr').value ? parseFloat(document.getElementById('arr').value) : null,
      capitalRaised: document.getElementById('capitalRaised').value ? parseFloat(document.getElementById('capitalRaised').value) : 0,
      raiseGoal: parseFloat(document.getElementById('raiseGoal').value),
      prepStage: document.getElementById('prepStage').value,
      timestamp: new Date().toISOString()
    };

    // Save the lead data into Firestore under a "leads" collection
    db.collection("leads").add(leadData)
      .then(function(docRef) {
        formMessage.textContent = "Thank you! Your information has been submitted.";
        leadForm.reset();
        postRevenueFields.style.display = 'none'; // Reset ARR field display
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
        formMessage.textContent = "There was an error submitting your form. Please try again.";
      });
  });
}); 