const cwd = process.cwd();
const prettier = require("prettier");
const { chalk, fs, normalizePath, runCommand } = arcli;

const enumsPath = normalizePath(
  cwd,
  "reactium_modules",
  "@atomic-reactor",
  "reactium-ui",
  "enums.js"
);

let ENUMS = require(enumsPath);

module.exports = spinner => {
  const emit = text => {
    if (!spinner) return;
    spinner.text = text;
  };

  return {
    // options: { action, params, props }
    updateEnums: ({ params }) => {
      emit(`Updating ${chalk.cyan("manifest")}...`);

      ENUMS.MANIFEST[params.key] = params.selected;

      const enumsTemp = prettier.format(
        `const ENUMS = ${JSON.stringify(ENUMS)};

                module.exports = ENUMS;`,
        {
          parser: "babel",
          singleQuote: true,
          jsxSingleQuote: true,
          jsxBracketSameLine: true,
          trailingComma: "all",
          tabWidth: 4
        }
      );

      fs.writeFileSync(enumsPath, enumsTemp);

      return new Promise(resolve => setTimeout(() => resolve(), 2000));
    },
    manifest: async () => {
      if (spinner && spinner.isSpinning) spinner.stop();
      await runCommand("arcli", ["rui-manifest", "-u"]);
      if (spinner) spinner.start();
    }
  };
};
