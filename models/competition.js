const util = require('./util');
const path = require('path');
const model = require('./model');

class competition extends model{
    
   
    getCompetitions(searchParams){
        
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
                        case 'active':
                                whereClause+=` and active='${searchParams[k]}' `;
                                break;    
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select * 
                from	competition
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

    getTeamsCompetition(idCompetition){
        let sql=`select t.* 
                from	team_competition tc
                        join team t
                            on t.id=tc.id_team
                where  tc.id_competition=${idCompetition} order by t.name`;      
        
                
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });         
    }

    getTeamsNotInCompetition(idCompetition){
        let sql=`select	t.*
        from	team t
        where	t.id not in
                (select id_team from team_competition where id_competition=${idCompetition})
        order by t.name`;      
               
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });         
    }

    saveTeamsCompetition(req) {
        return new Promise((resolve,reject)=>{
            let sqlDelete=`delete from team_competition where id_competition=${req.fields.competitionId}`;
            let sqlInsert=`INSERT INTO team_competition (id_team,id_competition,creation_user,creation_date)
                            SELECT id,${req.fields.competitionId},'${req.fields.loggedUserId}',now() 
                            FROM team where id in (${req.fields.stringSelectedTeams})`;
            this.executeSQL(sqlDelete).then(res1=>{
                this.executeSQL(sqlInsert).then(res2=>{
                    resolve(res2);
                }).catch(err2=>{
                    reject(err2)
                })
            }).catch(err1=>{
                reject(err1);
            })
        })
    }

    saveCompetition(req){
        return new Promise((resolve,reject)=>{

                if (req.files.logo){
                    req.fields.logo= `images/${path.parse(req.files.logo.path).base}`;
                }
                
                if (!req.fields.name || !req.fields.start_date ||!req.fields.end_date ){
                    reject("Preencha todos os campos obrigatórios");
                }
                else{

                    let valueParams=[   
                        req.fields.name,
                        (req.fields.active=='false'||req.fields.active=='0'?0:1),
                        req.fields.start_date,
                        req.fields.end_date
                    ];

                    let fieldParams=[   
                        'name',
                        'active',
                        'start_date',
                        'end_date'
                    ];
                    if (req.files.logo && req.files.logo.name){
                        valueParams.push(req.fields.logo);
                        fieldParams.push('logo');
                    }
                    
                    this.save('competition',req,fieldParams,valueParams).then(results=>{
                        
                        let id=0;
                        if (!req.fields.id){
                            id=results.insertId;
                        }
                        else{
                            id=req.fields.id;
                        }
                        //atualizar todos os registros para que não haja dois ativos
                        if (req.fields.active){
                            let strUpdate='update competition set active=0 where id<>'+id;
                            this.executeSQL(strUpdate,null);
                        }
                        resolve(results);
                        
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }

    deleteCompetition(id){
        let strDeleteCompetition=`delete from competition where id=${id}`;
        let strDeleteTeamCompetition=`delete from team_competition where id_competition=${id}`;
        let arraySQL=[];
        arraySQL.push(strDeleteTeamCompetition);
        arraySQL.push(strDeleteCompetition);
        return new Promise((resolve,reject)=>{
            this.executeTransaction(arraySQL)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });
    }

    getActiveCompetition(){
        let sql=`select id,name,logo from competition where active=1`;
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results[0]);
            }).catch(err=>{
                reject(err);
            });

        });

    }
}
module.exports = competition;