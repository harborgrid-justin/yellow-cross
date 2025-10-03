/**
 * Case Management System - Frontend JavaScript
 * Handles all case management functionality including:
 * - Case Creation & Intake
 * - Case Tracking & Status
 * - Case Assignment & Distribution
 * - Timeline Management
 * - Categorization & Tagging
 * - Notes & Updates
 * - Closing & Archive
 * - Analytics Dashboard
 */

// Global state
let cases = [];
let currentCase = null;
let filters = {
    status: '',
    priority: '',
    matterType: '',
    search: ''
};

// API Base URL
const API_BASE = '/api/cases';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadCases();
    updateStats();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Create case button
    const createBtn = document.getElementById('create-case-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => openCreateModal());
    }

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Cancel create button
    const cancelBtn = document.getElementById('cancel-create-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const modal = document.getElementById('create-case-modal');
            closeModal(modal);
        });
    }

    // Create case form submission
    const createForm = document.getElementById('create-case-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateCase);
    }

    // Search and filters
    const searchInput = document.getElementById('case-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilterChange);
    }

    const priorityFilter = document.getElementById('priority-filter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', handleFilterChange);
    }

    const matterFilter = document.getElementById('matter-filter');
    if (matterFilter) {
        matterFilter.addEventListener('change', handleFilterChange);
    }

    // View toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Keyboard navigation for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not([hidden])');
            openModals.forEach(modal => closeModal(modal));
        }
    });
}

/**
 * Load all cases from API
 */
async function loadCases() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/list`);
        const data = await response.json();
        
        if (data.cases) {
            cases = data.cases;
        } else {
            // Fallback: Generate mock data for demonstration
            cases = generateMockCases();
        }
        
        displayCases(cases);
        updateStats();
    } catch (error) {
        console.error('Error loading cases:', error);
        // Use mock data on error
        cases = generateMockCases();
        displayCases(cases);
        updateStats();
    }
}

/**
 * Display cases in the grid/list
 */
function displayCases(casesToDisplay) {
    const container = document.getElementById('cases-container');
    if (!container) return;

    // Apply filters
    const filteredCases = filterCases(casesToDisplay);

    if (filteredCases.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No cases found</h3>
                <p>Try adjusting your filters or create a new case</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredCases.map(caseItem => `
        <div class="case-card" data-case-number="${caseItem.caseNumber}">
            <div class="case-card-header">
                <span class="case-number">${caseItem.caseNumber}</span>
                <span class="case-status status-${getStatusClass(caseItem.status)}">${caseItem.status}</span>
            </div>
            <div class="case-card-body">
                <h3>${caseItem.title}</h3>
                <p class="case-client"><i class="fas fa-user"></i> ${caseItem.clientName}</p>
                <div class="case-meta">
                    <span class="case-meta-item">
                        <i class="fas fa-tag"></i>
                        ${caseItem.matterType}
                    </span>
                    <span class="case-priority priority-${caseItem.priority.toLowerCase()}">
                        ${caseItem.priority}
                    </span>
                    <span class="case-meta-item">
                        <i class="fas fa-user-tie"></i>
                        ${caseItem.assignedTo}
                    </span>
                    <span class="case-meta-item">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(caseItem.openedDate)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners to case cards
    container.querySelectorAll('.case-card').forEach(card => {
        card.addEventListener('click', () => {
            const caseNumber = card.dataset.caseNumber;
            openCaseDetail(caseNumber);
        });
    });
}

/**
 * Filter cases based on current filters
 */
function filterCases(casesToFilter) {
    return casesToFilter.filter(caseItem => {
        // Status filter
        if (filters.status && caseItem.status !== filters.status) {
            return false;
        }
        
        // Priority filter
        if (filters.priority && caseItem.priority !== filters.priority) {
            return false;
        }
        
        // Matter type filter
        if (filters.matterType && caseItem.matterType !== filters.matterType) {
            return false;
        }
        
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                caseItem.caseNumber.toLowerCase().includes(searchLower) ||
                caseItem.title.toLowerCase().includes(searchLower) ||
                caseItem.clientName.toLowerCase().includes(searchLower)
            );
        }
        
        return true;
    });
}

