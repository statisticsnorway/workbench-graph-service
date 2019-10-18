
module.exports = (app) => {
    app.use('/health', require('./health')());
    app.use('/api/graph', require('./graph')());
};