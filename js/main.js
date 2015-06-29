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

function onStartLiveEditHandler(){
    client.conn.init();
}