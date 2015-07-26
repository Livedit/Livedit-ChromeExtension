/**
 * Created by Kten on 2015-07-10.
 */
var tool = livedit.moduleDefine("livedit.tool");

tool.init = function(){
    chrome.debugger.onEvent.addListener(function(source, method, param){
        if(method == "Debugger.scriptParsed" && param.url.startsWith("http://")){
            util.log("SCRIPT PARSED(ID) : " + param.scriptId);
            util.log("SCRIPT PARSED(URL) : " + param.url );
        }
    });

    // On Detach Callback Function
    chrome.debugger.onDetach.addListener(function(source, reason){
        util.log("DETACH : TAB[" + source.tabId + "] REASON[" + reason + "]");
    });
}

tool.onInspectDOM = function(nodeSelector){

    chrome.tabs.query({active : true}, function(tab) {
        var tab = tab[0];

        tool.highlight = {
            config: function () {
                Object.defineProperty(this, 'contentColor', {value: {r: 255, g: 237, b: 130, a: 0.66}, enumerable: true});
                Object.defineProperty(this, 'paddingColor', {value: {r: 153, g: 140, b: 61, a: 0.55}, enumerable: true});
                Object.defineProperty(this, 'borderColor', {value: {r: 199, g: 78, b: 255, a: 0.66}, enumerable: true});
                Object.defineProperty(this, 'marginColor', {value: {r: 61, g: 153, b: 83, a: 0.66}, enumerable: true});
                Object.defineProperty(this, 'showInfo', {value: true, enumerable: true});
            }
        };

        tool.highlight.config();

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, debuggee));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function(response){
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            var body = responsedDOM.root.children[1].children[1];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector",{"nodeId" : body.nodeId, "selector" : nodeSelector}, function(response){
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + body.nodeId + ", 'selector' : " + nodeSelector +"}]");
                var nodeId = response.nodeId;

                // Send Command Highlight Node
                chrome.debugger.sendCommand(debuggee, "DOM.highlightNode",{"nodeId" : nodeId, "highlightConfig" : tool.highlight}, function(response){
                    util.log("HIGHLIGHT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.highlightNode, {'nodeId' : " +nodeId + ", 'highlightConfig'' : tool.highlight}]");
                });
            });
        });
    });
};

tool.onRemoveAttribute = function(param){
    var attributeName = param.name,
        nodeSelector = param.selector;

    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            var body = responsedDOM.root.children[1].children[1];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector", {
                "nodeId": body.nodeId,
                "selector": nodeSelector
            }, function (response) {
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + body.nodeId + ", 'selector' : " + nodeSelector + "}]");
                var nodeId = response.nodeId;

                // Send Command : Remove Attr
                chrome.debugger.sendCommand(debuggee, "DOM.removeAttribute", {"nodeId": nodeId, "name" : attributeName}, function (response) {
                    util.log("REMOVE : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.removeAttribute, {'nodeId' : " + response.id + ", 'name' : "+ attributeName + "}]");
                });
            });
        });
    });
};

tool.onRemoveElement = function(nodeSelector){
    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            var body = responsedDOM.root.children[1].children[1];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector", {
                "nodeId": body.nodeId,
                "selector": nodeSelector
            }, function (response) {
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + body.nodeId + ", 'selector' : " + nodeSelector + "}]");
                var nodeId = response.nodeId;

                // Send Command : Remove Element
                chrome.debugger.sendCommand(debuggee, "DOM.removeNode", {"nodeId": nodeId}, function (response) {
                    util.log("REMOVE : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.removeNode, {'nodeId' : " + response.id + "}]");
                });
            });
        });
    });
};

tool.onInsertHTMLElementRe = function(){
    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "Page.reload", {"ignoredCache" : true}, function (response) {
            util.log("RELOAD : Func[chrome.debugger.attach],  Parameter[debuggee, 'Page.reload'])");
        });
    });
}

