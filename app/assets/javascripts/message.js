$(document).on('turbolinks:load', function() {
    //message情報をコードに追記する処理
    function buildHTML(message){
      if(message.image.url !== null){
        alt_html = `<img class="lower-message__image" src='${message.image.url}' alt="表示できません">`
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
                      <p class="lower-message__content">${message.text}</p>
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
      if(typeof data.text === 'undefined') {
        alert('メッセージを入力して下さい');
    }
    else{
      var html = buildHTML(data);
      $('.messages').append(html);
      //自動生成されたフォーム内のリセット
      // $('.form__message').val('');
      // $('.form__mask').val('');
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight });
      $('#new_message')[0].reset();
      $(`.form__submit`).prop("disabled", false);
    }})
    .fail(function(){
      alert('データを送信できませんでした');
    })
  })

  //自動更新機能の実装
  var interval = setInterval(function(){
  //特定のWebページに入っている場合のみ５秒インターバル
  if(location.pathname.match(/\/groups\/\d+\/messages/)){

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
            console.log(message);
            $(".messages").append(buildHTML(message));
          });
        }
      })
      .fail(function(){
        alert('自動更新に失敗しました');
      })
     }
    else {
      clearInterval(interval);
      console.log(location.pathname);
    }

    },5000)

  // function updateMessages(){
  //   //webページ情報を変数urlに取得
  //   var url = location.href;
  //   //Webページ上の最新のメッセージIDを取得
  //   var last_message_id = $(".message:last").data("message-id");
  //  $.ajax({
  //     url: url,
  //     type: "GET",
  //     data: { key: last_message_id },
  //     dataType: 'json'
  // })

  //   //Webページ上で非表示のメッセージをmessagesに追加
  //   .done(function(messages){
  //     if( messages.length !== 0 ){
  //       messages.forEach(function(message){
  //         $(".messages").append(buildHTML(message));
  //       });
  //     }
  //   })
  //   .fail(function(){
  //     alert('自動更新に失敗しました');
  //   })
  // }
})

