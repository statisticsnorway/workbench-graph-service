const gql = require('graphql-tag')

module.exports = gql`
  query getStatisticalProgramById($id: ID!) {
    StatisticalProgramById(id: $id) {
      statisticalProgramCycles {
        edges {
          node {
            id
            name {languageText}
            description {languageText}
            businessProcesses {
              edges {
                node {
                  id
                  name {languageText}
                  description {languageText}
                  previousBusinessProcess {
                    id
                    name {languageText}
                    description {languageText}
                    processSteps {
                      edges {
                        node {
                          id
                          name {languageText}
                          technicalPackageID
                          codeBlocks {
                            codeBlockIndex
                            codeBlockTitle
                            codeBlockType
                            codeBlockValue
                            processStepInstance {
                              id
                              transformableInputs {
                                edges {
                                  node {
                                    inputId {__typename}
                                  }
                                }
                              }
                              processExecutionCode
                              processExecutionLog {logMessage}
                              transformedOutputs {
                                edges {
                                  node {id}
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  processSteps {
                    edges {
                      node {
                        id
                        name {languageText}
                        description {languageText}
                        technicalPackageID
                        codeBlocks {
                          codeBlockIndex
                          codeBlockTitle
                          codeBlockType
                          codeBlockValue
                          processStepInstance {
                            id
                            transformableInputs {
                              edges {
                                node {
                                  inputId {__typename}
                                }
                              }
                            }
                            processExecutionCode
                            processExecutionLog {logMessage}
                            transformedOutputs {
                              edges {
                                node {id}
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`