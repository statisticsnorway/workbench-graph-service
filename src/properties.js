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
    ldsA: "http://lds-postgres-gsim.linked-data-store/",
    ldsB: "http://lds-b-postgres-gsim.linked-data-store/",
    ldsC: "http://lds-c-postgres-gsim.linked-data-store/"
  }
};

module.exports = {
  test: test,
  development: development,
  staging_bip: staging_bip,
};
