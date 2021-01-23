$(function(){
    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
        $(document).on('click','.submit-action',function(){
            var $oldPwd=$('#old_password'),
                $newPwd=$('#new_password'),
                $confirmPwd = $('#confirm_password');
            if(!$oldPwd.val()) {
                $.toptips("请输入旧密码");
                return;
            }
            if(!$newPwd.val()) {
                $.toptips("请输入新密码");
                return;
            }
            if(!$confirmPwd.val()) {
                $.toptips("请输入确认新密码");
                return;
            }
            if($oldPwd.val() == $newPwd.val()){
                $.toptips("新密码不能与旧密码一样");
                return;
            }
            if($newPwd.val() != $confirmPwd.val()) {
                $.toptips("新密码与确认新密码不一致");
                return;
            }
            var params={
                url:'reader/password',
                type:'put',
                data:{id:id,old_password:$oldPwd.val(),new_password:$newPwd.val()},
                sCallback:function(res){
                    if(res){
                        $('#js_toast').fadeIn(100);
                        setTimeout(function () {
                            $('#js_toast').fadeOut(100);
                            window.location.href = 'my.html';
                        }, 2000);
                    }
                },
                eCallback:function(e){
                    if(e.status==401){
                        $.toptips("旧密码错误");
                    }
                    if(e.status==400){
                        $.toptips('密码必须是6位数的正整数');
                    }
                }
            };
            window.base.getData(params);
        });
    } else {
        $('#warnToast').fadeIn(100);
        
        setTimeout(function() {
            window.location.href = 'card.html';
        }, 3000);
    }

    
});