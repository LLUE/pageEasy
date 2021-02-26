/**
 * pageEasy @20200421 (js原生版)
 * mochyli@163.com
 */
class pageEasy{
    constructor(options){
        let ops = this.config(options)
        this.$options = ops
        this.$event   = ops.event
        this.$data    = ops.data
        // this.render(document.querySelector(ops.el),ops)
        this.observe(ops)
    }

    // 参数初始化
    config(ops){
        let el = document.querySelector(ops.el);
        return {
            el    : ops.el,
            page  : Number(el.getAttribute('page')) || ops.page || 1,
            size  : Number(el.getAttribute('size')) || ops.size || 10,
            total : Number(el.getAttribute('total')) || ops.total || 1,
            event : {
                onClick: function(index){},
            }
        };
    }

    //观察者
    observe(ops){
        if(!ops || typeof ops !== 'object'){
            return
        };
        Object.keys(ops).forEach( key => {
            this.defineReactive(ops,key,ops[key]);
        });
    }
    
    // 数据响应化
    defineReactive(obj, key, val){
        this.observe(val);
        let $this = this;
        Object.defineProperty(obj, key, {
            get(){
                return val;
            },
            set(newVal){
                if(newVal !== val){
                    console.log(`我将 ${key} 的值 ${val} 改为了 ${newVal}`);
                    val = newVal;
                    $this.render(document.querySelector(obj.el),obj);
                }
            }
        });
    }

    //渲染组件
    render(target,ops){
        let $this    = this;
        let pageArr  = this.getPageArr(ops);
        let alls     = Math.ceil(ops.total/ops.size);
        let ul       = document.createElement('ul');
        ul.className = 'pageEasy';

        if(!pageArr){return false};
        if(!target){return};
        target.innerHTML = '';
        
        let ulHtml  = pageArr.reduce(function (all, e) {
            let cla = '';
            let tit = e.c;
            if(e.u == 'page_pre'){
                cla = ops.page == 1 ? 'page_pre page_disable':'page_pre';
                tit = '上一页'
            };
            if(e.u == 'page_jumppre'){
                cla = 'page_jumppre',
                tit = '向前 5 页'
            };
            if(e.c == ops.page){
                cla = 'page_on'
            };
            if(e.u == 'page_jumpnext'){
                cla = 'page_jumpnext',
                tit = '向后 5 页'
            };
            if(e.u == 'page_next'){
                cla = ops.page == alls ? 'page_next page_disable':'page_next'
                tit = '下一页'
            };

            let li = document.createElement('li');
                li.className = `page_item ${cla}`;
                li.title     = tit;
                li.innerHTML = `<a>${e.c}</a>`;

            if(!((e.u == 'page_pre'&& ops.page == 1)||(ops.page == e.c)||(e.u == 'page_next'&& ops.page == alls))){
                li.onclick = function(){
                    $this.setCurPage(e,ops);
                    ops.event.onClick(ops.page);
                }
            };
            all.appendChild(li);
            return all;
        },ul);
        target.appendChild(ulHtml)
    }

    //设置当前页码
    setCurPage(e,ops){
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
                return ops.page = e.c;
        }
    }

    //页码数组化
    getPageArr(ops){
        let arr  = [{u:'page_pre',c:'<'},{u:'item',c:1}]; //{u:'item',c:1}
        let alls = Math.ceil(ops.total/ops.size);
        ops.page = Math.floor(Math.abs(ops.page));
        if(ops.page < 1 || ops.page > alls){
            return
        };
        if(ops.page > 4){
            arr = [{u:'page_pre',c:'<'},{u:'item',c:1},{u:'page_jumppre',c:'<<'}];
        };
        for(let i = 3; i > 0; i--){
            if(ops.page > i){
                arr.push({u:'item',c:ops.page-i+1});
            }
        };
        for(let j = 1; j < 3; j++){
            if(ops.page + j < alls){
                arr.push({u:'item',c:ops.page+j});
            }
        };
        if(alls-ops.page>3){
            arr.push({u:'page_jumpnext',c:'>>'})
        };
        if(ops.page != alls){
            arr.push({u:'item',c:alls});
        };
        arr.push({u:'page_next',c:'>'});

        return arr;
    }

}
