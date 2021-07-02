import config from './config.mjs'
import Twitter from 'twitter'

const client = new Twitter(config.twitterAPI)

export const getTweet = id => {
  return new Promise(resolve => {
    console.log(new Date(), 'Get tweet', id)
    client.get('statuses/show.json', {
      id: id
    }, (error, tweet, response) => {
      // TODO handle error cases
      resolve(tweet)
    })
  })
}

export const getLatestTweets = since_id => {
  return new Promise(resolve => {
    console.log(new Date(), `Get latest mentions since ${since_id}`)
    client.get('statuses/mentions_timeline.json', {
      since_id
    }, (error, tweets, response) => {
      // TODO handle error cases
      if (tweets?.length > 0) {
        tweets = tweets
          .filter(tweet => tweet.id_str > since_id) // failsafe
          .filter(tweet => tweet.user.screen_name !== 'btcfudbuster') // prevent answering on own tweets
          .filter(tweet => /@btcfudbuster/.test(tweet.text) && /(help|debunk|answer)/.test(tweet.text)) // trigger word
          // .filter(tweet => {
          // this does not work quite as expected, see this message that shouldn't have been posted becaus ethe bot was actually not tagged
          // https://twitter.com/btcfudbuster/status/1410278932562186241
          //   // twitter API always auto populates @btcfudbuster even for simple replies
          //   // if the bot is mentioned more than once, we can safely assume that the user wanted to follow up on sth.
          //   if (tweet.text.match(/@btcfudbuster/g)?.length > 1) {
          //     return true
          //   }

          //   // else check if tweet is not from bot and in direct reply to btcfudbuster but mentions it
          //   return tweet.in_reply_to_screen_name !== 'btcfudbuster'
          //     && tweet.user.screen_name !== 'btcfudbuster'
          //     && /@btcfudbuster/.test(tweet.text)
          // })
      }
      resolve(tweets || [])
    })
  })
}

/**
 * @description Method to send tweet
 * @param {Object} tweet the tweet to reply to
 * @returns {Promise}
 */
export const sendTweet = (replyTo, message, user1, user2) => {
  return new Promise(resolve => {
    console.log(new Date(), 'Reply to', replyTo, `message: ${message}`)

    // twitter requires to tag user in reply to, we also tag the user that is meant to read the fud busting
    if (user2 === user1 || !user2) {
      message += ` @${user1}`
    } else {
      message += ` @${user2} and @${user1}`
    }
    client.post('statuses/update', {
      status: message,
      in_reply_to_status_id: replyTo
    }, (error, tweet, response) => {
      if (error) {
        console.log(new Date(), error)
      }
      resolve()
    })
  })
}