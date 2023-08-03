export const testNets = [
  {
      name: "Sepolia",
      label: "Sepolia",
      value: 11155111,
      expectedEth: 0.002,
      hex: "0xaa36a7"
  },
  {
      name: "Goerli",
      label: "Goerli",
      value: 5,
      expectedEth: 0.5,
      hex: "0x5"
  },
]

export const contract_abi = {
  "contractName": "AggregatorVerifier",
  "abi": [
      {
          "inputs": [
              {
                  "internalType": "contract AggregatorVerifierCoreStep[]",
                  "name": "_steps",
                  "type": "address[]"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256[]",
                  "name": "proof",
                  "type": "uint256[]"
              },
              {
                  "internalType": "uint256[]",
                  "name": "verify_instance",
                  "type": "uint256[]"
              },
              {
                  "internalType": "uint256[]",
                  "name": "aux",
                  "type": "uint256[]"
              },
              {
                  "internalType": "uint256[][]",
                  "name": "target_instance",
                  "type": "uint256[][]"
              }
          ],
          "name": "verify",
          "outputs": [],
          "stateMutability": "view",
          "type": "function",
          "constant": true
      }
  ],
}
