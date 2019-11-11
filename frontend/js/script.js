//variavel que simula um banco de dados local
var userData = [
    {username: "rafael", password:"123", key: "LJWV4TZQMJ5ESTCCIY4FCM2NIZCSQ3BU"}
];

//Nome da aplicação no heroku
const herokuAppName = "salty-cliffs-85721"

//URL of API 
//in pattern: https://<nome_aplicação>.herokuapp.com
const URL = "https://"+herokuAppName+".herokuapp.com"

function getInputValue(){
    //Seleciona os elementos dos inputs e define os valores.
    var inputValuser = document.getElementById("username").value;
    var inputValpass = document.getElementById("password").value;
    var inputValToken = document.getElementById("token").value;

    //Default para usuário deslogado.
    var logged = false;

    //realizando requisição na rota /validate do backend para validar o usuario e senha digitado.
    var request = new XMLHttpRequest();
    request.onload = function(){
        if(request.status == 200){
            userData = JSON.parse(request.responseText).userData;
            userData.forEach(function (user, index) {
                if(inputValuser == user.username && inputValpass == user.password){
                    console.log("Usuario e senha corretos...");
                    logged = true;
        
                    //Realizando requisição no backend para validação de token.
                    var request = new XMLHttpRequest();
                    request.onload = function(){
                        if(request.status == 200){
                            var validation = JSON.parse(request.responseText).status;
                            console.log(validation);

                            if (validation == true){
                                alert("Você esta logado -> " + inputValuser);
                                localStorage.setItem("username", user.username);
                                window.location.replace("logged.html");
                                //console.log("replace OK sem flush");
                            }else if(validation == false){
                                alert("Token invalido");
                            }else{
                                alert("erro");
                            }
                        }
                    }
                    //Get na rota /validate passando o token digitado e o secret(hash do token).
                    request.open("GET", URL+"/validate?" + "usertoken=" + inputValToken 
                                                + "&" + "base32secret=" + user.key);
                    request.send(null);
                    request.onerror = function (e) {
                        alert("Erro na validação do token...");
                    };
                }
            });

            console.log("Sucesso na REQ");
            console.log(userData);
            
            if(logged == false){
                alert("Usuário não cadastrado, registre-se...");
            }
        }
    }

    //request para trazer o usuário logado.
    request.open("GET", URL+"/getUser");
    request.send(null);
    request.onerror = function (e) {
        alert("Erro na criação do usuário...");
    };
}

//Função para criar usuário.
function createUser(){

    var inputValuser = document.getElementById("username").value;
    var inputValpass = document.getElementById("password").value;
    
    //request na rota /secret que retorna o token e o qrcode.
    var request = new XMLHttpRequest();
    request.onload = function(){
        if(request.status == 200){
            keyBase32 = JSON.parse(request.responseText).secretKey.base32;
            qrCodeImg = JSON.parse(request.responseText).qrCode;
            console.log("Secret -> " + keyBase32);
            console.log("imgKey -> " + qrCodeImg);
            userData.push({
                username: inputValuser,
                password: inputValpass,
                key: keyBase32
            });       
            console.log(userData);
            
            //Chamada da função que constroi o modal de validação.
            modalValidation(keyBase32, qrCodeImg);

            //Chamada da função para gravar usuário no backend.
            storeUser(inputValuser, inputValpass, keyBase32);

        }
    }
    request.open("GET", URL+"/secret");
    request.send(null);
    request.onerror = function (e) {
        alert("Erro na criação do usuário...");
    };
}

//Função para gravar usuário no backend
function storeUser(inputValuser, inputValpass, keyBase32){

    var request = new XMLHttpRequest();
    request.onload = function(){
        if(request.status == 200){
           console.log("chamada realizada para /addUser")
        }
    }
    request.open("POST", URL+"/addUser?" + "username=" + inputValuser 
                                        + "&" + "password=" + inputValpass 
                                        + "&" + "base32secret=" + keyBase32);
    request.send(null);
    request.onerror = function (e) {
        alert("Erro na criação do usuário...");
    };
}

//Função para gerar modal de validação com qrcode
function modalValidation(keyBase32, qrCodeImg){
    
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

    document.getElementById("secretKey").innerHTML = keyBase32;
    document.getElementById("qrcode").src = qrCodeImg;  
}







