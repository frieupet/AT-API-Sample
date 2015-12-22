"use strict";

var Q = require('q'), //https://www.npmjs.com/package/q
    Client = require('node-rest-client').Client; //https://www.npmjs.com/package/node-rest-client;

module.exports = {

    //Get only one metric value for a only one dimension
    //
    // parameters :
    //
    //  var parameters = {
    //    "login": "user login",
    //    "password": "user password",
    //    "url": "Query url generated with DataQuery. Must be a query which only return a scalar value = only the value of metric"
    //  };
    //
    // Return a promise. Use like this :
    //
    //  ATHelper.getScalarValue(parameters)
    //  .then(function (result) {
    //      code for checking result
    //  })
    //  .catch(function (error) {
    //      code for checking error
    //  });
    //
    // or like this (node callback)
    //
    //  ATHelper.getScalarValue(queryParameters,
    //    function (error, result) {
    //        if (error) {
    //            code for checking error
    //        }
    //        code for checking result
    //    );
    //
    // For "no data" return null
    //
    getScalarValue: function (parameters, callback) {

        var objResult, result;
        var deferred = Q.defer();

        var options = {
            user: parameters.login,
            password: parameters.password,
            requestConfig: {
                timeout: 60000 //request timeout in milliseconds
            },
            responseConfig: {
                timeout: 1000 //response timeout
            }
        };

        var client = new Client(options); //node-rest-client

        var request = client.get(parameters.url, function (data, response) {

                try {

                    //check http response code
                    if (response.statusCode !== 200) {
                        var err = new Error("Bad response code : " + response.statusCode);
                        err.httpCode = response.statusCode;
                        deferred.reject(err);
                        return;
                    }

                    //get metric value, can throw an error
                    objResult = JSON.parse(data).DataFeed[0].Rows[0];

                    if (objResult) {
                        result = objResult[Object.keys(objResult)[0]];
                        if (!isNumeric(result)) {
                            deferred.reject(new Error("The value is not a number : " + result));
                            return;
                        }
                        result = parseInt(result);
                    }
                    else {
                        //no rows = no data -> 0 or null ?
                        result = 0;
                    }

                    deferred.resolve(result);

                }
                catch (ex) {
                    deferred.reject(ex);
                }
            }
        );

        request.on('requestTimeout', function (req) {
            req.abort();
            deferred.reject(new Error('Request timeout'));
        });

        request.on('responseTimeout', function () {
            deferred.reject(new Error('Response timeout'));
        });

        request.on('error', function (err) {
            deferred.reject(new Error(err));
        });

        deferred.promise.nodeify(callback);
        return deferred.promise;
    }
};

//validate a number
var isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
