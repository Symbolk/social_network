$(function () {
  $('.btn-heart').click(function(){
    $(this).blur();
    var post_id = $(this).attr('id');
    var span_id = $("#" + post_id + ' > .glyphicon').attr('id');
    $.get("/api/thumb?post_id=" + post_id + "&span_id=" + span_id,
      function (data){
        $("#" + post_id).empty();
        if (data.thumb) {
          $("#" + post_id).append("<span id='0' class='glyphicon glyphicon-heart glyphicon-btn'></span>");
        }
        else {
          $("#" + post_id).append("<span id='1' class='glyphicon glyphicon-heart-empty glyphicon-btn'></span>");
        }

        $("#thumb_" + post_id).empty();
        var thumbs = data.thumbs
        if (thumbs.length != 0){
          if (data.has_image){
            $("#thumb_" + post_id).append("<br>");
          }
          $("#thumb_" + post_id).append("<span class='glyphicon glyphicon-heart glyphicon-thumb'></span> ");
          thumbs.forEach(function (e){
            if (e.self){
              $("#thumb_" + post_id).append("<a class='btn btn-default btn-xs' href='/home'>" + e.name + "</a> ");
            }
            else{
              var name = encodeURIComponent(e.name);
              var email = encodeURIComponent(e.email);
              $("#thumb_" + post_id).append("<a class='btn btn-default btn-xs' href=/hub?user[email]=" + email + "&amp;user[name]=" + name + ">" + e.name + "</a> ");
            }
          });
        }

      }, "json");
  });
  $('.btn-comment').click(function(){
    var $panel = $(this).closest('.panel-google-plus');
    var $comment = $panel.find('.panel-google-plus-comment');
    var post_id = $(this).attr('id');
    var text = $comment.find('textarea').val();
    $.get("/api/comment?post_id=" + post_id + "&comment=" + encodeURIComponent(text),
      function (data){
        var comments = data.comments;
        $("#comment_" + post_id).empty();
        comments.forEach(function (e){
          var $img = $('<img/>', {
              alt: "User Image",
              "class": "img-circle avatar", 
              src: e.url
          });
          var $a = $('<a/>')
                    .addClass("pull-left")
                    .append($img);
          var $user = $('<h4/>')
                       .addClass("user")
                       .text(e.user.name);
          var $time = $('<h5/>')
                       .addClass("time")
                       .text(e.time);
          var $head = $('<div/>')
                       .addClass("comment-heading")
                       .append($user)
                       .append($time);
          var $text = $('<p/>').text(e.text);         
          var $body = $('<div/>')
                       .addClass("comment-body")
                       .append($head)
                       .append($text);
          $("#comment_" + post_id).append(
            $('<div/>')
              .addClass("comment")
              .append($a)
              .append($body)
          );
        });
      }, "json");
    $comment.find('button[type="reset"]').click();
  });
  $('.panel-google-plus > .panel-footer > .input-placeholder, .panel-google-plus > .panel-google-plus-comment > .panel-google-plus-textarea > button[type="reset"]').on('click', function(event) {
    var $panel = $(this).closest('.panel-google-plus');
    var $comment = $panel.find('.panel-google-plus-comment');
        
    $comment.find('.btn:first-child').addClass('disabled');
    $comment.find('textarea').val('');
    
    $panel.toggleClass('panel-google-plus-show-comment');
    
    if ($panel.hasClass('panel-google-plus-show-comment')) {
      $comment.find('textarea').focus();
    }
  });
  $('.panel-google-plus-comment > .panel-google-plus-textarea > textarea').on('keyup', function(event) {
    var $comment = $(this).closest('.panel-google-plus-comment');
    
    $comment.find('button[type="submit"]').addClass('disabled');
    if ($(this).val().length >= 1) {
      $comment.find('button[type="submit"]').removeClass('disabled');
    }
  });

});