const fs = require('fs');
const op = require('object-path');

require.extensions['.md'] = function(module, filename) {
    try {
        module.exports = fs.readFileSync(filename, 'utf8');
    } catch (error) {
        console.error(`Error importing md file ${filename}`);
    }
};

ReactiumBoot.Prefs = {
    clear: () => {},
    get: params => op.get({}, ...params),
    set: () => {},
};
