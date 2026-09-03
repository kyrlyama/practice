<?php
$mysqli = new mysqli("localhost", "root", "", "control");

if ($mysqli->connect_error) {
  die("Ошибка подключения: " . $mysqli->connect_error);
}
?>