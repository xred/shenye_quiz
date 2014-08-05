<?php
include("../conn.php");
$private = $_GET['private']; 
$public = $_GET['public'];
$data = file_get_contents("php://input")
$query = "SELECT * FROM `shenye_user_data` where `public` = '$public'";
$result = mysql_query($query);
$row = mysql_fetch_array($result);
if ($row['public'] == $public && $row['private'] == $private) {
	$filename = "./datajson/".$public.".js";
	file_put_contents($filename, $data);
	echo "success";
}else{
	echo "fail";
}
 ?>