// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
const { program } = require("commander");

program.version("1.0.0");

program.option("-g, --inputgen", "Generate input");
//   .option('-e, --env <environment>', 'Specify the environment')
//   .option('-d, --debug', 'Enable debug mode');

program.parse(process.argv);

const options = program.opts();

if (options.port) {
  console.log(`Port number: ${options.port}`);
}

if (options.env) {
  console.log(`Environment: ${options.env}`);
}

if (options.debug) {
  console.log("Debug mode enabled");
}
