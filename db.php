<?php
$mysqli = new mysqli("sql211.infinityfree.com", "if0_42814037", "s3E7ye41bYFseqK", "if0_42814037_control_likefon");

if ($mysqli->connect_error) {
  die("Ошибка подключения: " . $mysqli->connect_error);
}

$mysqli->set_charset("utf8mb4");
?>
