$(document).on('turbolinks:load', function() {

  var search_list = $("#user-search-result");
  var user_list = $("#chat-group-users");

  //チャットメンバーの情報をコードに追加する処理
  function appendUserInChatmembers(user) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</a>
                </div>`
    search_list.append(html);
  }

  // インクリメンタルサーチ結果に１人もいないときに引数messageを表示する処理
  function appendNoUser(message) {
    var html = `<li>
                  <div class='listview__element--right-icon'>${ message }</div>
                </li>`
    search_list.append(html);
  }

  // チャットメンバー候補のインクリメンタルサーチ
  $("#user-search-field").on("input", function() {
    var input = $("#user-search-field").val();
    $("#user-search-result").empty();

    if( input.length !== 0 ){
      $.ajax({
        type: 'GET',
        url: '/users',
        data: { keyword: input },
        dataType: 'json'
      })
      .done(function(users) {
         if (users.length !== 0) {
           users.forEach(function(user){
             appendUserInChatmembers(user);
           });
         }
         else {
           appendNoUser("一致するユーザーはいません");
        }
      })
      .fail(function() {
        alert('ユーザーの検索に失敗しました');
      })
    }
  })

  //追加ボタンでチャットメンバーを表示
  $(document).on("click",".chat-group-user__btn--add", function () {
    var id = $(this).data("user-id");
    var name = $(this).data("user-name");
    var html = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-8'>
                  <input name='group[user_ids][]' type='hidden' value=${id}>
                  <p class='chat-group-user__name'>${name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
    $(this).parent().remove();
    user_list.append(html);
  });

  //削除ボタンでチャットメンバーの非表示
  $(document).on("click",".js-remove-btn", function () {
    id = $(this).data("value");
  name = $(this).data("chat-group-user__name");
    $(this).parent().remove();
  });
})
