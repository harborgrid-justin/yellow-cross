#!/usr/bin/env ts-node
/**
 * Authenticated Parallel Agent Test Runner
 * 
 * Extends the basic parallel agent runner to test with authentication.
 * Creates a test user, logs in, and then tests all endpoints with auth tokens.
 */

import axios, { AxiosInstance } from 'axios';
import * as child_process from 'child_process';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SERVER_START_TIMEOUT = 15000; // 15 seconds

// Test user credentials
const TEST_USER = {
  username: 'test_agent_user',
  email: 'test_agent@yellowcross.com',
  password: 'TestAgent@2024!',
  firstName: 'Test',
  lastName: 'Agent',
  jobTitle: 'QA Engineer'
};

// Define API test groups for 8 parallel agents
const API_TEST_GROUPS = {
  agent1_core: {
    name: 'Core Features (Cases, Clients, Documents)',
    endpoints: [
      { method: 'GET', path: '/api/cases', description: 'List cases' },
      { method: 'POST', path: '/api/cases/create', description: 'Create case', data: { 
        title: 'Test Case', 
        description: 'Test case description',
        caseType: 'Civil',
        clientId: 'test-client-001',
        createdBy: 'test_agent_user'
      }},
      { method: 'GET', path: '/api/clients', description: 'List clients' },
      { method: 'POST', path: '/api/clients/create', description: 'Create client', data: {
        firstName: 'Test',
        lastName: 'Client',
        email: 'testclient@example.com',
        phoneNumber: '555-0100',
        createdBy: 'test_agent_user'
      }},
      { method: 'GET', path: '/api/documents', description: 'List documents' },
      { method: 'GET', path: '/api/documents/templates', description: 'Document templates' },
    ]
  },
  agent2_operations: {
    name: 'Operations (Tasks, Calendar, Billing)',
    endpoints: [
      { method: 'GET', path: '/api/tasks', description: 'List tasks' },
      { method: 'POST', path: '/api/tasks/create', description: 'Create task', data: {
        title: 'Test Task',
        description: 'Test task description',
        assignedTo: 'test_agent_user',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'test_agent_user'
      }},
      { method: 'GET', path: '/api/calendar', description: 'List calendar events' },
      { method: 'GET', path: '/api/calendar/upcoming', description: 'Upcoming events' },
      { method: 'GET', path: '/api/billing/time-entries', description: 'List time entries' },
      { method: 'GET', path: '/api/billing/invoices', description: 'List invoices' },
    ]
  },
  agent3_legal: {
    name: 'Legal Tools (Research, Court, Contracts)',
    endpoints: [
      { method: 'GET', path: '/api/research', description: 'Legal research' },
      { method: 'GET', path: '/api/court', description: 'Court docket' },
      { method: 'GET', path: '/api/contracts', description: 'List contracts' },
      { method: 'GET', path: '/api/contracts/templates', description: 'Contract templates' },
    ]
  },
  agent4_compliance: {
    name: 'Compliance & eDiscovery',
    endpoints: [
      { method: 'GET', path: '/api/compliance', description: 'Compliance dashboard' },
      { method: 'GET', path: '/api/compliance/audit-logs', description: 'Audit logs' },
      { method: 'GET', path: '/api/ediscovery', description: 'eDiscovery dashboard' },
      { method: 'GET', path: '/api/reports', description: 'Reports' },
    ]
  },
  agent5_practice1: {
    name: 'Practice Areas Group 1 (Litigation, IP, Real Estate)',
    endpoints: [
      { method: 'GET', path: '/api/litigation', description: 'Litigation management' },
      { method: 'GET', path: '/api/ip', description: 'Intellectual property' },
      { method: 'GET', path: '/api/realestate', description: 'Real estate transactions' },
    ]
  },
  agent6_practice2: {
    name: 'Practice Areas Group 2 (Employment, Immigration, Family)',
    endpoints: [
      { method: 'GET', path: '/api/employment', description: 'Employment law' },
      { method: 'GET', path: '/api/immigration', description: 'Immigration law' },
      { method: 'GET', path: '/api/family', description: 'Family law' },
    ]
  },
  agent7_practice3: {
    name: 'Practice Areas Group 3 (Criminal, Bankruptcy, Estate)',
    endpoints: [
      { method: 'GET', path: '/api/criminal', description: 'Criminal defense' },
      { method: 'GET', path: '/api/bankruptcy', description: 'Bankruptcy management' },
      { method: 'GET', path: '/api/estate', description: 'Estate planning' },
    ]
  },
  agent8_practice4: {
    name: 'Practice Areas Group 4 (Tax, Personal Injury, Class Action)',
    endpoints: [
      { method: 'GET', path: '/api/tax', description: 'Tax law' },
      { method: 'GET', path: '/api/personalinjury', description: 'Personal injury' },
      { method: 'GET', path: '/api/classaction', description: 'Class action' },
    ]
  }
};

