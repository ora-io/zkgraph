import yaml from "js-yaml";
import fs from "fs";
import { ethers } from "ethers";

function loadYaml(fname) {
  try {
    // Read the YAML file contents
    const fileContents = fs.readFileSync(fname, "utf8");
    // Parse the YAML content
    return yaml.load(fileContents);
  } catch (error) {
    console.error(error);
  }
}

export function loadZKGraphConfig(fname) {
  const config = loadYaml(fname);
  const source_address = config.dataSources[0].source.address;

  for (let i in config.dataSources[0].mapping.eventHandlers) {
    if (
      config.dataSources[0].mapping.eventHandlers[i].handler != "handleEvents"
    ) {
      throw Error(
        "zkgraph.yaml: currently only support 'handleEvents' as handler function name.",
      );
    }
  }
  const edefs = config.dataSources[0].mapping.eventHandlers.map(
    (eh) => eh.event,
  );
  const source_esigs = edefs.map((ed) =>
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ed)),
  );

  return [source_address, source_esigs];
}

export function loadZKGraphName(fname) {
  const config = loadYaml(fname);
  return config.name;
}

export function applyZKGraphConfig(configObj) {} //placeholder

export function loadZKGraphDestinations(fname) {
  const config = loadYaml(fname);
  return config.dataDestinations;
  // [
  //   {
  //     kind: 'ethereum/contract',
  //     network: 'mainnet',
  //     destination: { address: '0x123abc' }
  //   }
  // ]
}

export function loadZKGraphSources(fname) {
  const config = loadYaml(fname);
  return config.dataSources;
  // [
  //   {
  //     kind: 'ethereum/contract',
  //     network: 'goerli',
  //     source: { address: '0xFA5Db19087920F5d0e71d0373F099bd0C03589DA' },
  //     mapping: {
  //       kind: 'ethereum/events',
  //       apiVersion: '0.0.1',
  //       language: 'wasm/assemblyscript',
  //       file: './mapping.ts',
  //       eventHandlers: [Array]
  //     }
  //   }
  // ]
}
