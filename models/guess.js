const util = require('./util');
const path = require('path');
const model = require('./model');
const moment = require("moment");
const game = require('./game');

class guess extends model{
    
   
    getGuesses(searchParams){
        let whereClause='';
        let retrievePoints=false;
        if (searchParams){
            for(var k in searchParams) {
                if (searchParams[k] && searchParams[k].trim().toUpperCase()!='NULL'){
                    switch (k){
                        case 'points':
                            if (searchParams[k]='true'){
                                retrievePoints=true;
                            }
                            break;
                        case 'id':
                            whereClause+=` and g.id=${searchParams[k]}`;
                            break;
                        case 'teamName':
                            whereClause+=` and (t1.name like '%${searchParams[k]}%' or t2.name like '%${searchParams[k]}%' )`;
                            break;
                        case 'teamId':
                            whereClause+=` and (t1.id=${searchParams[k]} or t2.id=${searchParams[k]} )`;
                            break;    
                        case 'stage':
                            whereClause+=` and m.stage=${searchParams[k]}`;
                            break;
                        case 'groupx':
                            whereClause+=` and m.groupx='${searchParams[k]}'`;
                            break;    
                        case 'competitionName':
                            whereClause+=` and c.name='${searchParams[k]}'`;
                            break;
                        case 'competitionId':
                            whereClause+=` and c.id=${searchParams[k]}`;
                            break;
                        case 'date':
                            whereClause+=` and date(m.match_datetime)='${searchParams[k]}'`;
                            break;
                        case 'startDate':
                            whereClause+=` and date(m.match_datetime)>='${searchParams[k]}'`;
                            break;
                        case 'endDate':
                            whereClause+=` and date(m.match_datetime)<='${searchParams[k]}'`;
                            break; 
                        case 'gameName':
                            whereClause+=` and ga.name='${searchParams[k]}'`;
                            break;
                        case 'gameId':
                            whereClause+=` and ga.id=${searchParams[k]}`;
                            break;
                        case 'userName':
                            whereClause+=` and u.name='${searchParams[k]}'`;
                            break;
                        case 'userId':
                            whereClause+=` and u.id=${searchParams[k]}`;
                            break;
                        case 'status':
                            if (searchParams[k]=='past'){

                                whereClause+=` and m.match_datetime < addtime(now(),"03:00")`;

                            }
                            else if (searchParams[k]=='future'){
                                
                                whereClause+=` and m.match_datetime > addtime(now(),"03:00")`;
                            
                            }
                            break;                   
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select	g.id as idGuess,g.guess_team1,g.guess_team2,
                        ga.stage1_weight,ga.stage2_weight,ga.stage3_weight,ga.stage4_weight,ga.stage5_weight,
                        ga.winner_tie_loser_points,ga.team_score_points,
                        u.id as idUser, u.name as userName,
                        ga.id as idGame, ga.active as activeGame, ga.name as gameName,
                        m.id as idMatch, m.score_team1, m.score_team2, m.match_datetime,m.stage, m.groupx,
                        t1.id as idTeam1, t1.name as team1Name, t1.flag as team1Flag,
                        t2.id as idTeam2, t2.name as team2Name, t2.flag as team2Flag,
                        c.id as idCompetition, c.name as competitionName
                from	guess g
                        join user u
                            on u.id=g.id_user
                        join game ga
                            on ga.id=g.id_game
                        join matchx m
                            on m.id=g.id_match
                        join team t1
                            on t1.id=m.id_team1
                        join team t2
                            on t2.id=m.id_team2
                        join competition c
                            on c.id=m.id_competition
                where (1=1
                    ${whereClause}
                )    
                order by m.match_datetime,t1.name`;      
        
        
        return new Promise((resolve,reject)=>{
            this.executeSQL(sql)
            .then(results=>{
                if (!retrievePoints){
                    resolve(results);
                }
                else{
                    let newResults=[];
                    results.forEach(guess => {
                        let points = this.getPoints(guess);
                        guess = { ...guess, points: points};
                        newResults.push(guess);
                    });
                    resolve(newResults);
                }
            }).catch(err=>{
                reject(err);
            });

        });        

    }

    updateGuess(updateParams){
        return new Promise((resolve,reject)=>{
            let sql=`update guess 
                        set guess_team1=${updateParams['guessTeam1']}, guess_team2=${updateParams['guessTeam2']},
                        last_update_user=${updateParams['idUser']}, last_update_date=now()
                        where id=${updateParams['idGuess']} `;

            
            this.executeSQL(sql)
            .then(results=>{
                resolve(results);
            }).catch(err=>{
                reject(err);
            });
            
        });
    }

    isStarted(guess){
        const newDate = new Date(guess.match_datetime);
        let serverDate = new Date(new Date().setHours(new Date().getHours() + 3));
        return moment(newDate).format('yyyy-MM-DD HH:mm')<moment(serverDate).format('yyyy-MM-DD HH:mm');
    }

    getMatchResult(guess){
        if(guess.score_team1-guess.score_team2>0){
          return 'WT1';
        } else if (guess.score_team1-guess.score_team2<0){
          return 'WT2';
        } else{
          return 'T';
        }
    }

    getGuessResult(guess){
        if(guess.guess_team1-guess.guess_team2>0){
          return 'WT1';
        } else if (guess.guess_team1-guess.guess_team2<0){
          return 'WT2';
        } else{
          return 'T';
        }
    }

    isGoodGuess(guess){
        return (this.getGuessResult(guess)==this.getMatchResult(guess));
    }

    getPoints(guess){
        let total = 0;
        if (this.isGoodGuess(guess)){
          total+=guess.winner_tie_loser_points;
        }
        if (guess.score_team1==guess.guess_team1){
          total+=guess.team_score_points;
        }
        if (guess.score_team2==guess.guess_team2){
          total+=guess.team_score_points;
        }
        switch (guess.stage) {
          case 1 :
            total=total*guess.stage1_weight;
            break;
          case 2 :
            total=total*guess.stage2_weight;
            break;
          case 3 :
            total=total*guess.stage3_weight;
            break;
          case 4 :
            total=total*guess.stage4_weight;
            break;
          case 5 :
            total=total*guess.stage5_weight;
            break;
          
          default:
            total=0;
        }
        
        if (!this.isStarted(guess)){
          total=0;
        }
        return total;
    }

    getRanking(idGame){
        return new Promise((resolve,reject)=>{
            let ranking=[];
            let promises=[];
            const sqlUsersGame=`select 	u.*
                                from	user u
                                        join game_user gu
                                            on u.id=gu.id_user
                                where	gu.id_game=${idGame}`;

            this.executeSQL(sqlUsersGame).then(results=>{
                results.forEach(user=>{
                    const sqlGuess=`select	g.id as idGuess,g.guess_team1,g.guess_team2,
                                    ga.stage1_weight,ga.stage2_weight,ga.stage3_weight,ga.stage4_weight,ga.stage5_weight,
                                    ga.winner_tie_loser_points,ga.team_score_points,
                                    u.id as idUser, u.name as userName,u.photo as userPhoto,
                                    ga.id as idGame, ga.active as activeGame, ga.name as gameName,
                                    m.id as idMatch, m.score_team1, m.score_team2, m.match_datetime,m.stage, m.groupx,
                                    t1.id as idTeam1, t1.name as team1Name, t1.flag as team1Flag,
                                    t2.id as idTeam2, t2.name as team2Name, t2.flag as team2Flag,
                                    c.id as idCompetition, c.name as competitionName
                            from	guess g
                                    join user u
                                        on u.id=g.id_user
                                    join game ga
                                        on ga.id=g.id_game
                                    join matchx m
                                        on m.id=g.id_match
                                    join team t1
                                        on t1.id=m.id_team1
                                    join team t2
                                        on t2.id=m.id_team2
                                    join competition c
                                            on c.id=m.id_competition
                            where 	ga.id=${idGame} 
                                    and u.id=${user.id}
                            order by m.match_datetime`;
                    promises.push(this.executeSQL(sqlGuess));
                })
                Promise.all(promises).then(lists=>{
                    lists.forEach(guesses=>{
                        let points=0;
                        let idUser='';
                        let userName='';
                        let userPhoto='';
                        let gameName='';
                        guesses.forEach(guess=>{
                            points+=this.getPoints(guess);
                            idUser=guess.idUser;
                            userName=guess.userName;
                            userPhoto=guess.userPhoto;
                            gameName=guess.gameName;
                        });
                        let objRanking={
                            idUser,
                            userName,
                            userPhoto,
                            points,
                            idGame,
                            gameName
                        };
                        ranking.push(objRanking);
                    })
                    ranking.sort(function(a, b){return b.points-a.points});
                    let position = 0;
                    let realPosition = 0;
                    let lastPoints = 0;
                    let newRanking=[];
                    ranking.forEach(user => {
                        realPosition++;
                        if (user.points!=lastPoints) {
                            position=realPosition;
                        }
                        user = { ...user, position: position};
                        lastPoints = user.points;
                        newRanking.push(user);
                    });
                    newRanking.sort(function(a, b){return b.points-a.points});
                    resolve(newRanking);
                })
            }).catch(e=>{
                reject(e);
            })
        });
    }

}
module.exports = guess;