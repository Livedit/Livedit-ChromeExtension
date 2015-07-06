/**
 * Created by Kten on 2015-07-02.
 */
var inspectLinkFlag = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if (request.action && request.action == "getDOM") {
        var url = request.text;
        var saveUrl = "http://localhost:63342/LiveEdit/page/main.html";
        document.body.innerHTML = "<iframe style='width:50%; height:100vh; border:0px;' src='" + saveUrl + "'></iframe>" +
                                "<iframe style='width:50%; height:100vh; border:0px;' src='" + url +"'></iframe>";
        sendResponse({"msg": "Save Success."});
    } else if(request.action && request.action == "inspectDOM") {
        inspectDOM();
    }else
        sendResponse({"msg" : "Command is Fail."});
});

function inspectDOM(){

    if(!inspectLinkFlag) {
        var link = document.createElement("link");
        link.id = "inspectLink";
        link.href = chrome.extension.getURL("css/inspect.css");
        link.type = "text/css";
        link.rel = "stylesheet";
        $("head").append(link);

        inspectLinkFlag = true;
    }

    var last_element = null;

    // Inspect DOM Dialog Modifing
    /*
    $("body *").bind("click", function(){
        var is_different_elem = $(this)[0] != $(last_element)[0];
        if (last_element == null || is_different_elem || $(".dialogs").length == 0) {
            $(".dialogs").remove();
            $(this).append("<div id='dialog' class='dialogs'></div>");
            var element = $(this).get(0).tagName.toLowerCase();

            var id = $(this).attr("id");
            if (id)
                id = "#"+id;
            else
                id = "";

            var klass = $(this).attr("class"); // TODO: multiple classes support
            if (klass)
                klass = "."+klass.replace(/\s*dh_hover/, '');
            else
                klass = "";

            var infos = "element: "+element+id+klass;
            $("#dialog").html(infos).show();
        } else {
            $(".dialogs").remove();
        }

        last_element = this;
    });
    */

    // duplicate hover problem 
    $("body *").hover(function(){
        $(this).addClass("dh_hover")
        $(this).width($(this).width()).height($(this).height())
    }, function(){
        $(".dialogs").remove()
        $(this).removeClass("dh_hover")
        $(this).width($(this).width()).height($(this).height())
    })
}