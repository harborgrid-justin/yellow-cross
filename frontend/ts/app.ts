// Yellow Cross - Frontend Application TypeScript

import type {
    Feature,
    FeatureAPIData,
    PlatformInfo,
    HealthStatus,
    HTTPMethod,
    DebouncedFunction
} from './types';

// API Base URL
const API_BASE: string = window.location.origin;

// Global state for search results count (for accessibility)
declare global {
    interface Window {
        lastSearchResultCount?: number;
    }
}

// Performance: Debounce function for search optimization
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): DebouncedFunction<T> {
    let timeout: number | undefined;
    return function executedFunction(...args: Parameters<T>): void {
        const later = (): void => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
    };
}

// Performance: Lazy load images
function lazyLoadImages(): void {
    const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.src = dataSrc;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Feature data with icons and categories
const featuresData: Feature[] = [
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
async function initializeApp(): Promise<void> {
    try {
        // Performance: Initialize lazy loading
        lazyLoadImages();
        
        // Load platform info
        const platformInfo = await fetchAPI<PlatformInfo>('/api');
        updatePlatformStats(platformInfo);
        
        // Load features
        loadFeatures();
        loadDashboard();
        loadAPIEndpoints();
        
        // Accessibility: Set focus on skip link when page loads
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
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Fetch API helper
async function fetchAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
        
        return await response.json() as T;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Update platform statistics
function updatePlatformStats(info: PlatformInfo): void {
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
function animateCounter(element: HTMLElement, target: number): void {
    let current = 0;
    const increment = target / 50;
    const timer = window.setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = String(target);
            clearInterval(timer);
        } else {
            element.textContent = String(Math.floor(current));
        }
    }, 20);
}

// Load features grid
async function loadFeatures(): Promise<void> {
    const featuresGrid = document.getElementById('features-grid');
    if (!featuresGrid) return;
    
    featuresGrid.innerHTML = '';
    
    for (const feature of featuresData) {
        try {
            const featureCard = createFeatureCard(feature);
            featuresGrid.appendChild(featureCard);
            
            // Fetch actual data from API
            const apiData = await fetchAPI<FeatureAPIData>(feature.endpoint);
            updateFeatureCard(featureCard, apiData);
        } catch (error) {
            console.error(`Error loading feature ${feature.name}:`, error);
        }
    }
}

// Create feature card
function createFeatureCard(feature: Feature): HTMLDivElement {
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
        const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
        if (apiUrlInput) {
            apiUrlInput.value = feature.endpoint;
            sendAPIRequest();
        }
    });
    
    return card;
}

// Update feature card with API data
function updateFeatureCard(card: HTMLDivElement, apiData: FeatureAPIData): void {
    const subFeaturesList = card.querySelector<HTMLUListElement>('.sub-features-list');
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
function loadDashboard(): void {
    const dashboardGrid = document.getElementById('dashboard-grid');
    if (!dashboardGrid) return;
    
    dashboardGrid.innerHTML = '';
    
    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.dataset['category'] = feature.category;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `${feature.name}. ${feature.description}. API endpoint: ${feature.endpoint}. Press Enter to test API`);
        
        card.innerHTML = `
            <h4><i class="fas ${feature.icon}" aria-hidden="true"></i> ${feature.name}</h4>
            <p>${feature.description}</p>
            <span class="endpoint-badge">${feature.endpoint}</span>
        `;
        
        const clickHandler = (): void => {
            window.location.hash = 'api';
            const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
            if (apiUrlInput) {
                apiUrlInput.value = feature.endpoint;
                sendAPIRequest();
            }
        };
        
        card.addEventListener('click', clickHandler);
        
        // Keyboard navigation
        card.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clickHandler();
            }
        });
        
        dashboardGrid.appendChild(card);
    });
}

// Load API endpoints
function loadAPIEndpoints(): void {
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
function addAPIEndpoint(container: HTMLElement, endpoint: string, label: string): void {
    const div = document.createElement('div');
    div.className = 'api-endpoint';
    div.textContent = endpoint;
    div.title = label;
    div.setAttribute('role', 'menuitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `${label} - ${endpoint}`);
    
    const clickHandler = (): void => {
        document.querySelectorAll('.api-endpoint').forEach(el => {
            el.classList.remove('active');
            el.setAttribute('aria-selected', 'false');
        });
        div.classList.add('active');
        div.setAttribute('aria-selected', 'true');
        const apiUrlInput = document.getElementById('api-url') as HTMLInputElement | null;
        if (apiUrlInput) {
            apiUrlInput.value = endpoint;
        }
    };
    
    div.addEventListener('click', clickHandler);
    
    // Keyboard navigation
    div.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clickHandler();
        }
    });
    
    container.appendChild(div);
}

