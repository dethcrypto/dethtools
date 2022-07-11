export const jsonAbi = `{
    "type": "constructor",
    "payable": false,
    "inputs": [
      { "type": "string", "name": "symbol" },
      { "type": "string", "name": "name" }
    ]
  },
  {
    "type": "function",
    "name": "transferFrom",
    "constant": false,
    "payable": false,
    "inputs": [
      { "type": "address", "name": "from" },
      { "type": "address", "name": "to" },
      { "type": "uint256", "name": "value" }
    ],
    "outputs": [ ]
  },
  {
    "type": "function",
    "name": "balanceOf",
    "constant":true,
    "stateMutability": "view",
    "payable":false, "inputs": [
      { "type": "address", "name": "owner"}
    ],
    "outputs": [
      { "type": "uint256"}
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "Transfer",
    "inputs": [
      { "type": "address", "name": "from", "indexed":true},
      { "type": "address", "name": "to", "indexed":true},
      { "type": "address", "name": "value"}
    ]
  },
  {
    "type": "error",
    "name": "InsufficientBalance",
    "inputs": [
      { "type": "account", "name": "owner"},
      { "type": "uint256", "name": "balance"}
    ]
  },
  {
    "type": "function",
    "name": "addPerson",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "tuple",
        "name": "person",
        "components": [
          { "type": "string", "name": "name" },
          { "type": "uint16", "name": "age" }
        ]
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "addPeople",
    "constant": false,
    "payable": false,
    "inputs": [
      {
        "type": "tuple[]",
        "name": "person",
        "components": [
          { "type": "string", "name": "name" },
          { "type": "uint16", "name": "age" }
        ]
      }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "getPerson",
    "constant": true,
    "stateMutability": "view",
    "payable": false,
    "inputs": [
      { "type": "uint256", "name": "id" }
    ],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          { "type": "string", "name": "name" },
          { "type": "uint16", "name": "age" }
        ]
      }
    ]
  },
  {
    "type": "event",
    "anonymous": false,
    "name": "PersonAdded",
    "inputs": [
      { "type": "uint256", "name": "id", "indexed": true },
      {
        "type": "tuple",
        "name": "person",
        "components": [
          { "type": "string", "name": "name", "indexed": false },
          { "type": "uint16", "name": "age", "indexed": false }
        ]
      }
    ]
  }`;
