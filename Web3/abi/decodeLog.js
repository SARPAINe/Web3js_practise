// decodeLog
// web3.eth.abi.decodeLog(inputs, hexString, topics);
// Decodes ABI-encoded log data and indexed topic data.

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

let res = web3.eth.abi.decodeLog(
    [
        {
            indexed: false,
            internalType: "address",
            name: "primeContractorAddress",
            type: "address",
        },
        {
            indexed: false,
            internalType: "address",
            name: "subContractorAddress",
            type: "address",
        },
        {
            indexed: false,
            internalType: "string",
            name: "data",
            type: "string",
        },
    ],
    "0x000000000000000000000000a408ccbe0988300f2366408f1231dbf22e0c84b3000000000000000000000000e946f096344b2c7a569290e3128e63e207f2aac00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002f416464656420737562636f6e74726163746f7220657468206163636f756e742061732063757272656e7420757365720000000000000000000000000000000000",
    ["0xf96d1c75cd3019ef5aba745b2bee680768ae8cd6894dd251e2916541f775835b"]
);

// let res = web3.eth.abi.decodeLog(
//     [
//         {
//             type: "string",
//             name: "myString",
//         },
//         {
//             type: "uint256",
//             name: "myNumber",
//             indexed: true,
//         },
//         {
//             type: "uint8",
//             name: "mySmallNumber",
//             indexed: true,
//         },
//     ],
//     "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000748656c6c6f252100000000000000000000000000000000000000000000000000",
//     [
//         "0x000000000000000000000000000000000000000000000000000000000000f310",
//         "0x0000000000000000000000000000000000000000000000000000000000000010",
//     ]
// );
console.log(res);
process.exit();
