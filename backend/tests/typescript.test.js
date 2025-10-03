/**
 * TypeScript Implementation Verification Tests
 * Tests that verify TypeScript is properly configured and working
 * Updated for enterprise-grade React + TypeScript with Vite
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

    test('should have TypeScript build and lint scripts', () => {
      const packagePath = path.join(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('build:react');
      expect(packageJson.scripts).toHaveProperty('lint:frontend');
    });

    test('should have Vite configuration', () => {
      const vitePath = path.join(__dirname, '../../vite.config.ts');
      expect(fs.existsSync(vitePath)).toBe(true);
      
      const content = fs.readFileSync(vitePath, 'utf8');
      expect(content).toContain('vite');
      expect(content).toContain('react');
    });

    test('should have frontend tsconfig', () => {
      const tsconfigPath = path.join(__dirname, '../../frontend/tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });
  });

  describe('Frontend Source Structure', () => {
    test('should have frontend/src directory', () => {
      const srcDir = path.join(__dirname, '../../frontend/src');
      expect(fs.existsSync(srcDir)).toBe(true);
      expect(fs.statSync(srcDir).isDirectory()).toBe(true);
    });

    test('should have app directory', () => {
      const appDir = path.join(__dirname, '../../frontend/src/app');
      expect(fs.existsSync(appDir)).toBe(true);
      expect(fs.statSync(appDir).isDirectory()).toBe(true);
    });

    test('should have features directory', () => {
      const featuresDir = path.join(__dirname, '../../frontend/src/features');
      expect(fs.existsSync(featuresDir)).toBe(true);
      expect(fs.statSync(featuresDir).isDirectory()).toBe(true);
    });

    test('should have shared directory', () => {
      const sharedDir = path.join(__dirname, '../../frontend/src/shared');
      expect(fs.existsSync(sharedDir)).toBe(true);
      expect(fs.statSync(sharedDir).isDirectory()).toBe(true);
    });
  });

  describe('Core TypeScript Files', () => {
    test('should have App.tsx', () => {
      const appPath = path.join(__dirname, '../../frontend/src/app/App.tsx');
      expect(fs.existsSync(appPath)).toBe(true);
      
      const content = fs.readFileSync(appPath, 'utf8');
      expect(content).toContain('import React from');
      expect(content).toContain('Router');
    });

    test('should have main.tsx', () => {
      const mainPath = path.join(__dirname, '../../frontend/src/app/main.tsx');
      expect(fs.existsSync(mainPath)).toBe(true);
      
      const content = fs.readFileSync(mainPath, 'utf8');
      expect(content).toContain('ReactDOM');
    });

    test('should have shared types', () => {
      const typesPath = path.join(__dirname, '../../frontend/src/shared/types/index.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
      
      const content = fs.readFileSync(typesPath, 'utf8');
      expect(content).toContain('export interface');
    });

    test('should have API client', () => {
      const apiPath = path.join(__dirname, '../../frontend/src/shared/api/client.ts');
      expect(fs.existsSync(apiPath)).toBe(true);
      
      const content = fs.readFileSync(apiPath, 'utf8');
      expect(content).toContain('export');
      expect(content).toContain('api');
    });

    test('should have vite-env type definitions', () => {
      const envPath = path.join(__dirname, '../../frontend/src/vite-env.d.ts');
      expect(fs.existsSync(envPath)).toBe(true);
      
      const content = fs.readFileSync(envPath, 'utf8');
      expect(content).toContain('ImportMeta');
    });
  });

  describe('TypeScript Features', () => {
    test('should have feature pages', () => {
      const featuresDir = path.join(__dirname, '../../frontend/src/features');
      const features = fs.readdirSync(featuresDir);
      
      // Should have multiple features
      expect(features.length).toBeGreaterThan(10);
      
      // Each feature should have at least one .tsx file
      features.forEach(feature => {
        const featurePath = path.join(featuresDir, feature);
        if (fs.statSync(featurePath).isDirectory()) {
          const files = fs.readdirSync(featurePath);
          const tsxFiles = files.filter(f => f.endsWith('.tsx'));
          expect(tsxFiles.length).toBeGreaterThan(0);
        }
      });
    });

    test('should have Layout component', () => {
      const layoutPath = path.join(__dirname, '../../frontend/src/shared/components/Layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);
      
      const content = fs.readFileSync(layoutPath, 'utf8');
      expect(content).toContain('React.FC');
      expect(content).toContain('Outlet');
    });
  });

  describe('Documentation', () => {
    test('should have frontend README', () => {
      const readmePath = path.join(__dirname, '../../frontend/README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
      
      const content = fs.readFileSync(readmePath, 'utf8');
      expect(content).toContain('Frontend');
      expect(content).toContain('Architecture');
    });

    test('should have enterprise architecture documentation', () => {
      const archPath = path.join(__dirname, '../../ENTERPRISE_ARCHITECTURE.md');
      expect(fs.existsSync(archPath)).toBe(true);
      
      const content = fs.readFileSync(archPath, 'utf8');
      expect(content).toContain('Enterprise');
      expect(content).toContain('Google');
    });
  });
});
