async function outputRenderer(req, res, next) {

    let response = {
        response: req.response
    };

    res.json(response);
    res.end();
}

module.exports = outputRenderer;