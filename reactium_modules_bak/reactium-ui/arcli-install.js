const cwd = process.cwd();
const { normalizePath } = arcli;

const dir = (...args) =>
  normalizePath(
    cwd,
    "reactium_modules",
    "@atomic-reactor",
    "reactium-ui",
    ...args
  );

const INPUT = require(dir(".cli", "commands", "generate", "input.js"));
const GENERATOR = require(dir(".cli", "commands", "generate", "generator.js"));

module.exports = spinner => {
  return {
    init: ({ params }) => {
      const { unattended } = params;
      if (!unattended && spinner && spinner.isSpinning) {
        spinner.stop();
      }
    },
    prompt: INPUT,
    generate: GENERATOR
  };
};
