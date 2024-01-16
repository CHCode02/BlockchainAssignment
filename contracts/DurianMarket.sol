// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DurianMarket {
    
    struct Location{
        string locationName;
        uint timestamp;
    }
    struct Durian {
        uint256 durianID;
        uint256 durianTreeID;
        string name;
        string colour;
        uint256 size;
        uint256 weight;
        Location registeredLocation;
        Location distributedLocation;
        Location retailedLocation;
        string harvestDate;
        Rating rating;
        address userAddress;
    }

    struct Transaction{
        uint id;
        address sender;
        uint256[] items;
        address receiver;
        bool status;
    }

     struct Rating {
        uint256 creaminess;
        uint256 taste;
        uint256 fragrance;
        string comment;
    }
    


    // This line declares a public array of type Durian called durians. 
    // It will hold all the durians in the market.
    //change to mapping as it is more ez to search
    //Durian[] public durians;
    mapping(uint256 => Durian) durians;

    mapping(address => uint[]) ownedDurians;

    mapping(uint256 => Transaction) transactions;

    mapping(address => uint[]) userTransactions;

    uint transactionCount = 0;

    // This line declares a public mapping called durianToOwner that maps each Durian ID to its owner's Ethereum address.
    //mapping(uint256 => address) public durianToOwner;

    // This line declares a public mapping called ownerDurianCount that maps each owner's Ethereum address to the number of durians they own.
    //mapping(address => uint256) ownerDurianCount;

    // This function allows the addition of a new durian to the durians array. 
    // It takes in 9 parameters that represent the attributes of the durian. 
    // It creates a new Durian struct with these attributes and adds it to the end of the durians array. 
    // It also updates the durianToOwner mapping to associate the new Durian ID with the caller's Ethereum address, and increments the number of durians that the caller owns in the ownerDurianCount mapping.
    function addDurian(uint256 _durianID, uint256 _durianTreeID, string memory _name, string memory _colour, uint256 _size, uint256 _weight, string memory _harvestDate, string memory _registeredLocation,address _address) public {
        Durian memory newDurian ;
        newDurian.durianID = _durianID;
        newDurian.durianTreeID =  _durianTreeID;
        newDurian.name= _name;
        newDurian.colour= _colour;
        newDurian.size= _size;
        newDurian.weight = _weight;
        newDurian.harvestDate= _harvestDate;
        newDurian.registeredLocation.locationName = _registeredLocation;
        newDurian.registeredLocation.timestamp = block.timestamp;
        newDurian.userAddress = 0x0000000000000000000000000000000000000000;
        durians[_durianID] = newDurian;
        ownedDurians[_address].push(_durianID);
    }

    function addRating(uint256 durianId, uint256 taste, uint256 creaminess, uint256 fragrance, string memory comment) public {      
        require(creaminess >= 1 && creaminess <= 6, "Invalid rating value");
        require(creaminess >= 1 && creaminess <= 6, "Invalid rating value");
        require(creaminess >= 1 && creaminess <= 6, "Invalid rating value");
        Rating memory newRating = Rating(creaminess, taste,fragrance, comment);
        durians[durianId].rating = newRating;
    }


    function getRating(uint256 durianId) public view returns (uint256, uint256,uint256,string memory) {

        Rating memory rating = durians[durianId].rating;
        return (rating.creaminess, rating.taste, rating.fragrance,rating.comment);
    }

    



    // This is a public function called getDurianById, which takes in an unsigned integer _id as input and returns a tuple of nine values, each with a specific data type.
    function getDurianById(uint256 _durianID) public view returns (uint256, uint256,string memory, string memory,uint256,uint256,string memory,string memory,string memory, string memory) {
        
        // This line creates a new Durian struct called durian, which is initialized with the durian in the durians array that has the ID _id. 
        // The memory keyword specifies that this struct should be stored in memory rather than storage.
        Durian memory durian = durians[_durianID];
        
        // This line returns a tuple of the durian's attributes, in the order specified by the function's return statement. The values are obtained from the durian struct created in the previous line.
        return (durian.durianID, durian.durianTreeID ,durian.name, durian.colour, durian.size, durian.weight, durian.harvestDate,durian.registeredLocation.locationName,durian.distributedLocation.locationName,durian.retailedLocation.locationName);
    }

    function getDurianLocation(uint256 durianID)public view returns(string memory){
        return durians[durianID].registeredLocation.locationName;
    }

    function showAllOwnedDurians(address _address)public view returns(uint[] memory){
        return ownedDurians[_address];
    }

    function transferDurians(uint quantity, address target,address sender)public{
        uint256[] memory sendDurians = new uint256[](quantity);

        for (uint i = 0; i < quantity; i++) {
            uint id = ownedDurians[sender][i];
            sendDurians[i] = id;
        }
        //move the durians in front of array

        for (uint i = quantity; i < ownedDurians[sender].length; i++) {
            ownedDurians[sender][i - quantity] = ownedDurians[sender][i];
        }

        for (uint i = 0; i < quantity; i++) {
            ownedDurians[sender].pop();
        }
       
        Transaction memory transaction = Transaction(transactionCount, sender,sendDurians,target,false);
        transactions[transactionCount] = transaction;
        userTransactions[target].push(transactionCount);
        transactionCount++;
    }

    function getTransactions(address _address)public view returns(uint[] memory){
        return userTransactions[_address];
    }

    function getTransactionDetail(uint id)public view returns(address,uint256){
        return (transactions[id].sender,transactions[id].items.length);
    }

    function receiveDurians(uint id,uint userType,string memory userLocation) public{
        address receiver = transactions[id].receiver;
        uint256[] memory sendDurians = transactions[id].items;


        for(uint i = 0; i < sendDurians.length;i++){
            
            ownedDurians[receiver].push(sendDurians[i]);
            if(userType == 2){
                durians[sendDurians[i]].distributedLocation.locationName = userLocation;
                durians[sendDurians[i]].distributedLocation.timestamp = block.timestamp;
            }

            if(userType == 3){
                durians[sendDurians[i]].retailedLocation.locationName = userLocation;
                durians[sendDurians[i]].retailedLocation.timestamp = block.timestamp;
            }
        }
        
    }

     function sellDurian(address retailerAddress,address buyerAddress,uint durianId)public {
        
        for (uint256 i = 0; i < ownedDurians[retailerAddress].length; i++) {
            if (ownedDurians[retailerAddress][i] == durianId) {
                if (i != ownedDurians[retailerAddress].length - 1) {
                    ownedDurians[retailerAddress][i] = ownedDurians[retailerAddress][ownedDurians[retailerAddress].length - 1];
                }
                ownedDurians[retailerAddress].pop();
                break;
            }
        }

        ownedDurians[buyerAddress].push(durianId);
    
     }

    function getDurianOrigin(uint id) public view returns(uint, string memory, string memory, string memory){
       return (durians[id].durianTreeID,durians[id].registeredLocation.locationName,durians[id].distributedLocation.locationName,durians[id].retailedLocation.locationName);
    }

    // This function allows the farmers to edit the attributes of a durian based on their selection.
    // function editDurian(uint256 _id, uint256 _selection, string memory _name, string memory _colour, uint256 _size, uint256 _quantity, string memory _provenance, string memory _farmLocation, uint256 _harvestDate, uint256 _harvestMonth, uint256 _harvestYear) public {
        
    //     // checks whether the durian with the given _id exists in the durians array. 
    //     // If it does not exist, the function will revert with the message "Durian does not exist".
    //     require(durians.length > _id, "Durian does not exist");
        
    //     // checks whether the address calling the function (msg.sender) is the owner of the durian with the given _id. 
    //     // If msg.sender is not the owner of the durian, the function will revert with the message "You do not own this Durian".
    //     require(msg.sender == durianToOwner[_id], "You do not own this Durian");

    //     Durian storage durian = durians[_id];
        
    //     if (_selection == 1) {
    //         durian.name = _name;
    //     } else if (_selection == 2) {
    //         durian.colour = _colour;
    //     } else if (_selection == 3) {
    //         durian.size = _size;
    //     } else if (_selection == 4) {
    //         durian.provenance = _provenance;
    //     } else if (_selection == 5) {
    //         durian.farmLocation = _farmLocation;
    //     } else if (_selection == 6) {
    //         durian.harvestDate = _harvestDate;
    //     } else if (_selection == 7) {
    //         durian.harvestMonth = _harvestMonth;
    //     } else if (_selection == 8) {
    //         durian.harvestYear = _harvestYear;
    //     } else {
    //         revert("Invalid selection");
    //     }
    // }
}