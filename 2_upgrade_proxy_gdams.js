const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const Main = artifacts.require("Main");

module.exports = async function (deployer) {
    const existing_address = "0xfb14537b3e5F603760d3D3EA77903Ce8502cfFdA";
    const instance = await upgradeProxy(existing_address, Main, { deployer });
    console.log("Upgraded", instance.address);
};

//shaharin dev
//0x62B7d5f419fbcB556bd4fB122389D8B8F4d649a0
//shaharin stg
//0xfb14537b3e5F603760d3D3EA77903Ce8502cfFdA
//omar dev
// 0x0630FcEE35BcDC9a1AE0F4F2995bCf036DD5Edfd
//omar stg
// 0x25ca56737045F811C1523225D337268e3C5A6a8A
