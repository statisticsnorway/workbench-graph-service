const sortByChainedRefs = require('../../util/arrays')

describe('Array util', () => {

  test('It should sort by internal references', () => {
    const linkFn = o => o.ref

    const unsorted1 = [
      { id: 4, name : 'third', ref : 3},
      { id: 3, name : 'second', ref : 2},
      { id: 2, name : 'first', ref : 1},
      { id: 1, name : 'top', ref : null},
    ]
    const unsorted2 = [
      { id: 4, name : 'third', ref : 3},
      { id: 3, name : 'second', ref : 2},
      { id: 1, name : 'top', ref : null},
      { id: 2, name : 'first', ref : 1},
    ]
    const expected = [
      { id: 1, name : 'top', ref : null},
      { id: 2, name : 'first', ref : 1},
      { id: 3, name : 'second', ref : 2},
      { id: 4, name : 'third', ref : 3},
    ]
    expect(sortByChainedRefs(unsorted1, linkFn)).toEqual(expected)
    expect(sortByChainedRefs(unsorted2, linkFn)).toEqual(expected)
  })

})
