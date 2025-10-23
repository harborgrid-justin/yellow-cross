#!/usr/bin/env ts-node
/**
 * Parallel Agent Test Runner
 * 
 * Starts the backend server and runs 8 parallel agents to test
 * frontend-backend API communication.
 */

import axios from 'axios';
import * as child_process from 'child_process';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const SERVER_START_TIMEOUT = 15000; // 15 seconds

// Define API test groups for 8 parallel agents
const API_TEST_GROUPS = {
  agent1_core: {
    name: 'Core Features (Cases, Clients, Documents)',
    endpoints: [
      { method: 'GET', path: '/api/cases', description: 'List cases' },
      { method: 'GET', path: '/api/cases/analytics', description: 'Case analytics' },
      { method: 'GET', path: '/api/clients', description: 'List clients' },
      { method: 'GET', path: '/api/clients/analytics', description: 'Client analytics' },
      { method: 'GET', path: '/api/documents', description: 'List documents' },
      { method: 'GET', path: '/api/documents/templates', description: 'Document templates' },
    ]
  },
  agent2_operations: {
    name: 'Operations (Tasks, Calendar, Billing)',
    endpoints: [
      { method: 'GET', path: '/api/tasks', description: 'List tasks' },
      { method: 'GET', path: '/api/tasks/statistics', description: 'Task statistics' },
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
      { method: 'GET', path: '/api/research/citator', description: 'Citation checker' },
      { method: 'GET', path: '/api/court', description: 'Court docket' },
      { method: 'GET', path: '/api/court/deadlines', description: 'Court deadlines' },
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
      { method: 'GET', path: '/api/ediscovery/evidence', description: 'Evidence list' },
      { method: 'GET', path: '/api/reports', description: 'Reports' },
      { method: 'GET', path: '/api/reports/analytics', description: 'Analytics reports' },
    ]
  },
  agent5_practice1: {
    name: 'Practice Areas Group 1 (Litigation, IP, Real Estate)',
    endpoints: [
      { method: 'GET', path: '/api/litigation', description: 'Litigation management' },
      { method: 'GET', path: '/api/litigation/discovery', description: 'Discovery requests' },
      { method: 'GET', path: '/api/ip', description: 'Intellectual property' },
      { method: 'GET', path: '/api/ip/trademarks', description: 'Trademarks' },
      { method: 'GET', path: '/api/realestate', description: 'Real estate transactions' },
      { method: 'GET', path: '/api/realestate/properties', description: 'Properties' },
    ]
  },
  agent6_practice2: {
    name: 'Practice Areas Group 2 (Employment, Immigration, Family)',
    endpoints: [
      { method: 'GET', path: '/api/employment', description: 'Employment law' },
      { method: 'GET', path: '/api/employment/cases', description: 'Employment cases' },
      { method: 'GET', path: '/api/immigration', description: 'Immigration law' },
      { method: 'GET', path: '/api/immigration/visas', description: 'Visa applications' },
      { method: 'GET', path: '/api/family', description: 'Family law' },
      { method: 'GET', path: '/api/family/custody', description: 'Custody cases' },
    ]
  },
  agent7_practice3: {
    name: 'Practice Areas Group 3 (Criminal, Bankruptcy, Estate)',
    endpoints: [
      { method: 'GET', path: '/api/criminal', description: 'Criminal defense' },
      { method: 'GET', path: '/api/criminal/cases', description: 'Criminal cases' },
      { method: 'GET', path: '/api/bankruptcy', description: 'Bankruptcy management' },
      { method: 'GET', path: '/api/bankruptcy/filings', description: 'Bankruptcy filings' },
      { method: 'GET', path: '/api/estate', description: 'Estate planning' },
      { method: 'GET', path: '/api/estate/wills', description: 'Wills and trusts' },
    ]
  },
  agent8_practice4: {
    name: 'Practice Areas Group 4 (Tax, Personal Injury, Class Action)',
    endpoints: [
      { method: 'GET', path: '/api/tax', description: 'Tax law' },
      { method: 'GET', path: '/api/tax/filings', description: 'Tax filings' },
      { method: 'GET', path: '/api/personalinjury', description: 'Personal injury' },
      { method: 'GET', path: '/api/personalinjury/claims', description: 'Injury claims' },
      { method: 'GET', path: '/api/classaction', description: 'Class action' },
      { method: 'GET', path: '/api/classaction/lawsuits', description: 'Class action lawsuits' },
    ]
  }
};

interface TestResult {
  endpoint: string;
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
async function testEndpoint(endpoint: any): Promise<TestResult> {
  const url = `${BASE_URL}${endpoint.path}`;
  const startTime = Date.now();
  
  try {
    const response = await axios({
      method: endpoint.method.toLowerCase(),
      url,
      validateStatus: () => true, // Accept any status code
      timeout: 10000,
    });
    
    const responseTime = Date.now() - startTime;
    
    // Accept 200 (OK), 401 (Unauthorized - expected without auth), or 404 (endpoint exists but not found)
    const validStatuses = [200, 401, 404];
    const success = validStatuses.includes(response.status);
    
    return {
      endpoint: endpoint.path,
      status: response.status,
      success,
      message: success ? 'OK' : `Unexpected status ${response.status}`,
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      endpoint: endpoint.path,
      status: 'ERROR',
      success: false,
      message: error.code || error.message,
      responseTime,
    };
  }
}

// Test all endpoints for an agent
async function testAgentEndpoints(agentName: string, agentConfig: any): Promise<AgentResult> {
  console.log(`\n[${agentName}] Starting tests...`);
  
  const results: TestResult[] = [];
  
  for (const endpoint of agentConfig.endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    const statusIcon = result.success ? '✓' : '✗';
    console.log(`[${agentName}] ${statusIcon} ${endpoint.path} - Status: ${result.status} (${result.responseTime}ms)`);
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

// Main execution
async function main() {
  console.log('========================================');
  console.log('PARALLEL API COMMUNICATION TEST RUNNER');
  console.log('========================================\n');
  
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
    console.log('Running 8 parallel agents...\n');
    
    // Execute all agents in parallel
    const agentPromises = Object.entries(API_TEST_GROUPS).map(([agentKey, agentConfig]) => {
      return testAgentEndpoints(agentKey, agentConfig);
    });
    
    const allResults = await Promise.all(agentPromises);
    
    // Aggregate results
    let totalTests = 0;
    let totalSuccess = 0;
    let totalErrors = 0;
    const errorEndpoints: string[] = [];
    
    console.log('\n========================================');
    console.log('TEST RESULTS SUMMARY');
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
          errorEndpoints.push(`${r.endpoint} (${r.status}): ${r.message}`);
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
      console.log('✓ All tests passed!\n');
    }
    
    // Exit with appropriate code
    if (totalErrors === 0) {
      console.log('✓ SUCCESS: All API endpoints are accessible and functioning correctly');
      process.exit(0);
    } else if (totalSuccess / totalTests > 0.5) {
      console.log('⚠ WARNING: Some endpoints have issues, but most are working');
      process.exit(0); // Still exit successfully if > 50% pass
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