/**
 * Update statistics
 */
function updateStats() {
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status !== 'Closed' && c.status !== 'Archived').length;
    const closedCases = cases.filter(c => c.status === 'Closed').length;
    const urgentCases = cases.filter(c => c.priority === 'Critical' || c.priority === 'High').length;

    document.getElementById('total-cases').textContent = totalCases;
    document.getElementById('active-cases').textContent = activeCases;
    document.getElementById('closed-cases').textContent = closedCases;
    document.getElementById('urgent-cases').textContent = urgentCases;
}

/**
 * Handle case creation
 */
async function handleCreateCase(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const caseData = {
        title: formData.get('title'),
        clientName: formData.get('clientName'),
        matterType: formData.get('matterType'),
        priority: formData.get('priority'),
        description: formData.get('description'),
        assignedTo: formData.get('assignedTo'),
        practiceArea: formData.get('practiceArea'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
        filingDate: formData.get('filingDate'),
        dueDate: formData.get('dueDate')
    };

    try {
        const response = await fetch(`${API_BASE}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(caseData)
        });

        const result = await response.json();
        
        if (result.case) {
            cases.unshift(result.case);
        } else {
            // Create mock case for demonstration
            const newCase = {
                caseNumber: `CASE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                ...caseData,
                status: 'Open',
                openedDate: new Date().toISOString()
            };
            cases.unshift(newCase);
        }

        displayCases(cases);
        updateStats();
        
        const modal = document.getElementById('create-case-modal');
        closeModal(modal);
        e.target.reset();
        
        showAlert('success', 'Case created successfully!');
    } catch (error) {
        console.error('Error creating case:', error);
        showAlert('error', 'Failed to create case. Please try again.');
    }
}

/**
 * Open case detail modal
 */
function openCaseDetail(caseNumber) {
    const caseItem = cases.find(c => c.caseNumber === caseNumber);
    if (!caseItem) return;

    currentCase = caseItem;
    
    // Populate overview tab
    const overviewTab = document.getElementById('case-overview');
    if (overviewTab) {
        overviewTab.innerHTML = `
            <div class="case-detail-grid">
                <div class="detail-section">
                    <h3>Basic Information</h3>
                    <div class="detail-item">
                        <label>Case Number:</label>
                        <span>${caseItem.caseNumber}</span>
                    </div>
                    <div class="detail-item">
                        <label>Title:</label>
                        <span>${caseItem.title}</span>
                    </div>
                    <div class="detail-item">
                        <label>Client:</label>
                        <span>${caseItem.clientName}</span>
                    </div>
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="case-status status-${getStatusClass(caseItem.status)}">${caseItem.status}</span>
                    </div>
                    <div class="detail-item">
                        <label>Priority:</label>
                        <span class="case-priority priority-${caseItem.priority.toLowerCase()}">${caseItem.priority}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h3>Assignment</h3>
                    <div class="detail-item">
                        <label>Assigned To:</label>
                        <span>${caseItem.assignedTo}</span>
                    </div>
                    <div class="detail-item">
                        <label>Matter Type:</label>
                        <span>${caseItem.matterType}</span>
                    </div>
                    <div class="detail-item">
                        <label>Practice Area:</label>
                        <span>${caseItem.practiceArea || 'N/A'}</span>
                    </div>
                </div>
                <div class="detail-section full-width">
                    <h3>Description</h3>
                    <p>${caseItem.description || 'No description provided'}</p>
                </div>
            </div>
        `;
    }

    // Populate timeline tab
    const timelineTab = document.getElementById('case-timeline');
    if (timelineTab) {
        timelineTab.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-date">${formatDate(caseItem.openedDate)}</div>
                <div class="timeline-content">
                    <div class="timeline-title">Case Opened</div>
                    <p>Case was created and assigned to ${caseItem.assignedTo}</p>
                </div>
            </div>
        `;
    }

    // Populate notes tab
    const notesTab = document.getElementById('case-notes');
    if (notesTab) {
        notesTab.innerHTML = `
            <div class="note-card">
                <div class="note-header">
                    <span class="note-author">System</span>
                    <span class="note-date">${formatDate(caseItem.openedDate)}</span>
                </div>
                <div class="note-content">
                    Case created and opened for tracking.
                </div>
            </div>
        `;
    }

    // Populate analytics tab
    const analyticsTab = document.getElementById('case-analytics');
    if (analyticsTab) {
        const daysSinceOpened = Math.floor((new Date() - new Date(caseItem.openedDate)) / (1000 * 60 * 60 * 24));
        analyticsTab.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h4>Case Duration</h4>
                    <p class="analytics-value">${daysSinceOpened} days</p>
                </div>
                <div class="analytics-card">
                    <h4>Status</h4>
                    <p class="analytics-value">${caseItem.status}</p>
                </div>
                <div class="analytics-card">
                    <h4>Priority Level</h4>
                    <p class="analytics-value">${caseItem.priority}</p>
                </div>
            </div>
        `;
    }

    const modal = document.getElementById('case-detail-modal');
    openModal(modal);
}

