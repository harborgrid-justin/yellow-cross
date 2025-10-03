// Yellow Cross - Authentication JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupAuthListeners();
    setupAccessibility();
});

function setupAuthListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Social auth buttons
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', handleSocialAuth);
    });
}

// Accessibility: Setup skip link and focus management
function setupAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
            }
        });
    }
    
    // Focus on first form field
    const firstInput = document.querySelector('input[type="email"], input[type="text"]');
    if (firstInput) {
        firstInput.focus();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call (in production, this would call /api/security/auth)
        await simulateAPICall(1000);
        
        // For demo purposes, accept any credentials
        if (email && password) {
            showAlert('success', 'Login successful! Redirecting...');
            
            // Store auth token (demo)
            localStorage.setItem('authToken', 'demo-token-' + Date.now());
            localStorage.setItem('userEmail', email);
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/#dashboard';
            }, 1500);
        } else {
            showAlert('error', 'Please enter valid credentials');
        }
        
    } catch (error) {
        showAlert('error', 'Login failed. Please try again.');
        console.error('Login error:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        // Validate passwords match
        if (password !== confirmPassword) {
            showAlert('error', 'Passwords do not match');
            return;
        }
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await simulateAPICall(1500);
        
        showAlert('success', 'Registration successful! Redirecting to login...');
        
        // Redirect to login
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        
    } catch (error) {
        showAlert('error', 'Registration failed. Please try again.');
        console.error('Registration error:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function handleSocialAuth(e) {
    const provider = e.currentTarget.classList.contains('btn-google') ? 'Google' : 'Microsoft';
    
    showAlert('info', `${provider} authentication would be configured in production`);
    
    // In production, this would redirect to OAuth provider
    console.log(`Initiating ${provider} OAuth flow...`);
}

function showAlert(type, message) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'assertive');
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" aria-hidden="true"></i>
        ${message}
    `;
    
    // Insert at top of form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(alert, form.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }
}

function simulateAPICall(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    if (token && (currentPage === '/login.html' || currentPage === '/register.html')) {
        // User is logged in, redirect to dashboard
        window.location.href = '/#dashboard';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/login.html';
}

// Make logout available globally
window.logout = logout;

// Check auth on page load
checkAuth();
