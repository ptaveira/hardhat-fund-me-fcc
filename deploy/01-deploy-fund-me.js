//function deployFunc() {
//    console.log("Hi!");
//}
//module.exports.default = deployFunc;

//module.exports = async (hre) => {
//    const { getNamedAccounts, deployments } = hre;
//};

const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
//this is the same as:
//const helperConfig = require("../helper-hardhat-config");
//const networkConfig = helperConfig.networkConfig
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    //when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
    });
    log("------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
