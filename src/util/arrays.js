
/**
 * This function sorts an array of chained elements based on the given link function.
 * Each element in the array can have a "parent" reference to one of the other
 * elements in the same array, or null if it is at the start of the chain.
 *
 * @param array the array to sort
 * @param linkFn a link function that returns the id of the previous (linked) element
 * @returns [] sorted array
 */
function sortByChainedRefs(array, linkFn) {
  if (!linkFn) {
    return array
  } else {
    let sorted = []
    array.forEach(obj => {
      const value = linkFn(obj)
      if (!value) {
        const other = sorted.findIndex(o => linkFn(o) === null)
        if (other !== -1) {
          // Preserve same ordering as original array
          sorted.splice(other + 1, 0, obj)
        } else {
          // Place object with no ref first
          sorted.unshift(obj)
        }
      } else {
        const refsTo = sorted.findIndex(o => o.id === value)
        const refsFrom = sorted.findIndex(o => obj.id === linkFn(o))
        if (refsTo !== -1) {
          sorted.splice(refsTo + 1, 0, obj)
        } else if (refsFrom !== -1) {
          sorted.splice(refsFrom, 0, obj)
        } else {
          sorted.push(obj)
        }
      }
    })
    return sorted
  }
}

module.exports = sortByChainedRefs
