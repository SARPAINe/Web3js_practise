const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
let res = web3.eth.abi.encodeFunctionCall(
    {
        name: "myMethod",
        type: "function",
        inputs: [
            {
                type: "uint256",
                name: "myNumber",
            },
            {
                type: "string",
                name: "myString",
            },
        ],
    },
    ["2345675643", "Hello!%"]
);
console.log(res);

process.exit();

// Encodes a parameter based on its type to its ABI representation.
// topics value is similar for address parameter which is not an array.
// need to check topics value for string.
// need to check topics value for data.
