module.exports=(app)=>{

    let route=app.route('/');
    const message='<h1>Olá pessoal. Sou um servidor restful rodando na porta 4101</h1>';
    route.get((req,res)=> {
        res.send(message);
    });
}