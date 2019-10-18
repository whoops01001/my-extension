const SERVER_IP = "127.0.0.1"
const api_endpoint = `http://${SERVER_IP}:5000/api/check`

const webRequestFlags = [
  'blocking',
];

function checkStorage(current_url) {
  console.log("================================= 2")
  return new Promise(resolve => {
    setTimeout(() => {
      chrome.storage.sync.get(['storagekey'], function (result) {
        console.log("================================= 2 - 1")
        data = result.storagekey
        if (data) {
          console.log("================================= 2 - 2")
          console.log(data)
          if (data.includes(current_url)) {
            console.log("================================= 2 - 3")
            resolve('false');
          } else {
            console.log("================================= 2 - 4 - 1")
            resolve('true');
          }
        } else {
          console.log("================================= 2 - 4 - 2")
          resolve('true');
        }
      });
    }, 200);
  });
}

function checkDB(tabId, current_url, tab) {
  if (current_url) {
    if (current_url.indexOf("chrome-extension://") === 0) {
      return
    }
    if (current_url.indexOf(SERVER_IP) >= 0) {
      console.log("fire up localhost")
      return
    }
    response = $.post(api_endpoint, {
      url: current_url
    }).done(o => {
      if (o.result.label === "1") {
        chrome.tabs.update({
          url: chrome.extension.getURL('blocked.html')
        });
      }
    });
  }
}

async function process(tabId, changeInfo, tab) {
  var current_url = changeInfo.url;
  if (current_url) {
    console.log("================================= 1")
    var msg1 = await checkStorage(current_url);
    if (msg1 === 'true') {
      console.log("================================= 3")
      var msg = await checkDB(tabId, current_url, tab);
    }
  }
  console.log(tab)
}

chrome.tabs.onUpdated.addListener(process);
// chrome.webNavigation.onBeforeNavigate.addListener(process);