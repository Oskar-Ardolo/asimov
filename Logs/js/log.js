class Logs {
  constructor() {
  }

  async readdirectory(fs, path) {
    let promise = new Promise((resolve, reject) => {
      if(fs.existsSync(path)) {
        fs.readdir(path, (err, data) => {
          if (err) console.log(err);
          resolve(data);
        });
      } else {
        resolve([]);
      }

    });
    return promise.then((val) => {
      return val
    });
  }

  async readfile(fs, path, directory) {
    let promise = new Promise((resolve, reject) => {
      let tab = new Array();
      let jsoncontent;
      fs.readFile(path + directory, (err, value) => {
        if (err) console.log(err);
        jsoncontent = JSON.parse(value);
        let x = 0;
        for (let items in jsoncontent.action) {
          let y = 1;
          tab[x] = new Array();
          tab[x][0] = jsoncontent.pseudo;
          for (let j in jsoncontent.action[items]) {
            tab[x][y] = jsoncontent.action[items][j];
            y = y + 1;
          }
            x = x + 1;
          }
          resolve(tab);
      });
    });
    return promise.then((val) => {
      return val
    });
  }

  async readfileForOneUser(fs, fullpath, id) {
      let promise = new Promise((resolve, reject) => {
        let content;
        let jsoncontent;
        fs.readFile(fullpath, (err, data) => {
          if (err) console.log(err);
          jsoncontent = JSON.parse(data);
          for (let items in jsoncontent.action) {
            if (jsoncontent.action[items].id == id) {
              content = jsoncontent.action[items];
              return resolve(content);
            }
          }
          reject("error");
        });
      });
      return promise.then((val) => {
        return val
      });
  }

  async getIdLog(fs, pseudo, time) {
      let promise = new Promise((resolve, reject) => {
        let file = "log-["+pseudo+"]_["+time+"].json";
        let path = "./Logs/["+time+"]/";
        let fullpath = path + file;
        let jsoncontent;
        let id = 0;
        if(fs.existsSync(fullpath)) {
          fs.readFile(fullpath, (err, result) => {
            if (err) console.log(err);
            else {
              jsoncontent = JSON.parse(result);
              for (let items in jsoncontent.action) {
                id += 1;
              }
              resolve(id.toString());
            }
          });
        } else {
          resolve("0");
        }
      });
      return promise.then((val) => {
        return val
      });
  }

  async writeLog(data, fs, time, pseudo) {
    let promise = new Promise((resolve, reject) => {
      let day = new Date();
      let file = "log-["+pseudo+"]_["+time+"].json";
      let path = "./Logs/["+time+"]/";
      let fullpath = path + file;
      (async function() {
        if(!fs.existsSync(fullpath)) {
          let obj = { "pseudo" : pseudo, "action": [data] }
          let json = JSON.stringify(obj, null, 4);

          // Create directory if it doesn't exist
          fs.mkdir(path, { recursive : true }, (err) => {
            if (err) console.log(err);
          });

          // Create file or write into this file
          fs.writeFile(fullpath, json, 'utf8', (err) => {
            if (err) console.log(err);
            else resolve(true);
          });
        } else {
          fs.readFile(fullpath, (err, value) => {
            if (err) {
              console.log(err);
              reject(false);
            }
            else {
              let obj;
              let json;
              obj = JSON.parse(value);
              obj.action.push(data);
              json = JSON.stringify(obj, null, 4);
              fs.writeFile(fullpath, json, 'utf8', function(err) {
                if (err) console.log(err);
              });
              resolve(true);
            }
          });
        }
      })();
    });
    return promise.then((val) => {
      return val
    });
  }

}

module.exports = Logs;
