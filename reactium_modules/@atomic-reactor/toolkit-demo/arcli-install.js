const path = require('path');

const cwd = process.cwd();

const { fs, op, prefix } = arcli;

const resolve = (...args) => path.resolve(normalize(...args));

const normalize = (...args) => path.normalize(path.join(...args));

const excludePath = p => {
    if (p.startsWith(resolve(cwd, 'src'))) return false;

    return (
        p.endsWith('.tmp') ||
        p.includes('.Trash') ||
        p.startsWith('/Volumes/') ||
        p.includes('node_modules') ||
        p.includes('reactium_modules') ||
        p.startsWith(resolve(cwd, '.git')) ||
        p.startsWith(resolve(cwd, '.cli')) ||
        p.startsWith(resolve(cwd, 'docs')) ||
        p.startsWith(resolve(cwd, '.core')) ||
        p.startsWith(resolve(cwd, 'build')) ||
        p.startsWith(resolve(cwd, 'public')) ||
        p.startsWith(resolve(cwd, 'markdown')) ||
        p.startsWith(resolve(cwd, 'flow-typed'))
    );
};

module.exports = spinner => {
    let inject, inquirer;

    return {
        unattended: ({ params = {} }) => {
            inject = !op.get(params, 'unattended', false);
        },
        init: async ({ props }) => {
            if (inject === false) return;

            inquirer = props.inquirer;

            if (spinner.isSpinning) spinner.stop();

            const answers = await inquirer.prompt([
                {
                    prefix,
                    default: true,
                    name: 'inject',
                    type: 'confirm',
                    message: 'Inject Toolkit Demo styles?:',
                },
            ]);

            inject = op.get(answers, 'inject', false);
        },

        inject: async () => {
            if (inject === false) return;

            const { file } = await inquirer.prompt([
                {
                    prefix,
                    excludePath,
                    name: 'file',
                    rootPath: cwd,
                    depthLimit: 10,
                    itemType: 'file',
                    type: 'fuzzypath',
                    message: 'Select .scss file:',
                    excludeFilter: p => {
                        return !String(p)
                            .toLowerCase()
                            .endsWith('.scss');
                    },
                },
            ]);

            let scss = fs.readFileSync(file);
            scss += '@import \'+@atomic-reactor/toolkit-demo/style\';';
            scss += '\n';

            fs.writeFileSync(file, scss);
        },
        complete: () => {
            if (inject === false) return;

            if (!spinner.isSpinning) spinner.start();
        },
    };
};
