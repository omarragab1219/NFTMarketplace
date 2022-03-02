//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Test {
  address public owner;
  mapping (int=> string ) public userMessage;
  int public count;


  event testEvent(address caller, string message) ;

    constructor(address _owner) {
        console.log("deploying test contract for subgraph");
        owner=_owner;
    }


    function setMessage(string memory _message) public {
        userMessage[count]=_message;
         count ++;
         emit testEvent(msg.sender,_message);
        
    }

}
