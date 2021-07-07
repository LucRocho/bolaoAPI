const util = require('./util');
const path = require('path');
const model = require('./model');

class match extends model{
    
   
    getMatches(searchParams){
        let whereClause='';
        if (searchParams){
            for(var k in searchParams) {
                if (searchParams[k] && searchParams[k].trim().toUpperCase()!='NULL'){
                    switch (k){
                        case 'id':
                            whereClause+=` and mat.id=${searchParams[k]}`;
                            break;
                        case 'teamName':
                            whereClause+=` and (t1.name like '%${searchParams[k]}%' or t2.name like '%${searchParams[k]}%' )`;
                            break;
                        case 'teamId':
                            whereClause+=` and (t1.id=${searchParams[k]} or t2.id=${searchParams[k]} )`;
                            break;    
                        case 'stage':
                            whereClause+=` and mat.stage=${searchParams[k]}`;
                            break;
                        case 'groupx':
                            whereClause+=` and mat.groupx='${searchParams[k]}'`;
                            break;    
                        case 'competitionName':
                            whereClause+=` and comp.name='${searchParams[k]}'`;
                            break;
                        case 'competitionId':
                            whereClause+=` and comp.id=${searchParams[k]}`;
                            break;
                        case 'date':
                            whereClause+=` and date(mat.match_datetime)='${searchParams[k]}'`;
                            break;
                        case 'startDate':
                            whereClause+=` and date(mat.match_datetime)>='${searchParams[k]}'`;
                            break;
                        case 'endDate':
                            whereClause+=` and date(mat.match_datetime)<='${searchParams[k]}'`;
                            break;                
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select	mat.*,t1.name as team1Name, t2.name as team2Name,comp.name as competitionName,
                t1.flag as team1Flag, t2.flag as team2Flag
                from	matchx mat
                        join team t1
                            on mat.id_team1=t1.id
                        join team t2
                            on mat.id_team2=t2.id
                        join competition comp
                            on comp.id=mat.id_competition
                where (1=1
                    ${whereClause}
                )    
                order by mat.match_datetime`;      
        
        //console.log(sql);
        
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });        

    }

    updateScore(updateParams){
        return new Promise((resolve,reject)=>{
            let sql=`update matchx set score_team1=${updateParams['scoreTeam1']}, score_team2=${updateParams['scoreTeam2']},
                        last_update_user=${updateParams['idUser']}, last_update_date=now() where id=${updateParams['idMatch']} `;

            
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });
            
        });
    }

    saveMatch(req){
        return new Promise((resolve,reject)=>{

                
                
                if (!req.fields.id_competition || !req.fields.id_team1 || !req.fields.id_team2
                    || !req.fields.score_team1 || !req.fields.score_team2 || !req.fields.stage
                    || !req.fields.match_datetime){
                    reject("Preencha todos os campos");
                }
                else if(req.fields.id_team1==req.fields.id_team2){
                    reject("Escolha um time diferente do outro");
                } else{
                   
                    let valueParams=[   
                        req.fields.id_competition,
                        req.fields.id_team1,
                        req.fields.id_team2,
                        req.fields.score_team1,
                        req.fields.score_team2,
                        req.fields.stage,
                        req.fields.groupx,
                        req.fields.match_datetime
                    ];

                    let fieldParams=[   
                        'id_competition',
                        'id_team1',
                        'id_team2',
                        'score_team1',
                        'score_team2',
                        'stage',
                        'groupx',
                        'match_datetime'
                    ];
                    
                    this.save('matchx',req,fieldParams,valueParams).then(results=>{
                        //se inclusão, procura a competition a que pertence e insere novo guess para todos users
                        if (!req.fields.id){
                            let newId=results["insertId"];
                            let sqlInsert=`INSERT INTO guess 
                                        (id_user,id_game,id_match,guess_team1, guess_team2,creation_user,creation_date)
                                        select 	gu.id_user,gu.id_game,${newId},0,0,'${req.fields.loggedUserId}',now()
                                        from	game gam
                                                join competition comp
                                                    on comp.id=gam.id_competition
                                                join game_user gu
                                                    on gu.id_game=gam.id
                                        where	id_competition=${req.fields.id_competition}`;
                            this.executeSQL(sqlInsert).then(res=>{
                                resolve(results);
                            }).catch(err2=>{
                                reject(err2);
                            })            
                        }
                        else{
                            resolve(results);
                        }
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }

    deleteMatch(id){
        return new Promise((resolve,reject)=>{
           let deletes=[`delete from guess where id_match=${id}`,`delete from matchx where id=${id}`];
           this.executeTransaction(deletes)
           .then(resp=>{
                resolve(resp);
            }).catch(err2=>{
                reject(err2);
            });
        })
        
    }
}
module.exports = match;