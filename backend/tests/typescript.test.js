/**
 * TypeScript Implementation Verification Tests
 * Tests that verify TypeScript is properly configured and working
 */

const fs = require('fs');
const path = require('path');

describe('TypeScript Implementation', () => {
  
  describe('TypeScript Configuration', () => {
    test('should have tsconfig.json', () => {
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    test('should have valid TypeScript configuration', () => {
      const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      
      // Check for key configuration elements
      expect(tsconfigContent).toContain('"target": "ES2020"');
      expect(tsconfigContent).toContain('"strict": true');
      expect(tsconfigContent).toContain('"compilerOptions"');
    });

    test('should have TypeScript as dev dependency', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.devDependencies).toHaveProperty('typescript');
    });

    test('should have TypeScript build scripts', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('ts:build');
      expect(packageJson.scripts).toHaveProperty('ts:watch');
      expect(packageJson.scripts).toHaveProperty('build');
    });
  });

  describe('TypeScript Source Files', () => {
    test('should have frontend/ts directory', () => {
      const tsDir = path.join(__dirname, '../../frontend/ts');
      expect(fs.existsSync(tsDir)).toBe(true);
      expect(fs.statSync(tsDir).isDirectory()).toBe(true);
    });

    test('should have types.ts', () => {
      const typesPath = path.join(__dirname, '../../frontend/ts/types.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
    });

    test('should have app.ts', () => {
      const appPath = path.join(__dirname, '../../frontend/ts/app.ts');
      expect(fs.existsSync(appPath)).toBe(true);
      
      const content = fs.readFileSync(appPath, 'utf8');
      expect(content).toContain('import type {');
      expect(content).toContain('Feature,');
      expect(content).toContain('async function fetchAPI');
    });

    test('should have auth.ts', () => {
      const authPath = path.join(__dirname, '../../frontend/ts/auth.ts');
      expect(fs.existsSync(authPath)).toBe(true);
      
      const content = fs.readFileSync(authPath, 'utf8');
      expect(content).toContain('async function handleLogin');
      expect(content).toContain('async function handleRegister');
    });

    test('should have cases.ts', () => {
      const casesPath = path.join(__dirname, '../../frontend/ts/cases.ts');
      expect(fs.existsSync(casesPath)).toBe(true);
      
      const content = fs.readFileSync(casesPath, 'utf8');
      expect(content).toContain('import type {');
      expect(content).toContain('Case,');
      expect(content).toContain('CaseFilters');
      expect(content).toContain('async function loadCases');
    });
  });

  describe('Compiled JavaScript Files', () => {
    test('should have compiled app.js', () => {
      const appJsPath = path.join(__dirname, '../../frontend/js/app.js');
      expect(fs.existsSync(appJsPath)).toBe(true);
    });

    test('should have compiled auth.js', () => {
      const authJsPath = path.join(__dirname, '../../frontend/js/auth.js');
      expect(fs.existsSync(authJsPath)).toBe(true);
    });

    test('should have compiled cases.js', () => {
      const casesJsPath = path.join(__dirname, '../../frontend/js/cases.js');
      expect(fs.existsSync(casesJsPath)).toBe(true);
    });

    test('should have declaration files', () => {
      const appDtsPath = path.join(__dirname, '../../frontend/js/app.d.ts');
      const authDtsPath = path.join(__dirname, '../../frontend/js/auth.d.ts');
      const casesDtsPath = path.join(__dirname, '../../frontend/js/cases.d.ts');
      
      expect(fs.existsSync(appDtsPath)).toBe(true);
      expect(fs.existsSync(authDtsPath)).toBe(true);
      expect(fs.existsSync(casesDtsPath)).toBe(true);
    });

    test('should have source maps', () => {
      const appMapPath = path.join(__dirname, '../../frontend/js/app.js.map');
      const authMapPath = path.join(__dirname, '../../frontend/js/auth.js.map');
      const casesMapPath = path.join(__dirname, '../../frontend/js/cases.js.map');
      
      expect(fs.existsSync(appMapPath)).toBe(true);
      expect(fs.existsSync(authMapPath)).toBe(true);
      expect(fs.existsSync(casesMapPath)).toBe(true);
    });
  });

  describe('TypeScript Features', () => {
    test('should have type definitions', () => {
      const typesPath = path.join(__dirname, '../../frontend/ts/types.ts');
      const content = fs.readFileSync(typesPath, 'utf8');
      
      expect(content).toContain('export interface Feature');
      expect(content).toContain('export interface PlatformInfo');
      expect(content).toContain('export interface HealthStatus');
      expect(content).toContain('export type HTTPMethod');
      expect(content).toContain('export interface Case');
      expect(content).toContain('export interface CaseFilters');
      expect(content).toContain('export type CaseStatus');
      expect(content).toContain('export type CasePriority');
    });

    test('should have typed functions in app.ts', () => {
      const appPath = path.join(__dirname, '../../frontend/ts/app.ts');
      const content = fs.readFileSync(appPath, 'utf8');
      
      // Check for type annotations
      expect(content).toContain(': Promise<void>');
      expect(content).toContain(': HTMLElement');
      expect(content).toContain(': string');
      expect(content).toContain('async function');
    });

    test('should have typed event handlers in auth.ts', () => {
      const authPath = path.join(__dirname, '../../frontend/ts/auth.ts');
      const content = fs.readFileSync(authPath, 'utf8');
      
      // Check for type annotations
      expect(content).toContain('(e: Event)');
      expect(content).toContain(': Promise<void>');
      expect(content).toContain('AlertType');
    });

    test('should have typed case management in cases.ts', () => {
      const casesPath = path.join(__dirname, '../../frontend/ts/cases.ts');
      const content = fs.readFileSync(casesPath, 'utf8');
      
      // Check for type annotations
      expect(content).toContain('cases: Case[]');
      expect(content).toContain('filters: CaseFilters');
      expect(content).toContain(': Promise<void>');
      expect(content).toContain('function displayCases(casesToDisplay: Case[])');
      expect(content).toContain('function filterCases(casesToFilter: Case[])');
    });
  });

  describe('Documentation', () => {
    test('should have TypeScript implementation documentation', () => {
      const docPath = path.join(__dirname, '../../TYPESCRIPT_IMPLEMENTATION.md');
      expect(fs.existsSync(docPath)).toBe(true);
      
      const content = fs.readFileSync(docPath, 'utf8');
      expect(content).toContain('TypeScript Implementation');
      expect(content).toContain('100% complete');
    });
  });
});
