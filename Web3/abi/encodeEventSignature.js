const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
let res = web3.eth.abi.encodeEventSignature({
    anonymous: false,
    inputs: [
        {
            indexed: true,
            internalType: "address",
            name: "primeContractorAddress",
            type: "address",
        },
        {
            indexed: true,
            internalType: "string[]",
            name: "permittedUserIDs",
            type: "string[]",
        },
        {
            indexed: false,
            internalType: "string",
            name: "data",
            type: "string",
        },
    ],
    name: "AddedPermittedUser",
    type: "event",
});
console.log(res);

let res2 = web3.eth.abi.encodeEventSignature(
    "AddedPermittedUser(address,string[],string)"
);
console.log(res2);

// When calling a function on a contract,
// the function signature is determined by hashing
// the name of the function including its inputs (using keccak256),
// and truncating everything but the first 4 bytes.