/**
 * Modal functions
 */
function openCreateModal() {
    const modal = document.getElementById('create-case-modal');
    openModal(modal);
}

function openModal(modal) {
    if (modal) {
        modal.removeAttribute('hidden');
        modal.style.display = 'flex';
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
    }
}

/**
 * Handle search
 */
function handleSearch(e) {
    filters.search = e.target.value;
    displayCases(cases);
}

/**
 * Handle filter change
 */
function handleFilterChange(e) {
    const filterId = e.target.id;
    
    if (filterId === 'status-filter') {
        filters.status = e.target.value;
    } else if (filterId === 'priority-filter') {
        filters.priority = e.target.value;
    } else if (filterId === 'matter-filter') {
        filters.matterType = e.target.value;
    }
    
    displayCases(cases);
}

/**
 * Handle view toggle
 */
function handleViewToggle(e) {
    const btn = e.currentTarget;
    const view = btn.dataset.view;
    
    // Update active state
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update container class
    const container = document.getElementById('cases-container');
    if (view === 'list') {
        container.classList.remove('cases-grid');
        container.classList.add('cases-list');
    } else {
        container.classList.remove('cases-list');
        container.classList.add('cases-grid');
    }
}

/**
 * Handle tab switching
 */
function handleTabSwitch(e) {
    const tabName = e.target.dataset.tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

/**
 * Helper functions
 */
function showLoading() {
    const container = document.getElementById('cases-container');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading cases...</p>
            </div>
        `;
    }
}

function getStatusClass(status) {
    const statusMap = {
        'Open': 'open',
        'In Progress': 'in-progress',
        'Closed': 'closed',
        'On Hold': 'on-hold',
        'Pending Review': 'in-progress',
        'Archived': 'closed'
    };
    return statusMap[status] || 'open';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showAlert(type, message) {
    // Simple alert for now - could be enhanced with a toast notification
    const className = type === 'success' ? 'success' : 'error';
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${className}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

/**
 * Generate mock cases for demonstration
 */
function generateMockCases() {
    const statuses = ['Open', 'In Progress', 'Closed', 'On Hold'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const matterTypes = ['Civil', 'Criminal', 'Corporate', 'Family', 'Immigration', 'Real Estate'];
    const clients = ['John Smith', 'ABC Corporation', 'Jane Doe', 'Tech Startup Inc.', 'Robert Johnson'];
    const attorneys = ['Sarah Miller', 'David Chen', 'Emily Rodriguez', 'Michael Brown'];

    return Array.from({ length: 12 }, (_, i) => ({
        caseNumber: `CASE-2024-${String(1000 + i).padStart(4, '0')}`,
        title: `Case ${i + 1}: ${matterTypes[i % matterTypes.length]} Matter`,
        clientName: clients[i % clients.length],
        matterType: matterTypes[i % matterTypes.length],
        priority: priorities[i % priorities.length],
        status: statuses[i % statuses.length],
        assignedTo: attorneys[i % attorneys.length],
        practiceArea: matterTypes[i % matterTypes.length],
        description: 'This is a sample case description for demonstration purposes.',
        openedDate: new Date(2024, 0, 1 + i * 7).toISOString(),
        tags: ['sample', 'demo']
    }));
}

// Make openCaseDetail available globally
window.openCaseDetail = openCaseDetail;
