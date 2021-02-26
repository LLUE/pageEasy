/**
 * pageEasy.JQ依赖版
 */
$(function() {
    $.fn.extend({
    	pageEasy: function (ops) {
    		if (typeof (arguments[0]) != typeof ("string")) {
    			return $.fn.pageEasy.methods["init"](this, ops);
    		} else {
    			return $.fn.pageEasy.methods[arguments[0]](this, arguments[1]);
    		}
    	}
    });
    
    $.fn.pageEasy.methods = {
        options: function (target) {
    		var opts = $(target).data("pageEasy").options;
    		return opts;
        },
        init: function(target, ops){
            var $this    = this;
            let attrData = {
                page: Number($(target).attr('page'))||null,
                size: Number($(target).attr('size'))||null,
                total: Number($(target).attr('total'))||null,
            }
            for(let i in attrData){
                !attrData[i] && delete attrData[i]
            }
            Object.assign(attrData,ops)
            var options = $.extend({}, $.fn.pageEasy.defaults, ops);
            (options.total < 1) && (options.total = 1);
            (options.size < 1) && (options.size = 1);
            $(target).data("pageEasy", { options: options });
            
            $this.render(target, options);
        },
        render: function(target, ops){
            $(target).html('');
            let $this = this;
            let pag = Math.ceil(ops.total/ops.size)
            let ul = $this.getPageArr(ops).reduce(function (t, e, i) {
                let cla = '';
                let tit = e.c;
                if(e.u == 'page_pre'){
                    cla = ops.page == 1 ? 'page_pre page_disable':'page_pre';
                    tit = '上一页'
                }
                if(e.u == 'page_jumppre'){
                    cla = 'page_jumppre',
                    tit = '向前 5 页'
                }
                if(e.c == ops.page){
                    cla = 'page_on'
                }
                if(e.u == 'page_jumpnext'){
                    cla = 'page_jumpnext',
                    tit = '向后 5 页'
                }
                if(e.u == 'page_next'){
                    cla = ops.page == pag ? 'page_next page_disable':'page_next'
                    tit = '下一页'
                }
                let li   = $(`<li class="page_item ${cla}" title="${tit}"><a>${e.c}</a></li>`);
                let go = true;
                if(e.u == 'page_pre'&& ops.page == 1) {go = false};
                if(ops.page == e.c) {go = false};
                if(e.u == 'page_next'&& ops.page == pag) {go = false};
                
                if(go){
                    li.on('click',function(){
                        $this.setCurPage(e,ops);
                        $this.render(target,ops);
                        ops.onClick(ops.page,this,target)
                    })
                }
                return t.append(li)
            },$('<ul class="pageEasy">'))
            $(target).append(ul)
        },
        setCurPage: function(e,ops){
            switch (e.u) {
                case 'page_pre':
                    return ops.page = ops.page - 1;
                    break;
                case 'page_jumppre':
                    return ops.page = ops.page - 5;
                    break;
                case 'page_jumpnext':
                    return ops.page = ops.page + 5;
                    break;
                case 'page_next':
                    return ops.page = ops.page + 1;
                    break;
                default :
                    return ops.page = e.c
            }
        },
        getPageArr: function(ops){
            let arr = [{u:'page_pre',c:'<'},{u:'item',c:1}];
            let pag = Math.ceil(ops.total/ops.size)
            ops.page = Math.floor(Math.abs(ops.page))
            if(ops.page<1){
                ops.page = 1
                // console.log('错误提示：当前页数 page < 1')
            }
            if(ops.page > pag){
                ops.page = pag
                // console.log('错误提示：当前页数 page > 总页数 '+pag)
            }
            if(ops.page>4){
                arr = [{u:'page_pre',c:'<'},{u:'item',c:1},{u:'page_jumppre',c:'<<'}];
            }
            for(let i = 3; i > 0; i--){
                if(ops.page > i){
                    arr.push({u:'item',c:ops.page-i+1})
                }
            }
            for(let j = 1; j < 3; j++){
                if(ops.page + j < pag){
                    arr.push({u:'item',c:ops.page+j});
                }
            }
            if(pag-ops.page>3){
                arr.push({u:'page_jumpnext',c:'>>'})
            }
            if(ops.page != pag){
                arr.push({u:'item',c:pag});
            }
            arr.push({u:'page_next',c:'>'})
            // console.log(arr)
            // console.log('当前页：'+ops.page,'总页数：'+pag,)
            return arr
        }
    }
    
    $.fn.pageEasy.defaults = {
		title: 'Title',
		page: 1,
        size: 10,
        total: 1,
        onClick: function(page,el){},
    };
})