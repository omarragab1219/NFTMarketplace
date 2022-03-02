//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;
    address payable owner;

    constructor(string memory _greeting,address payable _owner) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
        owner=_owner;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }

    function transferMoney()public payable {
        owner.transfer(msg.value);  
    }
}
