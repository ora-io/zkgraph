// usage: node prove.js [--inputgen/pretest] <blocknum/blockhash> <state> -> wasm input
import  { program } from "commander";
console.log('test')
program.version("1.0.0");

program.option("-i, --inputgen", "Generate input")
//   .option('-e, --env <environment>', 'Specify the environment')
  .option('-p, --pretest', 'Run in pretest Mode');

program.parse(process.argv);

const options = program.opts();

if (options.inputgen) {
    console.log("Input generation mode");
//   console.log(`Port number: ${options.port}`);
}

// if (options.env) {
//   console.log(`Environment: ${options.env}`);
// }
