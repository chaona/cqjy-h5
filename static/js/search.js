$(function(){

    $('.submit-action').click(function(){
        var $keyword=$('#searchInput');
        var keywords = trim($keyword[0].value);
        if(!keywords) {
            $.toptips("请输入书名");
            return;
        }
        window.location.href = 'search-result.html?book_name='+$keyword[0].value;
    });

    var params={
        url:'keywords/hot/list',
        sCallback:function(res){
            if(res){
            	console.log(res)
                var hotKeywordsStr = hotKeywordsHtmlStr(res);
                $('#hot_search').append(hotKeywordsStr);
            }
        },
        eCallback:function(e){
            if(e.status==401){
                $.toptips('暂无热门检索词');
            }
        }
    };
    window.base.getData(params);

    function hotKeywordsHtmlStr(res){
    	data = res;
    	if (data){
            var len = data.length,
                str = '', item;
            if(len>0) {
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    str += '<span><a class="color'+(i)+'" href="search-result.html?book_name='+item.name+'">'+item.name+'</a></span>';
                }
            } else {
                $('.book-ovser').show();
            }
            
            return str;
        }
        return '';
    }

    //去左空格;
    function ltrim(s){
        return s.replace(/(^\s*)/g, "");
    }
    //去右空格;
    function rtrim(s){
        return s.replace(/(\s*$)/g, "");
    }
    //去左右空格;
    function trim(s){
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }
});