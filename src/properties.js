require('dotenv').config()

const test = {
  api: {
    ldsA: 'http://mock/',
    ldsB: 'http://mock/',
    ldsC: 'http://mock/'
  }
};

const development = {
  api: {
    ldsA: 'http://localhost:9090/',
    ldsB: 'http://localhost:9090/',
    ldsC: 'http://localhost:9090/'
  }
};

const staging_bip = {
  api: {
    ldsA: "https://workbench-graph-service.staging-bip-app.ssb.no/be/lds-a/",
    ldsB: "https://workbench-graph-service.staging-bip-app.ssb.no/be/lds-b/",
    ldsC: "https://workbench-graph-service.staging-bip-app.ssb.no/be/lds-c/"
  }
};

module.exports = {
  test: test,
  development: development,
  staging_bip: staging_bip,
};
