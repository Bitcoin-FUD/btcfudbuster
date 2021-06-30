import prompt from 'prompt'
import { getMostRelevantAnswer } from './answerUtils.mjs'

(async () => {
  prompt.start()

  while (true) {
    let result = await prompt.get([{
      name: 'query',
      description: 'Query you want to test',
      required: true
    }])
    let query = result.query

    let bestAnswer = getMostRelevantAnswer(query)
    if (bestAnswer) {
      let tweet = `${bestAnswer} @guidinguser @noviceuser`
      console.log(tweet)
    } else {
      console.log('No results')
    }
  }

})()