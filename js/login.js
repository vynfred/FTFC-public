document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    loginForm.insertBefore(errorContainer, loginForm.firstChild);

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            showLoading();
            await auth.signInWithEmailAndPassword(username, password);
            // Successful login will trigger the auth state observer in firebase.js
            // which will redirect to dashboard
        } catch (error) {
            hideLoading();
            errorContainer.innerHTML = `
                <p class="error-message">
                    ${error.message || 'Login failed. Please try again.'}
                </p>`;
        }
    });

    function showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loader';
        document.body.appendChild(loader);
    }

    function hideLoading() {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove();
    }
}); 