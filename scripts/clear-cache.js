#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), '.cache');

function clearCache() {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      let cleared = 0;
      
      files.forEach(file => {
        const filePath = path.join(CACHE_DIR, file);
        fs.unlinkSync(filePath);
        cleared++;
      });
      
      console.log(`✅ Cleared ${cleared} cache files`);
      
      // Also clear Next.js cache
      const nextCache = path.join(process.cwd(), '.next', 'cache');
      if (fs.existsSync(nextCache)) {
        fs.rmSync(nextCache, { recursive: true, force: true });
        console.log('✅ Cleared Next.js cache');
      }
    } else {
      console.log('ℹ️  No cache directory found');
    }
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  clearCache();
}