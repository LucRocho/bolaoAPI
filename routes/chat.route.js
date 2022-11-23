const chat = require('../models/chat');


module.exports=(app)=>{


    let routeGetById=app.route('/api/chats/chat/:idChat');
    //ok
    routeGetById.get((req,res)=> {
        let ch = new chat(req.app.get('env') == 'development');
        ch.getChat(req.params.idChat).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    let route=app.route('/api/chats/:idGame');
    
    //ok
    route.get((req,res)=> {
        let ch = new chat(req.app.get('env') == 'development');
        ch.getChats(req.params.idGame).then(results=>{
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err=>{
            res.send({ error: err });
        });


    });

    let routeSave=app.route('/api/chats/');
    //ok
    routeSave.post((req,res)=> {
        let ch = new chat(req.app.get('env') == 'development');
        ch.saveChat(req).then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });

    

    //ok
    let routeId=app.route('/api/chats/:id');
    routeId.delete((req,res)=>{
        let ch = new chat(req.app.get('env') == 'development');
        ch.delete(req.params.id,'chat').then(results => {
            //res.setHeader('Access-Control-Allow-Origin','*');
            res.send(results);
        }).catch(err => {
            res.send({ error: err });
        });
    });
    

}