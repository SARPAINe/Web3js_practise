const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "tortoise mechanic tray picnic live rocket balance move tobacco great talent dizzy",
    // remember to change this to your own phrase!
    "https://stgrpc.openpost.co.jp"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
const Main = require("../build/contracts/Main.json");
let abi = Main.abi;
let contractAddress = "0x850BA892d4e927A6a7708a1c5Ae4fBdb86e47396";
let main = new web3.eth.Contract(abi, contractAddress);
let accounts = web3.eth.getAccounts();

// const work = async () => {
//     // accounts = await web3.eth.getAccounts();
//     console.log(accounts[1]);
//     let res = await main.methods
//         .initAssetRightToken(1234567, accounts[1], accounts[0], [
//             "ragib",
//             "shaharin",
//             "omar",
//             "iffat",
//         ])
//         .send({ from: accounts[1] });
//     // console.log(res);
//     console.log(res.events.AddedPermittedUser);
//     process.exit();
// };
// work();

// const eventSearch = async () => {
//     accounts = await web3.eth.getAccounts();
//     console.log(accounts[1]);
//     let eventResponseAddedPermittedUser = await main.getPastEvents(
//         "AddedPermittedUser",
//         {
//             filter: {
//                 primeContractorAddress: accounts[1],
//             },
//             fromBlock: 0,
//             toBlock: "latest",
//         }
//     );
//     console.log(eventResponseAddedPermittedUser);
//     // console.log(res);
//     // console.log(
//     //     `Transaction hash: ${eventResponseAddedPermittedUser[0].transactionHash}`
//     // );
//     // console.log(
//     //     `Prime Contractor Address: ${eventResponseAddedPermittedUser[0].returnValues[0]}`
//     // );
//     // console.log(
//     //     `Permitted Users: ${eventResponseAddedPermittedUser[0].returnValues[1]}`
//     // );
//     // console.log(`Data: ${eventResponseAddedPermittedUser[0].returnValues[2]}`);
//     process.exit();
// };
// eventSearch();

0xe946f096344b2c7a569290e3128e63e207f2aac0;

main.getPastEvents("Initialized", {
    fromBlock: 0,
    toBlock: "latest",
}).then((res) => {
    console.log(res.length);
    process.exit();
});

// web3.eth.defaultAccount = "0xA408CcbE0988300f2366408F1231DbF22E0C84B3";
// console.log(web3.eth.Contract.defaultAccount);
// console.log(web3.eth.accounts);

// await gbdam.initAssetRightToken(1001,accounts[0],accounts[1],["ragib","shaharin"]);

//0x47907243F370d00a3fb2060Cae6301504d01f0a1 assettoken 1004 done
//  0x850BA892d4e927A6a7708a1c5Ae4fBdb86e47396
