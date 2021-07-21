const mysql = require('mysql');
var datetime = require('node-datetime');

const db_config = {
    // host     : '192.168.24.89',
    // user     : 'anunda',
    // password : 'anundadb',
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'minutes_of_meeting'
} // port 3306 (default) 


function query(sql) {
    var dt = datetime.create();
    var formatted_date = dt.format('Y-m-d');
    
    const conn = new mysql.createConnection(db_config);
    return new Promise((resolve, reject) => {
        try {
            conn.connect(
                (err) => {
                    if(msg) {
                        var msg = "!!! Cannot connect Database !!! Error: query ";
                        // log.addErrorLog(msg)
                        resolve(err)
                    } else {
                        conn.query(sql, function (err, rows, fields) {
                            if (err) {
                                var msg = "Query queryMyFunction Error :  " + err + " SQL : " + sql
                                // log.addErrorLog(msg)
                                resolve(err);
                                // conn.end();

                            } else {
                                var msg = "Query Success view query as query_"+formatted_date+".log"
                                //console.log(msg);
                                // log.addAppLog(msg)
                                // log.addQueryLog("##### Query ##### : " + msg + " \r ##### RESULT ##### : " + JSON.stringify(rows))
                                resolve(rows);
                            }
                        });
                        conn.end(function (err) {
                            if (err) {
                                var msg = "Close Connection ERROR : " + err
                                // log.addErrorLog(msg)
                                resolve(err);

                            } else {
                                var msg = 'Close Connection Done.'
                                // console.log(msg);
                                // log.addAppLog(msg)
                                // log.addQueryLog(msg)
                                
                            }
                        })
                    }
                }); 
        } catch (err) {
            var msg = "Catch Error occurred : " + err
            // console.log(msg)
            // log.addAppLog(msg)
            // log.addErrorLog(msg)
            resolve(err);

            msg = "queryMyFunction Rejected !!"
            // console.log(msg)
            // log.addAppLog(msg)
            // log.addErrorLog(msg)
            reject(err);
        }
    })
}
module.exports.query = query;