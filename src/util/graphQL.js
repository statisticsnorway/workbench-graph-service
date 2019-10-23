function isObject (obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

function humanizeGraphQLResponse (input) {
  if (!input) return null
  const output = {}

  Object.keys(input).forEach(key => {
    if (input[key] && input[key].edges) {
      output[key] = input[key].edges.map(edge => humanizeGraphQLResponse(edge.node))
    } else if (isObject(input[key])) {
      output[key] = humanizeGraphQLResponse(input[key])
    } else if (Array.isArray(input[key])) {
      output[key] = input[key].map(o => humanizeGraphQLResponse(o))
    } else {
      output[key] = input[key]
    }
  })

  return output
}

module.exports = humanizeGraphQLResponse
