const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '[locale]');
const searchString = 'colors: sParams.color ? (sParams.color as string).split(",") : undefined,';

function searchAndReplace(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            searchAndReplace(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchString)) {
                content = content.replace(searchString, '');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Replaced in ${fullPath}`);
            }
        }
    });
}

searchAndReplace(directoryPath);
console.log("Color parameter cleanup complete.");
