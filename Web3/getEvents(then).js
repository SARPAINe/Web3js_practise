const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const provider = new HDWalletProvider(
    "sweet weekend trouble patient execute pepper lake timber state coral girl reform",
    // remember to change this to your own phrase!
    "HTTP://127.0.0.1:7545"
    // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
const Main = require("../build/contracts/Owner.json");
let abi = Main.abi;
let contractAddress = "0xF3455990d51870B92C854041E313e7024627f813";
let main = new web3.eth.Contract(abi, contractAddress);
let accounts = web3.eth.getAccounts();

// try {
//     const print = async () => {
//         const ownerSetEvents = await main.getPastEvents("OwnerSet", {
//             // filter: {
//             //     assetRightTokenID: 1001,
//             // },
//             fromBlock: 0,
//             toBlock: "latest",
//         });

//         var owners = [];

//         for (var i = 0; i < ownerSetEvents.length; i++) {
//             owners.push(ownerSetEvents[i].raw.topics[3]);
//             // console.log(web3.utils.hexToUtf8(ownerSetEvents[i].raw.topics));
//         }
//         // console.log(owners[0]);
//         // console.log(web3.eth.abi.decodeParameter("bytes32", owners[0]));
//         console.log(web3.utils.hexToUtf8(owners[0]));
//         console.log(web3.utils.hexToUtf8(owners[1]));
//     };
//     print();
// } catch (err) {
//     console.log(err);
// }
// fetch("http://localhost:8080/api/campaigns/summary?campaignIndex=3").then(
//     (res) => {
//         console.log(res);
//     }
// );
// console.log(accounts[0]);

// const work = async () => {
//     accounts = await web3.eth.getAccounts();
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

// main.getPastEvents("OwnerSet", {
//     // filter: {
//     //     assetRightTokenID: 1001,
//     // },
//     fromBlock: 0,
//     toBlock: 40,
// }).then((eventResponseInitialized) => {
//     console.log(eventResponseInitialized);
//     console.log(typeof eventResponseInitialized);
//     let topics = eventResponseInitialized[1].raw.topics;
//     let data = eventResponseInitialized[1].raw.data;
//     console.log(data);
//     console.log(topics);

//     console.log(web3.eth.abi.decodeParameter("address", topics[1]));
//     console.log(web3.eth.abi.decodeParameter("address", topics[2]));
//     // console.log(web3.eth.abi.decodeParameters(["string"], data));
//     // console.log(web3.eth.abi.decodeParameter("string", data));
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
//     // console.log(`Data: ${eventResponseAddedPermittedUser[0].raw.data}`);
//     // console.log(`Topics: ${eventResponseAddedPermittedUser[0].raw.topics}`);
// });

// main.getPastEvents("AddedSubcontractor", {
//     filter: {
//         assetRightTokenID: 1001,
//     },
//     fromBlock: 0,
//     toBlock: "latest",
// }).then((eventResponseInitialized) => {
//     let topics = eventResponseInitialized[0].raw.topics;
//     let data = eventResponseInitialized[0].raw.data;
//     console.log(data);
//     console.log(topics);
//     // console.log(web3.eth.abi.decodeParameter("uint64", topics[1]));
//     // console.log(web3.eth.abi.decodeParameter("address", topics[2]));
//     console.log(
//         web3.eth.abi.decodeParameters(["address", "address", "string"], data)
//     );
//     process.exit();
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
//     // console.log(`Data: ${eventResponseAddedPermittedUser[0].raw.data}`);
//     // console.log(`Topics: ${eventResponseAddedPermittedUser[0].raw.topics}`);
// });

// console.log(res);

// web3.eth.defaultAccount = "0xA408CcbE0988300f2366408F1231DbF22E0C84B3";
// console.log(web3.eth.Contract.defaultAccount);
// console.log(web3.eth.accounts);

// await gbdam.initAssetRightToken(1001,accounts[0],accounts[1],["ragib","shaharin"]);

//0x47907243F370d00a3fb2060Cae6301504d01f0a1 assettoken 1004 done
//  0x850BA892d4e927A6a7708a1c5Ae4fBdb86e47396
