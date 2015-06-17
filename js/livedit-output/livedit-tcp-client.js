/**
 * Created by Kten on 2015-06-03.
 */

/**
 * Live Edit Connection Function
 */

var conn = livedit.moduleDefine("livedit.conn");
var util = livedit.moduleDefine("livedit.util");

conn.tcpClient = function(host, port){
    this.host = host;
    this.port = port;
    this._onReceive = this._onReceive.bind(this);
    this._onReceiveError = this._onReceiveError.bind(this);

    this.callbacks = {
        connect : null,
        disconnect : null,
        recv : null,
        sent : null
    };

    // Socket
    this.socketId = null;
    this.isConnected = false;

    console.log("initialized TCP Client");
};

conn.tcpClient.prototype.connect = function(callback){
    this.callbacks.connect = callback;

    chrome.sockets.tcp.create({}, this._onCreate.bind(this));
};

conn.tcpClient.prototype.sendMessage = function(msg, callback){
    this.callbacks.sent = callback;

    this._stringToArrayBuffer(msg + "\n", function(arrayBuffer){
        chrome.sockets.tcp.send(this.socketId, arrayBuffer, this._onSendComplete.bind(this));
    }.bind(this));
};

conn.tcpClient.prototype.addResponseListener = function(callback){
    this.callbacks.recv = callback;
};

conn.tcpClient.prototype.disconnect = function(){
    chrome.sockets.tcp.onReceive.removeListener(this._onReceive);
    chrome.sockets.tcp.onReceiveError.removeListener(this._onReceiveError);
    chrome.sockets.tcp.disconnect(this.socketId);
    chrome.socket.tcp.close(this.socketId);
    this.socketId = null;
    this.isConnected = false;
};

conn.tcpClient.prototype._onCreate = function(createInfo){
    if(chrome.runtime.lastError){
        error("Unable to crate socket : " + chrome.runtime.lastError.message);
    }

    this.socketId = createInfo.socketId;
    this.isConnected = true;

    chrome.socket.tcp.connect(this.socketId, this.host, this.port, this._onConnectComplete.bind(this));
};

conn.tcpClient.prototype._onConnectComplete = function(resultCode){
    if(resultCode < 0){
        util.error("Unable to connect to server");

        return;
    }

    // Start listening to message events
    chrome.socket.tcp.onReceive.addListener(this._onReceive);
    chrome.socket.tcp.onReceiveError.addListener(this._onReceiveError);

    if(this.callbacks.connect){
        util.log("connect complete.");
        this.callbacks.connect();
    }
};

conn.tcpClient.prototype._onReceive = function(receiveInfo){
    if(receiveInfo.socketId != this.socketId){
        return;
    }

    if(this.callbacks.recv){
        util.log("onDataRead");

        this._arrayBufferToString(receiveInfo.data, function(str){
            this.callbacks.recv(str);
        }.bind(this));
    }
};

conn.tcpClient.prototype._onReceiveError = function(info){
    if(info.socketId != this.socketId){
        return;
    }

    util.log("Unable to receive data from socket: " + info.resultCode);
};

conn.tcpClient.prototype._onSendComplete = function(sendInfo){
    util.log("onSendComplete");

    if(this.callbacks.sent){
        this.callbacks.sent(sendInfo);
    }
};

conn.tcpClient.prototype._arrayBufferToString = function(buf, callback){
    var reader = new FileReader();
    reader.onload = function(e){
        callback(e.target.result);
    };

    var blob = new Blob([buf], {type: "application/octet-stream"});
    reader.readAsText(blob);
};

conn.tcpClient.prototype._stringToArrayBuffer = function(str, callback){
    var blob = new Blob([str]);
    var file = new FileReader();

    file.onload = function(e){
        callback(e.target.result);
    };

    file.readAsArrayBuffer(blob);
};

/**
 * Live Edit View & Code Match
 **/

var match = livedit.moduleDefine("livedit.match");

/**
 * Live Edit Copy Page Create *
 **/

var copiedPage = livedit.moduleDefine("livedit.copy");
