const team = require('../models/team');
const moment = require("moment");
const util = require('../models/util')
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/teams');
    
    //ok
    route.get((req,res)=> {
        let tm = new team(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);
        
        tm.getTeams(searchParams).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    //ok
    route.post((req,res)=> {
        let tm = new team(req.app.get('env') == 'development');
        tm.saveTeam(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    

    //ok
    let routeId=app.route('/api/teams/:id');
    routeId.delete((req,res)=>{
        let tm = new team(req.app.get('env') == 'development');
        tm.delete(req.params.id,'team').then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });
    //ok
    routeId.get((req,res)=> {
        let tm = new team(req.app.get('env') == 'development');
        tm.getById('team',req.params.id).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

}