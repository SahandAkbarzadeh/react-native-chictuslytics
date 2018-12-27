let _url = '';
let _crashConfig = '';
let _reportConfig = '';

export const REPORT_TYPES = {
  CRASH: 0,
  REPORT: 1
};

const HEADERS = {
  'Content-Type': 'application/jsn;charset=UTF-8',
  'User-Agent': 'ChictusLytics'
};

class Server {
  static setUrl(value) { _url = value }
  static setConfigs(value) {
    _crashConfig = value.crash;
    _reportConfig = value.report;
  }

  static add(title, description, type, callback) {
    fetch(_url + '/report/add', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        title,description,
        "config": type === REPORT_TYPES.CRASH ? _crashConfig : _reportConfig
      })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data=> {
          callback(data)
        })
      } else {
        callback({"reportId": ""})
      }
    }).catch((e) => {
      callback({"reportId": ""})
    })
  }

  static add_text_attachment(reportId, string, type, callback) {
    fetch(_url + '/report/add_text_attachment', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        reportId,string,
        "config": type === REPORT_TYPES.CRASH ? _crashConfig : _reportConfig
      })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data=> {
          callback()
        })
      } else {
        callback()
      }
    }).catch((e) => {
      callback()
    })
  }

}

export default Server;