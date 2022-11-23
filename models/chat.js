const model = require('./model');

class chat extends model{
    
   
    //ok
    getChats(idGame){
        
        let sql=`select ch.*,us.name,us.photo
            from chat ch join user us on ch.creation_user=us.id
            where ch.id_game=${idGame}
            order by ch.creation_date desc `;      
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });        

    }

    saveChat(req){
        return new Promise((resolve,reject)=>{
                
                if (!req.fields.message){
                    reject("Preencha uma mensagem");
                } else{
                   
                    let valueParams=[   
                        req.fields.message,
                        req.fields.id_game
                    ];

                    let fieldParams=[   
                        'message',
                        'id_game'
                    ];
                    this.save('chat',req,fieldParams,valueParams).then(results=>{
                        resolve(results);
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }
}
module.exports = chat;