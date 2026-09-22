<?php
// La Scuderia CMS - Favicon Upload API
// Generates all favicon sizes from one upload

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['favicon'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No favicon file uploaded']);
    exit();
}

$file = $_FILES['favicon'];

// Validate file
$allowedTypes = ['image/png', 'image/jpeg', 'image/x-icon'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: PNG, JPG, ICO']);
    exit();
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Maximum size: 5MB']);
    exit();
}

try {
    // Get image info
    $imageInfo = getimagesize($file['tmp_name']);
    if (!$imageInfo) {
        throw new Exception('Invalid image file');
    }
    
    $width = $imageInfo[0];
    $height = $imageInfo[1];
    
    // Require minimum 512x512
    if ($width < 512 || $height < 512) {
        throw new Exception('Image must be at least 512x512 pixels');
    }
    
    // Create source image
    $mimeType = $imageInfo['mime'];
    switch ($mimeType) {
        case 'image/png':
            $source = imagecreatefrompng($file['tmp_name']);
            break;
        case 'image/jpeg':
            $source = imagecreatefromjpeg($file['tmp_name']);
            break;
        default:
            throw new Exception('Unsupported image format');
    }
    
    if (!$source) {
        throw new Exception('Failed to create image resource');
    }
    
    $generatedFiles = [];
    
    // Generate favicon-16x16.png
    $generatedFiles[] = generateFaviconSize($source, 16, '../../favicon-16x16.png');
    
    // Generate favicon-32x32.png
    $generatedFiles[] = generateFaviconSize($source, 32, '../../favicon-32x32.png');
    
    // Generate apple-touch-icon.png (180x180)
    $generatedFiles[] = generateFaviconSize($source, 180, '../../apple-touch-icon.png');
    
    // Generate favicon.ico (multi-size)
    generateMultiSizeICO($source, '../../favicon.ico');
    $generatedFiles[] = '/favicon.ico';
    
    imagedestroy($source);
    
    // Update content.json
    updateContentJSON($generatedFiles);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Favicon generated successfully',
        'files' => $generatedFiles,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Favicon generation failed',
        'message' => $e->getMessage()
    ]);
}

function generateFaviconSize($source, $size, $outputPath) {
    $sourceWidth = imagesx($source);
    $sourceHeight = imagesy($source);
    
    // Create square canvas
    $favicon = imagecreatetruecolor($size, $size);
    
    // Preserve transparency
    imagealphablending($favicon, false);
    imagesavealpha($favicon, true);
    $transparent = imagecolorallocatealpha($favicon, 0, 0, 0, 127);
    imagefill($favicon, 0, 0, $transparent);
    imagealphablending($favicon, true);
    
    // Resize and copy
    imagecopyresampled($favicon, $source, 0, 0, 0, 0, $size, $size, $sourceWidth, $sourceHeight);
    
    // Save as PNG
    imagepng($favicon, $outputPath, 9);
    imagedestroy($favicon);
    
    return basename($outputPath);
}

function generateMultiSizeICO($source, $outputPath) {
    // For ICO, we'll create a 32x32 version
    // Full multi-size ICO generation is complex, so we'll use a simple approach
    $size = 32;
    $sourceWidth = imagesx($source);
    $sourceHeight = imagesy($source);
    
    $icon = imagecreatetruecolor($size, $size);
    imagealphablending($icon, false);
    imagesavealpha($icon, true);
    $transparent = imagecolorallocatealpha($icon, 0, 0, 0, 127);
    imagefill($icon, 0, 0, $transparent);
    imagealphablending($icon, true);
    
    imagecopyresampled($icon, $source, 0, 0, 0, 0, $size, $size, $sourceWidth, $sourceHeight);
    
    // Save as PNG first, then convert to ICO
    $tempPng = sys_get_temp_dir() . '/temp_favicon.png';
    imagepng($icon, $tempPng, 9);
    imagedestroy($icon);
    
    // Simple ICO generation (single size)
    // In production, you might want to use a library for proper multi-size ICO
    $pngData = file_get_contents($tempPng);
    $pngSize = strlen($pngData);
    
    // ICO header
    $ico = pack('vvv', 0, 1, 1); // Reserved, Type (1 = ICO), Count
    
    // Image directory entry
    $ico .= pack('CCCCvvVV', 
        $size,      // Width
        $size,      // Height
        0,          // Color palette
        0,          // Reserved
        1,          // Color planes
        32,         // Bits per pixel
        $pngSize,   // Size of image data
        22          // Offset to image data
    );
    
    // PNG data
    $ico .= $pngData;
    
    file_put_contents($outputPath, $ico);
    unlink($tempPng);
}

function updateContentJSON($files) {
    $contentFile = '../../data/content.json';
    if (!file_exists($contentFile)) {
        return;
    }
    
    $data = json_decode(file_get_contents($contentFile), true);
    if ($data === null) {
        return;
    }
    
    // Update favicon paths
    $data['favicon'] = [
        'ico' => '/favicon.ico',
        'png_16' => '/favicon-16x16.png',
        'png_32' => '/favicon-32x32.png',
        'apple_touch' => '/apple-touch-icon.png'
    ];
    
    // Save updated content
    file_put_contents($contentFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
?>
