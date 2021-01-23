$(function(){
    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
            
        var params={
            url:'reader/detail/'+id,
            sCallback:function(res){
                if(res){
                    $('#reader_name').val(res.reader_name);
                    $('#icid_num').val(res.icid_num);
                    $('#twocard_id').val(res.twocard_id);
                    $('#reader_type_name').val(res.reader_type.reader_type_name);
                    $('#money').val(res.money);
                    $('#create_time').val(res.create_time);
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

    } else {
        $('#warnToast').fadeIn(100);
        
        setTimeout(function() {
            window.location.href = 'card.html';
        }, 3000);
    }
});