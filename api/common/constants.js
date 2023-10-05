import path from 'path'
import { fileURLToPath } from 'url';

export const networks = [
  {
    name: "Sepolia",
    label: "Sepolia",
    value: 11155111,
    expectedEth: 0.002,
    hex: "0xaa36a7",
  },
  {
    name: "Goerli",
    label: "Goerli",
    value: 5,
    expectedEth: 0.5,
    hex: "0x5",
  },
  {
    name: "Mainnet",
    label: "Mainnet",
    value: 1,
  },
];

export const CURRENT_DIRNAME = path.dirname(fileURLToPath(import.meta.url))
