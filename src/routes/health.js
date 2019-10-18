const router = require('express').Router();

module.exports = () => {
    router.get("/alive", function (req, res) {
        res.status(200).send();
    });

    router.get("/ready", function (req, res) {
        res.status(200).send();
    });
    return router;
};