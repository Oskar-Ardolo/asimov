class Notif {
  constructor(toast) {
    this.toast = toast;
  }

  async gettoast() {
    let promise = new Promise((resolve, reject) => {
      resolve(this.toast);
    });
    return promise.then((val) => {
      return val
    });
  }
}

module.exports = Notif;
