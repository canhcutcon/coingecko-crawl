export var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PUT"] = "PUT";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
})(Methods || (Methods = {}));
export var HTTP_STATUS;
(function (HTTP_STATUS) {
    HTTP_STATUS[HTTP_STATUS["Success"] = 200] = "Success";
    HTTP_STATUS[HTTP_STATUS["BadRequest"] = 400] = "BadRequest";
    HTTP_STATUS[HTTP_STATUS["Unauthorized"] = 401] = "Unauthorized";
    HTTP_STATUS[HTTP_STATUS["Forbidden"] = 403] = "Forbidden";
    HTTP_STATUS[HTTP_STATUS["NotFound"] = 404] = "NotFound";
    HTTP_STATUS[HTTP_STATUS["Internal"] = 500] = "Internal";
})(HTTP_STATUS || (HTTP_STATUS = {}));
