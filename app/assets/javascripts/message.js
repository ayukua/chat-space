$(function(){
    function buildHTML(message){
      if(message.image.url !== null){
        alt_html = `<img class="lower-message__image" src=${message.image} alt="表示できません">`
      }
      else{
        alt_html = ""
      }
      var html = `<div class="message">
                    <div class="upper-message">
                      <div class="upper-message__user-name">${message.user_name}</div>
                      <div class="upper-message__date">${message.date}</div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message_content">${message.text}</p>
                      ${alt_html}
                    </div>
                  </div>`
    return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })

    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html)
      $('.form__message').val('')
      $('.form__mask').val('')
    })
    .fail(function(){
      alert('error');
    })
  })
})
