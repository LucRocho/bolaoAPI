const match = require('../models/match');
const moment = require("moment");
const util = require('../models/util')
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/match');
    //ok
    route.get((req,res)=> {
        let mat = new match(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);
        
        mat.getMatches(searchParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    //ok
    route.post((req,res)=> {
        let mat = new match(req.app.get('env') == 'development');
        mat.saveMatch(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    //ok
    let routeUpdateScore=app.route('/api/updateScore');
    routeUpdateScore.get((req,res)=> {
        let mat = new match(req.app.get('env') == 'development');
        let updateParams = util.queryStringToJSON(req.query);
        mat.updateScore(updateParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    

    //ok
    let routeId=app.route('/api/match/:id');
    routeId.delete((req,res)=>{
        let mat = new match(req.app.get('env') == 'development');
        mat.deleteMatch(req.params.id).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    //ok
    routeId.get((req,res)=> {
        let mat = new match(req.app.get('env') == 'development');
        mat.getMatches(req.params).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results[0]);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    

}