async function errorHandler(err, req, res, next) {

    res.status(err.httpCode || 404);

    let response = {
        code: (err.errorCode || err.message),
        error: err.message,
        response: req.response
    };

    res.json(response);
    res.end();

}

module.exports = errorHandler;