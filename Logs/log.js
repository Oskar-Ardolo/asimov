/*
====================
LOGS FUNCTIONS
====================
*/

exports.writeLog = (data, fs) => {
  (async function() {
    fs.appendFile('./Logs/log.txt', data, (err) => {
      if (err) console.log(err);
    });
  })();
}

exports.writeErrorLog = (fs, req, action, err) => {
  let data = "       ======= "+ Date() +" =======  \n \n user : " +  req.session.pseudo +"\n action : "+action+" \n error : ["+err+"]\n \n";
  (async function() {
    fs.appendFile('./Logs/log_error.txt', data, (err) => {
      if (err) console.log(err);
    });
  })();
}
