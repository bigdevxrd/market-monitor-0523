#!/usr/bin/env node

/**
 * Market Monitor Code Cleanup Tool
 * Automated parallel agent for fixing TypeScript, ESLint and React errors
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class CodeCleanupAgent {
  constructor(projectRoot = '/users/daicameron/Dev/market-monitor') {
    this.projectRoot = projectRoot;
    this.errors = [];
    this.fixes = [];
  }

  // Agent 1: Fix React escape character errors
  async fixReactEscapeErrors() {
    console.log('🔧 Agent 1: Fixing React escape character errors...');
    
    const patterns = [
      { from: /We couldn't/g, to: 'We couldn&apos;t' },
      { from: /don't/g, to: 'don&apos;t' },
      { from: /won't/g, to: 'won&apos;t' },
      { from: /can't/g, to: 'can&apos;t' },
      { from: /shouldn't/g, to: 'shouldn&apos;t' },
      { from: /wouldn't/g, to: 'wouldn&apos;t' },
      { from: /hasn't/g, to: 'hasn&apos;t' },
      { from: /haven't/g, to: 'haven&apos;t' },
      { from: /isn't/g, to: 'isn&apos;t' },
      { from: /aren't/g, to: 'aren&apos;t' },
      { from: /"([^"]*?)"/g, to: '&quot;$1&quot;' }, // Fix quotes within JSX
    ];

    const files = glob.sync(`${this.projectRoot}/src/**/*.{tsx,jsx}`, { absolute: true });
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      patterns.forEach(pattern => {
        if (pattern.from.test(content)) {
          content = content.replace(pattern.from, pattern.to);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, content);
        this.fixes.push(`Fixed escape characters in ${path.relative(this.projectRoot, file)}`);
      }
    }
  }

  // Agent 2: Fix TypeScript any types
  async fixTypeScriptAnyTypes() {
    console.log('🔧 Agent 2: Fixing TypeScript any types...');
    
    const typeReplacements = [
      { from: /: any\b/g, to: ': unknown' },
      { from: /any\[\]/g, to: 'unknown[]' },
      { from: /Promise<any>/g, to: 'Promise<unknown>' },
      { from: /Record<string, any>/g, to: 'Record<string, unknown>' },
    ];

    const files = glob.sync(`${this.projectRoot}/src/**/*.{ts,tsx}`, { absolute: true });
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      typeReplacements.forEach(replacement => {
        if (replacement.from.test(content)) {
          content = content.replace(replacement.from, replacement.to);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, content);
        this.fixes.push(`Fixed any types in ${path.relative(this.projectRoot, file)}`);
      }
    }
  }

  // Agent 3: Fix unused variables
  async fixUnusedVariables() {
    console.log('🔧 Agent 3: Fixing unused variables...');
    
    const files = glob.sync(`${this.projectRoot}/src/**/*.{ts,tsx}`, { absolute: true });
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Remove unused imports
      const importRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"][^'"]+['"];?/g;
      content = content.replace(importRegex, (match, imports) => {
        const importList = imports.split(',').map(imp => imp.trim());
        const usedImports = importList.filter(imp => {
          const regex = new RegExp(`\\b${imp.replace(/\s+as\s+\w+/, '')}\\b`, 'g');
          const matches = content.match(regex);
          return matches && matches.length > 1; // More than just the import
        });
        
        if (usedImports.length === 0) {
          modified = true;
          return '';
        } else if (usedImports.length < importList.length) {
          modified = true;
          return match.replace(imports, usedImports.join(', '));
        }
        return match;
      });
      
      if (modified) {
        fs.writeFileSync(file, content);
        this.fixes.push(`Removed unused imports in ${path.relative(this.projectRoot, file)}`);
      }
    }
  }

  // Agent 4: Fix prefer-const errors
  async fixPreferConstErrors() {
    console.log('🔧 Agent 4: Fixing prefer-const errors...');
    
    const files = glob.sync(`${this.projectRoot}/src/**/*.{ts,tsx}`, { absolute: true });
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      // Find let declarations that are never reassigned
      const letRegex = /let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g;
      let match;
      
      while ((match = letRegex.exec(content)) !== null) {
        const varName = match[1];
        const reassignRegex = new RegExp(`\\b${varName}\\s*=(?!=)`, 'g');
        const assignments = content.match(reassignRegex);
        
        if (!assignments || assignments.length === 1) {
          content = content.replace(`let ${varName}`, `const ${varName}`);
          modified = true;
        }
      }