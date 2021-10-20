const chalk = require('chalk');
const globby = require('globby').sync;
const ActionSequence = require('action-sequence');

module.exports = spinner => {
    const emit = text => {
        if (!spinner) return;
        if (!spinner.isSpinning) spinner.start();
        spinner.text = text;
    };

    return {
        // options: { action, params, props }
        init: options => {
            emit(`Running ${chalk.cyan('arcli-install')} actions...`);
        },
        postinstall: async ({ params, props }) => {
            const { dir } = params;

            const filePath = arcli.normalizePath(
                props.cwd,
                dir,
                'arcli-install.js',
            );

            const actionFiles = globby([filePath]);

            if (actionFiles.length < 1) return;

            const actions = actionFiles.reduce((obj, file, i) => {
                const acts = require(file)(spinner, arcli, params, props);
                Object.keys(acts).forEach(key => {
                    obj[`postinstall_${i}_${key}`] = acts[key];
                });
                return obj;
            }, {});

            params['pluginDirectory'] = dir;
            await ActionSequence({ actions, options: { params, props } });
        },
    };
};
