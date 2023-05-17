/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const cc = require("camelcase");
const GENERATOR = require("./generator");

const { _, chalk, fs, op, path, prefix, props, error, message } = arcli;
const { cwd, inquirer } = arcli.props;

const {
  directoryName,
  excludePath,
  hasLiveEditor,
  isEmpty,
  mergeParams,
  normalize,
  resolve,
  sidebarGroups,
  slug
} = require("../utils");

const isLiveEditor = hasLiveEditor();

const NAME = "tk-element";

const DESC = "Create a new Reactium Toolkit element";

const CANCELED =
  "Reactium Toolkit element creation " + chalk.magenta("canceled!");

const VALIDATE = {};
const PROMPT = {};
const FILTER = {};

const HELP = () => {
  console.log("");
};

const CONFORM = params => {
  return Object.keys(params).reduce((obj, key) => {
    let val = params[key];
    switch (key) {
      case "name":
        obj[key] = val ? directoryName(val) : val;
        break;

      case "id":
      case "group":
        if (String(val).length > 0) {
          obj[key] = val ? slug(val) : val;
        } else {
          obj[key] = "";
        }
        break;

      case "url":
        val = val === true ? FILTER.URL(val, params) : val;
        if (val) {
          obj[key] = val;
        }
        break;

      case "order":
        if (val) {
          obj[key] = Number(val);
        }
        break;

      default:
        obj[key] = val;
        break;
    }
    return obj;
  }, {});
};

VALIDATE.REQUIRED = (key, val, msg) =>
  _.chain([val])
    .flatten()
    .compact()
    .isEmpty()
    .value()
    ? msg || `${chalk.magenta(key)} is required`
    : true;

FILTER.FORMAT = (key, val) => CONFORM({ [key]: val })[key];

FILTER.URL = (val, answers = {}) =>
  val === true
    ? _.compact([
        "/toolkit",
        op.get(answers, "group"),
        op.get(answers, "id")
      ]).join("/")
    : null;

PROMPT.ID = async params => {
  const { id } = await inquirer.prompt(
    [
      {
        prefix,
        name: "id",
        type: "input",
        message: "Element ID:",
        filter: val => FILTER.FORMAT("id", val),
        validate: val => VALIDATE.REQUIRED("id", val, "Element ID is required")
      }
    ],
    params
  );

  params.id = id;

  const { name } = await inquirer.prompt(
    [
      {
        prefix,
        name: "name",
        type: "input",
        message: "Element Name:",
        default: directoryName(params.id),
        filter: val => FILTER.FORMAT("name", val),
        validate: val =>
          VALIDATE.REQUIRED("name", val, "Element name is required")
      }
    ],
    params
  );

  params.name = name;
};

PROMPT.DIR = async params => {
  const { directory } = await inquirer.prompt(
    [
      {
        prefix,
        excludePath,
        depthLimit: 10,
        name: "directory",
        type: "fuzzypath",
        message: "Directory:",
        itemType: "directory",
        rootPath: normalize(cwd)
      }
    ],
    params
  );

  const domainFilePath = normalize(directory, "domain.js");
  const domain = fs.existsSync(domainFilePath) ? require(domainFilePath) : {};

  params.group = op.get(domain, "reactiumToolkit.group.id");

  params.directory = normalize(directory, cc(params.id, { pascalCase: true }));
};

PROMPT.OVERWRITE = async params => {
  if (!isEmpty(params.directory) && !params.overwrite) {
    message(chalk.magenta("The selected directory is not empty!"));

    const { overwrite } = await inquirer.prompt(
      [
        {
          prefix,
          default: false,
          type: "confirm",
          name: "overwrite",
          message: "Overwrite?"
        }
      ],
      params
    );

    if (overwrite !== true) {
      message(CANCELED);
      process.exit();
    }
  }
};

PROMPT.SIDEBAR = async params => {
  const groups = sidebarGroups();
  const inq = await inquirer.prompt(
    [
      {
        prefix,
        name: "label",
        type: "input",
        default: params.name,
        message: "Sidebar Label:"
      },
      {
        prefix,
        name: "group",
        type: "list",
        message: "Sidebar Parent:",
        choices: groups,
        default: params.group,
        askAnswered: true,
        when: answers => groups.length > 0 && !!answers.label
      },
      {
        prefix,
        default: 100,
        name: "order",
        type: "number",
        message: "Sidebar Order:",
        when: answers => !!answers.label
      }
    ],
    params
  );

  mergeParams(params, CONFORM(inq));
};

