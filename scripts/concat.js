/**
 * Concatenates the contents of all files in a specified folder with the content of a target file.
 * Usage: node concat.js <folderA> <fileB>
 * - <folderA>: The folder containing the files to be concatenated.
 * - <fileB>: The target file where the concatenated content will be written, overwriting its previous content.
 *
 * This script reads the contents of all files in <folderA>, regardless of their file format,
 * concatenates them together, and appends the content of <fileB>. The final concatenated content
 * is then written back to <fileB>, overwriting its previous content.
 *
 * Note: Make sure to replace <folderA> and <fileB> with the actual paths to the respective folders and files.
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Get the command line arguments
const [, , folderA, fileB] = process.argv;

// Check if all required arguments are provided
if (!folderA || !fileB) {
  console.error('Usage: node concatenate.js <folderA> <fileB>');
  process.exit(1);
}

// Read the contents of all files in folderA
const fileNames = readdirSync(folderA);
const contents = fileNames
  .map(fileName => readFileSync(join(folderA, fileName), 'utf8'));

// Concatenate the contents of all files
const concatenatedContent = contents.join('\n');

// Read the contents of file B
const contentB = readFileSync(fileB, 'utf8');

// Concatenate the contents of folderA and file B
const finalContent = concatenatedContent + '\n' + contentB;

// Write the concatenated content to file B
writeFileSync(fileB, finalContent, 'utf8');
