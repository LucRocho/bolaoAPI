const express=require('express');
const consign=require('consign');
var path = require('path');
const cors=require('cors');
var formidable = require("formidable");
//const MyWebSocket = require('./ws/MyWebSocket');


const app = express();

app.use(express.static('public'));

//const myWS=new MyWebSocket().getInstance();

app.use(function (req, res, next) {

    if (req.method === 'POST') {
      var form = formidable.IncomingForm({
        uploadDir: path.join(__dirname, '/public/images'),
        keepExtensions: true
      });
      
      form.parse(req, function (err, fields, files) {
        req.body = fields;
        req.fields = fields;
        req.files = files;
        next();
      });
    }
    else {
      next();
    }
});
  
  

app.use(cors({origin: ['http://localhost:8888','http://localhost:8080','http://192.168.0.16:8888','http://192.168.0.16:8080']}));
consign().include('routes').into(app);

app.listen(4101,'127.0.0.1',()=>{
    console.log('Servidor de teste restul rodando na porta 4101');
});