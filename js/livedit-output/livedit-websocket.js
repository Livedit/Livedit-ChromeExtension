/**
 * Created by Kten on 2015-06-25.
 */

var client = livedit.moduleDefine("livedit.client"),
    save = livedit.moduleDefine("livedit.save"),
    tool = livedit.moduleDefine("livedit.tool");
    util = livedit.moduleDefine("livedit.util");

new function() {
    var ws = null,
        connected = null;

    var host = "211.189.127.153",
        port = "9003",
        url = "ws://" + host + ":" + port;

    var open = function () {
        ws = new WebSocket(url);
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;

        util.log("OPENING....");
    };

    var close = function () {
        if (ws) {
            util.log("CLOSING....");

            ws.close();
        }

        connected = false;
    };

    var onOpen = function(){
        util.log("OPENED : " + url);
        connected = true;
    };

    var onClose = function(){
        util.log("CLOSED : " + url);
    };

    var onMessage = function(msg){
        var replacedData = msg.data.replace(/'/g, '"');
        var jsonStr = JSON.parse(replacedData);

        util.log("RCV MSG : " + replacedData);

        var nodeSelector = jsonStr.nodeSelector,
            command = jsonStr.command;

        if(command == "inspect")
            tool.onInspectDOM(nodeSelector);
    };

    var onError = function(event){
        util.error(event.data);
    };

    WebSocketClient = {
        init : function(){
            close();
            open();
        }
    };
};

client.conn = WebSocketClient;

