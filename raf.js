// polyfill for requestAnimationFrame and cancelAnimationFrame in test environment
module.exports = require('raf').polyfill();
