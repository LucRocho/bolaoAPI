const util = require('./util');
const path = require('path');
const model = require('./model');

class team extends model{
    
   
    //ok
    getTeams(searchParams){
        
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
                        default:
                            break;    
                    }
                }
             }
        }
        
        let sql=`select * 
                from	team
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

    saveTeam(req){
        return new Promise((resolve,reject)=>{

                if (req.files.flag){
                    req.fields.flag= `images/${path.parse(req.files.flag.path).base}`;
                }
                
                
                if (!req.fields.name){
                    reject("Preencha o nome");
                } else{
                   
                    let valueParams=[   
                        req.fields.name,
                    ];

                    let fieldParams=[   
                        'name'
                    ];
                    if (req.files.flag && req.files.flag.name){
                        valueParams.push(req.fields.flag);
                        fieldParams.push('flag');
                        
                    }
                                         
                    
                    this.save('team',req,fieldParams,valueParams).then(results=>{
                        resolve(results);
                    }).catch(err=>{
                        reject(err);
                    });
                };
        });
    }
}
module.exports = team;