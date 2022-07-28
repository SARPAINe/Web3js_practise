// const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const MyContract = artifacts.require("Owner");

module.exports = async function (deployer) {
    // await deployProxy(Main, [], { deployer, initializer: "initialize" });
    await deployer.deploy(MyContract);
};

//shaharin address dev
//0x890052e7FF44544A670A591A3c2f760949E8A1F7
//omar address dev
//0x642dc17856da952119a7D3658ddBDe368cf7f263
//omar address stg
//0x052aA3159F1d57F2fb95ac8eAdCA67c3edC31293
