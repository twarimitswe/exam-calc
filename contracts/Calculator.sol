// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator {
    // Stores the name as requested
    string private name;

    // Functions to set and get the name
    function setName(string memory _name) public {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    // Calculator functions
    function add(int256 a, int256 b) public pure returns (int256) {
        return a + b;
    }

    function subtract(int256 a, int256 b) public pure returns (int256) {
        return a - b;
    }

    function multiply(int256 a, int256 b) public pure returns (int256) {
        return a * b;
    }

    function divide(int256 a, int256 b) public pure returns (int256) {
        require(b != 0, "Cannot divide by zero");
        return a / b;
    }
}
