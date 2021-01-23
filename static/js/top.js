$(function(){
    getBooksTop();

    function getBooksTop(){
    	var params={
    		url:'book/borrow/top',
    		sCallback:function(res){
    			var str = getBooksHtmlStr(res);
    			$('.book-list').append(str);
    		}
    	};
    	window.base.getData(params);
    }

    function getBooksHtmlStr(res){
    	var data = res;
    	if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                morePage = true;
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<a href="javascript:" class="weui-media-box weui-media-box_appmsg">' +
                		'<div class="weui-media-box__hd">' + 
                    	'<img class="weui-media-box__thumb" src="'+getBookImgHtmlStr(item)+'" referrerPolicy="no-referrer">' +
                		'</div>' +
                		'<div class="weui-media-box__bd">' + 
                    	'<h4 class="weui-media-box__title">' + item.book_name + '</h4>' +
                    	'<p class="weui-media-box__desc">' + item.author + '</p>' + 
                    	'<p class="weui-media-box__desc">出版社：<span class="right">' + item.press + '</span></p>' +
                    	'<p class="weui-media-box__desc">出版时间：<span class="right">' + item.publication_data + '</span></p>' + 
                        '<p class="weui-media-box__desc">借阅次数：<span class="right">' + item.borrow_total + '</span></p>' + 
                		'</div>' +
                        '<div class="ribbon-zzsc-green">' + 
                        '<div class="ribbon-green top'+ (i+1) +'">'+ (i+1) +'</div>' + 
                        '</div>' + 
            			'</a>';
                }
            } else {
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

});