$("#postTextarea").keyup((e) => {
  var textbox = $(e.target);
  var value = textbox.val().trim();
  // console.log(value);
  var submitbtn = $("#submitPostButton");
  // console.log(submitbtn);
  if (submitbtn.length == 0) return alert("No Submit btn found");

  if (value == "") {
    submitbtn.prop("disabled", true);
    return;
  }
  submitbtn.prop("disabled", false);
});

$("#submitPostButton").click((e) => {
  var button = $(e.target);
  // console.log(button);
  var textbox = $("#postTextarea");
  // console.log(textbox.val());
  var data = {
    content: textbox.val(),
  };
  //   console.log(data);
  $.post("/api/posts", data, (postData, status, xhr) => {
    // alert(postData)
    // console.log(postData);
    var html = createPosthtml(postData);
    $(".postContainer").prepend(html);
    textbox.val("");
    button.prop("disabled", true);
  });
});

// $('.likebutton').click(() => {
//     alert('Button Clicked');
// })

$(document).on("click", ".likeBtn", (e) => {
//   alert("Button Clicked");
//   console.log("It worked");
    var btn = $(e.target);
    var postId = getPostIdFrmElement(btn);
    // console.log('client postId',postId);
    if (postId === undefined) return;
    $.ajax({
        url:`/api/posts/${postId}/like`,
        type:'PUT',
        success: (postData) => {
            // console.log(postData);
            console.log('Server Response---',postData.likes, ' ----postData');
        }
    })
});

function getPostIdFrmElement(ele){
    var isRoot = ele.hasClass('post');
    var rootElement = isRoot == true ? ele : ele.closest('.post');
    var postId = rootElement.data().id;
    if (postId === undefined) return alert('PostId is undefiend');
    return postId; 
}

function createPosthtml(postData) {
  // return postData.content;
  var postedBy = postData.postedBy;
  //   console.log(postData);
  //   console.log(postedBy);
  if (postedBy._id === undefined) {
    return console.log("Used object not populated");
  }
  var profileName = `${postedBy.firstName} ${postedBy.lastName}`;
  // var timestamps = postedBy.createdAt;
  var timestamps = timeDifference(new Date(), new Date(postData.createdAt));
  return `<div class='post' data-id=${postedBy._id}>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='profileName'>
                                ${profileName}
                            </a>
                            <span class='username'>
                                @${postedBy.username}
                            </span>
                            <span class='date'>
                                ${timestamps}
                            </span>
                        </div>
                        <div class='postBody'>
                            <span>
                            ${postData.content}
                            </span>
                        </div>
                        <div class='footer'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="far fa-comment">
                                    </i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class="fas fa-retweet">
                                    </i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='likeBtn'>
                                    <i class="far fa-heart">
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed/1000 < 30) return "Just Now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}
