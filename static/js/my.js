$(function(){
    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
        // id = '121212312';
        var params={
            url:'reader/detail/'+ id,
            sCallback:function(res){
                if(res){
                    $('.integral').html(res.integral);
                    $('.borrow_book_total').html(res.borrow_book_total);
                    $('.title').html(res.reader_type.reader_type_name+'：'+res.reader_name);
                    $('.borrow_book_num').html(res.reader_type.borrow_book_num);
                    $('.borrow_day').html(res.reader_type.borrow_day);
                    $('.renew_day').html(res.reader_type.renew_day);
                    var src = 'static/images/my@teacher-avatar.jpg';
                    if(res.reader_type_id == 1) {
                        console.log(111);
                        src = 'static/images/my@student-avatar.jpg';
                    }
                    $('.logo-img').attr('src', src);
                }
            },
            eCallback:function(e){
                if(e.status==401){
                    $.toptips('读者账号不存在');
                }
            }
        };
        window.base.getData(params);

        var params={
            url:'borrow/count/list/'+ id,
            sCallback:function(res){
                if(res){
                    if(res.borrowing_count) $('#borrowing_number').show().html(res.borrowing_count);
                    if(res.will_count) $('#will_number').show().html(res.will_count);
                    if(res.expire_count) $('#expire_number').show().html(res.expire_count);
                }
            },
            eCallback:function(e){
                if(e.status==401){
                    $.toptips('读者账号不存在');
                }
            }
        };
        window.base.getData(params);
    } else {
        window.location.href = 'card.html';
    }

    // 解绑
    $(window).on("click", "#unlock-action", function() {
        $.confirm("您确定要解绑吗?", "提示", function() {
            $.toast("解绑成功!");
            $('.card-bind').show();
            $('.card-unlock').hide();
            // 清除cookie
            window.base.setCookie('username', '', -1);
            // 删除 token
            window.base.deleteLocalStorage('token');
            setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 1500);
        }, function() {
            //取消操作
            $('.weui_mask').remove();
            $('.weui_dialog').remove();
        });
    });

});