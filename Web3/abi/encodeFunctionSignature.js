const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
let res = web3.eth.abi.encodeFunctionSignature({
    inputs: [
        {
            internalType: "uint64",
            name: "assetRightTokenID",
            type: "uint64",
        },
        {
            internalType: "address",
            name: "primeContractorAddress",
            type: "address",
        },
        {
            internalType: "address",
            name: "subContractorAddress",
            type: "address",
        },
        {
            internalType: "string[]",
            name: "permittedUsers",
            type: "string[]",
        },
    ],
    name: "initAssetRightToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
});
console.log(res);
// 0x3a69bcc8
let res2 = web3.eth.abi.encodeFunctionSignature(
    "initAssetRightToken(uint64,address,address,string[])"
);
console.log(res2);

// When calling a function on a contract,
// the function signature is determined by hashing
// the name of the function including its inputs (using keccak256),
// and truncating everything but the first 4 bytes.
