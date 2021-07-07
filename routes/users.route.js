const users = require('../models/users');
const moment = require("moment");
const util = require('../models/util')
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/users');
    
    //ok
    route.get((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);

        usr.getUsers(searchParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    //ok
    route.post((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        usr.saveUser(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    /*
    route.delete((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        usr.deleteAll('user').then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });
    */

    //ok
    let routeId=app.route('/api/users/:id');
    routeId.delete((req,res)=>{
        let usr = new users(req.app.get('env') == 'development');
        usr.delete(req.params.id,'user').then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    //ok
    routeId.get((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        usr.getById('user',req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    //ok
    let routeLogin=app.route('/api/users/login');
    routeLogin.post((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        usr.login(req.body.email, req.body.password).then(user => {
            res.send(user);
        }).catch(err => {
            res.send({ error: err });
        });
        
    });

    //ok
    let routeChangePassword=app.route('/api/users/changePassword');
    routeChangePassword.post((req,res)=> {
        let usr = new users(req.app.get('env') == 'development');
        usr.changePassword(req).then(results => {
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
        
    });

}