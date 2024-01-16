// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./User.sol";
import "./DurianMarket.sol";

contract Facade {

     User sessionUser;
     DurianMarket instance = new DurianMarket();
     address payable public owner;

     constructor(){
          owner = payable (msg.sender);
     }

    mapping(address => User) private users;

    function register(string memory _username, string memory _pass, string memory _name, string memory _address, uint _postal, string memory _state, uint _userType) public {
    require(bytes(_username).length > 0, "Username required");
    require(bytes(_pass).length > 0, "Password required");
    User newUser = new User(_username, _pass, _name,_address,_postal,_state,_userType);

    users[msg.sender] = newUser;
    }


 
 function getAddress()public view returns(address){
      return msg.sender;
 }

  function login(string memory username, string memory password)public {
    require(keccak256(bytes(users[msg.sender].getUsername())) == keccak256(bytes(username)), "Incorrect username");
    require(keccak256(bytes(users[msg.sender].getPassword())) == keccak256(bytes(password)), "Incorrect password");

    sessionUser = users[msg.sender];

  }

   function getCurrentUserDetail() public view returns(string memory, string memory,uint256,string memory ){
      require(bytes(sessionUser.getUsername()).length != 0,"Please log in");
      return (sessionUser.name(),sessionUser.homeAddress(),sessionUser.postal(),sessionUser.state());
  }

  function rateDurian(uint256 durianId, uint256 taste, uint256 creaminess, uint fragrance,string memory comment)public{
      //require(sessionUser.userAddress != 0x0000000000000000000000000000000000000000, "Not the Owner Of Durian");
     instance.addRating(durianId,taste,creaminess,fragrance, comment);
  }

  function getDurianDetail(uint256 durianID)public view returns(uint256, uint256,string memory, string memory,uint256,uint256,string memory,string memory,string memory, string memory){
       return instance.getDurianById(durianID);
  }

function getDurianLocation(uint256 durianID)public view returns(string memory){
        return instance.getDurianLocation(durianID);
    }


  function addDurian(uint256 _durianID, uint256 _durianTreeID, string memory _name, string memory _colour, uint256 _size, uint256 _weight, string memory _harvestDate) public{
        string memory fullAddress = string(abi.encodePacked(sessionUser.name(),sessionUser.homeAddress()));
       instance.addDurian(_durianID, _durianTreeID, _name,  _colour, _size, _weight, _harvestDate, fullAddress,msg.sender);
  }

  function showAllOwnedDurians(address ownerAddress)public view returns(uint[] memory){
       return instance.showAllOwnedDurians(ownerAddress);
  }

  function transferDurians(uint quantity, address target, address source)public{
       
       instance.transferDurians(quantity, target,source);
  }

  function receiveDurians(uint id) public{
       string memory fullAddress = string(abi.encodePacked(sessionUser.name(),sessionUser.homeAddress()));
       instance.receiveDurians(id, sessionUser.userType(), fullAddress);
  }

  function getTransactions(address senderAddress)public view returns(uint[] memory){
       return instance.getTransactions(senderAddress);
  }

  function getTransactionDetail(uint id)public view returns(string memory ,uint256){
        (address source, uint256 quantity) = instance.getTransactionDetail(id);
        return (users[source].name(),quantity);
    }

  function getDurianOrigin(uint id) public view returns(uint ,string memory, string memory, string memory){
       return instance.getDurianOrigin(id);
  }

  function buyDurian(address durianRetailer,address durianBuyer,uint durianId, uint durianFee)public payable{
       require(msg.value >= durianFee);
		owner.transfer(msg.value);
          instance.sellDurian(durianRetailer,durianBuyer,durianId);

  }
    
}