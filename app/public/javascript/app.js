//

// Click Events

//
$('#addComment').on('click', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
    comment: $('#commentBox').val()
    }
  })
  .done(function(data){
    console.log(data);
    getComment();
    $('#commentBox').val("");
  }
  );
  return false;
});


$(document).on('click', '.comments', function(){
    var thisId = $(this).attr('data-id');
    $.ajax({
      type: "GET",
      url: '/addComments/' + thisId,
    });
    $(this).parents('p').remove();
    getComment();
});




$(document).on('click', '.deleteComment', function(){
  var thisId = $(this).attr('data-id');
  $.ajax({
    type: "GET",
    url: '/deleteComments/' + thisId,
  });
  $(this).parents('p').remove();
  getdeleteComment();
});








// Get read and unread on screen

function getComment(){
  $('#commentBox').empty();
  $.getJSON('/comment', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#comments').prepend('<tr><td>' + data[i].title + '</td>' + '<td>' + data[i].author + '</td><td><button class="markread" data-id="' +data[i]._id+ '">Mark Read</button></td></tr>');
    }
    $('#comments').prepend('<p></p>');
}

function getdeleteComment(){
  $('#read').empty();
  $.getJSON('/read', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#read').prepend('<tr><td>' + data[i].title + '</td>' + '<td>' + data[i].author + '</td><td><button class="markunread" data-id="' +data[i]._id+ '">Mark Unread</button></td></tr>');
    }
    $('#read').prepend('<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>');
  });
}

getComment();
getdeleteComment();
