const model = require('./model');
const path = require('path');
const MyWebSocket = require('./../ws/MyWebSocket');



class chat extends model{
    

    getNovaMensagem(searchParams){
        let sql=`select newMessage from game_user where id_game=${searchParams['idGame']} and id_user=${searchParams['idUser']}`;      
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results[0]);
            }).catch(er=>{
                reject(er);
            });
        });         
    }
   
    //ok
    getChats(searchParams){

        let sql=`select ch.*,us.name,us.photo
            ,ch2.message as originalMessage, ch2.creation_date as originalDate, us2.name as originalUserName,ch2.chat_image as imageOriginal
            from chat ch join user us on ch.creation_user=us.id
            left join chat ch2 on ch.id_chat_original=ch2.id
            left join user us2 on ch2.creation_user=us2.id
            where ch.id_game=${searchParams['idGame']}
            order by ch.creation_date desc `;      
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{

                this.indicaMensagensLidas(searchParams['idGame'],searchParams['idUser']).then(res=>{
                    
                    resolve(results);
                }).catch(er=>{
                    reject(er);
                });

                
            }).catch(err=>{
                reject(err);
            });

        });        

    }

    //ok
    getChat(idChat){
        
            let sql=`select ch.*,us.name,us.photo
                ,ch2.message as originalMessage, ch2.creation_date as originalDate, us2.name as originalUserName,ch2.chat_image as imageOriginal
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

                if (!req.fields.message && !req.files.chat_image){
                    reject("Preencha uma mensagem");
                } else{
                    if (req.files && req.files.chat_image){
                        req.fields.message='***IMAGEM***'
                    }
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

                    if (req.files && req.files.chat_image && req.files.chat_image.name){
                        valueParams.push(`images/${path.parse(req.files.chat_image.path).base}`);
                        fieldParams.push('chat_image');
                    }
                    this.save('chat',req,fieldParams,valueParams).then(results=>{

                        this.indicaNovaMensagem(req.fields.id_game,req.fields.loggedUserId).then(res=>{
                            resolve(results);
                        }).catch(er=>{
                            reject(er);
                        });

                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }

    indicaNovaMensagem(idGame,idUser){
        return new Promise((resolve,reject)=>{
            let sqlUpdate=`update game_user set newMessage=1 where id_game=${idGame} and id_user<>${idUser}`;
            this.executeSQL(sqlUpdate).then(res=>{
                
                //comunicar via websockets que criou-se nova mensagem
                const myWS=new MyWebSocket().getInstance();
                myWS.sendMessageAll({'message':'novaMensagem','user': idUser,'game':idGame})
                

                resolve(res)

            }).catch(err=>{
                reject(err);
            })
        })
    }

    indicaMensagensLidas(idGame,idUser){
        return new Promise((resolve,reject)=>{
            let sqlUpdate=`update game_user set newMessage=0 where id_game=${idGame} and id_user=${idUser}`;
            this.executeSQL(sqlUpdate).then(res=>{

                //comunicar via websockets que mensagens foram lidas para o usuário logado
                const myWS=new MyWebSocket().getInstance();
                myWS.sendMessageAll({'message':'mensagensLidas','user': idUser,'game':idGame})

                resolve(res)
            }).catch(err=>{
                reject(err);
            })
        })
    }
}
module.exports = chat;