"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ABI2SolidityFiles = ABI2SolidityFiles;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getInOrOut(inputs) {
  let out = "";
  for (let i = 0; i < inputs.length; i += 1) {
    out += inputs[i].type;
    if (inputs[i].type == "string" || inputs[i].type == "bytes") {
      out += ` memory`;
    }
    if (inputs[i].type.match(/\[[^\]]*]/g)) {
      out += ` memory`;
    }

    if (inputs[i].name) {
      out += ` ${inputs[i].name}`;
    }
    if (i !== inputs.length - 1) {
      out += ", ";
    }
  }
  return out;
}

function getMethodInterface(method) {
  const out = [];
  // Type
  // Interfaces limitation: https://solidity.readthedocs.io/en/v0.4.24/contracts.html#interfaces
  if (method.type !== "function") {
    return null;
  }
  out.push(method.type);
  // Name
  if (method.name) {
    out.push(method.name);
  }
  // Inputs
  out.push("(");
  out.push(getInOrOut(method.inputs));
  out.push(")");
  // Functions in ABI are either public or external and there is no difference in the ABI
  out.push("external");
  // State mutability
  if (method.stateMutability === "pure") {
    out.push("pure");
  } else if (method.stateMutability === "view") {
    out.push("view");
  } else if (method.stateMutability === "pure") {
    out.push("pure");
  }
  // Payable
  if (method.payable) {
    out.push("payable");
  }
  // Outputs
  if (method.outputs && method.outputs.length > 0) {
    out.push("returns");
    out.push("(");
    out.push(getInOrOut(method.outputs));
    out.push(")");
  }
  return out.join(" ");
}

function abi2sols(abi) {
  const frontloader = "//SPDX-License-Identifier: Unlicense \n";
  const pragma = "pragma solidity 0.8.4; \n";
  const HEADER = "interface GeneratedInterface {\n";
  const FOOTER = "}\n";
  const jsonABI = JSON.parse(abi);
  let out = frontloader + pragma + HEADER;
  for (let i = 0; i < jsonABI.length; i += 1) {
    const method = jsonABI[i];
    const methodString = getMethodInterface(method);
    if (methodString) {
      out += `  ${getMethodInterface(method)};\n`;
    }
  }
  return out + FOOTER;
}

function ABI2SolidityFiles(input, output) {
  _fs2.default.readFile(input, { encoding: "utf8" }, (err, abi) => {
    if (err) {
      console.error(err);
      return;
    }
    const solidity = abi2sols(abi);
    if (output === "") {
      // default to stdout
      console.log("------------ Solidity interface:");
      console.log(solidity);
    } else {
      _fs2.default.writeFile(output, solidity, (err2) => {
        if (err2) console.error(err2);
      });
    }
  });
}

exports.default = abi2sols;
