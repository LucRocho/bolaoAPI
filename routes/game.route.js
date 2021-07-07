const game = require('../models/game');
const moment = require("moment");
const util = require('../models/util')
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/game');
    //ok
    route.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);
        
        gam.getGames(searchParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    //ok
    route.post((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.saveGame(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    

    //ok
    let routeId=app.route('/api/game/:id');
    routeId.delete((req,res)=>{
        let gam = new game(req.app.get('env') == 'development');
        gam.delete(req.params.id,'game').then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    //ok
    routeId.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getGames(req.params).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results[0]);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeUsersGame=app.route('/api/game/users/:id');
    //ok
    routeUsersGame.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getUsersGame(req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeGamesTeam=app.route('/api/game/teams/:id');
    //ok
    routeGamesTeam.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getTeams(req.params.id).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeValuesGame=app.route('/api/game/values/:id');
    //ok
    routeValuesGame.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getValues(req.params.id).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeActiveGamesUser=app.route('/api/user/games/:id');
    //ok
    routeActiveGamesUser.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getActiveGamesUser(req.params.id).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeOtherUsersGame=app.route('/api/game/otherusers/:id');
    //ok
    routeOtherUsersGame.get((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.getUsersNotInGame(req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeGameSaveUsers=app.route('/api/game/users');
    routeGameSaveUsers.post((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.saveUsersGame(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    let routeGamePaid=app.route('/api/game/paid/');
    routeGamePaid.post((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.setGamePaid(req.params.idGame,req.params.idUser,req.params.paid).then(results => {
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    let routeToogleGamePaid=app.route('/api/game/paid/:id');
    routeToogleGamePaid.post((req,res)=> {
        let gam = new game(req.app.get('env') == 'development');
        gam.toogleGamePaid(req.params.id).then(results => {
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    

}