const moment = require("moment");
const util = require('../models/util');
const competition = require('../models/competition');
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/competitions');
    
    //ok
    route.get((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);

        cmp.getCompetitions(searchParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    //ok
    route.post((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.saveCompetition(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    

    let routeId=app.route('/api/competitions/:id');
    //ok
    routeId.delete((req,res)=>{
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.deleteCompetition(req.params.id).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });
    
    //ok
    routeId.get((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.getById('competition',req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeCompetitionsTeams=app.route('/api/competitions/teams/:id');
    //ok
    routeCompetitionsTeams.get((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.getTeamsCompetition(req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeCompetitionsOtherTeams=app.route('/api/competitions/otherteams/:id');
    //ok
    routeCompetitionsOtherTeams.get((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.getTeamsNotInCompetition(req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeCompetitionsSaveTeams=app.route('/api/competitions/teams');
    routeCompetitionsSaveTeams.post((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.saveTeamsCompetition(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });


    //ok
    let routeActiveCompetition=app.route('/api/activeCompetition');
    routeActiveCompetition.get((req,res)=> {
        let cmp = new competition(req.app.get('env') == 'development');
        cmp.getActiveCompetition().then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });


}