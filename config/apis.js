const host = "http://localhost:10086";

module.exports = {
    "state": host + "/state",
    "nodesInfo": host + "/nodes-info",
    "get": host + "/get",
    "addNode": host + "/node/add",
    "deleleKey": host + "/delete",
    "fileKeysDetail": host + "/file-keys-detail",
}