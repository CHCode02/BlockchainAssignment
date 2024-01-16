var User  = artifacts.require("./User.sol");
var DurianMarket  = artifacts.require("./DurianMarket.sol");
var Facade  = artifacts.require("./Facade.sol");

module.exports = function(deployer) {
  deployer.deploy(User,"deb123", "123", "deb", "test",123,"test",0);
  deployer.deploy(DurianMarket);
  deployer.deploy(Facade);
};
