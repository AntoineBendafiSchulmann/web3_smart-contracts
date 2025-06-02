// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Safe {
    address public owner;

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Safe: not owner");
        _;
    }

    function changeOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Safe: zero address");
        emit OwnerChanged(owner, _newOwner);
        owner = _newOwner;
    }
}