/**
 * Created by Kten on 2015-06-04.
 */

var util = livedit.moduleDefine("livedit.util"),
    client = livedit.moduleDefine("livedit.client");

chrome.contextMenus.create({
    "title" : "Live Edit Start",
    "contexts": ["all"],
    "documentUrlPatterns": ["http://*/*", "https://*/*"],
    "id" : "context_livedit"
});

chrome.contextMenus.onClicked.addListener(onStartLiveEditHandler);

document.getElementById("livedit-partition-button").onclick = onCallSavedPage;
document.getElementById("livedit-save-button").onclick=onSaveCurrentPage;
document.getElementById("livedit-inspectDOM-button").onclick=onInspectDOM;

function onStartLiveEditHandler(){
    //client.conn.init();
}

function onSaveCurrentPage(){
    alert("This button is saved Current Page");
}

function onCallSavedPage(){
    chrome.tabs.query({active : true}, function(tab) {
        var tab = tab[0];

        // Send a request to the content script.
        chrome.tabs.sendMessage(tab.id, {action: "getDOM", text:tab.url}, function(response)
        {
            util.log(response.msg);
        });
    });
};

function onInspectDOM(){
    chrome.tabs.query({active : true}, function(tab) {
        var tab = tab[0];

        // Send a request to the content script.
        chrome.tabs.sendMessage(tab.id, {action: "inspectDOM", text:tab.url}, function(response)
        {
            util.log(response.msg);
        });
    });
}