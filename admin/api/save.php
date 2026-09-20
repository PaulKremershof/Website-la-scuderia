<?php
// La Scuderia CMS - Save API

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

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Validate data structure
if (!isset($data['seo']) || !isset($data['contact']) || !isset($data['sections'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Path to content file
$contentFile = '../../data/content.json';

// Create backup
$backupDir = '../../data/backups';
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0755, true);
}

if (file_exists($contentFile)) {
    $backupFile = $backupDir . '/content_' . date('Y-m-d_H-i-s') . '.json';
    copy($contentFile, $backupFile);
    
    // Keep only last 10 backups
    $backups = glob($backupDir . '/content_*.json');
    if (count($backups) > 10) {
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        array_splice($backups, 10);
        foreach ($backups as $oldBackup) {
            unlink($oldBackup);
        }
    }
}

// Save new content
$result = file_put_contents($contentFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit();
}

// Success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Content saved successfully',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
