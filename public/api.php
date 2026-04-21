<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the path after /api/
$path = isset($_GET['path']) ? $_GET['path'] : 'hello';

// Backend URL
$backendUrl = 'http://localhost:8081/api/' . $path;
// $backendUrl = 'https://desapuundoho-backend-yyacyn8027-q3bmatch.apn.leapcell.dev/api/' . $path;

// Use cURL instead of file_get_contents (more reliable on cPanel)
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $backendUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpCode !== 200) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Could not connect to backend',
        'http_code' => $httpCode,
        'curl_error' => $curlError,
        'backend_url' => $backendUrl,
        'hint' => 'Check: curl http://localhost:8081/api/hello in terminal'
    ]);
} else {
    echo $response;
}
?>