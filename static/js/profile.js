$(function(){
    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
            
        var params={
            url:'reader/detail/'+id,
            sCallback:function(res){
                if(res){
                    $('#cell_phone').val(res.cell_phone);
                    $('#address').val(res.address);
                }
            },
            eCallback:function(e){
                if(e.status==401){
                    $.toptips("读者账号不存在");
                }
            }
        };
        window.base.getData(params);

        $(document).on('click','.submit-action',function(){
            var $phone=$('#cell_phone'),
                $address=$('#address');
            if(!$phone.val()) {
                $.toptips("请输入联系电话");
                return;
            }
            if(!$address.val()) {
                $.toptips("请输入住址");
                return;
            }

            if(!isPhoneNumber($phone.val())){
                $.toptips("手机号码格式不正确");
                return;
            }
            
            var params={
                url:'reader/profile',
                type:'put',
                data:{id:id,cell_phone:$phone.val(),address:$address.val()},
                sCallback:function(res){
                    if(res){
                        $('#js_toast').fadeIn(100);
                        setTimeout(function () {
                            $('#js_toast').fadeOut(100);
                            window.location.href = 'my-profile.html';
                        }, 2000);
                    }
                },
                eCallback:function(e){
                    if(e.status==401){
                        $.toptips("读者账号不存在");
                    }
                    if(e.status==400){
                        $.toptips('手机号码格式不正确');
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

    // 手机号校验
    function isPhoneNumber(phoneNum) {
        var reg = /^1[0-9]{10}$/;
        return reg.test(phoneNum);
    }
    
});