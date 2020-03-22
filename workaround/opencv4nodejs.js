const promisify = require('../node_modules/opencv4nodejs/lib/promisify');
const extendWithJsSources = require('../node_modules/opencv4nodejs/lib/src');
const path = require('path');

const opencvBinDir = `C:\\tools\\opencv\\build\\x64\\vc15\\bin`
process.env.path = `${process.env.path};${opencvBinDir};${path.dirname(process.execPath)}`
let cv = require('../node_modules/opencv4nodejs/build/Release/opencv4nodejs.node')

// promisify async methods
cv = promisify(cv);
cv = extendWithJsSources(cv);

module.exports = cv;
