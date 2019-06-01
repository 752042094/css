/*
基于api.js
km_sis(key) //获取系统参数
km_open_win(winname, needlogin, reload, pageparam) //打开win窗口 默认：needlogin=true，reload=false，未登录会强制跳转登录页
km_close_win(winname) //关闭win
km_closewin_bai(winname) //关闭页面并切换状态栏为白字
km_closewin_hei(winname) //关闭页面并切换状态栏为黑字
km_open_frm(frmname, bounces, pageParam) //打开frm 默认：bounces=true
km_open_web(url, title, needlogin) //打开APP内置浏览器
km_toast(msg, location, duration) //默认提示弹窗
km_yanshi(fun, delay)  //安卓苹果延时不一致处理调用
km_fasong_tou(tokenurl, headers, uname) //发送数据的头部 headers=附加header uname未登录附加用户名
km_fasong_data(jsondata)  //向服务器发送数据前 预处理
km_jieshou(jsondata)  //接收服务器数据后 预处理
km_islogin_app() // 判断是否登录 只进行APP本地数据验证，返回结果。
km_islogin_fwq() // 判断是否登录 验证本地 并 验证服务器，失败APP退出登录 无返回值
km_logout_app(towin)//本地登出账号(通常服务器验证登录失效返回-2调用)//towin=root退出后返回首页(默认)=login返回登录页
km_logout_fwq() //本地登出账号 并通知服务器登出
km_clearstorage() //清理本地用户Storage数据 全清会造成应用错误 若需自动登录 不清理用户名密码。。？
km_fasong_ing(msg,transparent)  //开启数据通讯中蒙版 防止重复提交
km_fasong_end()  //数据通讯结束关闭蒙版
km_deviceId() //生成设备唯一ID
km_shebeixinxi(str) //设备信息
km_apiready(type, mokuai, yy) //apiready后通用配置//type=win/frm默认win，//mokuai=模块 不同模块状态栏配置不同//yy=1/0默认true 语言赋值vue语言监听更新vue
km_userinfo(userinfo) //修改缓存用户信息并广播（如果本页用了km_apiready()，自动有监听修改vuedata
km_setting(setting) //修改缓存系统参数并广播（如果本页用了km_apiready()，自动有监听修改vuedata
km_yuyan()  //修改语言并广播 弹窗
km_yuyan_data(yy) //获取语言数据 yy=cn/en/tai
km_json_he(obt1, obt2) //合并json
km_getJsonLength(jsonData)  //获取二维json长度
km_xiala()  //下拉刷新
km_close_to_root()  //关闭到root
km_ajax_userinfo()  //刷新用户信息
km_longpress(el, fn_longpress, fn_click, longpressTime, fn_move) //长按+单击+移动 合一方法
km_showAllStorage() //查看所有LocalStorage
km_showSt(st) //查看所有LocalStorage 辅助
km_log(data) //console.log 快捷方法
*/

