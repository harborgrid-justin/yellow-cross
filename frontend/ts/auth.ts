// Yellow Cross - Authentication TypeScript

type AlertType = 'success' | 'error' | 'info';

document.addEventListener('DOMContentLoaded', () => {
    setupAuthListeners();
    setupAccessibility();
});

function setupAuthListeners(): void {
    // Login form
    const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('register-form') as HTMLFormElement | null;
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Social auth buttons
    document.querySelectorAll<HTMLButtonElement>('.btn-social').forEach(btn => {
        btn.addEventListener('click', handleSocialAuth);
    });
}

// Accessibility: Setup skip link and focus management
function setupAccessibility(): void {
    const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const href = skipLink.getAttribute('href');
            if (href) {
                const target = document.querySelector<HTMLElement>(href);
                if (target) {
                    target.focus();
                }
            }
        });
    }
    
    // Focus on first form field
    const firstInput = document.querySelector<HTMLInputElement>('input[type="email"], input[type="text"]');
    if (firstInput) {
        firstInput.focus();
    }
}

async function handleLogin(e: Event): Promise<void> {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitBtn) return;
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
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

async function handleRegister(e: Event): Promise<void> {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const nameInput = document.getElementById('name') as HTMLInputElement | null;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement | null;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !submitBtn) return;
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
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

function handleSocialAuth(e: Event): void {
    const button = e.currentTarget as HTMLButtonElement;
    const provider = button.classList.contains('btn-google') ? 'Google' : 'Microsoft';
    
    showAlert('info', `${provider} authentication would be configured in production`);
    
    // In production, this would redirect to OAuth provider
    console.log(`Initiating ${provider} OAuth flow...`);
}

function showAlert(type: AlertType, message: string): void {
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
    
    const iconClass = type === 'success' 
        ? 'fa-check-circle' 
        : type === 'error' 
        ? 'fa-exclamation-circle' 
        : 'fa-info-circle';
    
    alert.innerHTML = `
        <i class="fas ${iconClass}" aria-hidden="true"></i>
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

function simulateAPICall(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Check if user is already logged in
function checkAuth(): void {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    if (token && (currentPage === '/login.html' || currentPage === '/register.html')) {
        // User is logged in, redirect to dashboard
        window.location.href = '/#dashboard';
    }
}

// Logout function
function logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/login.html';
}

// Make logout available globally
(window as any).logout = logout;

// Check auth on page load
checkAuth();
