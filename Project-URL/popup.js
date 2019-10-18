let OnAction = document.getElementById('OnAction');
let webCurrent = document.getElementById("urlCurrent");
// let webStatus = document.getElementById("webStatus");
let excludeUrl = document.getElementById("excludeUrl");
let reportUrl = document.getElementById("reportUrl");
let detectUrlBy = document.getElementById("detectBy");
let url = ""
let deleteUrlExclude = document.getElementById("DeleteUrlExclude");

const SERVER_IP_C = "127.0.0.1"
const api_endpoint_C = `http://${SERVER_IP_C}:5000/api/`

// //////////
// OnAction.addEventListener("change", event => {
//     if (event.target.checked) {
//         // document.getElementById("actionSave").style.visibility = "visible";
//     } else {
//         const returnVal = confirm("Are you sure?");
//         event.target.checked = !returnVal;
//         if (returnVal) {
//             // document.getElementById("actionSave").style.visibility = "visible";
//         }
//     }
//     chrome.runtime.sendMessage({
//         query: "setEnable",
//         enable: event.target.checked
//     }, function (response) {
//         // console.log(response);
//     });
// });

// chrome.runtime.sendMessage({
//     query: "getEnable"
// }, function (response) {
//     console.log(response);
//     var isEnable = false;
//     if (response.enable === undefined) {
//         console.log("no enable setting found!");
//         console.log("set enable to true");
//         chrome.runtime.sendMessage({
//             query: "setEnable",
//             enable: true
//         }, function (response) {
//             console.log(response);
//             isEnable = true;
//         });
//     } else {
//         isEnable = response.enable;
//     }

//     OnAction.checked = isEnable;
// });
// /////////

chrome.tabs.query({
    'active': true,
    'lastFocusedWindow': true
}, function (tabs) {
    tab = tabs[0];
    url = new URL(tab.url)
    domain = url.hostname
});

chrome.storage.sync.get(["current_url", "statkeyus"], function (items) {
    var default_content = "(loading...)"
    webCurrent.innerHTML = "     " + (domain || default_content);
    // webStatus.innerHTML = "     " + (items["status"] || default_content);
    detectUrlBy.innerHTML = "     " + (items["AI"] || "Database");
    // show dectec by ...
});

// Save and send data
document.getElementById("OnActionReport2").onclick = function () {
    chrome.tabs.reload(tab.id);
}

document.getElementById("OnActionExclude").addEventListener("click", (event) => {

    var userExcludeUrl = excludeUrl.value;
    if (userExcludeUrl == "") {
        return;
    }

    chrome.storage.sync.get(['storagekey'], function (result) {
        if (result === null) {
            result = [];
        }
        var array = result['storagekey'] ? result['storagekey'] : [];
        array.unshift(userExcludeUrl);

        var jsonObj = {};
        jsonObj['storagekey'] = array;
        chrome.storage.sync.set(jsonObj, function () {
            alert("thanh cong")
        });
    });

    response = $.post(api_endpoint_C + "exclude/url", {
        user_id: "192.168.0.0",
        url_exclude: userExcludeUrl,
        label: "1"
    }).done(o => {
        console.log(o);
        excludeUrl.value = ""
    });
})

document.getElementById("OnActionReport").addEventListener("click", (event) => {
    //report url
    // response = $.post(api_endpoint_C + "report/url", {
    //     user_id: "192.168.0.172",
    //     url_report: reportUrl.value,
    //     label: "1",
    //     content_report: url,
    // }).done(o => {
    //     alert(" Thanks for your report !!!")
    //     console.log(o);
    //     reportUrl.value = ""
    // });
    reportUrl.value = ""
    alert(" Thanks for your report !!!")
})

document.getElementById("OnActionDelete").addEventListener("click", (event) => {
    var userDeleteUrlExclude = deleteUrlExclude.value;
    if (userDeleteUrlExclude == "") {
        return;
    }

    chrome.storage.sync.get(['storagekey'], function (result) {
        if (result === null) {
            result = [];
        }
        var theList = result['storagekey'] ? result['storagekey'] : [];
        console.log("deleteUrlExclude " + userDeleteUrlExclude)
        // Checks if the url that will be deleted is in the array:
        console.log(theList.includes(userDeleteUrlExclude))
        if (theList.includes(userDeleteUrlExclude)) {
            console.log("HHHHHH")
            // create a new array without url
            var newUrlList = theList.filter(function (item) {
                return item !== userDeleteUrlExclude;
            });
            console.log("delete  " + newUrlList)
            var jsonObj = {};
            jsonObj['storagekey'] = newUrlList;
            // set new url list to the storage
            chrome.storage.sync.set(jsonObj, function () {
                // alert("Delete url exclude thanh cong")
            });
            deleteUrlExclude.value = ""
            alert("Delete url exclude thanh cong")
            chrome.runtime.reload();
        } else {
            deleteUrlExclude.value = ""
            alert("The url not exclude")
        }
    });
})

// document.getElementById("actionReportIssue").onclick = function () {
//     //report issue extension
//     response = $.post(api_endpoint + "report", {
//         url: current_url
//     }).done(o => {
//         console.log(o.result)
//         if (o.result) {
//             // show notification

//         }
//     });

// }