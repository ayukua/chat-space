$(document).on('turbolinks:load', function() {
    //message情報をコードに追記する処理
    function buildHTML(message){
      if(message.image.url !== null){
        alt_html = `<img class="lower-message__image" src=${message.image} alt="表示できません">`
      }
      else{
        alt_html = ""
      }
      var html = `<div class="message" data-message-id="${message.id}">
                    <div class="upper-message">
                      <div class="upper-message__user-name">${message.name}</div>
                      <div class="upper-message__date">${message.date}</div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message_content">${message.text}</p>
                      ${alt_html}
                    </div>
                  </div>`
    return html;
  }

  //送信ボタン押した時のajax通信
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

    //ajax通信した内容のコードへの追加およびフォーム内のvalue値を空白に
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html)
      $('.form__message').val('')
      $('.form__mask').val('')
      $(`.form__submit`).prop("disabled", false);
    })
    .fail(function(){
      alert('error');
    })
  })

  //自動更新機能の実装
    //特定のWebページに入っている場合のみ５秒インターバル
    if(location.href.match(/\/groups\/\d+\/messages/)){
      console.log(location.href)
      setInterval(updateMessages,5000)
    }

  function updateMessages(){
    //webページ情報を変数urlに取得
    var url = location.href;
    //Webページ上の最新のメッセージIDを取得
    var last_message_id = $(".message:last").data("message-id");
   $.ajax({
      url: url,
      type: "GET",
      data: { key: last_message_id },
      dataType: 'json'
  })

    //Webページ上で非表示のメッセージをmessagesに追加
    .done(function(messages){
      if( messages.length !== 0 ){
        messages.forEach(function(message){
          $(".messages").append(buildHTML(message));
        });
      }
    })
    .fail(function(){
      alert('error');
    })
  }
})