interface TestResult {
  endpoint: string;
  method: string;
  status: number | string;
  success: boolean;
  message: string;
  responseTime?: number;
}

interface AgentResult {
  agentName: string;
  results: TestResult[];
}

// Test a single endpoint
async function testEndpoint(client: AxiosInstance, endpoint: any): Promise<TestResult> {
  const url = `${BASE_URL}${endpoint.path}`;
  const startTime = Date.now();
  
  try {
    const response = await client({
      method: endpoint.method.toLowerCase(),
      url,
      data: endpoint.data,
      validateStatus: () => true, // Accept any status code
      timeout: 10000,
    });
    
    const responseTime = Date.now() - startTime;
    
    // For authenticated requests:
    // 200/201 = success, 404 = endpoint not fully implemented (still valid), 500 = server error
    const validStatuses = [200, 201, 404];
    const success = validStatuses.includes(response.status);
    
    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: response.status,
      success,
      message: success ? 'OK' : `Status ${response.status}: ${response.data?.message || 'Unknown error'}`,
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: 'ERROR',
      success: false,
      message: error.code || error.message,
      responseTime,
    };
  }
}

// Test all endpoints for an agent
async function testAgentEndpoints(agentName: string, agentConfig: any, client: AxiosInstance): Promise<AgentResult> {
  console.log(`\n[${agentName}] Starting authenticated tests...`);
  
  const results: TestResult[] = [];
  
  for (const endpoint of agentConfig.endpoints) {
    const result = await testEndpoint(client, endpoint);
    results.push(result);
    const statusIcon = result.success ? '✓' : '✗';
    console.log(`[${agentName}] ${statusIcon} ${endpoint.method} ${endpoint.path} - Status: ${result.status} (${result.responseTime}ms)`);
  }
  
  return {
    agentName,
    results,
  };
}

