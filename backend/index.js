const express = require('express');
const app = express();

//Utiliza porta gerada pela heroku 
//Caso está não esteja definida, utiliza a porta 8080
const PORT = process.env.PORT || 8080;

//var que simula um banco de dados onde na criação de usuario é dado .push
var userData = [];

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
})

//Rota que retorna o hash token e qrcode data_url
app.get('/secret', (req, res) => {

    var speakeasy = require('speakeasy');
    var secret = speakeasy.generateSecret({length: 20});
    
    var QRCode = require('qrcode');
    QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
        res.status(200).send({secretKey: secret, qrCode: data_url});
    });
    
});

//rota que recebe o token digitado e retorna true ou false de acordo com o token gerado pela Google
app.get('/validate', (req , res) =>{

    usertoken = req.query.usertoken;
    base32secret = req.query.base32secret;

    var speakeasy = require('speakeasy');

    var verified = speakeasy.totp.verify({ 
        secret: base32secret,
        encoding: 'base32',
        token: usertoken, 
        window: 2
    });
    console.log(usertoken);
    console.log(verified);

    var tokenEsperado = speakeasy.totp({
        secret: base32secret,
        encoding: 'base32'
      });
    
    console.log(tokenEsperado);

    res.status(200).send({status: verified});
});

//Rota que adiciona o usuario na variavel userData
app.post('/addUser', (req, res)=>{

    usernameStore = req.query.username;
    passwordStore = req.query.password;
    keyStore = req.query.base32secret;

    userData.push({
        username: usernameStore, 
        password: passwordStore, 
        key: keyStore
    });

    console.log(userData);

    res.status(200).json({ ok:true });

});

//Rota que retorna o usuario logado
app.get('/getUser', (req, res)=>{
    res.status(200).send({userData});
});


app.listen(PORT, () => {
    console.log('Server Runing on port 3000');
})


