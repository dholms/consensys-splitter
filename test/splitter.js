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



  it("should split value between accounts evenly", function() {
    var value = 50;
    var half = Math.floor(value/2);

    return contract.split(bob, carol,{from:owner, value: value})
    .then(function(success){
      return contract.balances(bob);
    })
    .then(function(balance){
      assert.equal(balance, half, "Did not split value in half");
      return contract.balances(carol);
    })
    .then(function(balance){
      assert.equal(balance, half, "Did not split value in half");
    })
  });

  it("should give extra value to the owner", function(){
    var value = 51;
    var half = Math.floor(value/2);
    var extra = 51%2;

    return contract.split(bob, carol,{from:owner, value: value})
    .then(function(tx){
      return contract.balances(bob);
    })
    .then(function(balance){
      assert.equal(balance, half, "Did not split value in half");
      return contract.balances(carol);
    })
    .then(function(balance){
      assert.equal(balance, half, "Did not split value in half");
      return contract.balances(owner);
    })
    .then(function(balance){
      assert.equal(balance, extra, "Owner did not get extra value");
    });
  });

  it("Should allow withdrawals", function(){
    var bobBalance= web3.eth.getBalance(bob);
    var carolBalance= web3.eth.getBalance(carol);
    var gasPrice = 20;

    var value = 50;
    var half = Math.floor(value/2);

    return contract.split(bob, carol, {from:owner, value:value})
    .then(function(tx){
      return contract.retrieveFunds({from:bob, gasPrice: gasPrice})
    })
    .then(function(tx){
      var txCost = tx.receipt.gasUsed * gasPrice;
      var expected = bobBalance.plus(web3.toBigNumber(half)).minus(txCost);
      var newBalance = web3.eth.getBalance(bob);
      assert.deepEqual(expected, newBalance, "Did not withdraw expected amounts")
      return contract.retrieveFunds({from:carol, gasPrice: gasPrice})
    })
    .then(function(tx){
      var txCost = tx.receipt.gasUsed * gasPrice;
      var expected = carolBalance.plus(web3.toBigNumber(half)).minus(txCost);
      var newBalance = web3.eth.getBalance(carol);
      assert.deepEqual(expected, newBalance, "Did not withdraw expected amounts")
    })

  });

});
