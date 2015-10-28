
var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  var sendResponse = function(reponse,data,statusCode) {
    statusCode = statusCode || 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  }

  var objectID = 1;
  var messages = [
    {
    username: "Jono",
    message: "Do my bidding!",
    objectID: objectID
    }
  ];

  if ( request.url !== "/classes/room1" && request.url !== "/classes/messages" ) { 
    sendResponse(response, "Not Found", 404);
  }

  if (request.method === "GET") {
    sendResponse(response, {results: messages} ,200);
  } else if (request.method === "POST") {
    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
    });
    request.on('end', function() {
      data = JSON.parse(data);
      data[objectID] = ++objectID;
      messages.push(data);
      sendResponse(response, {objectID: 1}, 201);
    });
  } else if (request.method === "OPTIONS") {
    sendResponse(response, null);    
  }

};


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler