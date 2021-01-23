$(function(){
    // 用JS获取地址栏参数的方法
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
         if(r!=null) return  decodeURIComponent(r[2]); 
         return null;
    }

    getBook();

    function getBook(){
    	var params={
    		url:'book/detail/'+ GetQueryString('id'),
    		sCallback:function(res){
    			var descHtmlStr = getBookDescHtmlStr(res);
    			$('.book-desc').append(descHtmlStr);
                var infoHtmlStr = getBookInfoHtmlStr(res);
                $('.book-info').append(infoHtmlStr);
                var introductionHtmlStr = getBookIntroductionHtmlStr(res);
                $('.book-introduction').append(introductionHtmlStr);
                var imgHtmlStr = getBookImgHtmlStr(res);
                $('.book-img').append(imgHtmlStr);
    		}
    	};
    	window.base.getData(params);
    }

    function getBookDescHtmlStr(res){
        var str = '';
        str += '<h4>'+res.book_name+'</h4>' +
            '<p>作者：'+res.author+'</p>' + 
            '<p>出版社：'+res.press+'</p>' + 
            '<p>出版时间：'+res.publication_data+'</p>' + 
            '<p>ISBN：'+res.isbsn+'</p>';
        return str;
    }

    function getBookImgHtmlStr(res){
        var str = '';
        if(res.picture != ''){
            str += '<img src="'+ res.picture +'" referrerPolicy="no-referrer">';
        } else {
            str += '<img src="/static/images/no-book-img.gif" >';
        }
        return str;
    }

    function getBookIntroductionHtmlStr(res){
        var str = '暂无介绍';
        if(res.introduction){
            str = res.introduction;
        }
        return str;
    }

    function getBookInfoHtmlStr(res){
        var str = '';
        str += '<p>索书号：<span>'+res.clc_num+'</span></p>' + 
            '<p>条码号：<span>'+res.book_num+'</span></p>' + 
            // '<p>文献所属馆：<span>'++'</span></p>' + 
            // '<p>文献所在馆：<span>'++'</span></p>' + 
            // '<p>所在馆位置：<span>'++'</span></p>' + 
            '<p>文献状态：'+getBookStatus(res.status)+'</p>';
        return str;
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
        return '<span class="order-status-txt '+arr[status].cName+'">'+arr[status].txt+'</span>';
    }
});