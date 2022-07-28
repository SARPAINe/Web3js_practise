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
console.log(`Encoded address: ${res}`);

let res2 = web3.eth.abi.encodeParameter("string[]", ["ragib", "shaharin"]);
console.log(`Encoded string array: ${res2}`);

let res3 = web3.eth.abi.encodeParameter("string", "Added permitted User IDs");
console.log(`Encoded stirng: ${res3}`);

console.log(
    web3.eth.abi.encodeParameters(
        ["uint256", "string"],
        ["2345675643", "Hello!%"]
    )
);

// console.log(
//     web3.eth.abi.encodeParameters(
//         ["uint8[]", "string"],
//         [["34", "434"], "0x324567fff"]
//     )
// );
// doesn't work
process.exit();

// Encodes a parameter based on its type to its ABI representation.
// topics value is similar for address parameter which is not an array.
// need to check topics value for string.
// need to check topics value for data.
