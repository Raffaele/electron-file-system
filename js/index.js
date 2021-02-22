const fs = require('fs');
const path = require('path');
const includeCSS = require('./include-css');
includeCSS('bootstrap-css-only');

let actualPath;

function init() {
    actualPath = '/';
    buildUI();
}

init();

function updatePath(movement) {
    const oldPath = actualPath;
    actualPath = path.join(actualPath, movement);
    try {
        buildUI();
    } catch (ex) {
        if (ex.code === 'EACCES') {
            actualPath = oldPath;
        }
        throw ex;
    }
    
    console.log('dopo');
}

function buildUI() {
    const dirItems = fs.readdirSync(actualPath);
    console.log(actualPath, {dirItems});
    const folderContentList = document.getElementById('folder-content-list');
    const fileContentDom = document.getElementById('file-content');
    document.getElementById('complete-path').innerHTML = actualPath;
    folderContentList.innerHTML = '';
    
    if (actualPath !== '/') {
        dirItems.unshift('..');
    }
    const links = dirItems.map(itemName => {
        const link = document.createElement('a');
        link.href="javascript:void(0)";
        const itemPath = path.join(actualPath, itemName);
        const isItemADir = fs.lstatSync(itemPath).isDirectory();
        const itemTypeLabel = isItemADir ? 'DIR' : 'FILE';
        link.innerHTML = `[${itemTypeLabel}] ${itemName}`;
        link.addEventListener('click', () => {
            try {
                if (isItemADir) {
                    updatePath(itemName);
                    fileContentDom.innerHTML = '';
                } else {
                    const fileContent = fs.readFileSync(itemPath, 'utf8');
                    fileContentDom.innerHTML = fileContent;
                    [...document.querySelectorAll('.link-sub-element')].forEach(el => {
                        el.classList.remove('selected');
                    });
                    link.classList.add('selected');
                }
            } catch (ex) {
                if (ex.code === 'EACCES') {
                    alert('permission denied');
                    return;
                }
                throw ex;
            }
            
        });
        link.classList.add('link-sub-element');
        return link;
    });
    links.forEach(domLink => {
        folderContentList.appendChild(domLink);
    });
}
