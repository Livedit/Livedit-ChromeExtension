/**
 * Created by Kten on 2015-07-02.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if (request.action && request.action == "getDOM") {
        var url = request.text;
        var saveUrl = "http://localhost:63342/LiveEdit/page/main.html";
        document.body.innerHTML = "<iframe style='width:50%; height:100vh; border:0px;' src='" + saveUrl + "'></iframe>" +
                                "<iframe style='width:50%; height:100vh; border:0px;' src='" + url +"'></iframe>";
        sendResponse({"msg": "Save Success."});
    }else
        sendResponse({"msg" : "Save Fail."});
});
