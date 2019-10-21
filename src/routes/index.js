
module.exports = (app) => {
    app.use('', require('./health')());
    app.use('/api/graph', require('./graph')());
};