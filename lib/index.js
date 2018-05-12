const fs = require('fs');
const util = require('util');
const {
    isEmpty,
    get,
} = require('./fp');

const readFileAsync = util.promisify(fs.readFile);

const DEPS = {
    devDependencies: '--save-dev',
    dependencies: '--save',
};

async function readJSONFile (filepath) {
    const contents = await readFileAsync(filepath, 'utf8');
    return JSON.parse(contents);
}

function updateToLatestCommandsFromPackageJSON (packageJSON) {
    if (isEmpty(packageJSON)) {
        return [];
    }
    const commands = Object.keys(DEPS)
        .map(key => {
            const prefix = DEPS[key];
            const depStr = Object.keys(get([key], packageJSON) || {})
                .map(d => `${d}@latest`)
                .join(' ');
            if (!isEmpty(depStr)) {
                return { command: `npm install ${prefix} ${depStr}`, type: key };
            }
            return null;
        })
        .filter(x => !isEmpty(x));
    return commands;
}

module.exports = {
    readJSONFile,
    updateToLatestCommandsFromPackageJSON,
};