tool.onInsertHTMLElement = function(param){
    var nodeSelector = param.selector,
        outerHTML = param.outerHTML;

    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            console.log(responsedDOM);
            var body = responsedDOM.root.children[1].children[1];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector", {
                "nodeId": body.nodeId,
                "selector": nodeSelector
            }, function (response) {
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + body.nodeId + ", 'selector' : " + nodeSelector + "}]");
                var nodeId = response.nodeId;

                chrome.debugger.sendCommand(debuggee, "DOM.setOuterHTML", {
                    "nodeId": nodeId,
                    "outerHTML": outerHTML
                }, function(response){
                    console.log(response);

                    //tool.onInjectExternalJavascript();
                });
            });
        });
    });
};

tool.onModifyElement = function(param){
    var nodeSelector = param.selector,
        name = param.name,
        value = param.value,
        type = param.type;

    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            var body = responsedDOM.root.children[1].children[1];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector", {
                "nodeId": body.nodeId,
                "selector": nodeSelector
            }, function (response) {
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + body.nodeId + ", 'selector' : " + nodeSelector + "}]");
                var nodeId = response.nodeId;

                chrome.debugger.sendCommand(debuggee, "DOM.setAttributeValue", {
                    "nodeId": nodeId,
                    "name": name,
                    "value": value
                }, function (response) {
                    util.log("MODIFY ELEMENT ATTRIBUTE : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.setAttributeValue, {'nodeId' : " + nodeId + ", 'name' : " + name + ", 'value' : " + value + "}]");
                });
            });
        });
    });
};

tool.onInjectExternalJavascript = function(param){
    var nodeSelector = param.selector,
        outerHTML = param.outerHTML;

    chrome.tabs.query({active : true, lastFocusedWindow : true}, function(tab) {
        var tab = tab[0];

        var debuggee = {tabId: tab.id};

        chrome.debugger.attach(debuggee, "1.0", tool.onAttach.bind(null, tab.id));
        util.log("ATTACH : Func[chrome.debugger.attach],  Parameter[debuggee," + " 1.0, tool.onAttach.bind(null, " + tab.id + ")");


        chrome.debugger.sendCommand(debuggee, "Debugger.enable", function(msg){

        });

        chrome.debugger.sendCommand(debuggee, "Debugger.compileScript", {expression: outerHTML, sourceURL: tab.url, persistScript:true}, function(msg){
            chrome.debugger.sendCommand(debuggee, "Debugger.runScript", {scriptId: msg.scriptId}, function(msg){
                console.log(msg);
            });
        });

        chrome.debugger.sendCommand(debuggee, "Debugger.disalbe", function(msg){

        });

        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            var responsedDOM = response;
            console.log(responsedDOM);
            var head = responsedDOM.root.children[1].children[0];

            chrome.debugger.sendCommand(debuggee, "DOM.querySelector", {
                "nodeId": head.nodeId,
                "selector": nodeSelector
            }, function (response) {
                util.log("GET SELECTED ELEMENT : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.querySelector, {'nodeId' : " + head.nodeId + ", 'selector' : " + nodeSelector + "}]");
                var nodeId = response.nodeId;

                chrome.debugger.sendCommand(debuggee, "DOM.setOuterHTML", {
                    "nodeId": nodeId,
                    "outerHTML": outerHTML
                }, function(response){
                    console.log(response);

                    //tool.onInjectExternalJavascript();
                });
            });
        });

        /*
        chrome.debugger.sendCommand(debuggee, "DOM.getDocument", function (response) {
            util.log("GET DOM : Func[chrome.debugger.sendCommand],  Parameter[debuggee," + " DOM.getDocument]");

            console.log(response);
            var responsedDOM = response;
            var head = responsedDOM.root.children[1].children[0];

            var outerHTML = "<script lang='javascript' src='../js/temp.js'></script>"

            chrome.debugger.sendCommand(debuggee, "DOM.setOuterHTML", {
                "nodeId": head.nodeId,
                "outerHTML": outerHTML
            }, function(response){
                console.log(response);
            });
        });*/
    });
};

tool.onAttach = function(debuggee){
    if (chrome.runtime.lastError) {
        util.error(chrome.runtime.lastError.message);
        return;
    }
}

tool.init();