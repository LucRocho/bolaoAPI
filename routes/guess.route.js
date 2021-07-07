const guess = require('../models/guess');
const moment = require("moment");
const util = require('../models/util')
moment.locale('pt-BR');

module.exports=(app)=>{

    let route=app.route('/api/guess');
    route.get((req,res)=> {
        let gue = new guess(req.app.get('env') == 'development');
        let searchParams = util.queryStringToJSON(req.query);
        gue.getGuesses(searchParams).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    
    let routeUpdateGuess=app.route('/api/updateGuess');
    routeUpdateGuess.get((req,res)=> {
        let gue = new guess(req.app.get('env') == 'development');
        let updateParams = util.queryStringToJSON(req.query);
        gue.updateGuess(updateParams).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    

    let routeId=app.route('/api/guess/:id');
    routeId.get((req,res)=> {
        let gue = new guess(req.app.get('env') == 'development');
        gue.getGuesses(req.params).then(results=>{
            res.send(results[0]);
        }).catch(err=>{
            res.send({ error: err });
        });
    });

    let routeRanking=app.route('/api/ranking/:id');
    routeRanking.get((req,res)=> {
        let gue = new guess(req.app.get('env') == 'development');
        gue.getRanking(req.params.id).then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });
    });
    

}