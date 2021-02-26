/**
 * pageEasy @20200421 (js原生版)
 * mochyli@163.com
 */
class tableEasy{
    constructor(options){
        let ops = this.config(options);
        console.log(ops);
        this.getNodes(ops);
        this.$options = ops;
        this.$event   = ops.event;
        this.$data    = ops.data;
        this.observe(ops);
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
                }
            }
        });
    }

    //分离节点
    getNodes(ops){
        let el = document.querySelector(ops.el);
        console.log(el);
    }


}
