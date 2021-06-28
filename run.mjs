import path from 'path'
import Realm from 'realm'
import { State } from './schemas.mjs'
import { getLatestTweets, getTweet, sendTweet } from './tweetUtils.mjs'
import { getMostRelevantAnswer } from './answerUtils.mjs'

const __dirname = path.resolve()

let realm
let state

Realm.open({
  path: path.join(__dirname + '/btcfudbuster', 'db.realm'),
  schema: [ State ]
})
  .then(async r => {
    realm = r
    state = realm.objects('State')

    if (!state || !state[0]) {
      realm.write(() => {
        realm.create('State', {
          id: 0,
          sinceId: 1409236251304210399
        })
      })
    }

    run()
    //every 5 minutes
    setInterval(run, 1000 * 60 * 5)
  })
  .catch(e => {
    throw Error(e)
  })

function run() {
  getLatestTweets(state[0].sinceId)
    .then(async tweets => {
      tweets = tweets.filter(tweet => tweet.id > state[0].sinceId)

      for (let tweet of tweets) {
        let originalTweet = await getTweet(tweet.in_reply_to_status_id_str)
        let message = getMostRelevantAnswer(originalTweet.text)
        if (message) {
          let replyTo = tweet.user.screen_name
          let theUserWhoHasToLearn = tweet.in_reply_to_screen_name

          console.log(message, replyTo, theUserWhoHasToLearn)
          // await sendTweet(tweet.id, message, replyTo, theUserWhoHasToLearn)
        } else {
          // TODO define an appropriate message when no fudbusting article has been found
          console.log('No answer found')
        }
      }

      if (tweets.length === 0) {
        console.log('No new mentions')
        return
      }

      realm.write(() => {
        realm.create('State', {
          id: 0,
          sinceId: tweets[0].id
        }, true)
      })
    })
}