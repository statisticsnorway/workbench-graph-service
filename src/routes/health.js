const router = require('express').Router();

module.exports = () => {
    router.get('/', (req, res) => res.status(200).send({
        message: 'Workbench Graph Service',
    }));

    router.get("/health/alive", function (req, res) {
        res.status(200).send();
    });

    router.get("/health/ready", function (req, res) {
        res.status(200).send();
    });
    return router;
};