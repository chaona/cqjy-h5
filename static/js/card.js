$(function(){
    if(window.base.getCookie('username')){
        window.location.href = 'index.html';
    }

    $(document).on('click','.submit-action',function(){
        var $userName=$('#account'),
            $pwd=$('#secret');
        if(!$userName.val()) {
            $.toptips("请输入卡号");
            return;
        }
        if(!$pwd.val()) {
            $.toptips('请输入密码');
            return;
        }
        var params={
            url:'reader/card',
            type:'post',
            data:{account:$userName.val(),secret:$pwd.val()},
            sCallback:function(res){
                if(res){
                    $.toast("绑定成功");
                    window.base.setCookie('username',res.id,36500);
                    window.base.setLocalStorage('token',res);
                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 1500);
                    
                }
            },
            eCallback:function(e){
                if(e.status==401){
                    $.toptips('帐号或密码错误');
                }
            }
        };
        window.base.getData(params);
    });
});