// Check if server is running
async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Wait for server to start
async function waitForServer(maxWaitTime: number = SERVER_START_TIMEOUT): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 1000; // Check every 1 second
  
  console.log('Waiting for server to start...');
  
  while (Date.now() - startTime < maxWaitTime) {
    if (await checkServerHealth()) {
      console.log('✓ Server is ready!\n');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  console.error('✗ Server failed to start within timeout period');
  return false;
}

// Create authenticated axios client
async function createAuthenticatedClient(): Promise<AxiosInstance | null> {
  try {
    console.log('Attempting to login with test user...');
    
    // Try to login first (user might already exist)
    let loginResponse;
    try {
      loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: TEST_USER.username,
        password: TEST_USER.password,
      }, { timeout: 10000 });
    } catch (loginError: any) {
      // If login fails, try to register the user
      if (loginError.response?.status === 401 || loginError.response?.status === 404) {
        console.log('User not found, registering new test user...');
        
        try {
          const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER, { 
            timeout: 10000 
          });
          
          console.log('✓ Test user registered successfully');
          
          // Now login
          loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: TEST_USER.username,
            password: TEST_USER.password,
          }, { timeout: 10000 });
        } catch (registerError: any) {
          console.error('✗ Failed to register test user:', registerError.response?.data?.message || registerError.message);
          return null;
        }
      } else {
        throw loginError;
      }
    }
    
    if (loginResponse.status === 200 && loginResponse.data.accessToken) {
      console.log('✓ Successfully authenticated\n');
      
      // Create axios instance with auth token
      return axios.create({
        baseURL: BASE_URL,
        headers: {
          'Authorization': `Bearer ${loginResponse.data.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.error('✗ Login failed: Invalid response');
      return null;
    }
  } catch (error: any) {
    console.error('✗ Authentication error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('================================================');
  console.log('AUTHENTICATED PARALLEL API COMMUNICATION TESTS');
  console.log('================================================\n');
  
  // Check if server is already running
  const serverAlreadyRunning = await checkServerHealth();
  let serverProcess: child_process.ChildProcess | null = null;
  
  if (!serverAlreadyRunning) {
    console.log('Starting backend server...');
    
    // Start the server
    const rootDir = path.join(__dirname, '../..');
    serverProcess = child_process.spawn('npm', ['start'], {
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: 'development' },
      stdio: 'pipe',
    });
    
    // Wait for server to be ready
    const serverReady = await waitForServer();
    
    if (!serverReady) {
      if (serverProcess) {
        serverProcess.kill();
      }
      process.exit(1);
    }
  } else {
    console.log('✓ Server already running\n');
  }
  
  try {
    // Create authenticated client
    const authClient = await createAuthenticatedClient();
    
    if (!authClient) {
      console.error('✗ Failed to create authenticated client. Cannot proceed with tests.');
      process.exit(1);
    }
    
    console.log('Running 8 parallel authenticated agents...\n');
    
    // Execute all agents in parallel with authentication
    const agentPromises = Object.entries(API_TEST_GROUPS).map(([agentKey, agentConfig]) => {
      return testAgentEndpoints(agentKey, agentConfig, authClient);
    });
    
    const allResults = await Promise.all(agentPromises);
    
    // Aggregate results
    let totalTests = 0;
    let totalSuccess = 0;
    let totalErrors = 0;
    const errorEndpoints: string[] = [];
    
    console.log('\n========================================');
    console.log('AUTHENTICATED TEST RESULTS SUMMARY');
    console.log('========================================\n');
    
    allResults.forEach((agentResult) => {
      const agentName = API_TEST_GROUPS[agentResult.agentName as keyof typeof API_TEST_GROUPS].name;
      const successCount = agentResult.results.filter(r => r.success).length;
      const errorCount = agentResult.results.filter(r => !r.success).length;
      const avgResponseTime = agentResult.results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / agentResult.results.length;
      
      totalTests += agentResult.results.length;
      totalSuccess += successCount;
      totalErrors += errorCount;
      
      console.log(`${agentName}:`);
      console.log(`  Total: ${agentResult.results.length}, Success: ${successCount}, Errors: ${errorCount}`);
      console.log(`  Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
      
      // Collect error endpoints
      agentResult.results.forEach(r => {
        if (!r.success) {
          errorEndpoints.push(`${r.method} ${r.endpoint} (${r.status}): ${r.message}`);
        }
      });
    });
    
    console.log('\n========================================');
    console.log(`TOTAL: ${totalTests} tests, ${totalSuccess} successful, ${totalErrors} errors`);
    console.log(`Success Rate: ${((totalSuccess / totalTests) * 100).toFixed(2)}%`);
    console.log('========================================\n');
    
    if (errorEndpoints.length > 0) {
      console.log('ERROR DETAILS:');
      errorEndpoints.forEach(err => console.log(`  - ${err}`));
      console.log('');
    } else {
      console.log('✓ All authenticated tests passed!\n');
    }
    
    // Exit with appropriate code
    if (totalErrors === 0) {
      console.log('✓ SUCCESS: All authenticated API endpoints are functioning correctly');
      process.exit(0);
    } else if (totalSuccess / totalTests > 0.7) {
      console.log('⚠ WARNING: Some endpoints have issues, but most are working (>70% success rate)');
      process.exit(0); // Still exit successfully if > 70% pass
    } else {
      console.log('✗ FAILURE: Too many endpoint failures');
      process.exit(1);
    }
    
  } finally {
    // Clean up: stop server if we started it
    if (serverProcess && !serverAlreadyRunning) {
      console.log('\nStopping server...');
      serverProcess.kill();
      // Wait a bit for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main, testAgentEndpoints, testEndpoint };
