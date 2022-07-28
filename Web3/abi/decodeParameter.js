const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
let res = web3.eth.abi.encodeParameter(
    "address",
    "0xE946F096344B2C7A569290e3128e63e207F2AAc0"
);
console.log(res);
console.log(`Decoded address: ${web3.eth.abi.decodeParameter("address", res)}`);

let res2 = web3.eth.abi.encodeParameter("string[]", ["ragib", "shaharin"]);
console.log(res2);
console.log(
    `Decoded string array: ${web3.eth.abi.decodeParameter("string[]", res2)}`
);
console.log("break");
let res3 = web3.eth.abi.encodeParameter("string", "Added permitted User IDs");
console.log(res3);
console.log(`Decoded string: ${web3.eth.abi.decodeParameter("string", res3)}`);

let res4 = web3.eth.abi.encodeParameters(
    ["uint256", "string"],
    ["2345675643", "Hello!%"]
);
console.log(res4);
let res5 = web3.eth.abi.decodeParameters(["uint256", "string"], res4);
console.log(res5);
console.log(`Decoded parameters: ${res5[0]} ${res5[1]}`);

let res6 = web3.eth.abi.encodeParameters(
    ["uint8[]", "string"],
    [[34, 43], "0x324567fff"]
);

let res7 = web3.eth.abi.decodeParameters(["uint8[]", "string"], res6);
console.log(res7);
process.exit();

// Encodes a parameter based on its type to its ABI representation.
// topics value is similar for address parameter which is not an array.
// need to check topics value for string.
// need to check topics value for data.
