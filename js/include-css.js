const fs = require('fs');
const { rootPath } = require('electron-root-path');
const path = require('path');
const NPM_PACKAGE_FOLDER = 'node_modules';
const PACKAGE_FILE_NAME = 'package.json';

function includeCSS(packageName) {
    if (!fs.existsSync(NPM_PACKAGE_FOLDER)) {
        throw new ReferenceError('node-modules folder not loaded');
    }
    const packagePath = `${NPM_PACKAGE_FOLDER}/${packageName}`;
    if (!fs.existsSync(packagePath)) {
        throw new ReferenceError(`package ${packageName} not recognised`);
    }
    const packageFilePath = `${packagePath}/${PACKAGE_FILE_NAME}`;
    if (!fs.existsSync(packageFilePath)) {
        throw new ReferenceError(`No packege file included (${packageName}/${PACKAGE_FILE_NAME})`);
    }
    const packegeMain = JSON.parse(fs.readFileSync(packageFilePath, 'utf8')).main;
    const mainCssFile = path.join(rootPath, packagePath, packegeMain);
    const cssDom = getCssDomIncluder(mainCssFile);
    document.head.innerHTML = cssDom.outerHTML + document.head.innerHTML;
}

function getCssDomIncluder(cssPath) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const dom = document.createElement('style');
    dom.innerHTML = cssContent;
    
    return dom;
}

module.exports = includeCSS;