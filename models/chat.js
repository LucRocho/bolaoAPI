const model = require('./model');

class chat extends model{
    
   
    //ok
    getChats(idGame){
        
        let sql=`select ch.*,us.name,us.photo
            ,ch2.message as originalMessage, ch2.creation_date as originalDate, us2.name as originalUserName 
            from chat ch join user us on ch.creation_user=us.id
            left join chat ch2 on ch.id_chat_original=ch2.id
            left join user us2 on ch2.creation_user=us2.id
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

    //ok
    getChat(idChat){
        
            let sql=`select ch.*,us.name,us.photo
                ,ch2.message as originalMessage, ch2.creation_date as originalDate, us2.name as originalUserName 
                from chat ch join user us on ch.creation_user=us.id
                left join chat ch2 on ch.id_chat_original=ch2.id
                left join user us2 on ch2.creation_user=us2.id
                where ch.id=${idChat}`;      
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
                        req.fields.id_game,
                    ];

                    let fieldParams=[   
                        'message',
                        'id_game',
                    ];

                    if (req.fields.id_chat_original){
                        valueParams.push(req.fields.id_chat_original);
                        fieldParams.push('id_chat_original');
                    }

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