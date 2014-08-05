<?php
include("../conn.php");
$private = $_GET['private']; 
$public = $_GET['public'];
$data = file_get_contents("php://input")
$query = "SELECT * FROM `shenye_user_data` where `public` = '$public'";
$result = mysql_query($query);
$row = mysql_fetch_array($result);
if (1) {
	$filename = "./datajson/".$public.".js";
	file_put_contents($filename, $data);
	echo $data;
}else{
	echo "fail";
}
?>
