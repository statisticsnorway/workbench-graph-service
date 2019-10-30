const _ = require('lodash')
const sortByChainedRefs = require('../util/arrays')

/*
* List of all available node types that can be mapped
*/
const nodeTypes = {
  STATISTICAL_PROGRAM_CYCLE: { path: 'statisticalProgramCycles', type: 'StatisticalProgramCycle' },
  BUSINESS_PROCESS_CHILDREN: { path: 'reverseBusinessProcessParentBusinessProcess', type: 'BusinessProcess' },
  BUSINESS_PROCESS_REVERSE: { path: 'previousBusinessProcess', type: 'BusinessProcess', reverse: true },
  BUSINESS_PROCESS: { path: 'businessProcesses', type: 'BusinessProcess' },
  PROCESS_STEP: { path: 'processSteps', type: 'ProcessStep', sortBy: o => _.get(o, 'previousProcessStep.id')},
  CODE_BLOCK: { path: 'codeBlocks', type: 'CodeBlock' },
  INPUT_DATASET: { path: 'processStepInstance.transformableInputs', type: 'UnitDataset', reverse: true },
  OUTPUT_DATASET: { path: 'processStepInstance.transformedOutputs', type: 'UnitDataset' }
}

// Mark a node type to invisible (not shown as part of the graph)
/* istanbul ignore next */
const invisible = (type) => {
  type.invisible = true
  return type
}

/*
 * This class iterates over a hierarchical data structure and transforms selected node types into a dependency graph.
 */
class GraphMapper {

  constructor (structure, mappedTypes, type) {
    this.mappedTypes = mappedTypes
    this.result = { root: { id: structure.id }, nodes: [], edges: [] }
    this.addToResult(null, structure, type)
  }

  get graph () {
    return this.result
  }

  createNode = (obj, type) => {
    // TODO: Use language code
    return { id: obj.id, label: obj.name ? obj.name[0].languageText : 'no name', type: type, technicalID: obj.technicalPackageID }
  }

  createCodeBlock = (obj) => {
    return { id: obj.id, label: obj.codeBlockTitle || 'Kode blokk', type: nodeTypes.CODE_BLOCK.type }
  }

  createEdge = (from, to) => {
    return { from: from.id, to: to.id }
  }

  addToResult = (parent, obj, type, reverse = false, invisible = false) => {
    try {
      if (!invisible) {
        this.addRelation(parent, obj, type, reverse)
      }

      this.mappedTypes.forEach(node => {
        const value = _.get(obj, node.path)
        if (value) {
          if (Array.isArray(value)) {
            sortByChainedRefs(value, node.sortBy).forEach(e => {
              this.addToResult(invisible ? parent : obj, e, node.type, node.reverse, node.invisible)
            })
          } else {
            /* istanbul ignore next */
            this.addToResult(invisible ? parent : obj, value, node.type, node.reverse, node.invisible)
          }
        }
      })
    } catch (e) {
      /* istanbul ignore next */
      console.error('Transformation error', e)
    }
  }

  addRelation (parent, child, childType, reverse) {
    if (childType === nodeTypes.CODE_BLOCK.type) {
      child.id = parent.id + child.codeBlockIndex
      this.addNode(this.createCodeBlock(child))
    } else if (child.outputId) {
      child.id = child.outputId.id
      child.name = child.outputId.name
      this.addNode(this.createNode(child, childType))
    } else if (child.inputId) {
      child.id = child.inputId.id
      child.name = child.inputId.name
      this.addNode(this.createNode(child, childType))
    } else {
      this.addNode(this.createNode(child, childType))
    }
    if (parent && reverse) {
      this.result.edges.push(this.createEdge(child, parent))
    } else if (parent) {
      this.result.edges.push(this.createEdge(parent, child))
    }
  }

  addNode(node) {
    // Check to avoid duplicates
    if (!this.result.nodes.find(e => e.id === node.id)) {
      this.result.nodes.push(node)
    }
  }
}

module.exports = { nodeTypes: nodeTypes, invisible: invisible, GraphMapper: GraphMapper }