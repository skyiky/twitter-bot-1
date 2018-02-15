var twit = require('twit');
var config = require('./config.js');
var T = new twit(config);
var followerMin = 10000;
var params = {
    q: '',
    result_type: 'recent',
    lang: 'en'
}
//grab current trending topics (e.g. #trend)
//find users with tweets mentioning trending topics with > 10k followers
// 1. follow said user
// 2. retweet said users tweet
// 3. reply to said user tweet with message
function getTrending() {
    T.get('trends/place', {
        id: 1
    }, function(err, response) {
        if (!err) {
            response[0]["trends"].forEach( function(i) {
                getTweets(i["name"]);
            });
        } else {
            console.log("trending GET fail");
            console.log(err);
        }
    });
}

function getTweets(trendingStr) {
    T.get('search/tweets', {
        q: trendingStr,
        result_type: 'recent',
        lang: 'en'
    }, function(err, response) {
        if (!err) {
            var retweetId = '';
            response.statuses.forEach( function(i) {
                retweetId = i["id_str"];
                userId = i["user"]["id_str"];
                username = i["user"]["screen_name"];
                retweet(retweetId);
                follow(userId);
                reply(retweetId, username);
            });
        } else {
            console.log("tweet GET fail");
            console.log(err);
        }
    });
}

function retweet(retweetId) {
    T.post('statuses/retweet/:id', {
        id: retweetId
    }, function(err, response) {
        if (err) {
            console.log('retweet POST fail');
            console.log(err);
        }
    });
}

function follow(userId) {
    T.post('friendships/create', {
        user_id: userId,
        follow: true
    }, function(err, response) {
        if (err) {
            console.log('follow POST fail');
            console.log(err);
        }
    });
}


function reply(retweetId, username) {
    var message = '';
    var reply = '@' + username + ' ' + message;
    T.post('statuses/update', {
        status: reply,
        in_reply_to_status_id: retweetId
    }, function(err, response) {
        if (err) {
            console.log('retweet POST fail');
            console.log(err);
        }
    });
}


getTrending();
