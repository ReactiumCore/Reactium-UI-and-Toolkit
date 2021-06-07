const SDK = {};
const cwd = process.cwd();
const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');
const camelcase = require('camelcase');
const prettier = require('prettier/standalone');
const parserHtml = require('prettier/parser-html');
const parserbabel = require('prettier/parser-babylon');

SDK.codeFormat = (str, options = {}) => {
    const defaultOptions = {
        tabWidth: 4,
        useTabs: false,
        printWidth: 80,
        parser: 'babel',
        singleQuote: true,
        trailingComma: 'es5',
        jsxSingleQuote: true,
        jsxBracketSameLine: true,
        plugins: [parserbabel, parserHtml],
    };

    const opt = { ...defaultOptions, ...options };

    let code;

    try {
        code = prettier.format(str, opt);
    } catch (err) {
        code = str;
    }

    return code;
};

SDK.directoryName = str => camelcase(SDK.slug(str), { pascalCase: true });

SDK.excludePath = p => {
    if (p.startsWith(SDK.resolve(cwd, 'src'))) {
        return false;
    }

    if (p.startsWith(SDK.resolve(cwd, 'reactium_modules'))) {
        return false;
    }

    return (
        p.endsWith('.tmp') ||
        p.includes('.Trash') ||
        p.startsWith('/Volumes/') ||
        p.includes('node_modules') ||
        p.startsWith(SDK.resolve(cwd, '.git')) ||
        p.startsWith(SDK.resolve(cwd, '.cli')) ||
        p.startsWith(SDK.resolve(cwd, 'docs')) ||
        p.startsWith(SDK.resolve(cwd, '.core')) ||
        p.startsWith(SDK.resolve(cwd, 'build')) ||
        p.startsWith(SDK.resolve(cwd, 'public')) ||
        p.startsWith(SDK.resolve(cwd, 'markdown')) ||
        p.startsWith(SDK.resolve(cwd, 'flow-typed'))
    );
};

SDK.hasLiveEditor = () =>
    fs.existsSync(
        SDK.resolve(
            cwd,
            'reactium_modules',
            '@atomic-reactor',
            'toolkit-demo',
            'utils',
            'ComponentDemo.js',
        ),
    );

SDK.isEmpty = dir => {
    let files = [];

    try {
        files = fs.readdirSync(dir).filter(
            file =>
                !String(file)
                    .toLowerCase()
                    .endsWith('.ds_store'),
        );
    } catch (err) {}
    return files.length < 1;
};

SDK.mergeParams = (params = {}, merge = {}) => {
    Object.entries(merge).forEach(([key, val]) => {
        val = _.chain([val])
            .compact()
            .isEmpty()
            .value()
            ? undefined
            : val;
        params[key] = val;
    });

    return params;
};

SDK.normalize = (...args) => path.normalize(path.join(...args));

SDK.resolve = (...args) => path.resolve(SDK.normalize(...args));

SDK.slug = str => slugify(str, { lower: true });

module.exports = SDK;
