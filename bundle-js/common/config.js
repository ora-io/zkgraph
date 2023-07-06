import yaml from 'js-yaml'
import fs from 'fs'

export function loadConfig(fname){
    try {
        // Read the YAML file contents
        const fileContents = fs.readFileSync(fname, 'utf8');
        // Parse the YAML content
        return yaml.load(fileContents);
    } catch (error) {
    console.error(error);
    }
}

export function applyConfig(configObj){
    
}

// var config = loadConfig('src/zkgraph.yaml')
// console.log(config.dataSources[0].mapping.eventHandlers)
// console.log(config.dataSources[0].mapping.eventHandlers[0].source)
// console.log(config.dataSources[0].mapping.eventHandlers[0])
// console.log(config.dataSources[0].mapping.eventHandlers[0].handler)