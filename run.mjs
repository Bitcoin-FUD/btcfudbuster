import path from 'path'
import config from './config.mjs'
import Realm from 'realm'
import { State } from './schemas.mjs'
import Twitter from 'twitter'

const client = new Twitter(config.twitterAPI)
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
        await sendTweet(tweet)
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

function getLatestTweets() {
  return new Promise(resolve => {
    console.log('Get latest mentions')
    client.get('statuses/mentions_timeline.json', {since_id: state[0].sinceId}, function(error, tweets, response) {
      resolve(tweets)
    })
  })
}

/**
 * @description Method to send tweet
 * @param {Object} tweet the tweet to reply to
 * @returns {Promise}
 */
function sendTweet(tweet) {
  return new Promise(resolve => {
    let message = ''
    let replyTo = tweet.user.screen_name
    let theUserWhoHasToLearn = tweet.in_reply_to_screen_name
    console.log('Tweet to', tweet.id)

    message += `I'm still being built, so here is a curated collection for now endthefud.org`

    // twitter requires to tag user in reply to, we also tag the user that is meant to read the fud busting
    if (theUserWhoHasToLearn === replyTo) {
      message += ` @${replyTo}`
    } else {
      message += ` @${theUserWhoHasToLearn} and @${replyTo}`
    }
    client.post('statuses/update', {
      status: message,
      in_reply_to_status_id: tweet.id
    }, (error, tweet, response) => {
      if (error) {
        console.log(error)
      }
      resolve()
    })
  })
}