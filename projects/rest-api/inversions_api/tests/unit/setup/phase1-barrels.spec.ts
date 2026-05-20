/**
 * Smoke Tests for Setup Phase (T187, T188)
 * Validates that barrels export correctly and routes are registered.
 * 
 * @test Phase 1 (Setup)
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Phase 1: Setup - Barrels and Route Registration', () => {
  const projectRoot = path.resolve(__dirname, '../../../');

  describe('T187: Institutional Module Barrel', () => {
    it('should have created institutional barrel file', () => {
      const barrelPath = path.join(projectRoot, 'src/modules/institutional/index.ts');
      expect(fs.existsSync(barrelPath)).toBe(true);
    });

    it('institutional barrel should export module metadata', () => {
      const barrelPath = path.join(projectRoot, 'src/modules/institutional/index.ts');
      const content = fs.readFileSync(barrelPath, 'utf-8');
      expect(content).toContain('institutionalModule');
      expect(content).toContain('name: \'institutional\'');
      expect(content).toContain('version: \'0.1.0\'');
    });
  });

  describe('T187: Coverage Module Barrel', () => {
    it('should have created coverage barrel file', () => {
      const barrelPath = path.join(projectRoot, 'src/modules/strategies/coverage/index.ts');
      expect(fs.existsSync(barrelPath)).toBe(true);
    });

    it('coverage barrel should export module metadata', () => {
      const barrelPath = path.join(projectRoot, 'src/modules/strategies/coverage/index.ts');
      const content = fs.readFileSync(barrelPath, 'utf-8');
      expect(content).toContain('coverageModule');
      expect(content).toContain('name: \'coverage\'');
      expect(content).toContain('version: \'0.1.0\'');
    });
  });

  describe('T188: Institutional Routes File', () => {
    it('should have created institutional router file', () => {
      const routerPath = path.join(projectRoot, 'src/routes/institutional/index.ts');
      expect(fs.existsSync(routerPath)).toBe(true);
    });

    it('institutional router should define placeholder endpoints', () => {
      const routerPath = path.join(projectRoot, 'src/routes/institutional/index.ts');
      const content = fs.readFileSync(routerPath, 'utf-8');
      expect(content).toContain('router.get(\'/analysis\'');
      expect(content).toContain('router.get(\'/regulatory-positions\'');
      expect(content).toContain('router.get(\'/provenance\'');
      expect(content).toContain('501');
    });
  });

  describe('T188: Coverage Routes File', () => {
    it('should have created coverage router file', () => {
      const routerPath = path.join(projectRoot, 'src/routes/strategies/coverage/index.ts');
      expect(fs.existsSync(routerPath)).toBe(true);
    });

    it('coverage router should define placeholder endpoints', () => {
      const routerPath = path.join(projectRoot, 'src/routes/strategies/coverage/index.ts');
      const content = fs.readFileSync(routerPath, 'utf-8');
      expect(content).toContain("router.get('/'");
      expect(content).toContain("router.post('/'");
      expect(content).toContain("router.get('/:id'");
      expect(content).toContain('501');
    });
  });

  describe('T188: Main App Route Registration', () => {
    it('should have registered institutional router in main app', () => {
      const indexPath = path.join(projectRoot, 'src/index.ts');
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('import { institutionalRouter }');
      expect(content).toContain('app.use("/api/institutional", institutionalRouter)');
    });

    it('should have registered coverage router in main app', () => {
      const indexPath = path.join(projectRoot, 'src/index.ts');
      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain('import { coverageRouter }');
      expect(content).toContain('app.use("/api/strategies/coverage", coverageRouter)');
    });
  });
});

