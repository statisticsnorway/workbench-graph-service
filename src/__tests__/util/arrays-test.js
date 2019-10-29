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

  test('It should sort some real life business processes', () => {
    const linkFn = o => o.ref
    const businessProcesses = [
      { id: '1_2_3', name: '1_2_3 Utlede variabler - Lønn og tilsvarende ytelser', ref: '1_2_2' },
      { id: '1_3_2', name: '1_3_2 Aggregere - Kombiner til samlet persondatasett', ref: '1_3_1' },
      { id: '1_2_1', name: '1_2_1 Utlede variabler - Konto', ref: '1_1_1' },
      { id: '1_2_2', name: '1_2_2 Utlede variabler - Eiendom', ref: '1_2_1' },
      { id: '1_1_1', name: '1_1_1 Preprossessering - Skill ut skatteobjekter', ref: undefined },
      { id: '1_3_1', name: '1_3_1 Aggregere - Skatteobjekter til person nivå', ref: '1_2_3' }
    ]
    const expected = [
      { id: '1_1_1', name: '1_1_1 Preprossessering - Skill ut skatteobjekter', ref: undefined },
      { id: '1_2_1', name: '1_2_1 Utlede variabler - Konto', ref: '1_1_1' },
      { id: '1_2_2', name: '1_2_2 Utlede variabler - Eiendom', ref: '1_2_1' },
      { id: '1_2_3', name: '1_2_3 Utlede variabler - Lønn og tilsvarende ytelser', ref: '1_2_2' },
      { id: '1_3_1', name: '1_3_1 Aggregere - Skatteobjekter til person nivå', ref: '1_2_3' },
      { id: '1_3_2', name: '1_3_2 Aggregere - Kombiner til samlet persondatasett', ref: '1_3_1' }
    ]
    expect(sortByChainedRefs(businessProcesses, linkFn)).toEqual(expected)
  })

})
