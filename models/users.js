const util = require('./util');
const path = require('path');
const model = require('./model');

class users extends model{
    
   //ok
    login(email,password){
        return new Promise((resolve,reject)=>{
            this.executeSQL('select * from user where email=?',[email])
            .then(results=>{
                    if (results.length==0) {
                        reject('Usuário inválido');
                    }
                    else{
                        let row=results[0];
                        let decryptedBDPassword=util.decryptText(row.password);
                        if (decryptedBDPassword!==password){
                            reject('Senha inválida');

                        }
                        else if(!row.active){
                            reject('Usuário inativo');
                        }
                        else{
                            resolve(row);
                        }
                    }
                
            }).catch(err=>{
                reject(err);
            });
        });
    }

    

    
    changePassword(req){
        return new Promise((resolve,reject)=>{
            if(!req.fields.password || !req.fields.retypedPassword){
                reject("Preencha todos os campos");
            } else if (req.fields.password!==req.fields.retypedPassword){
                reject("A senha e sua confirmação não conferem");
            } else{
                let encryptedPassword=util.encryptText(req.fields.password);
                let params=[];
                params.push(encryptedPassword);  
                
                params=this.getSaveParams(params,req.fields.loggedUserId);
                params.push(req.fields.id);
                this.executeSQL('update user set password=?,  last_update_user=?, last_update_date=? where id=?',params)
                .then(results=>{
                    resolve(results);
                }).catch(err=>{
                    reject(err)  ;
                })
            }
        });
    }

    getUsers(searchParams){
        
        let whereClause='';
        if (searchParams){
            for(var k in searchParams) {
                if (searchParams[k]){
                    switch (k){
                        case 'id':
                            whereClause+=` and id=${searchParams[k]}`;
                            break;
                        case 'name':
                            whereClause+=` and name like '%${searchParams[k]}%' `;
                            break;
                        case 'email':
                            whereClause+=` and email like '%${searchParams[k]}%' `;
                            break;    
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select * 
                from	user
                where (1=1
                    ${whereClause}
                )    
                order by name `;      
        
                
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });        

    }

    saveUser(req){
        return new Promise((resolve,reject)=>{

                if (req.files.photo){
                    req.fields.photo= `images/${path.parse(req.files.photo.path).base}`;
                }
                
                if (!req.fields.name || !req.fields.email){
                    reject("Preencha nome e e-mail");
                } else if(!req.fields.id && !req.fields.password){
                    reject("Preencha a senha");
                } else if(!req.fields.id && req.fields.loggedUserAdministrator==0){
                    reject("Usuário sem permissão de inclusão");
                } else if(req.fields.id && req.fields.loggedUserAdministrator==0 && (!req.fields.active|| req.fields.administrator)){
                    reject("Usuário sem permissão para essa alteração");
                } else{
                    let valueParams=[   
                        req.fields.name,
                        req.fields.email,
                        (req.fields.administrator=='false' || req.fields.administrator=='0'?0:1),
                        (req.fields.active=='false' || req.fields.active=='0'?0:1)
                    ];
                    let fieldParams=[   
                        'name',
                        'email',
                        'administrator',
                        'active'
                    ];
                    if (req.files.photo && req.files.photo.name){
                        valueParams.push(req.fields.photo);
                        fieldParams.push('photo');
                    }
                    if (!req.fields.id){
                        let encryptedPassword=util.encryptText(req.fields.password);
                        valueParams.push(encryptedPassword);
                        fieldParams.push('password');
                    }                        
                    
                    this.save('user',req,fieldParams,valueParams).then(results=>{
                        resolve(results);
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }
}
module.exports = users;