PROMPT.DOC = async params => {
  const { doc, docLabel, docOrder } = await inquirer.prompt(
    [
      {
        prefix,
        name: "doc",
        default: true,
        type: "confirm",
        message: "Documentation?"
      }
    ],
    params
  );

  params.doc = doc;
  params.docLabel = docLabel;
  params.docOrder = docOrder;
};

PROMPT.EDITOR = async params => {
  const { editor } = await inquirer.prompt(
    [
      {
        prefix,
        name: "editor",
        default: false,
        type: "confirm",
        message: "Live Editor?",
        when: () => isLiveEditor
      }
    ],
    params
  );

  params.editor = editor;
};

PROMPT.PREFLIGHT = async params => {
  // Transform the preflight object instead of the params object
  const preflight = CONFORM({ ...params });
  delete preflight.debug;

  const isDebug = op.get(params, "debug", false);

  // Output messge
  if (!isDebug) {
    message(
      "A new toolkit element will be created using the following configuration:"
    );
  } else {
    message(
      "A new toolkit element would be created using the following configuration:"
    );
  }

  console.log(JSON.stringify(preflight, null, 2));
  console.log("");

  let confirm;

  if (!isDebug) {
    const inq = await inquirer.prompt([
      {
        prefix,
        name: "confirm",
        type: "confirm",
        message: "Proceed?",
        default: false
      }
    ]);

    confirm = op.get(inq, "confirm");
  }

  if (confirm !== true) {
    if (!isDebug) {
      message(CANCELED);
    } else {
      message("Debug " + chalk.cyan("complete!"));
    }
    process.exit();
  }
};

const ACTION = async ({ props, opt }) => {
  const initialParams = FLAGS_TO_PARAMS(opt);

  console.log("");

  // 0.0 - prep params that came from flags
  let params = CONFORM(initialParams);

  // 1.0 - Get name
  await PROMPT.ID(params);

  // 2.0 - Get Directory
  await PROMPT.DIR(params);

  // 3.0 - Check directory
  await PROMPT.OVERWRITE(params);

  // 5.0 - Sidebar
  await PROMPT.SIDEBAR(params);

  // 6.0 - Documentation
  await PROMPT.DOC(params);

  // 7.0 - Live editor
  await PROMPT.EDITOR(params);

  // 8.0 - Preflight
  await PROMPT.PREFLIGHT(params);

  // 9.0 - Execute actions
  if (op.get(params, "debug") !== true) {
    await GENERATOR({ arcli: global, params, props });
  }

  console.log("");
};

const FLAGS_TO_PARAMS = opt =>
  FLAGS().reduce((obj, key) => {
    let val = opt[key];
    val = typeof val === "function" ? undefined : val;

    if (val) op.set(obj, key, val);

    return obj;
  }, {});

const FLAGS = () => {
  let flags = [
    "name",
    "directory",
    "overwrite",
    "id",
    "sidebar",
    "group",
    "label",
    "order",
    "debug",
    "doc",
    "docLabel",
    "docOrder",
    "editor"
  ];

  return flags;
};

const COMMAND = ({ program, ...args }) =>
  program
    .command(NAME)
    .description(DESC)
    .action(opt => ACTION({ opt, props, program }))
    .usage("element [options]")
    .option("-n, --name [name]", "The element name")
    .option("-d, --directory [directory]", "The path to create the element")
    .option("-i, --id [id]", "The unique id of the element")
    .option("-s, --sidebar [sidebar]", "Include sidebar item")
    .option("-g, --group [group]", "Sidebar group")
    .option("-l, --label [label]", "Sidebar label")
    .option("-o, --order [order]", "Sidebar order")
    .option("-e, --editor [editor]", "Create as Live Editor element")
    .option("-D, --debug [debug]", "Debug mode")
    .option("-O, --overwrite [overwrite]", "Overwrite existing element")
    .option("--doc [doc]", "Add documentation element")
    .option("--docLabel [docLabel]", "Documentation sidebar label")
    .option("--docOrder [docOrder]", "Documentation sidebar order")
    .on("--help", HELP);

module.exports = {
  ACTION,
  CANCELED,
  COMMAND,
  CONFORM,
  NAME,
  FILTER,
  VALIDATE,
  PROMPT
};
