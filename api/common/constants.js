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

export const TdABI = [
  "function setup(string memory wasmName, uint256 circuitSize) payable",
  "function prove(string memory imageId, string memory privateInput, string memory publicInput) payable",
  "function deploy(string memory imageId, uint256 chainid) payable",
];
