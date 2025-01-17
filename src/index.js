#!/usr/bin/env node
"use strict";

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _package = require("../package.json");

var _abi2solidity = require("./abi2sols");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function main() {
  _commander2.default
    .version(_package.version)
    .option("-i, --input <file>", "JSON ABI Input file", "")
    .option("-o, --output <file>", "Solidity output file", "")
    .parse(process.argv);

  if (_commander2.default.input === "") {
    console.log("Using stdin to READ ABI");
    _commander2.default.input = process.stdin.fd;
  }

  if (_commander2.default.output === "") {
    console.log("Using stdout to write Solidity interface");
  }

  (0, _abi2solidity.ABI2SolidityFiles)(
    _commander2.default.input,
    _commander2.default.output
  );
}

main();
