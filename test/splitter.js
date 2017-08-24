var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var bob = accounts[1];
  var carol = accounts[2];

  var contract;

  beforeEach(function(){
    return Splitter.new({from:owner})
    .then(function(instance){
      contract = instance;
    });
  });



  it("should split money between accounts evenly", function() {
    var bobBalance = web3.eth.getBalance(bob).toNumber();
    var carolBalance = web3.eth.getBalance(carol).toNumber();
    var value = 50;
    var each = Math.floor(value/2);

    return contract.split(bob, carol,{from:owner, value: value})
    .then(function(success){
      return contract.retrieveFunds({from:bob})
      // assert.equal(bobBalance+500, web3.eth.getBalance(bob).toNumber(), "Recipient didn't get proper amount.")
      // assert.equal(carolBalance+each, web3.eth.getBalance(carol).toNumber(), "Recipient didn't get proper amount.")
    })
    .then(function(success){
      assert.equal(bobBalance, web3.eth.getBalance(bob).toNumber(), "Original: "+bobBalance + ", new: " + web3.eth.getBalance(bob).toNumber())
    })
  });

});
