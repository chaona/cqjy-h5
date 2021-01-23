$(function(){
    // 用JS获取地址栏参数的方法
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
         if(r!=null) return  decodeURIComponent(r[2]); 
         return null;
    }

    var pageIndex=1,
        moreDataFlag=true,
        page = 2,
        morePage=false;

    getBooks(pageIndex);
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
    
    // getBook();

    function getBooks(pageIndex){
    	var params={
    		url:'book/search/title/'+ GetQueryString('book_name'),
            data:{page:pageIndex,size:10},
    		sCallback:function(res){
                $('.books_count').html(res.total);
    			var descHtmlStr = getBooksHtmlStr(res);
    			$('.book-list').append(descHtmlStr);
    		}
    	};
    	window.base.getData(params);
    }

    /*根据图书状态获得标志*/
    function getBookStatus(status){
        var arr=[{
            cName:'delete',
            txt:'已删除'
        },{
            cName:'in_library',
            txt:'在馆'
        },{
            cName:'circulation',
            txt:'流通'
        },{
            cName:'pull',
            txt:'已下架'
        }];
        return '<span class="right '+arr[status].cName+'">'+arr[status].txt+'</span>';
    }

    function getBooksHtmlStr(res){
    	var data = res.data;
    	if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                morePage = true;
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="book.html?id='+item.id+'" class="weui-media-box weui-media-box_appmsg">' +
                		'<div class="weui-media-box__hd">' + 
                    	'<img class="weui-media-box__thumb" src="'+getBookImgHtmlStr(item)+'" referrerPolicy="no-referrer">' +
                		'</div>' +
                		'<div class="weui-media-box__bd">' + 
                    	'<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                    	'<p class="weui-media-box__desc">' + item.author + '</p>' + 
                    	'<p class="weui-media-box__desc">出版社：<span class="right">' + item.press + '</span></p>' +
                    	'<p class="weui-media-box__desc">出版时间：<span class="right">' + item.publication_data + '</span></p>' + 
                        '<p class="weui-media-box__desc">状态：' + getBookStatus(item.status) + '</p>' + 
                		'</div>' +
            			'</a>';
                }
            } else {
                morePage = false;
                $('.book-over').show().html('已经到底了哦~');
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

});