pragma solidity ^0.4.13;

contract Splitter{
    address public owner;
    address[] public recipients;
    uint    public balance;

    function Splitter(address[] _recipients){
        owner= msg.sender;
        recipients = _recipients;
        balance = 0;
    }

    modifier onlyMe(){
        require(msg.sender == owner);
        _;
    }

    function split() onlyMe() public payable returns(bool success){
        require(msg.value > recipients.length);
        balance += msg.value;
        uint toSend = msg.value/recipients.length;
        uint getsExtra = msg.value%recipients.length;

        for(uint i=0;i<recipients.length;i++){
            uint amount = toSend;
            if(i < getsExtra) amount++;
            sendFunds(recipients[i], amount);
        }
        return true;
    }

    function sendFunds(address recipient, uint amount) internal{
        recipient.transfer(amount);
    }

    function kill() onlyMe() public{
        selfdestruct(owner);
    }
}
