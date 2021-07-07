const moment = require("moment");
const CryptoJS =require('crypto-js');

class util {

    static encryptText(text){
        return CryptoJS.AES.encrypt(text, 'my_super_key').toString();
    }

    static decryptText(text){
        return CryptoJS.AES.decrypt(text, 'my_super_key').toString(CryptoJS.enc.Utf8);
    }

    
    static getParams(req,params){
        return Object.assign(
            {},
            {
                user:req.session.user
                
            },
            params
        );
    }

    static queryStringToJSON(queryString) {    
        //return Object.fromEntries(new URLSearchParams(queryString));
        return Array.from(new URLSearchParams(queryString)).reduce((o, i) => ({ ...o, [i[0]]: i[1] }), {});
    }

    static getStartMonthCurrentDate(){
        let startMonthDate = new Date();
        startMonthDate.setDate(1);
        return moment(startMonthDate).format("YYYY-MM-DD").toString();
    }

    

    static getFinalMonthCurrentDate(){
        let startNextMonthDate= new Date();
        startNextMonthDate.setMonth(startNextMonthDate.getMonth()+1);
        startNextMonthDate.setDate(1);
        return moment(startNextMonthDate).subtract(1,'day').format("YYYY-MM-DD").toString();
    }


    ///
    static getStartYearCurrentDate(){
        let startYearDate = new Date();
        startYearDate.setDate(1);
        startYearDate.setMonth(0);
        return moment(startYearDate).format("YYYY-MM-DD").toString();
    }

    

    static getFinalYearCurrentDate(){
        let endYearDate = new Date();
        endYearDate.setMonth(11);
        endYearDate.setDate(31);
        return moment(endYearDate).format("YYYY-MM-DD").toString();
    }
    ///



    static get10DaysAgoDate(){
        let day10ago= new Date();
        return moment(day10ago).subtract(10,'day').format("YYYY-MM-DD").toString();
    }

    static get10DaysAfterTodayDate(){
        let day10after= new Date();
        return moment(day10after).add(10,'day').format("YYYY-MM-DD").toString();
    }

    
    static formatMoney(number, decPlaces, decSep, thouSep, currency) {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSep = typeof decSep === "undefined" ? "." : decSep;
        thouSep = typeof thouSep === "undefined" ? "," : thouSep;
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = (j = i.length) > 3 ? j % 3 : 0;
        
        return currency + sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }   
    
    static formatExpirationDate(date){
        if (!date){
            return "";
        }
        else{
            let expirationDate=moment(date).format('MM/YYYY');
            return expirationDate;
        }

    }

   
}
module.exports=util;