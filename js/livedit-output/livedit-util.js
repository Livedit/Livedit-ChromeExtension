/**
 * Created by Kten on 2015-06-17.
 */

var util = livedit.moduleDefine("livedit.util");

util.error = function(msg){
    console.log("[ERROR] " + msg);
};

util.log = function(msg){
    console.log("[LOG] " + msg);
}
