$(function(){

    // 用JS获取地址栏参数的方法
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
         if(r!=null) return  decodeURIComponent(r[2]); 
         return null;
    }

    var tab_name = '';
    tab_name = GetQueryString('name');

    $('.weui-navbar__item').on('click', function () {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

        //内容切换
        $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
        var data_toggle =$(this).attr("href");
        $(data_toggle).addClass("weui_tab_bd_item_active");
    });

    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
        switch(tab_name) {
        case 'tab2':
            $('#will-list').click();
            getWillExpireList(id);
            break;
        case 'tab3':
            $('#done-list').click();
            getExpireList(id);
            break;
        default:
            getBorrowingList(id);
    } 
        
    } else {
        window.location.href = 'card.html';
    }

    var pageIndex=1,
        moreDataFlag=true,
        page = 2,
        morePage=false;

    getList(id, pageIndex);

    // 显示加载状态
    function showLoding(){
        $.showLoading();
    }

    // 隐藏加载状态
    function hideLoding(){
        setTimeout(function() {
          $('.weui_loading_toast').fadeOut(500);
          $('.weui_loading_toast').remove();
          $('.weui_mask_transparent').remove();
        }, 500);
    }

    
    /**
     * 借阅清单
     */
    function getList(id, pageIndex){
        var params={
            url:'borrow/all/list/'+id,
            data:{page:pageIndex,size:5},
            sCallback:function(res){
                var str = getListStr(res);
                $('#my_over_list').append(str);
            }
        };
        window.base.getData(params);
    }

    // 字符串拼接
    function getListStr(res){
        var data = res.data;
        if (data){
            var len = data.length,
                str = '', item, temp = '', do_type = '', do_time = '';
            if(len>0) {
                morePage = true;
                for (var i = 0; i < len; i++) {
                    item = data[i];

                    if(!isEmpty(item.fact_time)){
                        do_type = '还书';
                        do_time = item.fact_time;
                        str += getListHtmlStr(item, do_type, do_time);
                    }
                    do_type = "借书";
                    do_time = item.borrow_time;
                    str += getListHtmlStr(item, do_type, do_time);
                }
            } else {
                morePage = false;
                $('.book-over').show().html('已经到底了哦~');
            }
            
            return str;
        }
        return '';
    }

    function getListHtmlStr(item, do_type, do_time){
        var do_action = 'borrow-action', str = '';
        if(do_type=="还书"){
            do_action = 'return-action'
        }
        str += '<a href="book.html?book_num='+ item.book_id +'" class="weui-media-box weui-media-box_appmsg">' +
            '<div class="weui-media-box__hd">' + 
            '<img class="weui-media-box__thumb" src="/static/images/no-book-img.gif" alt="">' +
            '</div>' +
            '<div class="weui-media-box__bd">' + 
            '<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
            '<p class="weui-media-box__desc">' + item.author + '</p>' + 
            '<p class="weui-media-box__desc">借阅时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.borrow_time) + '</span></p>' +
            '<p class="weui-media-box__desc">应还时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.return_time) + '</span></p>' + 
            '<p class="weui-media-box__desc">操作类型：<span class="right '+do_action+'">' + do_type + '</span></p>' +
            '<p class="weui-media-box__desc">操作时间：<span class="right">' + do_time + '</span></p>' + 
            '</div>' +
            '</a>';
        return str;
    }

    /**
     * 已过期清单
     */
    function getExpireList(id){
        var params={
            url:'borrow/expire/list/'+id,
            sCallback:function(res){
                var str = getExpireListHtmlStr(res);
                $('#my_expire_list').append(str);
            },
            eCallback:function(e){
                if(e.status==404){
                    $('.book-over').show().html('您目前没有已过期的图书')
                }
            }
        };
        window.base.getData(params);
    }

    function getExpireListHtmlStr(res){
        var data = res;
        if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="book.html?book_num='+ item.book_id +'" class="weui-media-box weui-media-box_appmsg">' +
                        '<div class="weui-media-box__hd">' + 
                        '<img class="weui-media-box__thumb" src="/static/images/no-book-img.gif" alt="">' +
                        '</div>' +
                        '<div class="weui-media-box__bd">' + 
                        '<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                        '<p class="weui-media-box__desc">' + item.author + '</p>' + 
                        '<p class="weui-media-box__desc">ISBN：<span class="right">' + item.isbn + '</span></p>' +
                        '<p class="weui-media-box__desc">借阅时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.borrow_time) + '</span></p>' +
                        '<p class="weui-media-box__desc">应还时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.return_time) + '</span></p>' + 
                        '</div>' +
                        '</a>';
                }
            }
            
            return str;
        }
        return '';
    }

    /**
     * 将过期清单
     */
    function getWillExpireList(id){
        var params={
            url:'borrow/soon_expire/list/'+id,
            sCallback:function(res){
                var str = getWillExpireListHtmlStr(res);
                $('#my_will_list').append(str);
            },
            eCallback:function(e){
                if(e.status==404){
                    $('.renew-expire-all').hide();
                    $('.book-over').show().html('您目前没有将过期的图书');
                }
            }
        };
        window.base.getData(params);
    }

    function getWillExpireListHtmlStr(res){
        var data = res;
        if (data){
            var len = data.length,
                str = '', item;
            $('.will_number').html(len);
            if(len>0) {
                $('.renew-expire-all').show();
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="book.html?book_num='+ item.book_id +'" class="weui-media-box weui-media-box_appmsg">' +
                        '<div class="weui-media-box__hd">' + 
                        '<img class="weui-media-box__thumb" src="/static/images/no-book-img.gif" alt="">' +
                        '</div>' +
                        '<div class="weui-media-box__bd">' + 
                        '<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                        '<p class="weui-media-box__desc">' + item.author + '</p>' + 
                        '<p class="weui-media-box__desc">ISBN：<span class="right">' + item.isbn + '</span></p>' +
                        '<p class="weui-media-box__desc">借阅时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.borrow_time) + '</span></p>' +
                        '<p class="weui-media-box__desc">应还时间：<span class="right red-time">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.return_time) + '</span></p>' + 
                        '</div>' +
                        '</a>';
                }
            }
            
            return str;
        }
        return '';
    }

    /**
     * 在借中清单
     */
    function getBorrowingList(id){
        var params={
            url:'borrow/borrowing/list/'+id,
            sCallback:function(res){
                var str = getBorrowingListHtmlStr(res);
                $('#my_borrowing_list').append(str);
            },
            eCallback:function(e){
                if(e.status==404){
                    $('.renew-borrowing-all').hide();
                    $('.book-over').show().html('您目前没有在借中的图书')
                }
            }
        };
        window.base.getData(params);
    }

    function getBorrowingListHtmlStr(res){
        var data = res;
        if (data){
            var len = data.length,
                str = '', item;
            $('.borrow_number').html(len);
            if(len>0) {
                $('.renew-borrowing-all').show();
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="book.html?book_num='+ item.book_id +'" class="weui-media-box weui-media-box_appmsg">' +
                        '<div class="weui-media-box__hd">' + 
                        '<img class="weui-media-box__thumb" src="/static/images/no-book-img.gif" alt="">' +
                        '</div>' +
                        '<div class="weui-media-box__bd">' + 
                        '<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                        '<p class="weui-media-box__desc">' + item.author + '</p>' + 
                        '<p class="weui-media-box__desc">ISBN：<span class="right">' + item.isbn + '</span></p>' +
                        '<p class="weui-media-box__desc">借阅时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.borrow_time) + '</span></p>' +
                        '<p class="weui-media-box__desc">应还时间：<span class="right">' + /\d{4}-\d{1,2}-\d{1,2}/g.exec(item.return_time) + '</span></p>' + 
                        '</div>' +
                        '</a>';
                }
            }
            
            return str;
        }
        return '';
    }
    
    var scrollTrue = false;
    $('#done-list').click(function(){
        scrollTrue = false;
        $('#my_expire_list').html('');
        $('.book-over').hide();
        getExpireList(id);
    });
    $('#will-list').click(function(){
        scrollTrue = false;
        $('#my_will_list').html('');
        $('.book-over').hide();
        getWillExpireList(id);
    });
    $('#doing-list').click(function(){
        scrollTrue = false;
        $('#my_borrowing_list').html('');
        $('.book-over').hide();
        getBorrowingList(id);
    });
    $('#over_list').click(function(){
        scrollTrue = true;
        $('#my_over_list').html('');
        $('.book-over').hide();
        page = 1;
        getList(id, 1);
        
    });

    /*
    下拉加载数据
     */
    $(window).scroll(
        function() {
            if(scrollTrue){
                var scrollTop = $(this).scrollTop();//滚动条的垂直偏移
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                if(morePage) {
                    if (scrollTop + windowHeight == scrollHeight) {
                        showLoding();
                        getList(id, page+1);
                        page++;
                        hideLoding();
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }   
        }
    );


    //判断字符是否为空的方法
    function isEmpty(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }

    // 锚点定位加上偏移量
    $("a").click(function(){
        var index = $("a").index(this);
        $("html,body").animate({scrollTop:$("#elementid" + index).offset()-105},200)
        return false;
    });

    // 在借中 续借
    $('.renew-borrowing-all').click(function(){
        var params={
            url:'borrow/renew/borrowing/'+id,
            type:'put',
            sCallback:function(res){
                $.toast("续借成功");
                setTimeout(function() {
                        window.location.href = 'borrow.html';
                    }, 1500);
            },
            eCallback:function(e) {
                if(e.status == 404){
                    $.toptips('已经续借过一次了哦~');
                }
            }
        };
        window.base.getData(params);
    });

    // 将过期续借
    $('.renew-expire-all').click(function(){
        var params={
            url:'borrow/renew/expire/'+id,
            type:'put',
            sCallback:function(res){
                $.toast("续借成功");
                setTimeout(function() {
                        window.location.href = 'borrow.html?name=tab2';
                    }, 1500);
            },
            eCallback:function(e) {
                if(e.status == 404){
                    $.toptips('已经续借过一次了哦~');
                }
            }
        };
        window.base.getData(params);
    });

});
