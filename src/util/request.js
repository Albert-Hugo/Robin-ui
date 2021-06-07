
import axois from "axios";

function paramToUrl(data){
    let str = '';
    for (let key in data) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(data[key]);
    }
    return str;
}

function get(config) {
    let str = paramToUrl(config.data);
    
    axois
        .get(config.url + '?' + str)
        .then((rsp) => {
            config.callback(rsp)
        });
}

function postDelete(config) {
    axois
        .post(config.url ,config.data)
        .then((rsp) => {
            config.callback(rsp)
        });
}


export default {
    "get": get,
    "postDelete": postDelete,
}