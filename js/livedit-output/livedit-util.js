/**
 * Created by Kten on 2015-06-17.
 */

var util = livedit.moduleDefine("livedit.util");

util.rootName = function(url){
    // 2 -> 0
    var index;
    var endFlag = false;
    for(var i = 0; i < url.length ; i ++ ) {
        if (url[i] == "2" && !endFlag ) {
            i ++;
            endFlag = true;
            continue;
        }

        if(url[i] == "\/" && endFlag){
            index = i;
            break;
        }
    }

    return url.substring(0, index);
};

util.error = function(msg){
    console.log("[ERROR] " + msg);
};

util.log = function(msg){
    console.log("[LOG] " + msg);
}

util.substringFileName = function(url){
    var index;
    for(var i = url.length - 1; i >= 0 ; i -- ) {
        if (url[i] == "\/") {
            index = i;
            break;
        }
    }

    //console.log(url.substring(index + 1, url.length));
    return url.substring(index + 1, url.length);
}