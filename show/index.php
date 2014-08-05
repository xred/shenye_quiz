<?php
include("../conn.php");
$public = $_GET['id'];

$query = "SELECT * FROM `shenye_user_data` where `public` = '$public'";
$result = mysql_query($query);
$row = mysql_fetch_array($result);

 ?>
 <?php if ($row['private'] == ""): ?>
     error
<?php else: ?>
<html>
<head>
    <title>华科校友圈</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0 user-scalable=no">
    <link rel="stylesheet" type="text/css" href="css/bootstrap3/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/index.css">
    <script type="text/javascript" src="js/jq.1.10.2.js"></script>
    <script type="text/javascript" src="js/datajson.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
    <script>
    </script>
    <script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F98a0a5cc6e9318263d84f30f259edb62' type='text/javascript'%3E%3C/script%3E"));
</script>
</head>

<body>
    <a id="share-guide" onclick="hideGuide();">
        <img src="img/guide.png" alt="">
    </a>
    <div class="container">
        <div class="cHeader cCell">
            <div class="leftIcon" id="userIcon">
                <img src="img/header-icon.jpg" alt="">
            </div>
            <div class="rightInfos">
                <h2 class="queTitle" id="queTitle">
             </h2>
             <span class="joinPeople">
                已有
                <em>0</em>
                人参与测试
            </span>
        </div>
    </div>
    <div class="cCell cBody">
        <div class="queProgress progress">
            <div id="queProgress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                0%
            </div>
        </div>
        <div class="cBodyStart">
            <span id="startText"></span>
            <a class="btn btn-lg btn-danger" id="btn-start">马上开始</a>
        </div>
        <div class="cBodyEnd">
            
        </div>

        <div class="cBodyQue">
            
        </div>
    </div>
    <div class="cCell cFooter">
        <div class="alert alert-info" id="footerText">
        </div>
        <div class="alert alert-success">
            <h4>旁友，想制作自己的答卷吗？点击下面，免费，靠谱，账号都不需要，炸裂了！！</h4>
            <a href="#" class="btn btn-success">炸裂的链接</a>
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
 <?php endif ?>