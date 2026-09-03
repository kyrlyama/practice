<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$brand = $mysqli->real_escape_string($data['brand']);
$model = $mysqli->real_escape_string($data['model']);
$glass_type = $mysqli->real_escape_string($data['case_type']);
$quantity = (int)$data['quantity'];
$shop = $mysqli->real_escape_string($data['shop']);

$sql = "INSERT INTO glasses (brand, model, glass_type, quantity, shop)
        VALUES ('$brand', '$model', '$glass_type', $quantity, '$shop')
        ON DUPLICATE KEY UPDATE quantity = quantity + $quantity";

if ($mysqli->query($sql)) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'error' => $mysqli->error]);
}
?>