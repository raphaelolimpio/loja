require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

});
db.connect((err) => {
    if (err) {
        console.error('🔴 Conectado ao banco de dados MySQL: ' , err);
        return;
    }
    console.log('🟢 Conectado ao banco de dados MySQL');
});

module.exports = db;