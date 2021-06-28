import path from 'path'
import Realm from 'realm'
import { State } from './schemas.mjs'
import { getLatestTweets } from './tweetUtils'

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
  getLatestTweets()
    .then(async tweets => {
      tweets = tweets.filter(tweet => tweet.id > state[0].sinceId)

      for (let tweet in tweets) {
        let message = `I'm still being built, so here is a curated collection for now endthefud.org`
        let replyTo = tweet.user.screen_name
        let theUserWhoHasToLearn = tweet.in_reply_to_screen_name

        await sendTweet(tweet.id, message, replyTo, theUserWhoHasToLearn)
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