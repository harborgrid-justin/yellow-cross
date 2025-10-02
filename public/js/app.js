// Yellow Cross - Frontend Application JavaScript

// API Base URL
const API_BASE = window.location.origin;

// Feature data with icons and categories
const featuresData = [
    {
        name: 'Case Management System',
        icon: 'fa-briefcase',
        endpoint: '/api/cases',
        category: 'management',
        description: 'Complete case lifecycle management from intake to closing',
        subFeatureCount: 8
    },
    {
        name: 'Client Relationship Management',
        icon: 'fa-users',
        endpoint: '/api/clients',
        category: 'management',
        description: 'Comprehensive client database and relationship tracking',
        subFeatureCount: 8
    },
    {
        name: 'Document Management System',
        icon: 'fa-folder-open',
        endpoint: '/api/documents',
        category: 'management',
        description: 'Secure document storage, versioning, and collaboration',
        subFeatureCount: 8
    },
    {
        name: 'Time & Billing Management',
        icon: 'fa-clock',
        endpoint: '/api/billing',
        category: 'management',
        description: 'Track billable hours and generate invoices',
        subFeatureCount: 8
    },
    {
        name: 'Calendar & Scheduling System',
        icon: 'fa-calendar-alt',
        endpoint: '/api/calendar',
        category: 'management',
        description: 'Court dates, deadlines, and appointment management',
        subFeatureCount: 8
    },
    {
        name: 'Task & Workflow Management',
        icon: 'fa-tasks',
        endpoint: '/api/tasks',
        category: 'management',
        description: 'Task assignment and workflow automation',
        subFeatureCount: 8
    },
    {
        name: 'Legal Research & Knowledge Base',
        icon: 'fa-book',
        endpoint: '/api/research',
        category: 'legal',
        description: 'Integrated legal research and knowledge management',
        subFeatureCount: 8
    },
    {
        name: 'Court & Docket Management',
        icon: 'fa-gavel',
        endpoint: '/api/court',
        category: 'legal',
        description: 'Track court dockets and manage filings',
        subFeatureCount: 8
    },
    {
        name: 'Contract Management',
        icon: 'fa-file-contract',
        endpoint: '/api/contracts',
        category: 'legal',
        description: 'Contract lifecycle from drafting to renewal',
        subFeatureCount: 8
    },
    {
        name: 'eDiscovery & Evidence Management',
        icon: 'fa-search',
        endpoint: '/api/ediscovery',
        category: 'legal',
        description: 'Evidence collection, review, and production',
        subFeatureCount: 8
    },
    {
        name: 'Compliance & Risk Management',
        icon: 'fa-shield-alt',
        endpoint: '/api/compliance',
        category: 'compliance',
        description: 'Ethics tracking and risk assessment',
        subFeatureCount: 8
    },
    {
        name: 'Reporting & Analytics',
        icon: 'fa-chart-bar',
        endpoint: '/api/reports',
        category: 'analytics',
        description: 'Comprehensive reporting and business intelligence',
        subFeatureCount: 8
    },
    {
        name: 'Communication & Collaboration',
        icon: 'fa-comments',
        endpoint: '/api/communication',
        category: 'management',
        description: 'Internal messaging and team collaboration',
        subFeatureCount: 8
    },
    {
        name: 'Security & Access Control',
        icon: 'fa-lock',
        endpoint: '/api/security',
        category: 'compliance',
        description: 'Authentication, authorization, and security monitoring',
        subFeatureCount: 8
    },
    {
        name: 'Integration & API Management',
        icon: 'fa-plug',
        endpoint: '/api/integrations',
        category: 'management',
        description: 'Third-party integrations and API management',
        subFeatureCount: 8
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkSystemStatus();
});