// Send API request
async function sendAPIRequest(): Promise<void> {
    const methodSelect = document.getElementById('http-method') as HTMLSelectElement | null;
    const urlInput = document.getElementById('api-url') as HTMLInputElement | null;
    const requestBodyTextarea = document.getElementById('request-body') as HTMLTextAreaElement | null;
    const responseStatus = document.getElementById('response-status');
    const responseBody = document.getElementById('response-body');
    
    if (!methodSelect || !urlInput || !responseStatus || !responseBody) return;
    
    const method = methodSelect.value as HTTPMethod;
    const url = urlInput.value;
    const requestBody = requestBodyTextarea?.value || '';
    
    try {
        responseStatus.textContent = 'Loading...';
        responseStatus.className = 'response-status';
        responseBody.textContent = '';
        
        const options: RequestInit = {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';
        responseStatus.textContent = `Error: ${errorMessage}`;
        responseStatus.className = 'response-status error';
        responseBody.textContent = errorStack || errorMessage;
    }
}

// Check system status
async function checkSystemStatus(): Promise<void> {
    const statusDot = document.getElementById('status-dot') as HTMLElement | null;
    const statusText = document.getElementById('system-status') as HTMLElement | null;
    
    if (!statusDot || !statusText) return;
    
    try {
        const health = await fetchAPI<HealthStatus>('/health');
        
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
function setupEventListeners(): void {
    // Smooth scrolling
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e: Event) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const target = document.querySelector<HTMLElement>(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // API request button
    const sendButton = document.getElementById('send-request');
    if (sendButton) {
        sendButton.addEventListener('click', sendAPIRequest);
    }
    
    // Search features with debouncing for performance
    const searchInput = document.getElementById('search-features') as HTMLInputElement | null;
    if (searchInput) {
        const debouncedSearch = debounce((value: string) => {
            filterDashboard(value, null);
            // Announce results to screen readers
            announceSearchResults();
        }, 300);
        
        searchInput.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            debouncedSearch(target.value);
        });
    }
    
    // Filter category
    const filterSelect = document.getElementById('filter-category') as HTMLSelectElement | null;
    if (filterSelect) {
        filterSelect.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLSelectElement;
            filterDashboard(null, target.value);
        });
    }
    
    // Press Enter in API URL to send request
    const apiUrl = document.getElementById('api-url') as HTMLInputElement | null;
    if (apiUrl) {
        apiUrl.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                sendAPIRequest();
            }
        });
    }
    
    // Hamburger menu for mobile navigation
    const hamburger = document.querySelector<HTMLButtonElement>('.hamburger');
    const navMenu = document.querySelector<HTMLElement>('.nav-menu');
    if (hamburger && navMenu) {
        const toggleMenu = (): void => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!isExpanded));
            navMenu.classList.toggle('active');
            navMenu.style.display = navMenu.classList.contains('active') ? 'flex' : '';
        };
        
        hamburger.addEventListener('click', toggleMenu);
        
        // Keyboard support for hamburger
        hamburger.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e: Event) => {
            const target = e.target as Node;
            if (!hamburger.contains(target) && !navMenu.contains(target)) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navMenu.style.display = '';
            }
        });
        
        // Escape key closes menu
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navMenu.style.display = '';
                hamburger.focus();
            }
        });
    }
}

// Filter dashboard
function filterDashboard(searchTerm: string | null, category: string | null): void {
    const cards = document.querySelectorAll<HTMLDivElement>('.dashboard-card');
    const searchInput = document.getElementById('search-features') as HTMLInputElement | null;
    const categorySelect = document.getElementById('filter-category') as HTMLSelectElement | null;
    
    const search = (searchTerm?.toLowerCase() || searchInput?.value.toLowerCase() || '');
    const cat = category || categorySelect?.value || 'all';
    
    let visibleCount = 0;
    cards.forEach(card => {
        const text = card.textContent?.toLowerCase() || '';
        const cardCategory = card.dataset['category'];
        
        const matchesSearch = !search || text.includes(search);
        const matchesCategory = cat === 'all' || cardCategory === cat;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Store count for accessibility announcements
    window.lastSearchResultCount = visibleCount;
}

// Accessibility: Announce search results to screen readers
function announceSearchResults(): void {
    const dashboardGrid = document.getElementById('dashboard-grid');
    if (dashboardGrid) {
        const count = window.lastSearchResultCount || 0;
        dashboardGrid.setAttribute('aria-label', `Feature cards. Showing ${count} results`);
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchAPI,
        featuresData
    };
}
