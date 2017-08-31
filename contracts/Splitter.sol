pragma solidity ^0.4.13;

contract Splitter{
    address public owner;
    mapping(address=>uint) public balances;

    event LogSplit(address sender, address recipient1, address recipient2, uint amount);
    event LogWithdraw(address retriever, uint amount);
    event LogDestroy();

    function Splitter(){
        owner = msg.sender;
    }

    modifier onlyMe(){
        require(msg.sender == owner);
        _;
    }


    function split(address recipient1, address recipient2) public payable returns(bool success){
        require(msg.value > 1);
        uint toSend = msg.value/2;
        balances[recipient1] += toSend;
        balances[recipient2] += toSend;
        uint extra = msg.value%2;
        balances[owner] += extra;

        LogSplit(msg.sender, recipient1, recipient2, msg.value);

        return true;
    }

    function retrieveFunds() public returns(bool success){
        uint balance = balances[msg.sender];
        require(balance > 0);
        balances[msg.sender] = 0;
        msg.sender.transfer(balance);      
        LogWithdraw(msg.sender, balance);

        return true;
    }

    function kill() onlyMe() public{
        LogDestroy();
        selfdestruct(owner);
    }
}
