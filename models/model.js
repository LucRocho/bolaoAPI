const poolProd = require('./poolProd');
const poolDev = require('./poolDev');
const moment = require("moment");

class model {

    constructor(development=false){
        this.development=development;
    }


    getSaveParams(params,userId){

        let newParams=[];
        let currentDate=new Date();
        let stringDate=moment(currentDate).format("YYYY-MM-DD HH:mm:ss");
        newParams.push(userId);
        newParams.push(stringDate);
        return params.concat(newParams);
    }

    getErrorMessageDB(code){
        switch (code){
            
            case 'ER_ROW_IS_REFERENCED_2':
                return 'Impossível excluir. Registro utilizado em outra tabela.';
                break;
            case 'ER_DUP_ENTRY':
                return 'Impossível salvar. Registro já existente no banco de dados';
                break;
            default:
                return 'Erro na comunicação com o banco de dados';
                break;
        }
        
    }


    fetchFirstRow(sql){
        return new Promise((resolve,reject)=>{
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(sql,
                    (err,results)=>{
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else
                        {
                            resolve(results[0].total);
                        }
                    }
                );
                pool.releaseConnection(conn);
            });
            
        });
    }

    delete(id,table){
        return new Promise((resolve,reject)=>{
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(
                    'delete from ' + table + ' where id=?',
                    [id],
                    (err,results)=> {
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else{
                            resolve(results);
                        }
                    });
                pool.releaseConnection(conn);    
            });    
            
                
        });
    }

    deleteAll(table){
        return new Promise((resolve,reject)=>{
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(
                    'delete from ' + table ,
                    (err,results)=> {
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else{
                            resolve(results);
                        }
                    });
                pool.releaseConnection(conn);    
            });    
            
                
        });
    }

    getAll(table, orderField){

        

        let strQuery='select * from '+ table +'  order by ' + orderField;
        return new Promise((resolve,reject)=>{
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(strQuery,
                    (err,results)=>{
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else
                        {
                            resolve(results);
                        }
                    }
                );
                pool.releaseConnection(conn);
            });
            

        });
    }


    getSQLSave(table,req,fieldParams,valueParams){
        let insert=true;
        let strQuery='';
        let strQuery2='';
        let strQuery3='';
        if (parseInt(req.body.id)>0) {
            insert=false;
            strQuery2=fieldParams.join('=?,');
            strQuery2=strQuery2 + '=?,';
        }
        else{
            strQuery2=fieldParams.join(',')
            strQuery2=strQuery2 + ',';
            fieldParams.forEach(element => {
                strQuery3=strQuery3+'?,';
            });
        }
        //update
        if (!insert){
            
            strQuery=`
                update ${table} set ${strQuery2}
                    last_update_user=?, last_update_date=?
                where id=?
            `;
        }
        //create
        else{
            strQuery=`
                insert into  ${table} (${strQuery2}creation_user,creation_date)
                values (${strQuery3}?,?)
                `; 
        };
        return strQuery;
    }

    save(table,req,fieldParams,valueParams){
        return new Promise((resolve,reject)=>{
            let insert=true;
            let strQuery='';
            let strQuery2='';
            let strQuery3='';
            if (parseInt(req.fields.id)>0) {
                insert=false;
                strQuery2=fieldParams.join('=?,');
                strQuery2=strQuery2 + '=?,';
            }
            else{
                strQuery2=fieldParams.join(',')
                strQuery2=strQuery2 + ',';
                fieldParams.forEach(element => {
                    strQuery3=strQuery3+'?,';
                });
            }
            valueParams=this.getSaveParams(valueParams,req.fields.loggedUserId);
            //update
            if (!insert){
                valueParams.push(req.body.id);
                strQuery=`
                    update ${table} set ${strQuery2}
                        last_update_user=?, last_update_date=?
                    where id=?
                `;
                
            }
            //create
            else{
                strQuery=`
                    insert into  ${table} (${strQuery2}creation_user,creation_date)
                    values (${strQuery3}?,?)
                    `; 
                
            }

            
            //console.log(strQuery);
            //console.log(valueParams);
            
            
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(strQuery,valueParams,
                (err,results)=>{
                    if (err){
                        //console.log(err);
                        reject(this.getErrorMessageDB(err.code));
                    }
                    else{
                        
                        resolve(results);
                    }
                });
                pool.releaseConnection(conn);
            });
            
        });

    }

    //precisa melhorar, só funciona para transações com 2 ou 3 queries
    /**
     * Solutions:
As of NodeJS@12.10.0 you can use Promise.allSettled(). This will not only wait for all promises to complete,
 but will give you an array with the result of each promise. 
 Just iterate through the results and verify that none have a status of ‘rejected’.
Not the best solution but it works: do not use Promise.all() inside transctions, use sequential query execution.
     */
    executeTransaction(sqlArray){
        let sql1=sqlArray[0];
        let sql2=sqlArray[1];
        let sql3='';
        if (sqlArray.length===3){
            sql3=sqlArray[2];
        }
        return new Promise((resolve,reject)=>{
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.beginTransaction((beginTransactionError) => {
                    if(beginTransactionError) {
                        reject(beginTransactionError.message);
                    }
                    else{
                        conn.query(sql1,[],(queryError1,results1) => {
                            if(queryError1) {
                                conn.rollback((rollbackError1) => {
                                    if(rollbackError1) {
                                        reject(rollbackError1.message);
                                    } else {
                                        reject(this.getErrorMessageDB(queryError1.code));
                                    }
                                });
                            }
                            else {
                                conn.query(sql2,[],(queryError2,results2) => {
                                    if(queryError2) {
                                        conn.rollback((rollbackError2) => {
                                            if(rollbackError2) {
                                                reject(rollbackError2.message);
                                            } else {
                                                reject(this.getErrorMessageDB(queryError2.code));
                                            }
                                        });
                                    }
                                    else {
                                        if (sql3===''){
                                            conn.commit((commitError1) => {
                                                if (commitError1) {
                                                    reject(commitError1.message);
                                                }
                                                else{
                                                    resolve({message:'transação ok'});
                                                }
                                            });
                                       }
                                       else{
                                        conn.query(sql3,[],(queryError3,results3) => {
                                            if(queryError3) {
                                                conn.rollback((rollbackError3) => {
                                                    if(rollbackError3) {
                                                        reject(rollbackError3.message);
                                                    } else {
                                                        reject(this.getErrorMessageDB(queryError3.code));
                                                    }
                                                });
                                            }
                                            else {
                                                
                                                conn.commit((commitError2) => {
                                                    if (commitError2) {
                                                        reject(commitError2.message);
                                                    }
                                                    else{
                                                        resolve({message:'transação ok'});
                                                    }
                                                });
                                            }  
                                       });
                                    }
                                    } 
                                });    //ok
                            } //ok
                        });//ok

                    };//ok
                }); //ok
                pool.releaseConnection(conn);   
            });
             
        }); 
    }           

    isDuplicated(table,description,id){
        return new Promise((resolve,reject)=>{
            let params=[];
            params.push(description);
            let queryUpdate='';
            if (id){
                params.push(id);
                queryUpdate='and id<>?'
            }
            let strQuery =  'select * from ' + table + ' where description=? ' + queryUpdate;
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(
                    strQuery,
                    params,
                    (err,results)=>{
                        if (err){
                            reject(err);
                        }
                        else{
                            if (results.length==0) {
                                resolve(false);
                            }
                            else{
                                resolve(true);
                            }
                        }
                    }
                );
                pool.releaseConnection(conn);    
            });
            
        });
    }

    executeSQL(sql,params){
        return new Promise((resolve,reject)=>{

            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(sql,params,
                    (err,results)=>{
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else{
                            resolve(results);
                        }
                    });
                pool.releaseConnection(conn);       
            });

        });
    }

    getById(table,id){
        return new Promise((resolve,reject)=>{
            let strQuery=`select * from ${table} where id=${id}`;
            const pool=(this.development?poolDev:poolProd);
            pool.getConnection((err,conn)=> {
                conn.query(strQuery,
                    (err,results)=>{
                        if (err){
                            reject(this.getErrorMessageDB(err.code));
                        }
                        else
                        {
                            if (results.length!=1){
                                reject('Não foi possível retornar esse registro');
                            }else{
                                resolve(results[0]);
                            }
                            
                        }
                    }
                );
                pool.releaseConnection(conn);       
            });
            
        });    
    }

   
}
module.exports = model;