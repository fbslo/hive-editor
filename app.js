//npm install steem-js-patched
var steem = require('steem-js-patched')

var wif = 'this_is_your_posting_key'
var owner = 'your_steem_username'

//date of HIVE hardfork in ms
var hardfork_date = '1584658800000'

var query = {
  tag: owner,
  limit: '99' //edit last 99 posts
}

//get posts from the user
steem.api.getDiscussionsByBlog(query, function(err, result) {
  for(i=0;i<result.length;i++){
    if(!err){
      let title = result[i].title
      let body = result[i].body
      let permlink = result[i].permlink
      let jsonMetadata = result[i].json_metadata
      let category = result[i].category
      let author = result[i].author
      let date = result[i].created
      updatePost(title, body, permlink, jsonMetadata, category, author, date)
    } else {
      console.log("Error! " + err)
    }
  }
});

function updatePost(title, body, permlink, jsonMetadata, category, author, date){
  var text = '<p><center>[View this post on HIVE!](https://hive.blog/@'+author+'/'+permlink+')</center>'
  var myDate = new Date(date);
  var result_date = myDate.getTime();
  //if post was created after hard fork, it does not exsits on HIVE
  if(result_date > hardfork_date){
    console.log('Post '+title+' was created after the HIVE hard fork!')
  }
  //post can be resteemed, we cannot update resteemed posts
  if(owner != author){
    console.log('Post '+title+' was not created by '+owner+'!')
  } else {
    let body_updated = body + text
    steem.broadcast.comment(wif, '', category, author, permlink, title, body_updated, jsonMetadata, function(err, result) {
      if(err) console.log("Error! " + err)
      if(result){
        console.log("Post " + title + " updated! TX: " + result.id + ", Block: " + result.block_num + "!")
      }
    });
  }
}
