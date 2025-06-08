// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lock {
    uint256 public unlockTime;
    address payable public owner;

    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "unlock time should be in the future"
        );
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    receive() external payable {
        // pas de logique : l’ether reste stocké dans le contrat
    }

    function withdraw() external {
        require(
            block.timestamp >= unlockTime,
            "You can't withdraw yet"
        );
        require(msg.sender == owner, "you aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }
}