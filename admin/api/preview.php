<?php
// La Scuderia CMS - Preview API
// Generates preview HTML without publishing

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load content data
$contentFile = '../../data/content.json';
if (!file_exists($contentFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Content file not found']);
    exit();
}

$data = json_decode(file_get_contents($contentFile), true);
if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON in content file']);
    exit();
}

// Include HTML generation functions
require_once 'html-generator.php';

try {
    // Generate preview HTML for German version
    $htmlDE = generateHTML($data, 'de');
    
    // Generate preview HTML for English version
    $htmlEN = generateHTML($data, 'en');
    
    // Save preview files
    $previewDir = '../../data/preview';
    if (!file_exists($previewDir)) {
        mkdir($previewDir, 0755, true);
    }
    
    file_put_contents($previewDir . '/index.html', $htmlDE);
    file_put_contents($previewDir . '/index-en.html', $htmlEN);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Preview generated successfully',
        'preview_url_de' => '/data/preview/index.html',
        'preview_url_en' => '/data/preview/index-en.html',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to generate preview',
        'message' => $e->getMessage()
    ]);
}
?>