//获取系统参数
function km_sis(key) {
    // sis_url_ome
    // sis_url_img
    // widgetid
    // appkey
    return api.loadSecureValue({
        sync: true,
        key: key
    });
}
//打开一个win窗口 并判断是否 需登录 已登录
function km_open_win(winname, needlogin, reload, pageParam) {
    if (typeof(needlogin) == "undefined") { //是否需要登录
        needlogin = true;
    }
    if (typeof(reload) == "undefined") { //是否重新加载
        reload = false;
    }
    pageParam = pageParam || {};
    if (needlogin && !km_islogin_app()) { //如果此win需要登录 但还未登录
        km_open_win('public/login_win', false); //打开登录页
    } else {
        var delay = 0;
        // if (api.systemType != 'ios') {
        //     delay = 300;
        // }
        // if (winname.indexOf("faxian/kuang") != -1) {
        //     bgColor = '#4a525e';
        // } else {
        //     bgColor = 'rgba(0,0,0,0.0)';
        // }
        api.openWin({
            name: '' + winname + '',
            url: 'widget://html/' + winname + '.html',
            delay: delay,
            reload: reload,
            pageParam: pageParam,
            // bgColor: bgColor,
            slidBackEnabled: true, //是否支持滑动返回。iOS7.0+
            vScrollBarEnabled: false, //是否显示垂直滚动条
            hScrollBarEnabled: false, //是否显示水平滚动条
            hideHomeIndicator: true //适配iOS X底部横杠 不触摸时隐藏
        });
    }
}
//关闭win
function km_close_win(winname) {
    winname = winname || "";
    api.closeWin({
        name: winname,
        animation: {
            type: "push", //动画类型（详见动画类型常量）
            subType: "from_left", //动画子类型（详见动画子类型常量）
            duration: 300 //动画过渡时间，默认300毫秒
        }
    });
}
//关闭页面并切换状态栏为白字
function km_closewin_bai(winname) {
    api.setStatusBarStyle({
        style: 'light' //字体颜色 dark/light
    });
    winname = winname || '';
    api.closeWin({
        name: winname
    });
}
//关闭页面并切换状态栏为黑字
function km_closewin_hei(winname) {
    api.setStatusBarStyle({
        style: 'dark' //字体颜色 dark/light
    });
    winname = winname || '';
    api.closeWin({
        name: winname
    });
}
//打开frm
function km_open_frm(frmname, bounces, pageParam, allowEdit) {
    if (typeof(bounces) == "undefined") { //页面是否弹动
        bounces = true;
    }
    if (typeof(allowEdit) == "undefined") { //是否允许长按页面时弹出选择菜单
        allowEdit = false;
    }
    pageParam = pageParam || {};
    api.openFrame({
        name: '' + frmname + '',
        url: 'widget://html/' + frmname + '.html',
        rect: {
            x: 0,
            y: $api.offset($api.dom('header')).h, //$api.dom('header').offsetHeight
            w: api.winWidth,
            h: 'auto'
        },
        pageParam: pageParam, //页面参数，在新页面通过 api.pageParam 获取
        bounces: bounces, //页面是否弹动
        allowEdit: allowEdit, //是否允许长按页面时弹出选择菜单
        vScrollBarEnabled: false, //是否显示垂直滚动条
        hScrollBarEnabled: false, //是否显示水平滚动条
        overScrollMode: 'scrolls', //设置页面滚动到头部或尾部时，显示回弹阴影效果的模式，仅Android有效。
    });
}
//打开APP内置浏览器
function km_open_web(url, title, needlogin) {
    if (typeof(needlogin) == "undefined") { //是否需要登录 默认不需要
        needlogin = false;
    }
    if (needlogin && !km_islogin_app()) { //如果此URL需要登录 但还未登录
        km_open_win('public/login_win', false); //打开登录页
    } else {
        api.openWin({
            name: 'public/web_win',
            url: 'widget://html/public/web_win.html',
            delay: 0,
            reload: false,
            pageParam: {
                url: url,
                title: title
            },
            slidBackEnabled: true, //是否支持滑动返回。iOS7.0+
            vScrollBarEnabled: true, //是否显示垂直滚动条
            hScrollBarEnabled: true, //是否显示水平滚动条
            hideHomeIndicator: true //适配iOS X底部横杠 不触摸时隐藏
        });
    }
}
//默认提示弹窗
function km_toast(msg, location, duration) {
    location = location || 'middle';
    duration = duration || '2000';
    api.toast({
        msg: msg,
        duration: duration,
        location: location
    });
}
//安卓苹果延时不一致处理调用
function km_yanshi(fun, delay) {
    delay = delay || '300';
    if (api.systemType != 'ios') {
        setTimeout(fun, delay);
    } else {
        fun();
    }
}
//发送数据的头部 headers=附加header
function km_fasong_tou(tokenurl, headers, uname) {
    headers = headers || {};
    uname = uname || '';
    headers.Sbid = km_deviceId(); //设备ID
    headers.Widgetid = km_sis('widgetid'); //widgetid
    headers.Yuyan = $api.getStorage('yuyan') ? $api.getStorage('yuyan').yuyan : 'cn'; //当前语言.。。？

    if (km_islogin_app()) { //已登录的头部
        headers.Ajaxtoken = ($api.getStorage('uname') + '/' + tokenurl).toLowerCase();
        headers.Sessionid = $api.getStorage('sessionid'); //sessionid 无会自动过滤
        headers.Pwd = $api.getStorage('pwd'); //加密的密码 无会自动过滤
        headers.Uname = $api.getStorage('uname'); //用户名
    } else if (uname) { //未登录有用户名的头部
        headers.Ajaxtoken = (uname + '/' + tokenurl).toLowerCase();
        headers.Uname = uname; //用户名
    } else { //未登录也没有户名的头部
        headers.Ajaxtoken = (headers.Sbid + '/' + tokenurl).toLowerCase();
        headers.Uname = headers.Sbid; //用户名
    }
    return headers;
}
//向服务器发送数据前 预处理
function km_fasong_data(jsondata) {
    return jsondata;
}
//接收服务器数据后 预处理
function km_jieshou(jsondata) {
    //如果apizt返回-2非法操作/接口验证失败(APP处理强制登出)
    if (jsondata.apizt == '-2') {
        km_toast(jsondata.msg);
        if (km_islogin_app()) {
            km_logout_app('public/login_win');
        }
    }
    return jsondata;
}
// 判断是否登录 只进行APP本地数据验证，返回结果。
function km_islogin_app() {
    if ($api.getStorage('uname') && $api.getStorage('pwd') && $api.getStorage('userinfo') && $api.getStorage('sessionid')) {
        return true;
    } else {
        km_clearstorage(); //清理数据
        return false;
    }
}
// 判断是否登录 验证本地 并 验证服务器，失败APP退出登录 无返回值
function km_islogin_fwq() {
    if ($api.getStorage('uname') && $api.getStorage('pwd') && $api.getStorage('userinfo') && $api.getStorage('sessionid')) {
        api.ajax({
            url: km_sis('sis_url_ome') + '/api/Publics/islogin',
            method: 'post',
            headers: km_fasong_tou('api/Publics/islogin'),
            data: {
                values: km_fasong_data({
                    uname: $api.getStorage('uname'),
                    pwd: $api.getStorage('pwd'),
                })
            }
        }, function(ret, err) {
            // ret.apizt //=1成功
            // ret.msg;
            // ret.thas; //apizt=1时 已登陆时间（秒）
            // ret.tdie; //apizt=1时 登陆有效时间剩余（秒）
            if (ret.apizt != 1) {
                api.alert({
                    title: vuedata.yy['提示'] || '提示',
                    msg: ret.msg,
                }, function(ret, err) {
                    km_logout_app('public/login_win'); //本地登出
                });
            }
        });
    } else {
        km_clearstorage(); //清理数据
    }
}
//本地登出账号(通常服务器验证登录失效返回-2调用)
//towin=root退出后返回首页(默认)=login返回登录页
function km_logout_app(towin) {
    towin = towin || 'root';
    //清理本地缓存
    km_clearstorage();
    //关闭页面
    if (towin == 'root') {
        api.execScript({ //先让root切到发现页
            name: 'root',
            script: "randomSwitchBtn($api.byId('faxian'))"
        });
        setTimeout(function() {
            km_close_to_root();
        }, 500);
    } else {
        setTimeout(function() {
            km_open_win(towin, false); //打开登录页
        }, 500);
    }
    //下线融云币聊
    rong = api.require('rongCloud2');
    // rong.init();
    rong.logout(function(ret, err) {
        if (ret.status == 'success') {
            // console.log('币聊登出成功');
        } else if (ret.status == 'error') {
            console.log('币聊登出失败：' + err.code);
        }
    });
}
//本地登出账号 并通知服务器登出 标记服务器币聊为离线（用户手动退出调用）
function km_logout_fwq() {
    km_fasong_ing(); //开启数据通讯中蒙版 防止重复提交
    api.ajax({
        url: km_sis('sis_url_ome') + '/api/Publics/logout',
        method: 'post',
        headers: km_fasong_tou('api/Publics/logout'),
        data: {
            values: km_fasong_data({
                uname: $api.getStorage('uname')
            })
        }
    }, function(ret, err) {
        km_fasong_end(); //数据通讯结束关闭蒙版
        if (ret) {
            //ret = km_jieshou(ret);
            km_toast(ret.msg);
            if (ret.apizt == 1) {
                km_logout_app('root'); //本地登出
            }
        } else {
            // if (err.body) {
            //     console.log(err.body)
            // } else {
            //     console.log($api.jsonToStr(err));
            // }
            km_toast('网络错误');
        }
    });
}
//清理本地用户Storage数据 全清会造成应用错误
//若需自动登录 不清理用户名密码。。？
function km_clearstorage() {
    if (!$api.getStorage('autologin')) {
        $api.rmStorage('pwdtrue'); //登录不选保存 自动清除 防止换号时
    }
    $api.rmStorage('pwd');
    $api.rmStorage('userinfo');
    $api.rmStorage('setting');
    $api.rmStorage('sessionid');
    $api.rmStorage('biliao'); //数据库biliao表丰富后的信息
    $api.rmStorage('biliao_active_id'); //当前打开的会话id
    $api.rmStorage('wdxx'); //未读消息总管
    /*以下项 登录后如果uid变化时清除*/
    // $api.rmStorage('biliao_xx');  //币聊消息列表
    // $api.rmStorage('biliao_frs'); //币聊好友列表
    // $api.rmStorage('biliao_sumweidu');  //币聊未读消息总数
    // $api.rmStorage('biliao_name_img');  //币聊其他用户的显示名字头像
    /*以下项 不处理*/
    // $api.rmStorage('uname');
    // $api.rmStorage('yuyan'); //语言配置
    // $api.rmStorage('autologin'); //是否记住密码
}
//开启数据通讯中蒙版 防止重复提交
function km_fasong_ing(msg, transparent) {
    msg = msg || "";
    transparent = transparent || false;
    bgColor = transparent ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)';
    api.openFrame({
        name: 'fasonging_frm',
        url: 'widget://html/my/fasonging_frm.html',
        pageParam: {
            msg: msg,
            transparent: transparent
        },
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        bgColor: bgColor
    });
}
//数据通讯结束关闭蒙版
function km_fasong_end() {
    api.closeFrame({
        name: 'fasonging_frm'
    });
}
//生成设备唯一ID
function km_deviceId() {
    sbid = api.deviceId;
    if (!sbid) {
        sbid = api.systemVersion + '-' + api.deviceModel + '-' + api.deviceName;
    }
    sbid = api.systemType + '-' + sbid;
    return $api.trimAll(sbid);
}
//设备信息
function km_shebeixinxi(str) {
    var shebeixinxi = {
        ver: api.version, //引擎版本信息
        sType: api.systemType, //系统类型
        sVer: api.systemVersion, //系统版本
        id: api.deviceId, //设备标识
        model: api.deviceModel, //设备型号
        name: api.deviceName, //设备名称
        cType: api.connectionType, //网络状态
        winName: api.winName, //主窗口名字
        winWidth: api.winWidth, //主窗口宽度
        winHeight: api.winHeight, //主窗口高度
        frameName: api.frameName || '', //子窗口名字
        frameWidth: api.frameWidth || '', //子窗口宽度
        frameHeight: api.frameHeight || '' //子窗口高度
    };
    if (str && shebeixinxi[str]) {
        return shebeixinxi[str];
    } else {
        return shebeixinxi;
    }
}
// apiready后通用配置
// type=win/frm默认win，
// mokuai=模块 不同模块状态栏配置不同
// vue=是否使用vue，默认1/true 0/false不监听语言/用户信息的改变
function km_apiready(type, mokuai, vue) {
    type = type || 'win';
    mokuai = mokuai || 'root';
    api.parseTapmode();
    if (type == 'win') {
        if (mokuai == 'root') { //roo页默认方案：白底黑字
            StatusBarStyle = {
                style: 'dark' //字体颜色 dark/light
            };
        } else if (mokuai == 'kuang') { //矿机页默认方案：灰底白字
            StatusBarStyle = {
                style: 'light' //字体颜色 dark/light
            };
        }
        $api.fixStatusBar($api.dom('header')); //为传入的DOM元素增加适当的上内边距，避免header与状态栏重叠
        api.setStatusBarStyle(StatusBarStyle); //设置状态栏
        $api.fixTabBar($api.dom('footer')); //适配iOS X底部横杠 留出空间
        api.setWinAttr({ //设置 window 属性
            hideHomeIndicator: true //适配iOS X底部横杠 不触摸时隐藏
        });
    }

    //是否需要监听语言、用户
    if (typeof(vue) == "undefined") {
        vue = true;
    }
    //声明不用vue、页面没使用vuedata定义vue，则不继续执行
    if (!vue || typeof(vuedata) == 'undefined') {
        return;
    }
    //语言信息赋值+监听改变事件
    if (typeof(vuedata.yy) != "undefined") {
        //赋值---语音缓存值若不存在 拉取默认值
        if (vuedata.yy == '' || JSON.stringify(vuedata.yy) == "{}") { //如果当前页未赋值
            vuedata.yy = $api.getStorage('yuyan'); //拉取缓存值
            if (typeof(vuedata.yy) == "undefined" || vuedata.yy == '' || JSON.stringify(vuedata.yy) == "{}") { //如果还未赋值
                vuedata.yy = km_yuyan_data('cn'); //生成默认值
                $api.setStorage('yuyan', vuedata.yy); //缓存默认值
                // console.log('语言赋值了默认值cn');
            }
        }
        //监听---语言改变，自动更新当前页面vue语言数据
        api.addEventListener({
            name: 'yuyan'
        }, function(ret, err) {
            if (ret.value) {
                vuedata.yy = ret.value;
                // console.log('语言切换了');
            }
        });
    }

    //用户信息赋值+监听改变事件
    if (typeof(vuedata.userinfo) != "undefined") {
        if (vuedata.userinfo == "" || JSON.stringify(vuedata.userinfo) == "{}") { //页面已初始化赋值 这里不重复赋值
            vuedata.userinfo = $api.getStorage('userinfo'); //拉取缓存值
        }
        api.addEventListener({ //监听用户信息改变，自动更新当前页面vue用户信息
            name: 'userinfo'
        }, function(ret, err) {
            if (ret.value) {
                vuedata.userinfo = ret.value;
                // console.log('用户信息改变了');
            }
        });
    }
    //系统参数赋值+监听改变事件
    if (typeof(vuedata.setting) != "undefined") {
        if (vuedata.setting == "" || JSON.stringify(vuedata.setting) == "{}") { //页面已初始化赋值 这里不重复赋值
            vuedata.setting = $api.getStorage('setting'); //拉取缓存值
        }
        api.addEventListener({ //监听用户信息改变，自动更新当前页面vue用户信息
            name: 'setting'
        }, function(ret, err) {
            if (ret.value) {
                vuedata.setting = ret.value;
                // console.log('系统参数改变了');
            }
        });
    }
}
//修改缓存用户信息并广播（如果本页用了km_apiready()，自动有监听修改vuedata）
function km_userinfo(userinfo) {
    $api.setStorage('userinfo', userinfo);
    api.sendEvent({
        name: 'userinfo',
        extra: userinfo
    });
}
//修改缓存系统参数并广播（如果本页用了km_apiready()，自动有监听修改vuedata）
function km_setting(setting) {
    $api.setStorage('setting', setting);
    api.sendEvent({
        name: 'setting',
        extra: setting
    });
}
//修改语言并广播 弹窗
function km_yuyan() {
    api.actionSheet({
        // title: '修改语言',
        cancelTitle: vuedata.yy.取消,
        buttons: ['简体中文', 'English', 'ภาษาไทย'],
        style: {
            fontNormalColor: '#4d4d4d', //选项按钮正常状态文字颜色，默认值：#007AFF
            fontPressColor: '#808080', //选项按钮按下时文字颜色，默认值：#0060F0
            titleFontColor: '#000000' //标题文字颜色，默认值：#8F8F8F
        }
    }, function(ret, err) { //广播语言变更事件，在任意页面通过 addEventListener 监听收到
        if (ret.buttonIndex == 1) {
            yy = 'cn';
        } else if (ret.buttonIndex == 2) {
            yy = 'en';
        } else if (ret.buttonIndex == 3) {
            yy = 'tai';
        }
        yuyan = km_yuyan_data(yy);
        api.sendEvent({
            name: 'yuyan',
            extra: yuyan
        });
        $api.setStorage('yuyan', yuyan);
    });
}
//获取语言数据 yy=cn/en/tai
function km_yuyan_data(yy) {
    if (typeof(yy) == "undefined") {
        yy = 'cn';
    }
    yuyan = api.readFile({
        sync: true,
        path: 'widget://res/yuyan.json'
    });
    yuyan = $api.strToJson(yuyan);
    yuyan2 = {
        'cn': {},
        'en': {},
        'tai': {}
    };
    for (var key in yuyan) {
        yuyan2.cn[key] = yuyan[key].cn;
        yuyan2.en[key] = yuyan[key].en;
        yuyan2.tai[key] = yuyan[key].tai;
    }
    if (yuyan2[yy]) {
        return yuyan2[yy];
    } else {
        return yuyan2['cn'];
    }
}
//合并json？
function km_json_he(obt1, obt2) {
    for (var i in obt1) {   
        obt2[i] = obt1[i];     
    }  
    return obt2;
}
//获取json长度
function km_getJsonLength(jsonData) {
    var length = 0;
    for (var ever in jsonData) {
        length++;
    }
    return length;
}
//把服务器返回含id的数据 提取成{id:{},..}形式
function km_show_json_id(jsondata) {
    jsonret = {};
    for (var i in jsondata) {
        id = jsondata[i].id;
        jsonret[id] = jsondata[i];     
    }  
    return jsonret;
}
//下拉刷新
function km_xiala(fun) {
    api.setCustomRefreshHeaderInfo({
        bgColor: 'rgba(0,0,0,0)', // （可选项）字符串类型；下拉刷新的背景设置，支持 rgb、rgba、#，该背景大小同当前 window 或 frame 的宽高；默认：#C0C0C0
        dropColor: '#428bca', // (可选项) 字符串类型；水滴的颜色，支持rgb、rgba、#，默认：#9BA2AC
        finishedText: '刷新完成' // (可选项) 字符串类型；刷新结束的文字显示，默认：'刷新完成'
    }, function() {
        //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
        if (fun) {
            eval(fun);
        } else {
            ajax_base('xiala');
        }
    });
}
//关闭到root
function km_close_to_root() {
    api.setStatusBarStyle({
        style: 'dark', //字体颜色 dark/light
        // color: 'white' //背景颜色
    });
    api.closeToWin({
        name: 'root'
    });
}
//刷新用户信息+系统参数
function km_ajax_userinfo() {
    km_fasong_ing(); //开启数据通讯中蒙版 防止重复提交
    api.ajax({
        url: km_sis('sis_url_ome') + '/api/wode/index',
        method: 'post',
        headers: km_fasong_tou('api/wode/index'),
        data: {
            values: km_fasong_data({})
        }
    }, function(ret, err) {
        km_fasong_end(); //数据通讯结束关闭蒙版
        if (ret) {
            ret = km_jieshou(ret);
            if (ret.apizt == 1) {
                km_userinfo(ret.userinfo); //修改缓存用户信息并广播（如果本页用了km_apiready()，自动有监听修改vuedata
                km_setting(ret.setting); //修改缓存系统参数并广播（如果本页用了km_apiready()，自动有监听修改vuedata
            } else {
                km_toast(ret.msg);
            }
        } else {
            km_toast('网络错误');
        }
    });
}
// 长按+单击+移动 合一方法  使用方法 <div ontouchstart='km_longpress(this,"fn_longpress(_this)","fnclick(_this)",800,"fn_move(_this)");'></div>
function km_longpress(el, fn_longpress, fn_click, longpressTime, fn_move) {
    longpressTime = longpressTime || 800;
    fn_click = fn_click || '';
    fn_move = fn_move || '';
    var _this = el;
    longpress = setTimeout(function() {
        fn_click = ''; //阻止点击
        fn_move = ''; //阻止移动
        eval(fn_longpress);
    }, longpressTime);
    el.ontouchmove = function() {
        clearTimeout(longpress); //阻止长按
        fn_click = ''; //阻止点击
        eval(fn_move);
        fn_move = ''; //阻止重复移动
    }
    el.ontouchend = function() {
        clearTimeout(longpress); //阻止长按
        eval(fn_click);
    }
}
//查看所有LocalStorage
function km_showAllStorage() {
    // $api.clearStorage();  //清除所有
    km_showSt('uname');
    km_showSt('pwd');
    km_showSt('userinfo');
    km_showSt('sessionid');
    km_showSt('yuyan');
    km_showSt('setting');
    km_showSt('autologin');
    km_showSt('pwdtrue');
    km_showSt('biliao');
    km_showSt('biliao_xx');
    km_showSt('biliao_frs');
    km_showSt('biliao_sumweidu');
    km_showSt('biliao_active_id');
    km_showSt('biliao_name_img');
}
//查看所有LocalStorage 辅助
function km_showSt(st) {
    console.log('【' + st + '】');
    console.log(JSON.stringify($api.getStorage(st)));
}
//console.log 快捷方法
function km_log(data) {
    if (typeof data != 'object') {
        console.log(data);
    } else {
        console.log(JSON.stringify(data));
    }
}
