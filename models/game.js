const util = require('./util');
const path = require('path');
const model = require('./model');

class game extends model{
    
   
    getGames(searchParams){
        let whereClause='';
        if (searchParams){
            for(var k in searchParams) {
                if (searchParams[k] && searchParams[k].trim().toUpperCase()!='NULL'){
                    switch (k){
                        case 'id':
                            whereClause+=` and gam.id=${searchParams[k]}`;
                            break;
                        case 'name':
                            whereClause+=` and gam.name like '%${searchParams[k]}%' `;
                            break;
                        case 'competitionName':
                            whereClause+=` and comp.name='${searchParams[k]}'`;
                            break;
                        case 'competitionId':
                            whereClause+=` and comp.id=${searchParams[k]}`;
                            break;
                        case 'idResponsibleUser':
                            whereClause+=` and usr.id=${searchParams[k]}`;
                            break;
                        case 'nameResponsibleUser':
                            whereClause+=` and usr.name='${searchParams[k]}'`;
                            break;
                        case 'active':
                            whereClause+=` and gam.active='${searchParams[k]}' `;
                            break;    
                        
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select	gam.*,comp.id as competitionId,comp.name as competitionName,comp.logo as competitionLogo,
                        usr.id as responsibleUserId,usr.name as responsibleUserName
                from	game gam
                        join competition comp
                            on comp.id=gam.id_competition
                        join user usr
                            on usr.id=gam.id_responsible_user
                where (1=1
                    ${whereClause}
                )    
                order by gam.name`;      
        
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

    getActiveGamesUser(idUser){
        let sql=`select	g.*
                from	game g
                        join game_user gu
                            on g.id=gu.id_game
                where	active=1
                        and gu.id_user=${idUser}
                order by g.name`;      

                
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });  
    }

    saveGame(req){
     return new Promise((resolve,reject)=>{
                if (!req.fields.name || !req.fields.id_competition || !req.fields.id_responsible_user
                    || !req.fields.winner_tie_loser_points || !req.fields.team_score_points 
                    || !req.fields.stage1_weight || !req.fields.stage2_weight || !req.fields.stage3_weight 
                    || !req.fields.stage4_weight || !req.fields.stage5_weight 
                    || !req.fields.individual_value){
                    reject("Preencha todos os campos");
                } else{
                  let valueParams=[   
                        req.fields.name,
                        req.fields.id_competition,
                        req.fields.id_responsible_user,
                        req.fields.individual_value,
                        req.fields.winner_tie_loser_points,
                        req.fields.team_score_points,
                        req.fields.stage1_weight,
                        req.fields.stage2_weight,
                        req.fields.stage3_weight,
                        req.fields.stage4_weight,
                        req.fields.stage5_weight,
                        req.fields.percent_first_prize,
                        req.fields.percent_second_prize,
                        req.fields.percent_third_prize,
                        (req.fields.active=='false'||req.fields.active=='0'?0:1)
                    ];

                    let fieldParams=[   
                        'name',
                        'id_competition',
                        'id_responsible_user',
                        'individual_value',
                        'winner_tie_loser_points',
                        'team_score_points',
                        'stage1_weight',
                        'stage2_weight',
                        'stage3_weight',
                        'stage4_weight',
                        'stage5_weight',
                        'percent_first_prize',
                        'percent_second_prize',
                        'percent_third_prize',
                        'active'
                    ];
                    
                    this.save('game',req,fieldParams,valueParams).then(results=>{
                        resolve(results);
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }

    getUsersGame(idGame){
        let sql=`select u.*, gu.paid,gu.id_game,gu.id as idGameUser
                from	game_user gu
                        join user u
                            on u.id=gu.id_user
                where  gu.id_game=${idGame} order by u.name`;      
        
                
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });         
    }

    getTeams(idGame){
        let sql=`select	t.id,t.name
                from	team t
                        join team_competition tc
                            on t.id=tc.id_team
                        join game g
                            on g.id_competition=tc.id_competition
                where	g.id=${idGame}
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

    getUsersNotInGame(idGame){
        let sql=`select	u.*
        from	user u
        where	u.id not in
                (select id_user from game_user where id_game=${idGame})
        order by u.name`;      
               
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });

        });         
    }

    saveUsersGame(req) {
        return new Promise((resolve,reject)=>{
            if (!req.fields.stringSelectedUsers || req.fields.stringSelectedUsers===''){
                req.fields.stringSelectedUsers='0';
            }
            let sqlDelete1=`delete from guess 
                           where id_game=${req.fields.gameId}
                                 and id_user not in  (${req.fields.stringSelectedUsers})`;
            let sqlDelete2=`delete from game_user 
                           where id_game=${req.fields.gameId}
                                 and id_user not in  (${req.fields.stringSelectedUsers})`;
            let deletes=[];
            //console.log(sqlDelete1)
            //console.log(sqlDelete2)
            deletes.push(sqlDelete1);
            deletes.push(sqlDelete2);
            this.executeTransaction(deletes).then(res=>{
                let selectUsers=req.fields.stringSelectedUsers.split(',');
                selectUsers.forEach(idUser => {
                    let sqlSearch=`select * from game_user where id_user=${idUser} and id_game=${req.fields.gameId}`;
                    this.executeSQL(sqlSearch).then(res2=>{
                        if (res2.length==0){
                            let sqlInsert1=`INSERT INTO game_user 
                                            (id_user,id_game,paid,creation_user,creation_date)
                                            values (${idUser},${req.fields.gameId},0,'${req.fields.loggedUserId}',now())`;
                            let sqlInsert2=`INSERT INTO guess 
                                            (id_user,id_game,id_match,guess_team1, guess_team2,creation_user,creation_date)
                                            SELECT ${idUser},${req.fields.gameId},mat.id,0,0,'${req.fields.loggedUserId}',now() 
                                            FROM matchx mat 
                                            join competition comp
                                                on mat.id_competition=comp.id
                                            join game gam
                                                on gam.id_competition=comp.id
                                            where gam.id=${req.fields.gameId}`;
                            let inserts=[];
                            //console.log(sqlInsert1);
                            //console.log(sqlInsert2);
                            inserts.push(sqlInsert1);
                            inserts.push(sqlInsert2);
                            this.executeTransaction(inserts).then(res3=>{
                                resolve(res3);
                            }).catch(err3=>{
                                reject(res3);
                            })
                        }
                    }).catch(err2=>{
                        reject(err2)
                    })
                    resolve(res)
                });
            }).catch(err=>{
                reject(err);
            })
            
           
        })
    }

    toogleGamePaid(idGameUser){
        return new Promise((resolve,reject)=>{
            let sqlUpdate=`update game_user set paid= not paid where id=${idGameUser}`;
            this.executeSQL(sqlUpdate).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err);
            })
        })
    }

    getUserAmount(idGame){
        let sql=`select count(*) as qtdUsers
        from	game_user gu
                join user u
                    on u.id=gu.id_user
        where  gu.id_game=${idGame}`;      

        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                resolve(results[0]);
            }).catch(err=>{
                reject(err);
            });

        });  
    }

    getValues(idGame){
        return new Promise((resolve,reject)=>{

            let amount = 0
            let individualValue=0
            let totalPrize=0
            let firstPrize=0
            let secondPrize=0
            let thirdPrize=0
            let percentFirstPrize=0
            let percentSecondPrize=0
            let percentThirdPrize=0
            let sql=`select * from game where  id=${idGame}`;    
            this.getUserAmount(idGame).then(qtd=>{
                amount=qtd.qtdUsers
                this.executeSQL(sql)
                .then(results=>{
                    individualValue=results[0].individual_value
                    totalPrize=individualValue*amount
                    percentFirstPrize=results[0].percent_first_prize
                    firstPrize=percentFirstPrize/100*totalPrize
                    percentSecondPrize=results[0].percent_second_prize
                    secondPrize=percentSecondPrize/100*totalPrize
                    percentThirdPrize=results[0].percent_third_prize
                    thirdPrize=percentThirdPrize/100*totalPrize
                    let values={
                        amount,
                        individualValue,
                        totalPrize,
                        percentFirstPrize,
                        firstPrize,
                        percentSecondPrize,
                        secondPrize,
                        percentThirdPrize,
                        thirdPrize,
                        stage1Weight:results[0].stage1_weight,
                        stage2Weight:results[0].stage2_weight,
                        stage3Weight:results[0].stage3_weight,
                        stage4Weight:results[0].stage4_weight,
                        stage5Weight:results[0].stage5_weight,
                        goalsPoints:results[0].team_score_points,
                        winnerPoints:results[0].winner_tie_loser_points
                    }
                    resolve(values)
                }).catch(err2=>{
                    reject(err2);
                });
            })
            .catch(err=>{
                reject(err);
            });
        });
    }
}
module.exports = game;