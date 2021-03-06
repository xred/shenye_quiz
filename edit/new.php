<html>
<head>
    <title>答题编辑器</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0 ">
    <link rel="stylesheet" type="text/css" href="css/bootstrap3/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap3/css/font-awesome.min.css">

    <!--messager-->
    <link rel="stylesheet" href="messager/css/messenger-theme-flat.css">
    <link rel="stylesheet" href="messager/css/messenger.css">

    <link rel="stylesheet" type="text/css" href="css/index.css">
    <script type="text/javascript" src="js/jq.1.10.2.js"></script>

    <script src="css/bootstrap3/js/bootstrap.min.js"></script>
    <script src="messager/js/messenger.min.js"></script>

    <script type="text/javascript" src="js/index.js"></script>
    <script>
    </script>
    <script type="text/javascript">
    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F98a0a5cc6e9318263d84f30f259edb62' type='text/javascript'%3E%3C/script%3E"));
    </script>
</head>

<body>
    <!--[if lt IE 7]> 
<p>
    (ﾉ￣д￣)ﾉ
    作为程序员，我迫切的建议并希望你可以使用chrome内核的浏览器（如搜狗浏览器，360极速浏览器的极速模式，或者直接用谷歌浏览器）浏览本页面，因为那样可以获得最佳体验，你可以看到更多的动画效果，更漂亮的阴影和圆角，当然你仍然可以坚持使用古老的IE6或IE7（包括360浏览器），我只是这么建议一下而已 :D
