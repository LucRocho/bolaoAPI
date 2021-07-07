module.exports=(app)=>{

    let route=app.route('/');
    const message='<h1>Olá pessoal. Sou um servidor restful rodando na porta 4000</h1>';
    route.get((req,res)=> {
        res.send(message);
    });
}