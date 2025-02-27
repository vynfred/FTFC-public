document.addEventListener('DOMContentLoaded', function() {
    const investorForm = document.createElement('form');
    investorForm.id = 'investorForm';
    investorForm.innerHTML = `
        <h3>Add New Investor</h3>
        <label for="investorName">Name:</label>
        <input type="text" id="investorName" required>
        
        <label for="investorInterests">Industries:</label>
        <select id="investorInterests" multiple required>
            <option value="tech">Technology</option>
            <option value="health">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="edtech">EdTech</option>
            <option value="ecommerce">E-commerce</option>
            <option value="biotech">Biotech</option>
            <option value="retail">Retail</option>
        </select>
        
        <label for="minRaise">Minimum Investment:</label>
        <input type="number" id="minRaise" min="0">
        
        <label for="maxRaise">Maximum Investment:</label>
        <input type="number" id="maxRaise" min="0">
        
        <button type="submit">Add Investor</button>
    `;

    document.querySelector('#investorSection').appendChild(investorForm);

    investorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const investorData = {
            name: document.getElementById('investorName').value,
            interests: Array.from(document.getElementById('investorInterests').selectedOptions)
                .map(option => option.value),
            minRaise: parseFloat(document.getElementById('minRaise').value) || 0,
            maxRaise: parseFloat(document.getElementById('maxRaise').value) || 0,
            addedBy: auth.currentUser.uid,
            timestamp: new Date().toISOString()
        };

        try {
            await db.collection('investors').add(investorData);
            investorForm.reset();
            // Refresh investor list
            loadInvestors();
        } catch (error) {
            console.error('Error adding investor:', error);
            alert('Error adding investor. Please try again.');
        }
    });
}); 