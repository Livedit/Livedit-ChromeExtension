/**
 * Created by Kten on 2015-06-03.
 */

/**
 * Live Edit Connection Function
 */

var conn = livedit.moduleDefine("livedit.conn");

conn.connection = function() {
    // Set up context menu at install time.
    chrome.runtime.onInstalled.addListener(function () {
        var context = "page";
        var title = "Live Edit Start";
        var id = chrome.contextMenus.create({"title": title, "contexts": [context], "id": "context" + context})
    });

    // add click event
    chrome.contextMenus.onClicked.addListener(this.onClickHandler);
}

conn.onClickHandler = function(){
    conn.connect();
    console.log("Live Edit Start");
};

conn.appendMessage = function(text){
    console.log(text);
};

conn.port = null;

// Message 보냄
conn.sendNativeMessage = function() {
    var message = "Send Message";
    conn.port.postMessage(message);
    conn.appendMessage("Sent message: " + JSON.stringify(message));
};

// Message 기다림
conn.onNativeMessage = function(message) {
    conn.appendMessage("Received message: " + JSON.stringify(message));
}

// 연결을 끊음
conn.onDisconnected = function() {
    conn.appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    conn.port = null;
}

// 연결
conn.connect = function() {
    var hostName = "com.google.chrome.example.echo"; // 나중에 바꿀 hostName

    conn.appendMessage("Connecting to native messaging host" + hostName);
    conn.port = chrome.runtime.connectNative(hostName);
    conn.appendMessage(this.port);
    conn.port.onMessage.addListener(this.onNativeMessage);
    conn.port.onDisconnect.addListener(this.onDisconnected);
}

/**
 * Live Edit View & Code Match
 **/

var match = livedit.moduleDefine("livedit.match");





