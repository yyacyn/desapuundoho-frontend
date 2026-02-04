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

// Forward the request to Golang backend
$response = file_get_contents($backendUrl);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not connect to backend']);
} else {
    echo $response;
}
?>