</p>
     <![endif]-->
     <p class="alert alert-warning" id="phone-warning">
         建议在电脑上打开该网址进行编辑么么哒~手机上体验并不是很好。主要是程序猿太懒了。
     </p>
    <div class="guide-list">
        <ul class="nav nav-pills nav-stacked" role="tablist">
            <li role="presentation">
                <a href="#cCell-title">
                    <i class="icon-font"></i>
                    编辑标题
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-guide">
                    <i class="icon-align-left"></i>
                    编辑引导文字
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-queList">
                    <i class="icon-list-ul"></i>
                    问题列表
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-addQue">
                    <i class="icon-edit"></i>
                    问题编辑器
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-score">
                    <i class="icon-bar-chart"></i>
                    分数分段编辑器
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-end">
                    <i class="icon-indent-right"></i>
                    结束后的内容
                </a>
            </li>
            <li role="presentation">
                <a href="#cCell-footer">
                    <i class="icon-gift"></i>
                    底部常驻文字
                </a>
            </li>
            <li class="divider">
                <br>
            </li>
            <li role="presentation">
                <a id="btn-saveData">
                    <i class="icon-save"></i>
                    保存
                </a>
            </li>
            <li role="presentation">
                <a id="btn-preview">
                    <i class="icon-desktop"></i>
                    预览
                </a>
            </li>
        </ul>
    </div>

    <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title" id="myModalLabel">WARNING！！这不是演习！！</h4>
            </div>
            <div class="modal-body" id="modalText">
                (,,#ﾟДﾟ) 你确定要删掉这条问题？？真的？？？
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">不删了</button>
                <button type="button" class="btn btn-danger" id="btn-confirm-delete">给劳资删掉！</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="ssConfirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title" id="myModalLabel">WARNING！！这不是演习！！</h4>
            </div>
            <div class="modal-body">
                (,,#ﾟДﾟ) 你确定要删掉所有分段？？
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">不删了</button>
                <button type="button" class="btn btn-danger" id="btn-ss-confirm-delete">给劳资删掉！</button>
            </div>
        </div>
    </div>
</div>

<div class="container">

    <div class="cHeader cCell" id="cCell-title">
        <div class="leftIcon" id="userIcon">
            <img src="image/header-icon.jpg" alt="" id="userImg">
        </div>
        <div class="rightInfos">
            <input type="text" id="queTitle" class="form-control" placeHolder="在这里输入标题">
        </div>
    </div>
    <div class="cCell" id="cCell-guide">
        <div class="editCell">
            <span class="title">在这里输入引导文字
                <em>（必须填，填个空格也行）</em>
            </span>
            <textarea type="text" id="startText" class="form-control" placehodler="在这里输入引导文字"></textarea>
        </div>
    </div>
    <div class="cCell cQueList" id="cCell-queList">
        <div class="editCell">
            <a class="btn btn-danger" id="btn-deleteAllQue">清空</a>
            <span class="title">这里是问题列表
                <em>（点击标题可以折叠，打开）</em>
            </span>
            <ul class="panel-group" id="queListHolder">
                    <!--
                    <li>
                        <div class="panel panel-default">
                            <div class="panel-heading">

                                <div class="btns">
                                    <a href="#" class="btn-que-edit">
                                        <i class="icon-edit"></i>
                                    </a>
                                    <a href="" class="btn-que-delete">
                                        <i class="icon-remove-circle"></i>
                                    </a>
                                </div>

                                <a data-toggle="collapse" data-parent="#accordion" href="#queBody0" class="titleA">
                                    aaa
                                </a>
                            </div>
                            <div id="queBody0" class="panel-collapse collapse">
                                <div class="panel-body">
                                    <div class="cBodyQue">
                                        <div class='queTitle'>
                                            #{titleStr}
                                        </div>
                                        <ul id='queList'>
                                            <li class="right">
                                                <i class="icon-ok-circle"></i>
                                                <span>#{nowWord}. #{item}</span>
                                            </li>
                                            <li>
                                                <i class="icon-ok-circle"></i>
                                                <span>#{nowWord}. #{item}</span>
                                            </li>
                                            <li>
                                                <i class="icon-ok-circle"></i>
                                                <span>#{nowWord}. #{item}</span>
                                            </li>
                                            <li>
                                                <i class="icon-ok-circle"></i>
                                                <span>#{nowWord}. #{item}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                -->
            </ul>
        </div>
    </div>

    <div class="cCell cBody"  id="cCell-addQue">
        <div class="cBodyStart">

            <div class="editCell addQue">
                <span class="title">添加问题
                    <em>（在答案左侧勾选正确答案）</em>
                </span>
                <input type="text" class="form-control" id="queItemTitle" placeHolder="输入问题的标题">

                <ul id="ansAddList">
                    <li>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <input type="radio" name="rightAns" value="0">
                            </span>
                            <input type="text" class="form-control" placeHolder="输入A答案">
                        </div>
                    </li>
                    <li>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <input type="radio" name="rightAns" value="1">
                            </span>
                            <input type="text" class="form-control" placeHolder="输入B答案">
                        </div>
                    </li>
                    <li>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <input type="radio" name="rightAns" value="2">
                            </span>
                            <input type="text" class="form-control" placeHolder="输入C答案">
                        </div>
                    </li>
                    <li>
                        <div class="input-group">
                            <span class="input-group-addon">
                                <input type="radio" name="rightAns" value="3">
                            </span>
                            <input type="text" class="form-control" placeHolder="输入D答案">
                        </div>
                    </li>
                </ul>

                <a class="btn btn-lg btn-success" id="btn-addQue">添加这个问题 (〝▼ _ ▼）</a>

                <a class="btn btn-lg btn-danger" id="btn-cancelEdit">清空编辑器 (＃｀д´)ﾉ</a>
            </div>
        </div>
    </div>
    <div class="cCell" id="cCell-score">
        <div class="editCell">
            <span class="title">分数参数</span>
            <div>
                <div class="input-group input-group-md avgScoreHolder">
                    <span class="input-group-addon">每道题分数</span>
                    <input type="text" id="input_avgScore" class="form-control" placeholder="最好填写整数">
                </div>
                <span id="fullScoreSpan">
                    总分：0
                </span>
                <em>（该分数会从下面的分数分段中自动获得）</em>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="editCell">
            <span class="title">分数分段</span>
            <ul id="scoreSecUl">
                
           </ul>
       </div>
       <div class="editCell">
        <span class="title">添加分数分段</span>
        <div class="input-group input-group-md ssHolder">
            <span class="input-group-addon" id="scoreSecStart">0-</span>
            <input type="text" id="input_scoreSec" class="form-control" placeholder="最好填写整数">
        </div>
        <p class="alert alert-warning">
            为方便起见，所有分数分段都是“左开右闭”，若是你的第一个分段是及格分段比如60分，那你应该填写59。请务必注意~
            <br>
            同理，最后的满分分段形式应当是 99 < 分数 <= 100  这样~
            <br>
            当然，0分会自动包含在第一个分段里~
        </p>
        <textarea type="text" id="input_scoreComment" class="form-control" placeholder="填写该分段的评价，由于微信分享原因，最好不要超过35个字~"></textarea>
    </div>
    <div class="ssBtnHolder">
        <a class="btn btn-lg btn-success" id="btn_addSS">添加这个分段 (〝▼ _ ▼）</a>

        <a class="btn btn-lg btn-danger" id="btn_deleteSS">清空所有分段(＃｀д´)ﾉ</a>
    </div>
</div>
<div class="cCell" id="cCell-end">
    <div class="editCell">
        <span class="title">结束后的内容
            <em>（可不填）</em>
        </span>
        <textarea type="text" id="input_endText" class="form-control" placeholder="填写用户答题结束后会出现的内容,比如介绍你的微信公众账号之类~"></textarea>
    </div>
    <div class="editCell">
        <span class="title">按钮信息
            <em>（可不填）</em>
        </span>
        <img src="image/btn-guide.jpg" alt="">
        <p class="alert alert-warning">如图，在答题结束后会出现按钮，请填写红色按钮中的文字以及按钮上的链接，一般可设置为你的公众账号主页，如
            <a href="http://mp.weixin.qq.com/s?__biz=MzAwNDAwNjIzMg==&mid=200791641&idx=1&sn=7323124e281b47d2c73086966c843f85#rd'">华科校友圈</a>
        </p>
    </div>
    <input type="text" id="input_endBtnText" class="form-control" placeholder="填写按钮上的文字，不要超过10个字">
    <input type="text" id="input_endBtnHref" class="form-control" placeholder="填写按钮的链接">
</div>
<div class="cCell" id="cCell-footer">
    <div class="editCell">
        <span class="title">常驻底部文字
            <em>（可不填）</em>
        </span>
        <img src="image/footer-guide.jpg" alt="">
        <p class="alert alert-warning">
            如图所示……如果你不填写，我们也会放自己的文字上去么么哒~
        </p>
        <textarea type="text" id="input_footerText" class="form-control" placeholder="随便写点"></textarea>
    </div>
</div>
</div>
<div class="footer">
    <div class="container">
        <a href="http://shenye.club" class="mp-link">【深夜食堂】出品</a>
</div>
</div>
</body>


</html>
