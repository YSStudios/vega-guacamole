#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.cwd(), '.cache');

function clearInstagramCache() {
  try {
    const instagramCacheFiles = ['instagram.json', 'instagram-v2.json'];
    let cleared = 0;
    
    instagramCacheFiles.forEach(file => {
      const filePath = path.join(CACHE_DIR, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        cleared++;
        console.log(`✅ Cleared cache: ${file}`);
      }
    });
    
    if (cleared === 0) {
      console.log('ℹ️  No Instagram cache files found');
    } else {
      console.log(`✅ Cleared ${cleared} Instagram cache files`);
    }
    
    console.log('🔄 Restart your dev server to see changes');
  } catch (error) {
    console.error('❌ Error clearing Instagram cache:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  clearInstagramCache();
}

module.exports = clearInstagramCache;