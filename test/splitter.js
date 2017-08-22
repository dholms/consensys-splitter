var Splitter = artifacts.require("./Splitter.sol");
var BigNumber = require('big-number')

contract('Splitter', function(accounts) {

  var owner = accounts[0];
  var bob = accounts[1];
  var carol = accounts[2];
  var david = accounts[3];

  var contract;

  beforeEach(function(){
    return Splitter.new([bob,carol,david], {from:owner})
    .then(function(instance){
      contract = instance;
    });
  });



  it("should split money between accounts evenly", function() {
    var bobBalance = web3.eth.getBalance(bob).toNumber();
    var carolBalance = web3.eth.getBalance(carol).toNumber();
    var davidBalance = web3.eth.getBalance(david).toNumber();
    var value = 99;
    var each = Math.floor(value/3);

    return contract.split({from:owner, value: value})
    .then(function(success){
      assert.equal(bobBalance+500, web3.eth.getBalance(bob).toNumber(), "Recipient didn't get proper amount.")
      assert.equal(carolBalance+each, web3.eth.getBalance(carol).toNumber(), "Recipient didn't get proper amount.")
      assert.equal(davidBalance+each, web3.eth.getBalance(david).toNumber(), "Recipient didn't get proper amount.")
    });
  });

});
