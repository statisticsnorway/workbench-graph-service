const gql = require('graphql-tag')

module.exports = gql`
    query getStatisticalProgramById($id: ID!) {
        StatisticalProgramById(id: $id) {
            statisticalProgramCycles {
                edges {
                    node {
                        id
                        name {
                            languageCode
                            languageText
                        }
                        description {
                            languageText
                        }
                        businessProcesses {
                            edges {
                                node {
                                    id
                                    name {
                                        languageCode
                                        languageText
                                    }
                                    description {
                                        languageCode
                                        languageText
                                    }
                                    reverseBusinessProcessParentBusinessProcess {
                                        edges {
                                            node {
                                                id
                                                name {
                                                    languageCode
                                                    languageText
                                                }
                                                processSteps {
                                                    edges {
                                                        node {
                                                            id
                                                            name {
                                                                languageCode
                                                                languageText
                                                            }
                                                            description {
                                                                languageCode
                                                                languageText
                                                            }
                                                            previousProcessStep {
                                                                id
                                                            }
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
                                                                                id
                                                                                inputId {
                                                                                    ... on UnitDataSet {
                                                                                        id
                                                                                        name {
                                                                                            languageCode
                                                                                            languageText
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    processExecutionCode
                                                                    processExecutionLog {
                                                                        logMessage
                                                                    }
                                                                    transformedOutputs {
                                                                        edges {
                                                                            node {
                                                                                id
                                                                                outputId {
                                                                                    ... on UnitDataSet {
                                                                                        id
                                                                                        name {
                                                                                            languageCode
                                                                                            languageText
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
                                    previousBusinessProcess {
                                        id
                                        name {
                                            languageCode
                                            languageText
                                        }
                                        description {
                                            languageCode
                                            languageText
                                        }
                                        processSteps {
                                            edges {
                                                node {
                                                    id
                                                    name {
                                                        languageCode
                                                        languageText
                                                    }
                                                    previousProcessStep {
                                                        id
                                                    }
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
                                                                        id
                                                                        inputId {
                                                                            ... on UnitDataSet {
                                                                                id
                                                                                name {
                                                                                    languageCode
                                                                                    languageText
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            processExecutionCode
                                                            processExecutionLog {
                                                                logMessage
                                                            }
                                                            transformedOutputs {
                                                                edges {
                                                                    node {
                                                                        id
                                                                        outputId {
                                                                            ... on UnitDataSet {
                                                                                id
                                                                                name {
                                                                                    languageCode
                                                                                    languageText
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
                                    processSteps {
                                        edges {
                                            node {
                                                id
                                                name {
                                                    languageCode
                                                    languageText
                                                }
                                                description {
                                                    languageCode
                                                    languageText
                                                }
                                                previousProcessStep {
                                                    id
                                                }
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
                                                                    id
                                                                    inputId {
                                                                        ... on UnitDataSet {
                                                                            id
                                                                            name {
                                                                                languageCode
                                                                                languageText
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        processExecutionCode
                                                        processExecutionLog {
                                                            logMessage
                                                        }
                                                        transformedOutputs {
                                                            edges {
                                                                node {
                                                                    id
                                                                    outputId {
                                                                        ... on UnitDataSet {
                                                                            id
                                                                            name {
                                                                                languageCode
                                                                                languageText
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
                }
            }
        }
    }
`