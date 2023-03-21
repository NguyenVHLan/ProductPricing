const Marketplace = artifacts.require("ProductPricing");

module.exports = function(deployer) {
  deployer.deploy(ProductPricing);
};
