import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
       
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.comment){
        handleCommentBtnClick(e.target.dataset.comment)
    }
    else if(e.target.dataset.ban){
            handleDeleteBtnClick(e.target.dataset.ban)
    }
        
    
})
 
 
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Blizzard`,
            profilePic: `https://media.licdn.com/dms/image/D4D35AQEGXIq-L22QxQ/profile-framedphoto-shrink_400_400/0/1694641794683?e=1697331600&v=beta&t=xdrfE89XzLNlP8QQZYedL6_q6kbX-XzoZXa6VRC4QuM`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}
function handleCommentBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const commentInput = document.getElementById(`comment-${tweetId}`)
    if(commentInput.value){
        
        targetTweetObj.replies.unshift({
            handle: `@Blizzard`,
            profilePic: `https://media.licdn.com/dms/image/D4D35AQEGXIq-L22QxQ/profile-framedphoto-shrink_400_400/0/1694641794683?e=1697331600&v=beta&t=xdrfE89XzLNlP8QQZYedL6_q6kbX-XzoZXa6VRC4QuM`,
            tweetText: commentInput.value
            })
        
        render()
        commentInput.value = ''
    }
   
}
function handleDeleteBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
        
    })[0]
   let index = tweetsData.findIndex(function(tweet){
     return tweet.uuid === tweetId;
    })
    if (index !== -1){
    const result = confirm("Want to delete the babble?")
    if(result){
    tweetsData.splice(index, 1);
        
    }
        } 
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
         
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-solid fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                  <span class="tweet-detail">
                    <i class="fa-solid fa-ban"
                    data-ban="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
            <div id="reply-input">
                <img src="https://media.licdn.com/dms/image/D4D35AQEGXIq-L22QxQ/profile-framedphoto-shrink_400_400/0/1694641794683?e=1697331600&v=beta&t=xdrfE89XzLNlP8QQZYedL6_q6kbX-XzoZXa6VRC4QuM" id="profile-pic-reply">
                <textarea placeholder="Add your comment here..." 
                class="comment-input" id="comment-${tweet.uuid}"></textarea>
                <button id="comment-btn" data-comment="${tweet.uuid}">Add</button>
            </div>  
    </div>  
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

