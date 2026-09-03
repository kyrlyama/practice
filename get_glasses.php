<?php
include 'db.php';

$result = $mysqli->query("SELECT * FROM glasses");
$glasses = [];

while ($row = $result->fetch_assoc()) {
  $glasses[] = $row;
}

header('Content-Type: application/json');
echo json_encode($glasses);
?>