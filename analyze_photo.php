<?php
include 'config.php';
header('Content-Type: application/json');
set_time_limit(60);

$data = json_decode(file_get_contents('php://input'), true);
$imageBase64 = $data['image'] ?? '';

if (!$imageBase64) {
  echo json_encode(['error' => 'Фото не получено сервером']);
  exit;
}

// Извлекаем реальный формат фото (jpeg/png/...) из начала base64-строки
preg_match('#^data:image/(\w+);base64,#', $imageBase64, $matches);
$mediaType = isset($matches[1]) ? 'image/' . $matches[1] : 'image/jpeg';

$imageBase64 = preg_replace('#^data:image/\w+;base64,#', '', $imageBase64);

$prompt = "Посмотри на фото листа продаж. Распознай каждую строку и верни СТРОГО валидный JSON-массив (без пояснений, без markdown), где каждый элемент это объект с полями:
sale_date (в формате ГГГГ-ММ-ДД), cost_price (число), name (текст), quantity (число), price (число), sum (число), payment (текст, может быть пустым), confidence (true если уверен в распознавании каждого поля этой строки, false если хоть в одном не уверен).";

$requestBody = [
    'model' => 'claude-sonnet-5',
    'max_tokens' => 2000,
    'messages' => [[
        'role' => 'user',
        'content' => [
            ['type' => 'image', 'source' => ['type' => 'base64', 'media_type' => $mediaType, 'data' => $imageBase64]],
            ['type' => 'text', 'text' => $prompt]
        ]
    ]]
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-api-key: ' . CLAUDE_API_KEY,
    'anthropic-version: 2023-06-01',
    'content-type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);

if ($response === false) {
  $error = curl_error($ch);
  curl_close($ch);
  echo json_encode(['error' => 'Ошибка соединения: ' . $error]);
  exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
  echo json_encode(['error' => "Claude API вернул код $httpCode", 'details' => $response]);
  exit;
}

$responseData = json_decode($response, true);
$claudeText = $responseData['content'][0]['text'] ?? '';
$claudeText = preg_replace('/```json\s*|\s*```/', '', $claudeText);

$parsed = json_decode($claudeText, true);
if ($parsed === null) {
  echo json_encode(['error' => 'Не удалось распознать ответ ИИ', 'raw' => $claudeText]);
  exit;
}

echo json_encode($parsed);
?>