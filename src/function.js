const loginForm = document.getElementById("login-form");

function register() {
    var userInput = document.getElementsByName('userArr[]');
    var k = "User information : "

    for (var i = 0; i < userInput.length; i++) {
        var a = userInput[i];
        k = k + a.value + "";
    }

    alert("Register successfully!")
    alert(k)

    document.getElementById("par").innerHTML = k;

}

function login() {
    var userInput = document.getElementsByName('userArr[]');
    uname = loginForm.username.value;
    pass = loginForm.password.value;
    for (var i = 0; i < userInput.length; i++) {
        if (uname == userInput[i].getElementById(uName) && pass == userInput[i].getElementById(password)) {
            alert("Login successfully!!")
            location.reload();
        } else {
            alert("Account not found, Please try again")
        }
    }
}

function addDurian() {
    var durianInfo = document.getElementsByName('durianArr[]');
    var k = "User information : "

    for (var i = 0; i < durianInfo.length; i++) {
        var a = durianInfo[i];
        k = k + a.value + "";
    }

    alert("Added successfully!")
    alert(k)

    document.getElementById("par").innerHTML = k;
}

function search() {
    
}

function buyDurian() {

}



function rate() {
    let star = document.querySelectorAll('input');
    

    for (let i = 0; i < star.length; i++) {
        star[i].addEventListener('click', function () {
            i = this.value;
            // use alert to check whether it has value or not 
            alert(i);
        });
    }
}


function sendDurian(){
    
    let button = document.createElement('button')
    button.innerText = 'Receive'
    var table = document.getElementById("table1");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "Farm Name";
    cell2.innerHTML = "Quantity Received";
    // insert receive button into table 
    cell3.innerHTML = button;
}

function receiveDurian(){
    
}
