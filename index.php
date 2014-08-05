<meta charset="UTF-8" />
<title>创建一个新的答题</title>
<?php
include("conn.php");
function get_random()
{
	$randStr = str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
	$rand = substr($randStr,0,6);
	return $rand;
}

$private = $_COOKIE['shenye_private'];
$public = $_COOKIE['shenye_public'];
if (1) {
	$public = "shenye_".get_random();
	$private = get_random();
	$query = "INSERT `shenye_user_data`  (uid,public,private,viewnum) values ('','$public','$private','0')";
	$status = mysql_query($query);
	if ($status == '1') {
		setcookie("shenye_public",$public,time()+3600*24*365);
		setcookie("shenye_private",$private,time()+3600*24*365);
		$url= sprintf("<a href='%s'>点击创建新的问答</a>","http://http://114.215.169.8/shenye_quiz/edit.php?public=".$public);
		echo $url;
	}else{
		echo "err";
	}
}
 ?>