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
          sinceId: 1364622148971724802
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
      tweets
        .filter(tweet => tweet.id > state[0].sinceId)
        .forEach(tweet => {
          sendTweet(tweet.id_str)
        })

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
    // TODO get latest mentions
    // client.get('search/tweets', {}, function(error, tweets, response) {
    //   resolve(tweets.statuses)
    // })
  })
}

/**
 * @description Method to send tweet
 * @param {Number} id status id
 * @returns {Promise}
 */
function sendTweet(id) {
  return new Promise(resolve => {
    let tweet = ''
    console.log('Tweet to', id)

   
    // TODO get username and right fudbusting links to share
    tweet += ` @${username}`

    client.post('statuses/update', {
      status: tweet,
      in_reply_to_status_id: id
    }, (error, tweet, response) => {
      if (error) {
        console.log(error)
      }
      resolve()
    })
  })
}