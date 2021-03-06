let response = {

  warning(_payload){
    sessionStorage.setItem("warning", "true");
    location.reload()
  },

  new_post(_payload){
    let count = get_count("info")
    select_helper1("info", "new", ++count)
  },

  delete_post(payload){
    let post_id = payload.post_id
    if (!$("#" + post_id).length){
      let count = get_count("info")
      select_helper1("info", "new", --count)
    }
    else{
      let count = get_count("danger")
      select_helper1("danger", "deleted", ++count)
    }
  },

  new_comment(payload){
    let post_id = payload.post_id
    let list = $(".comment-notification-list")
    let post = list.find("#" + post_id)
    if (!post.length){
      let text = "there is a new comment"
      post = $('<li/>')
              .addClass("alert alert-info")
              .attr("role", "alert")
              .attr("count", 1)
              .attr("id", post_id)
              .text(text + " in a post")
              .css('cursor', 'pointer')
              .click( _ => {
                $.get("/api/comment/get?post_id=" + post_id,
                  data => {
                    if (data.error){
                      alert(data.error)
                      return
                    }
                    let comments = data.comments
                    $("#comment_" + post_id).empty()
                    comments.forEach(function (e){
                      let $img = $('<img/>', {
                          alt: "User Image",
                          "class": "img-circle avatar", 
                          src: e.url
                      })
                      let $a = $('<a/>')
                                .addClass("pull-left")
                                .append($img)
                      let $user = $('<h4/>')
                                   .addClass("user")
                                   .text(e.user.name)
                      let $time = $('<h5/>')
                                   .addClass("time")
                                   .text(e.from_now)
                      let $head = $('<div/>')
                                   .addClass("comment-heading")
                                   .append($user)
                                   .append(" ")
                                   .append($time)
                      if (e.self){
                        let $delete = $('<button/>', {
                            "class": "btn btn-default btn-comment-delete btn-xs",
                            time: e.time,
                            id: post_id,
                            text: "delete"
                        })
                        $head.append(" ")
                        $head.append($delete)
                      }
                      else{
                        let $reply = $('<button/>', {
                            "class": "btn btn-default btn-comment-reply btn-xs",
                            email: e.user.email,
                            name: e.user.name,
                            time: e.time,
                            id: post_id,
                            text: "reply"
                        })
                        $head.append(" ")
                        $head.append($reply)
                      }
                      let $text
                      if (jQuery.isEmptyObject(e.refer)){
                        $text = $('<pre/>').text(e.text) 
                      }
                      else{
                        $text = $('<pre/>').text("@" + e.refer.name + ": " + e.text) 
                      }       
                      let $body = $('<div/>')
                                   .addClass("comment-body")
                                   .append($head)
                                   .append($text)
                      $("#comment_" + post_id).append(
                        $('<div/>')
                          .addClass("comment")
                          .append($a)
                          .append($body)
                      )
                    })
                  }, "json")
                $(".panel[id='" + post_id + "']").scrollView()
                post.remove()
              })
      list.append(post)
    }
    else{
      let count = Number.parseInt(post.attr("count")) + 1
      let text = "there are " + count + " new comments"
      post.attr("count", count)
          .text(text + " in a post")
    }
  },

  delete_comment(payload){
    let id = payload.post_id
    let email = payload.email
    let time = payload.time
    let list = $(".comment-notification-list")
    let post = list.find("#" + id)
    let comment = $("button[time='" + time + "'][email='" + email + "'][id='" + id + "']")
    if (post.length && !comment.length){
      let count = Number.parseInt(post.attr("count")) - 1
      if (count == 0){
        post.remove()
      }
      else{
        let text = (count == 1) ? "there is a new comment" : "there are " + count + " new comments"
        post.attr("count", count)
          .text(text + " in a post")
      }
    }
  }

}

function get_count(name){
  return Number.parseInt($(".alert-" + name).attr("count"))
}

function select_helper1(name, type, count){
  if (count == 0){
    $(".alert-" + name).empty().attr("count", count)
    return
  }
  let text = (count == 1) ? "there is a " + type + " post" : "there are " + count + " " + type + " posts"
  $(".alert-" + name).text(text)
    .attr("count", count)
    .css('cursor', 'pointer')
    .click( _ => location.reload() )
}

$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000)
    })
}

export default response