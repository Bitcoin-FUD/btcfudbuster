import prompt from 'prompt'
import environment from './material/environment.mjs'

/**
 * @description Method to get random element from array
 * @param {*[]} arr the array
 * @returns {*} random element
 * @example random(['a', 'b', 'c'])
 */
 export const random = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}

(async () => {
  prompt.start()

  while (true) {
    let result = await prompt.get([{
      name: 'query',
      description: 'Query you want to test',
      required: true
    }])
    let query = result.query
    console.log('Your query: ' + query)

    let answers = environment
      .map(material => {
        material.hits = query
          .split(' ')
          .filter(keyword => material.tags.indexOf(keyword) !== -1)
          .length

        return material
      })
      .filter(material => material.hits > 0)
      .sort((a, b) => a.hits > b.hits
        ? 1
        : a.hits < b.hits
        ? -1
        : Math.random() < .5 ? 1 : -1
      )

    let bestAnswer = answers.pop()
    if (bestAnswer) {
      let url = random(bestAnswer.links)
      let tweet = `${bestAnswer.answer} ${url} @guidinguser @noviceuser`
      console.log(tweet)
    } else {
      console.log('No results')
    }
  }
})()