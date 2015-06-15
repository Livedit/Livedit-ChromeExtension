/**
 * Created by Kten on 2015-06-04.
 */

/**
 * livedit object create
 **/
var livedit = livedit || {};

livedit.moduleDefine = function(ns_string){
    var parts = ns_string.split('.'),
        parent = livedit,
        i;

    // ó�� �ߺ��Ǵ� ���� ��ü�� ����
    if(parts[0] === "livedit"){
        parts = parts.slice(1);
    }

    for(i = 0 ; i < parts.length; i ++){
        if(typeof parent[parts[i]] === "undefined"){
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
}