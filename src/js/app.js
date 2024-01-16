let address;
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    
  

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
       address = accounts[0]
        document.getElementById("accountArea").innerHTML = address;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {

      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {


    $.getJSON('Facade.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var FacadeArtifact = data;
      App.contracts.Facade = TruffleContract(FacadeArtifact);
      
      // Set the provider for our contract
      App.contracts.Facade.setProvider(App.web3Provider);
      
    });

    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#btn-login', App.handleLogin);
    $(document).on('click', '#btn-register', App.handleRegister);
    $(document).on('click', '#btn-detail', App.getUserDetail);
    $(document).on('click', '#btn-add', App.addCart);
    $(document).on('click', '#search-zy', App.getDurianDetail); 
    $(document).on('click', '#rate', App.addRating); 
    $(document).on('click', '#addDurian', App.handleAddDurian); 
    $(document).on('click', '#addPrice', App.addPrice); 
    $(document).on('click', '#purchase', App.purchaseDurian); 
    $(document).on('click', '#sendDurian', App.sendDurian); 
    $(document).on('click', '.receive-btn', App.receiveDurian); 
    $(document).on('click', '#buyDurian', App.buyDurian); 
  },

  
  handleLogin: function(event) {
    var FacadeInstance;
   

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;

      var username = document.getElementById("loginUsername").value;
      var password = document.getElementById("loginPassword").value;
    
      FacadeInstance.login(username, password,{from:address});
      
    })
      .then(function(){
         return FacadeInstance.getCurrentUserDetail.call();
      }).then(function(user){
        document.getElementById('fName').value = user[0]
        document.getElementById("fLocation").value = user[1]
        App.loadDurians()
        App.loadTransactions()
        App.loadRetailerDurian()
      })
    .catch(function(err) {
      console.log(err.message);
    });

  },

  handleRegister: function(event) {
    console.log("register")
    event.preventDefault();
    var FacadeInstance;
   
  

   App.contracts.Facade.deployed().then(function(instance) {
    FacadeInstance = instance;
      
      var username = document.getElementById("regUsername").value;
      var password = document.getElementById("regPassword").value;
      var name = document.getElementById("regName").value;
      var userAddress = document.getElementById("regAddress").value;
      var postal = document.getElementById("regPostal").value;
      var state = document.getElementById("regState").value;
      var user = document.getElementById("user").value;
      var userInt;
      if(user == "Farmer"){
        userInt = 1;
      }
      else if(user == "Distributor"){
        userInt = 2;
      }
      else if(user == "Retailer"){
        userInt = 3;
      }
      else if(user == "Customer"){
        userInt = 4;
      }

      alert(userInt);
      
      return FacadeInstance.register(username, password,name,userAddress,postal,state,userInt, {from:address});
    
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  getUserDetail: function(event){
    event.preventDefault();
    var FacadeInstance;
    var UserInstance;

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;

      return FacadeInstance.getCurrentUser.call();
      
    }).then(function(user){
      document.getElementById('user-detail').textContent = user;
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  
  handleAddDurian: function(event){
    event.preventDefault();
    var FacadeInstance;
    
    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
      var durianHarvestDate = document.getElementById("dHarvestDate").value;
      var durianID = parseInt(document.getElementById("dID").value);
      var treeID = parseInt(document.getElementById("tID").value);
      var durianName = document.getElementById("dName").value;
      var durianColour = document.getElementById("dColour").value;
      var durianSize = parseInt(document.getElementById("dSize").value);  //change
      var durianWeight = parseInt(document.getElementById("dWeightInKg").value);
      // var farmName = document.getElementById("fName").value;
      // var farmLocation = document.getElementById("fLocation").value;
      //name and location based on user account name and address : Too much input cant compile
      
       FacadeInstance.addDurian(durianID, treeID, durianName, durianColour, durianSize, durianWeight, durianHarvestDate, {from:address});
    }).then(function(){
        App.loadDurians()
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  
  getDurianDetail: function(event) {
    event.preventDefault();
    var FacadeInstance;

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;  
      var durianID = parseInt(document.getElementById("search-durian-zy").value);
      console.log(FacadeInstance)
      //changed to .call because its a view function
      return FacadeInstance.getDurianDetail.call(durianID)
    }).then(function(durian){
      //durian[0]  = durianId, durian[1] = tree id 
      // return values: durian.durianID, durian.durianTreeID ,durian.name, durian.colour, durian.size, durian.weight, durian.harvestDate,durian.registeredLocation.locationName < this one is farm name + location
      // do something that you want
      //remove durian id as return paramater
      document.getElementById("durian-tree").textContent = durian[1]
      document.getElementById("durian-name").textContent = durian[2];
      document.getElementById("durian-colour").textContent = durian[3];
      document.getElementById("durian-size").textContent = durian[4]
      document.getElementById("durian-weight").textContent = durian[5].toNumber();
      document.getElementById("durian-harvest").textContent = durian[6];
      document.getElementById("durian-farm").textContent = durian[7]
      document.getElementById("durian-distributor").textContent = durian[8]
      document.getElementById("durian-retailer").textContent = durian[9]
    })
    // .catch(function(err) {
    //   console.log(err.message);
    // });
  
  },
  
  addRating: function(event){
    event.preventDefault();
    var FacadeInstance;
    
    var _durianID = document.getElementById("searchID").value; //"searchID" from HTML 
    var newPrice = document.getElementsById("durianArr[]").value;
    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
        
      return FacadeInstance.getRating.call();
    }).then(function(rating){

      //Function Name from your Smart Contract exp: fun()
      //.fun([function Input without '[]'],{from:address}) - for not public view function - need deduce gas fee
      //.getItemCount.call(); - for public view - X deduce gas fee (View Only)

    })

    //console.log(rating[0].toNumber()); //Rating 1
    //console.log(rating[1].toNumber()); //Rating 2
    //console.log(rating[2].toNumber()); //Rating 3

    //do how your result need to display/if..else thing https://www.w3schools.com/nodejs/default.asp
     //console.log(getRating().count[index number].toNumber()) - addRating() return number from DurianMarket.sol
  },

  sendDurian:function(){

    var quantity = document.getElementById("qtt").value; 
    var targetAddress = document.getElementById("sendAddress").value

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
        
      FacadeInstance.transferDurians(quantity,targetAddress,address,{from:address})
    }).then(function(rating){
      alert("Sent succesful")
    })

    

  },
  loadDurians:function(){
    var FacadeInstance;

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
     
      return FacadeInstance.showAllOwnedDurians.call(address)
    }).then(async function(durians){
      var ownedDurians = $('#ownedDurians');
      var durianTemplate = $('#owned-durian-template');

      for(let i = 0;i<durians.length;i++){
       
         var item = await FacadeInstance.getDurianDetail.call(parseInt(durians[i].toNumber()));
         durianTemplate.find('.owned-durian-name').text(item[2]);
         durianTemplate.find('.owned-durian-id').text(item[0]);
         ownedDurians.append(durianTemplate.html());

        
      }

   
    })
  },
  loadTransactions:function(){
    var FacadeInstance;

    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
     
      return FacadeInstance.getTransactions.call(address)
    }).then(async function(transactions){
      var table = document.getElementById("table1");

      for(let i = 0;i<transactions.length;i++){
        var id = parseInt(transactions[0])

         var item = await FacadeInstance.getTransactionDetail.call(id);
         var row = table.insertRow(1);
         var cell1 = row.insertCell(0);
         var cell2 = row.insertCell(1);
         var cell3 = row.insertCell(2);

        cell1.innerHTML = item[0]
        cell2.innerHTML = item[1].toNumber()
        cell3.innerHTML = "<button class='receive-btn' data-value="+ id + ">Receive</button>"
      }

   
    })

  },

  receiveDurian:function(event){
    const target  = event.currentTarget;
    const id = target.getAttribute('data-value');
  
    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
        
      FacadeInstance.receiveDurians(id,{from:address})
    }).then(function(){
      alert("Received!")
    })
    
  },


  loadRetailerDurian(){
    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;

      return FacadeInstance.showAllOwnedDurians.call("0x1303B8a6bE81E384dE36b4bB0e26B5ded81b0130")
    }).then(async function(durians){
      var ownedDurians = $('#purchaseDurians');
      var durianTemplate = $('#purchase-durian-template');

      for(let i = 0;i<durians.length;i++){
       
         var item = await FacadeInstance.getDurianDetail.call(parseInt(durians[i].toNumber()));
         durianTemplate.find('.purchase-name').text(item[2]);
         durianTemplate.find('.purchase-id').text(item[0]);
         durianTemplate.find('.purchase-colour').text(item[3]);
         durianTemplate.find('.purchase-size').text(item[4]);
         durianTemplate.find('.purchase-weight').text(item[5]);
         ownedDurians.append(durianTemplate.html());

      }

   
    })
  },
  buyDurian:function(){


    App.contracts.Facade.deployed().then(function(instance) {
      FacadeInstance = instance;
        
      var durianId = document.getElementById("buy-id");
      

      //input address
      FacadeInstance.buyDurian( "0x1303B8a6bE81E384dE36b4bB0e26B5ded81b0130",durianId,0,{from: address, value: 5000000000000000000n})
      
    })
  }
  
  


  

  

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
