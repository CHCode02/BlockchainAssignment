//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract User{
    string username;
    string password;
    string public name;
    string public homeAddress;
    uint public postal;
    string public state;
    uint public userType; //1:Farmer 2:Distributor 3:Retailer
   


    constructor(string memory _username, string memory _pass, string memory _name, string memory _address, uint _postal, string memory _state,uint _type){
        username = _username;
        password = _pass;
        name = _name;
        homeAddress = _address;
        postal = _postal;
        state = _state;
        userType  = _type;
    }

    function getUsername() public view returns(string memory){
        return username;
    }

    function getPassword() public view returns(string memory){
        return password;
    }

    function getAddr() public view returns(string memory){
        return homeAddress;
    }

    function getName() public view returns(string memory){
        return name;
    }


    function getUserType()public view returns(uint256){
        return userType;
    }


   
}