// Initialize application
async function initializeApp() {
    try {
        // Load platform info
        const platformInfo = await fetchAPI('/api');
        updatePlatformStats(platformInfo);
        
        // Load features
        loadFeatures();
        loadDashboard();
        loadAPIEndpoints();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Fetch API helper
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Update platform statistics
function updatePlatformStats(info) {
    if (info.features) {
        const featureCount = document.getElementById('feature-count');
        const subfeatureCount = document.getElementById('subfeature-count');
        
        if (featureCount) {
            animateCounter(featureCount, info.features.length);
        }
        
        if (subfeatureCount) {
            animateCounter(subfeatureCount, info.features.length * 8);
        }
    }
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Load features grid
async function loadFeatures() {
    const featuresGrid = document.getElementById('features-grid');
    if (!featuresGrid) return;
    
    featuresGrid.innerHTML = '';
    
    for (const feature of featuresData) {
        try {
            const featureCard = createFeatureCard(feature);
            featuresGrid.appendChild(featureCard);
            
            // Fetch actual data from API
            const apiData = await fetchAPI(feature.endpoint);
            updateFeatureCard(featureCard, apiData);
        } catch (error) {
            console.error(`Error loading feature ${feature.name}:`, error);
        }
    }
}

// Create feature card
function createFeatureCard(feature) {
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.innerHTML = `
        <div class="feature-icon">
            <i class="fas ${feature.icon}"></i>
        </div>
        <h3>${feature.name}</h3>
        <p>${feature.description}</p>
        <span class="feature-badge">${feature.subFeatureCount} Sub-Features</span>
        <div class="sub-features">
            <h4>Sub-Features:</h4>
            <ul class="sub-features-list"></ul>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.hash = 'api';
        document.getElementById('api-url').value = feature.endpoint;
        sendAPIRequest();
    });
    
    return card;
}

// Update feature card with API data
function updateFeatureCard(card, apiData) {
    const subFeaturesList = card.querySelector('.sub-features-list');
    if (!subFeaturesList) return;
    
    if (apiData.subFeatures && Array.isArray(apiData.subFeatures)) {
        subFeaturesList.innerHTML = apiData.subFeatures
            .slice(0, 4)
            .map(sf => `<li>${sf}</li>`)
            .join('');
        
        if (apiData.subFeatures.length > 4) {
            subFeaturesList.innerHTML += `<li>+${apiData.subFeatures.length - 4} more...</li>`;
        }
    }
}

// Load dashboard
function loadDashboard() {
    const dashboardGrid = document.getElementById('dashboard-grid');
    if (!dashboardGrid) return;
    
    dashboardGrid.innerHTML = '';
    
    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.dataset.category = feature.category;
        card.innerHTML = `
            <h4><i class="fas ${feature.icon}"></i> ${feature.name}</h4>
            <p>${feature.description}</p>
            <span class="endpoint-badge">${feature.endpoint}</span>
        `;
        
        card.addEventListener('click', () => {
            window.location.hash = 'api';
            document.getElementById('api-url').value = feature.endpoint;
            sendAPIRequest();
        });
        
        dashboardGrid.appendChild(card);
    });
}

// Load API endpoints
function loadAPIEndpoints() {
    const endpointsList = document.getElementById('api-endpoints');
    if (!endpointsList) return;
    
    endpointsList.innerHTML = '';
    
    // Add API info endpoint
    addAPIEndpoint(endpointsList, '/api', 'Platform Info');
    
    // Add feature endpoints
    featuresData.forEach(feature => {
        addAPIEndpoint(endpointsList, feature.endpoint, feature.name);
    });
}

// Add API endpoint to sidebar
function addAPIEndpoint(container, endpoint, label) {
    const div = document.createElement('div');
    div.className = 'api-endpoint';
    div.textContent = endpoint;
    div.title = label;
    
    div.addEventListener('click', () => {
        document.querySelectorAll('.api-endpoint').forEach(el => {
            el.classList.remove('active');
        });
        div.classList.add('active');
        document.getElementById('api-url').value = endpoint;
    });
    
    container.appendChild(div);
}

// Send API request
async function sendAPIRequest() {
    const method = document.getElementById('http-method').value;
    const url = document.getElementById('api-url').value;
    const requestBody = document.getElementById('request-body').value;
    const responseStatus = document.getElementById('response-status');
    const responseBody = document.getElementById('response-body');
    
    try {
        responseStatus.textContent = 'Loading...';
        responseStatus.className = 'response-status';
        responseBody.textContent = '';
        
        const options = {
            method: method
        };
        
        if (method !== 'GET' && requestBody) {
            options.body = requestBody;
        }
        
        const startTime = Date.now();
        const response = await fetch(`${API_BASE}${url}`, options);
        const endTime = Date.now();
        const data = await response.json();
        
        responseStatus.textContent = `Status: ${response.status} ${response.statusText} (${endTime - startTime}ms)`;
        responseStatus.className = `response-status ${response.ok ? 'success' : 'error'}`;
        responseBody.textContent = JSON.stringify(data, null, 2);
        
    } catch (error) {
        responseStatus.textContent = `Error: ${error.message}`;
        responseStatus.className = 'response-status error';
        responseBody.textContent = error.stack;
    }
}

// Check system status
async function checkSystemStatus() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('system-status');
    
    if (!statusDot || !statusText) return;
    
    try {
        const health = await fetchAPI('/health');
        
        if (health.status === 'healthy') {
            statusDot.style.background = 'var(--success)';
            statusText.textContent = 'All Systems Operational';
        } else {
            statusDot.style.background = 'var(--warning)';
            statusText.textContent = 'Degraded Performance';
        }
    } catch (error) {
        statusDot.style.background = 'var(--danger)';
        statusText.textContent = 'System Offline';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // API request button
    const sendButton = document.getElementById('send-request');
    if (sendButton) {
        sendButton.addEventListener('click', sendAPIRequest);
    }
    
    // Search features
    const searchInput = document.getElementById('search-features');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterDashboard(e.target.value, null);
        });
    }
    
    // Filter category
    const filterSelect = document.getElementById('filter-category');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterDashboard(null, e.target.value);
        });
    }
    
    // Press Enter in API URL to send request
    const apiUrl = document.getElementById('api-url');
    if (apiUrl) {
        apiUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAPIRequest();
            }
        });
    }
}

// Filter dashboard
function filterDashboard(searchTerm, category) {
    const cards = document.querySelectorAll('.dashboard-card');
    const search = searchTerm?.toLowerCase() || document.getElementById('search-features')?.value.toLowerCase() || '';
    const cat = category || document.getElementById('filter-category')?.value || 'all';
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardCategory = card.dataset.category;
        
        const matchesSearch = !search || text.includes(search);
        const matchesCategory = cat === 'all' || cardCategory === cat;
        
        card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

// Utility: Format timestamp
function formatTimestamp(date) {
    return new Date(date).toLocaleString();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchAPI,
        featuresData
    };
}
