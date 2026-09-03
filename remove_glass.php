<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$brand = $mysqli->real_escape_string($data['brand']);
$model = $mysqli->real_escape_string($data['model']);
$glass_type = $mysqli->real_escape_string($data['case_type']);
$quantity = (int)$data['quantity'];
$shop = $mysqli->real_escape_string($data['shop']);

$sql = "UPDATE glasses
        SET quantity = GREATEST(quantity - $quantity, 0)
        WHERE brand = '$brand' AND model = '$model' AND glass_type = '$glass_type' AND shop = '$shop'";

if ($mysqli->query($sql)) {
  if ($mysqli->affected_rows > 0) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'error' => 'Такое стекло не найдено на складе']);
  }
} else {
  echo json_encode(['success' => false, 'error' => $mysqli->error]);
}
?>