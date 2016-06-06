var Twit = require('twit');

var client;
var streams = {};

var handleTweet = function(someTweet){

  var newTweet = {
    user: someTweet&&someTweet.user&&someTweet.user['screen_name'],
    tweet: someTweet['text'].replace(/\n\r/g,''),
    timestamp: someTweet['timestamp_ms']
  }
  
  sails.sockets.blast('tweet',newTweet);

};

module.exports = function tweet(sails) {
  return {
    initialize: function (done) {

    	var twitConfig = {
    		'consumer_key': process&&process.env&&process.env['TWITTER_CONSUMER_KEY'] || sails.config.twitter['TWITTER_CONSUMER_KEY'],
    		'consumer_secret': process&&process.env&&process.env['TWITTER_CONSUMER_SECRET'] || sails.config.twitter['TWITTER_CONSUMER_SECRET'],
    		'access_token': process&&process.env&&process.env['TWITTER_ACCESS_TOKEN'] || sails.config.twitter['TWITTER_ACCESS_TOKEN'],
    		'access_token_secret': process&&process.env&&process.env['TWITTER_ACCESS_TOKEN_SECRET'] || sails.config.twitter['TWITTER_ACCESS_TOKEN_SECRET']
    	};

    	client = new Twit(twitConfig);
      return done();
    },
    routes: {
      before: {
        'POST /subscribe': function (req, res, next) {
          var topics = req.param('topics') || [];

          try {

            // Get a list of all existing topics
            var currentStreams = Object.keys(streams);
            console.log('All streams',currentStreams);

            topics.forEach(function(oneTopic){
             // Add new streams for new topics
              if (!streams[oneTopic]){
                streams[oneTopic] = client.stream('statuses/filter', { track: oneTopic, language: 'en' });
            		streams[oneTopic].on('tweet', handleTweet);
              }
              // Remove existing topics from our list of current streams
              // The currentStreams array will then only contain topics 
              // that need to be removed.
              else {
                currentStreams.splice(currentStreams.indexOf(oneTopic), 1);
              }
            });

            currentStreams.forEach(function(oneTopic){
              console.log('stopping stream for',oneTopic);
              streams[oneTopic].stop();
              delete streams[oneTopic];
            });

            return res.send(200);

          } catch (chronicPain){
            console.log('Something has gone terribly wrong',chronicPain);
            return res.send(500);
          }
        }

      }
    },
    client: client
  }
};


/* Example Tweet Data

{ created_at: 'Sat Jun 04 10:08:46 +0000 2016',
  id: 739036163349024800,
  id_str: '739036163349024769',
  text: 'There is something very odd about workers who want to leave the EU i think.  https://t.co/ciYCrNNeB9',
  source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
  truncated: false,
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: null,
  in_reply_to_user_id_str: null,
  in_reply_to_screen_name: null,
  user: 
   { id: 256658795,
     id_str: '256658795',
     name: 'Sputnik Sven',
     screen_name: 'sputniksteve',
     location: null,
     url: null,
     description: 'Trogressive Praditionalist. Dilettante. Education. Doctor Who. Stuff. Doctoral Researcher. https://sputniksteve.wordpress.com/',
     protected: false,
     verified: false,
     followers_count: 1219,
     friends_count: 2736,
     listed_count: 31,
     favourites_count: 2693,
     statuses_count: 19449,
     created_at: 'Wed Feb 23 20:13:28 +0000 2011',
     utc_offset: -25200,
     time_zone: 'Pacific Time (US & Canada)',
     geo_enabled: true,
     lang: 'en',
     contributors_enabled: false,
     is_translator: false,
     profile_background_color: 'C0DEED',
     profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
     profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
     profile_background_tile: false,
     profile_link_color: '0084B4',
     profile_sidebar_border_color: 'C0DEED',
     profile_sidebar_fill_color: 'DDEEF6',
     profile_text_color: '333333',
     profile_use_background_image: true,
     profile_image_url: 'http://pbs.twimg.com/profile_images/732258713818533889/sicZjmxc_normal.jpg',
     profile_image_url_https: 'https://pbs.twimg.com/profile_images/732258713818533889/sicZjmxc_normal.jpg',
     profile_banner_url: 'https://pbs.twimg.com/profile_banners/256658795/1456784795',
     default_profile: true,
     default_profile_image: false,
     following: null,
     follow_request_sent: null,
     notifications: null },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  quoted_status_id: 739024342743416800,
  quoted_status_id_str: '739024342743416832',
  quoted_status: 
   { created_at: 'Sat Jun 04 09:21:48 +0000 2016',
     id: 739024342743416800,
     id_str: '739024342743416832',
     text: 'Trade unionists &amp; workers voting #brexit - you\'d trust Boris &amp; Gove to protect your rights...? 🤔\n#GreenerIN #EUref https://t.co/DPrSVRH5hp',
     source: '<a href="http://twitter.com/#!/download/ipad" rel="nofollow">Twitter for iPad</a>',
     truncated: false,
     in_reply_to_status_id: null,
     in_reply_to_status_id_str: null,
     in_reply_to_user_id: null,
     in_reply_to_user_id_str: null,
     in_reply_to_screen_name: null,
     user: 
      { id: 237791702,
        id_str: '237791702',
        name: 'CambridgeGreenParty',
        screen_name: 'CambridgeGreens',
        location: 'Cambridge, UK',
        url: 'http://cambridge.greenparty.org.uk',
        description: 'Cambridge Green Party',
        protected: false,
        verified: false,
        followers_count: 1497,
        friends_count: 2149,
        listed_count: 54,
        favourites_count: 291,
        statuses_count: 6790,
        created_at: 'Thu Jan 13 16:57:24 +0000 2011',
        utc_offset: -25200,
        time_zone: 'Pacific Time (US & Canada)',
        geo_enabled: true,
        lang: 'en',
        contributors_enabled: false,
        is_translator: false,
        profile_background_color: '4A913C',
        profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/575959807603019777/xdFpwI7x.jpeg',
        profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/575959807603019777/xdFpwI7x.jpeg',
        profile_background_tile: false,
        profile_link_color: '4A913C',
        profile_sidebar_border_color: 'C0DEED',
        profile_sidebar_fill_color: 'DDEEF6',
        profile_text_color: '333333',
        profile_use_background_image: true,
        profile_image_url: 'http://pbs.twimg.com/profile_images/698526050305904641/TdmuhnVj_normal.png',
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/698526050305904641/TdmuhnVj_normal.png',
        profile_banner_url: 'https://pbs.twimg.com/profile_banners/237791702/1463609221',
        default_profile: false,
        default_profile_image: false,
        following: null,
        follow_request_sent: null,
        notifications: null },
     geo: null,
     coordinates: null,
     place: null,
     contributors: null,
     is_quote_status: false,
     retweet_count: 0,
     favorite_count: 0,
     entities: 
      { hashtags: [Object],
        urls: [],
        user_mentions: [],
        symbols: [],
        media: [Object] },
     extended_entities: { media: [Object] },
     favorited: false,
     retweeted: false,
     possibly_sensitive: false,
     filter_level: 'low',
     lang: 'en' },
  is_quote_status: true,
  retweet_count: 0,
  favorite_count: 0,
  entities: 
   { hashtags: [],
     urls: [ [Object] ],
     user_mentions: [],
     symbols: [] },
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  filter_level: 'low',
  lang: 'en',
  timestamp_ms: '1465034926627' }


*/



