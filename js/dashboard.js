// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  const dbRef = firebase.firestore();
  const investorListEl = document.getElementById('investorList');
  const accountListEl = document.getElementById('accountList');
  const accountModal = document.getElementById('accountModal');
  const accountDetailsEl = document.getElementById('accountDetails');
  const recommendedInvestorsEl = document.getElementById('recommendedInvestors');
  const closeModal = document.querySelector('.close');

  // Cache for investors, so we can reference them when showing recommendations
  let investorsCache = [];

  // Load investors list from Firestore "investors" collection
  dbRef.collection('investors').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const investor = doc.data();
        investor.id = doc.id;
        investorsCache.push(investor);
        const li = document.createElement('li');
        li.textContent = investor.name;
        investorListEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error loading investors: ", err);
    });

  // Load accounts list from Firestore "leads" collection
  dbRef.collection('leads').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const account = doc.data();
        account.id = doc.id;
        const li = document.createElement('li');
        li.textContent = account.company || "Unnamed Startup";
        li.style.cursor = "pointer";
        li.addEventListener('click', function() {
          showAccountDetails(account);
        });
        accountListEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error loading accounts: ", err);
    });

  function showAccountDetails(account) {
    // Populate account details
    accountDetailsEl.innerHTML = `
      <h3>${account.company || "Unnamed Startup"}</h3>
      <p><strong>Vision:</strong> ${account.vision}</p>
      <p><strong>Industry:</strong> ${account.industry.join(", ")}</p>
      <p><strong>Team Members:</strong> ${account.teamMembers}</p>
      <p><strong>Revenue Status:</strong> ${account.revenueStatus}</p>
      ${account.arr ? `<p><strong>Current ARR:</strong> ${account.arr}</p>` : ''}
      ${account.capitalRaised ? `<p><strong>Capital Raised:</strong> ${account.capitalRaised}</p>` : ''}
      <p><strong>Raise Goal:</strong> ${account.raiseGoal}</p>
      <p><strong>Preparation Stage:</strong> ${account.prepStage}</p>
    `;

    // Compute recommended investors based on this account's industry and raise goal.
    // This is a simulated function.
    const recommendations = getRecommendedInvestors(account);
    recommendedInvestorsEl.innerHTML = "";
    if (recommendations.length) {
      recommendations.forEach(inv => {
        const li = document.createElement('li');
        li.textContent = inv.name;
        recommendedInvestorsEl.appendChild(li);
      });
    } else {
      recommendedInvestorsEl.innerHTML = "<p>No matching investors found.</p>";
    }

    // Show the modal
    accountModal.style.display = "block";
  }

  function getRecommendedInvestors(account) {
    // Simulated recommendation logic:
    // Return investors whose interests match any of the account's industries
    // and whose raise range (if available) matches the account's raise goal.
    return investorsCache.filter(inv => {
      let industryMatch = false;
      if (inv.interests && Array.isArray(inv.interests)) {
        industryMatch = account.industry.some(ind => inv.interests.includes(ind));
      }
      let raiseMatch = true;
      if (inv.minRaise !== undefined && inv.maxRaise !== undefined) {
        raiseMatch = account.raiseGoal >= inv.minRaise && account.raiseGoal <= inv.maxRaise;
      }
      return industryMatch && raiseMatch;
    });
  }

  // Set up modal close behavior
  closeModal.addEventListener('click', function() {
    accountModal.style.display = "none";
  });

  // Also close modal when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === accountModal) {
      accountModal.style.display = "none";
    }
  });

  // Add this to your existing dashboard.js
  document.querySelector('a[href="login.html"]').addEventListener('click', function(e) {
    e.preventDefault();
    auth.signOut().then(() => {
      window.location.href = '/login.html';
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  });

  // Add search and filter functionality
  function addSearchAndFilter() {
    const searchBar = document.createElement('input');
    searchBar.type = 'search';
    searchBar.placeholder = 'Search accounts...';
    searchBar.addEventListener('input', filterAccounts);

    const filterSelect = document.createElement('select');
    filterSelect.innerHTML = `
        <option value="">All Industries</option>
        <option value="tech">Technology</option>
        <option value="health">Healthcare</option>
        // ... other options
    `;
    filterSelect.addEventListener('change', filterAccounts);

    document.querySelector('#accountSection').insertBefore(
        searchBar, 
        document.querySelector('#accountList')
    );
  }

  // Add basic analytics
  function addAnalytics() {
    const stats = document.createElement('div');
    stats.className = 'dashboard-stats';
    stats.innerHTML = `
        <div class="stat-card">
            <h3>Total Leads</h3>
            <p class="stat-number">${totalLeads}</p>
        </div>
        <div class="stat-card">
            <h3>Active Investors</h3>
            <p class="stat-number">${activeInvestors}</p>
        </div>
        // ... more stats
    `;
  }

  // Add export to CSV feature
  function exportToCSV() {
    const csvContent = convertToCSV(accountsData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts-export.csv';
    a.click();
  }
}); 