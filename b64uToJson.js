function b64uToJson(s) {
    if (s.length % 4 === 2) s = s + "==";
    else if (s.length % 4 === 3) s = s + "=";
    var base64Url = s.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(b64tohex(base64)));
}

var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad="=";
// convert a base64 string to hex
function b64tohex(s) {
    var ret = ""
    var i;
    var k = 0; // b64 state, 0-3
    var slop;
    var v;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) === b64pad) break;
        v = b64map.indexOf(s.charAt(i));
        if (v < 0) continue;
        if (k === 0) {
            ret += '%' + BI_RM.charAt(v >> 2);
            slop = v & 3;
            k = 1;
        } else if (k === 1) {
            ret += BI_RM.charAt((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        } else if (k === 2) {
            ret += '%' + BI_RM.charAt(slop);
            ret += BI_RM.charAt(v >> 2);
            slop = v & 3;
            k = 3;
        } else {
            ret += '%' + BI_RM.charAt((slop << 2) | (v >> 4));
            ret += BI_RM.charAt(v & 0xf);
            k = 0;
        }
    }
    if (k === 1)
        ret += BI_RM.charAt(slop << 2);
    return ret;
}