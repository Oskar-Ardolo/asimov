const iniparser = require('iniparser');
const configDB = iniparser.parseSync('DB.ini'); 
const mysql = require('mysql');
// Create pool to prevent database inactivity
const db = mysql.createPool({
  host:configDB['dev']['host'],
  user:configDB['dev']['user'],
  password:configDB['dev']['password'],
  database:configDB['dev']['database'],
  multipleStatements: true
});

db.getConnection( async (err) => {
    if (err) console.log(err, new Date);
    else console.log(`Connecté à la base de données '${configDB['dev']['database']}' | ${ new Date }`);
});

module.exports = db;