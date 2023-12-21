const mysql = require("mysql2/promise.js")

const connection_data = {
    host: 'srv815.hstgr.io',
    port : 3306,
    user: 'u970133903_BGMAdmin',
    password: 'RKfwnmPhW1!l',
    database: 'u970133903_BGMDB'
}


const pool = mysql.createPool(connection_data);
    
module.exports = pool;


