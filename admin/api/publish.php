<?php
// La Scuderia CMS - Publish API
// Regenerates live HTML files from content.json

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
    // Create backups of current HTML files
    $backupDir = '../../data/backups/html';
    if (!file_exists($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d_H-i-s');
    
    if (file_exists('../../index.html')) {
        copy('../../index.html', $backupDir . '/index_' . $timestamp . '.html');
    }
    
    if (file_exists('../../en/index.html')) {
        copy('../../en/index.html', $backupDir . '/index-en_' . $timestamp . '.html');
    }
    
    // Generate new HTML files
    $htmlDE = generateHTML($data, 'de');
    $htmlEN = generateHTML($data, 'en');
    
    // Write to live files
    file_put_contents('../../index.html', $htmlDE);
    
    if (!file_exists('../../en')) {
        mkdir('../../en', 0755, true);
    }
    file_put_contents('../../en/index.html', $htmlEN);
    
    // Log publish event
    $logFile = '../../data/publish-log.txt';
    $logEntry = date('Y-m-d H:i:s') . " - Published by CMS\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    
    // Clean up old backups (keep last 10)
    $backups = glob($backupDir . '/index_*.html');
    if (count($backups) > 10) {
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        $toDelete = array_slice($backups, 0, count($backups) - 10);
        foreach ($toDelete as $file) {
            unlink($file);
        }
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Website published successfully',
        'files_updated' => [
            'index.html',
            'en/index.html'
        ],
        'backup_created' => $timestamp,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to publish',
        'message' => $e->getMessage()
    ]);
}
?>
