let _url = '';
let _crashConfig = '';
let _reportConfig = '';

export const REPORT_TYPES = {
  CRASH: 0,
  REPORT: 1
};

const HEADERS = {
  'content-type': 'application/json',
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
        title, description,
        "config": type === REPORT_TYPES.CRASH ? _crashConfig : _reportConfig
      })
    }).then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          callback(data)
        })
      } else {
        callback({ "reportId": "" })
      }
    }).catch((e) => {
      callback({ "reportId": "" })
    })
  }

  static add_text_attachment(reportId, string, type, callback) {
    fetch(_url + '/report/add_text_attachment', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        reportId, string,
        "config": type === REPORT_TYPES.CRASH ? _crashConfig : _reportConfig
      })
    }).then(response => {
      callback()
    }).catch((e) => {
      callback()
    })
  }

  static add_attachment(reportId,image, type, callback) {
    const data = new FormData();
    let params = {
        'reportId': reportId,
        'config': type === REPORT_TYPES.CRASH ? _crashConfig : _reportConfig
    }
    data.append('attachment', {
      uri: image,
      type: 'image/jpeg', // or photo.type
      name: 'screenshot.jpeg'
    });
    fetch(_url + '/report/add_attachment?' +  Object.keys(params).map(key => key + '=' + params[key]).join('&'), {
      method: 'post',
      body: data,
      headers: {
        'content-type': 'multipart/form-data',
        'User-Agent': 'ChictusLytics'
      }
    }).then(res => {
      callback()
    }).catch(e=> {
      callback()
    });
  }

}

export default Server;