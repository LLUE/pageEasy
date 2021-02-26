$(function(){
    var time = new Date();
    var day = ("0" + time.getDate()).slice(-2);
    var month = ("0" + (time.getMonth() + 1)).slice(-2);
    var hours = ("0" + time.getHours()).slice(-2);
    var minut = ("0" + time.getMinutes()).slice(-2);
    var nowTime = time.getFullYear() + "-" + (month) + "-" + (day)+'T'+hours+':'+minut;
    var tadayBegin = time.getFullYear() + "-" + (month) + "-" + (day)+'T00:00';
    var tadayEnd   = time.getFullYear() + "-" + (month) + "-" + (day)+'T23:59';

    // 时间初始化
    $('#startTime').val(tadayBegin);
    $('#endTime').val(tadayEnd);

    // 时间格式化
    function dateToStr(date, formatStr) {
        let str = null;
        if(date){
            formatStr = formatStr || 'yyyy-MM-dd HH:mm:ss';
            let f = function (m) {
                return m < 10 ? `0${m}` : m
            }
            str = formatStr.replace('yyyy', new Date(date).getFullYear())
            str = str.replace('MM', f(new Date(date).getMonth() + 1))
            str = str.replace('dd', f(new Date(date).getDate()))
            str = str.replace('HH', f(new Date(date).getHours()))
            str = str.replace('mm', f(new Date(date).getMinutes()))
            str = str.replace('ss', f(new Date(date).getSeconds()))
        }
        return str
    };

    //默认查询
    findData()

    //查询按钮
    $('.sbtn').on('click',function(){ 
        $("#pageCur").val(1)
        findData();
    });
    
    //跳转按钮
    $('.pageBtn').on('click',function(){ 
        findData();
    });

    //下一页按钮
    $('.pagenext').on('click',function(){ 
        let curpage = Number($("#pageCur").val());
        curpage++;
        $("#pageCur").val(curpage)
        findData();
    });
    //上一页按钮
    $('.pagepres').on('click',function(){ 
        let curpage = Number($("#pageCur").val());
        curpage--;
        if(curpage < 1){
            curpage = 1
        }
        $("#pageCur").val(curpage)
        findData();
    });

    function findData(){
        // 发起请求
        let apiUrl = `./js/test.json`
        let datas = {
            page      : Number($("#pageCur").val())||1,
            pageSize  : Number($("#size").val())||10,
            identity  : $('#identity').val(),
            network   : $('#network').val(),
            startTime : dateToStr($('#startTime').val()),
            endTime   : dateToStr($('#endTime').val()),
        };
        for(let i in datas){
            !datas[i] && delete datas[i]
        }
        $.ajax({ 
            type: "POST",
            url: apiUrl,
            data: JSON.stringify(datas),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function(res){
                if(res.code == 1){
                    let r = res.data;
                    let content = res.data.reduce(function (t, e, i) {
                        let tr = `<tr>
                            <td>${i+1}</td>
                            <td>${e.identity}</td>
                            <td>${e.network}</td>
                            <td>${e.startTime}</td>
                            <td>${e.params}</td>
                            <td>${e.endTime}</td>
                            <td>${e.content}</td>
                        </tr>`
                        return t + tr
                    },'')
                    $('#tab>tbody').html(content);

                    //分页插件 pageEasy.JQ
                    $("#pageination").pageEasy({
                        title: 'title',
                        page: datas.page,
                        size: datas.pageSize,
                        total: res.total,
                        onClick: function(page,el){
                            $("#pageCur").val(page)
                            findData();
                        },
                    });

                    //分页插件 pageEasy
                    page.$options.page = datas.page
                    page.$options.size = datas.pageSize
                    page.$options.total = res.total
                }else{
                    alert('请求返回 code = ' + res.code)
                }
            },
            error: function(err){
                $('#result').html('请求失败');
            }
        })

    }

    
    //分页插件 pageEasy.JQ
    $("#pageination").pageEasy({
        title: 'title',
        page: Number($("#pageCur").val())||1,
        size: Number($("#size").val())||10,
        total: 1,
        onClick: function(index,el){
            $("#pageCur").val(index)
            findData();
        },
    });

    //分页插件 pageEasy 
    var page = new pageEasy({
        el: '#pageinations',
        total: 1,
    });
    page.$event.onClick = function(index){
      console.log('page',index)
        $("#pageCur").val(index)
        findData();
    }

    //表格插件 tableEasy 
    var table = new tableEasy({
        el: '#app',
        data: {
            test: '我是test',
            columns: [],
            data: [],
        }
    })
    
})