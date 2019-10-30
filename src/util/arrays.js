/**
 * This function sorts an array of chained elements based on the given link function.
 * Each element in the array can have a "chain" reference to one of the other
 * elements in the same array, or null if it is at the start of the chain.
 *
 * @param array the array to sort
 * @param linkFn a link function that returns the id of the chained (linked) element
 * @returns [] sorted array
 */
function sortByChainedRefs (array, linkFn) {
  if (!linkFn) {
    return array
  } else {
    const sorted = [...array]
    let swapped = false
    // Based on the bubble sort algorithm
    for (let i = 0; i < sorted.length - 1; i++) {
      swapped = false
      for (let j = 0; j < sorted.length - 1; j++) {
        if (sorted[j].id !== linkFn(sorted[j + 1])) {
          // swap arr[j] and arr[j+1]
          let temp = sorted[j]
          sorted[j] = sorted[j + 1]
          sorted[j + 1] = temp
          swapped = true
        }
      }
      // If no two elements were swapped by inner loop, then break
      if (!swapped)
        break
    }
    return sorted
  }
}

module.exports = sortByChainedRefs
