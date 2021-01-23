$(function(){

    // if(!window.base.getLocalStorage('token')){
    //     window.location.href = 'login.html';
    // }
    var qr_txt;
    if(window.base.getCookie('username')){
        var id = window.base.getCookie('username');
        // id = '121212312';
        var params={
            url:'reader/detail/'+ id,
            sCallback:function(res){
                if(res){
                    qr_txt = res.icid_num;
                    var str = showCardInfoHtmlStr(res);
                    $('.card-box').append(str);
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
    }


    $("#qr").click(function(){
        var $iosDialog2 = $('#iosDialog2');
        $iosDialog2.fadeIn(200);
        $("#qrcodeimg").empty().qrcode({render:"image",ecLevel:"L",size:250,background:"#fff",fill:"#000",text:qr_txt});
    });
    $("#close_qrcode").click(function(){
        var $iosDialog2 = $('#iosDialog2');
        $iosDialog2.fadeOut(200);
    });

    var hasMore = document.querySelectorAll('.has-more')
	var toggle = document.querySelectorAll('.toggle')

	;[].forEach.call(toggle, function(item, index) {
	    item.addEventListener('click', function () {
	        item.classList.toggle('show')
	        hasMore[index].classList.toggle('show-more')
	        item.textContent = item.textContent == '更多服务' ? '收起' : '更多服务'
	    })
	});

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

    // 读者证字符串拼接
    function showCardInfoHtmlStr(res){
        $('.card-bind').hide();
        $('.card-unlock').show();
        var str = '';
        str += '<p class="card-name">'+ res.reader_name +'</p>' + 
            '<p class="card-number">'+res.icid_num+'</p>' + 
            '<p class="card-status">'+getReaderStatus(res.status)+'</p>';
        return str;
    }

    /*根据读者状态获得标志*/
    function getReaderStatus(status){
        var arr=[{
            cName:'delete',
            txt:'已删除'
        },{
            cName:'normal',
            txt:'使用中'
        },{
            cName:'stop',
            txt:'已停用'
        }];
        return '<span class="'+arr[status].cName+'">'+arr[status].txt+'</span>';
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

    var pageIndex=1,
        moreDataFlag=true,
        page = 2,
        morePage=false;

    /*
        下拉加载数据
     */
    $(window).scroll(
        function() {
            var scrollTop = $(this).scrollTop();//滚动条的垂直偏移
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if(morePage) {
                if (scrollTop + windowHeight == scrollHeight) {
                    showLoding();
                    getBooks(page);
                    page++;
                    hideLoding();
                }
            } else {
                return false;
            }
            
        }
    );

    // 馆藏数据
    getLibraryCount();
    function getLibraryCount(){
        var params={
            url:'book/library/count',
            sCallback:function(res){
                if(res){
                    $('.library_count').html(res.library_count);
                    $('.borrow_count').html(res.borrow_count);
                }
            }
        };
        window.base.getData(params);
    }

    // 最新上传图书
    getBooks(pageIndex);

    /**
     * 最近上传图书
     */
    function getBooks(pageIndex){
    	var params={
    		url:'book/recent',
            data:{page:pageIndex,size:10},
    		sCallback:function(res){
    			var str = getBooksHtmlStr(res);
    			$('.book-list').append(str);
    		}
    	};
    	window.base.getData(params);
    }

    // 字符串拼接
    function getBooksHtmlStr(res){
    	var data = res.data;
    	if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                morePage = true;
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="book.html?id='+ item.id +'" class="weui-media-box weui-media-box_appmsg">' +
                		'<div class="weui-media-box__hd">' + 
                    	'<img class="weui-media-box__thumb" src="'+getBookImgHtmlStr(item)+'" referrerPolicy="no-referrer">' +
                		'</div>' +
                		'<div class="weui-media-box__bd">' + 
                    	'<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                    	'<p class="weui-media-box__desc">' + item.author + '</p>' + 
                    	'<p class="weui-media-box__desc">出版社：<span class="right">' + item.press + '</span></p>' +
                    	'<p class="weui-media-box__desc">出版时间：<span class="right">' + item.publication_data + '</span></p>' + 
                		'</div>' +
            			'</a>';
                }
            } else {
                morePage = false;
                str = '<p class="book-over">已经到底了哦~</p>';
            }
            
            return str;
        }
        return '';
    }

    function getBookImgHtmlStr(res){
        var str = '';
        if(res.picture != ''){
            str = res.picture;
        } else {
            str = "/static/images/no-book-img.gif";
        }
        return str;
    }

    /*
    * 获取数据 分页
    * params:
    * pageIndex - {int} 分页下表  1开始
    */
    function getOrders(pageIndex){
        var params={
            url:'order/paginate',
            data:{page:pageIndex,size:20},
            tokenFlag:true,
            sCallback:function(res) {
                var str = getOrderHtmlStr(res);
                $('#order-table').append(str);
            }
        };
        window.base.getData(params);
    }

    /*拼接html字符串*/
    function getOrderHtmlStr(res){
        var data = res.data;
        if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<tr>' +
                        '<td>' + item.order_no + '</td>' +
                        '<td>' + item.snap_name + '</td>' +
                        '<td>' + item.total_count + '</td>' +
                        '<td>￥' + item.total_price + '</td>' +
                        '<td>' + getOrderStatus(item.status) + '</td>' +
                        '<td>' + item.create_time + '</td>' +
                        '<td data-id="' + item.id + '">' + getBtns(item.status) + '</td>' +
                        '</tr>';
                }
            }
            else{
                ctrlLoadMoreBtn();
                moreDataFlag=false;
            }
            return str;
        }
        return '';
    }

    /*根据订单状态获得标志*/
    function getOrderStatus(status){
        var arr=[{
            cName:'unpay',
            txt:'未付款'
        },{
            cName:'payed',
            txt:'已付款'
        },{
            cName:'done',
            txt:'已发货'
        },{
            cName:'unstock',
            txt:'缺货'
        }];
        return '<span class="order-status-txt '+arr[status-1].cName+'">'+arr[status-1].txt+'</span>';
    }

    /*根据订单状态获得 操作按钮*/
    function getBtns(status){
        var arr=[{
            cName:'done',
            txt:'发货'
        },{
            cName:'unstock',
            txt:'缺货'
        }];
        if(status==2 || status==4){
            var index=0;
            if(status==4){
                index=1;
            }
            return '<span class="order-btn '+arr[index].cName+'">'+arr[index].txt+'</span>';
        }else{
            return '';
        }
    }

    /*控制加载更多按钮的显示*/
    function ctrlLoadMoreBtn(){
        if(moreDataFlag) {
            $('.load-more').hide().next().show();
        }
    }

    /*加载更多*/
    $(document).on('click','.load-more',function(){
        if(moreDataFlag) {
            pageIndex++;
            getOrders(pageIndex);
        }
    });
    /*发货*/
    $(document).on('click','.order-btn.done',function(){
        var $this=$(this),
            $td=$this.closest('td'),
            $tr=$this.closest('tr'),
            id=$td.attr('data-id'),
            $tips=$('.global-tips'),
            $p=$tips.find('p');
        var params={
            url:'order/delivery',
            type:'put',
            data:{id:id},
            tokenFlag:true,
            sCallback:function(res) {
                if(res.code.toString().indexOf('2')==0){
                   $tr.find('.order-status-txt')
                       .removeClass('pay').addClass('done')
                       .text('已发货');
                    $this.remove();
                    $p.text('操作成功');
                }else{
                    $p.text('操作失败');
                }
                $tips.show().delay(1500).hide(0);
            },
            eCallback:function(){
                $p.text('操作失败');
                $tips.show().delay(1500).hide(0);
            }
        };
        window.base.getData(params);
    });

    /*解绑*/
    $(document).on('click','#login-out',function(){
        window.base.deleteLocalStorage('token');
        window.location.href = 'login.html';
    });
});