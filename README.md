# abi2solidity

Convert an ABI to a Solidity interface, updated for version 0.8.4

## Install

```shell
$ npm install --save abi2sols
# OR
$ yarn add abi2sols
```

## Code Usage

```js
import abi2sols from "abi2sols";

const ABI = `
[
  {
    "constant": false,
    "inputs": [],
    "name": "f",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
`;

const solidity = abi2sols(ABI);
console.log(solidity);
// Will print out:
// interface GeneratedInterface {
//   function f (  ) external returns ( uint256 );
// }
```

# License

MIT
