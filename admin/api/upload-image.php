<?php
// La Scuderia CMS - Image Upload API

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Check if file was uploaded
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image file uploaded']);
    exit();
}

$file = $_FILES['image'];
$metadata = json_decode($_POST['metadata'] ?? '{}', true);

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
$maxSize = 10 * 1024 * 1024; // 10MB

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: JPG, PNG, WebP, SVG']);
    exit();
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Maximum size: 10MB']);
    exit();
}

try {
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    $uploadDir = '../../images/';
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $targetPath = $uploadDir . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Failed to move uploaded file');
    }
    
    // Generate responsive versions for non-SVG images
    $responsiveVersions = [];
    if ($file['type'] !== 'image/svg+xml') {
        $responsiveVersions = generateResponsiveImages($targetPath, $filename);
    }
    
    // Prepare response
    $imageData = [
        'id' => uniqid('img_'),
        'url' => '/images/' . $filename,
        'filename' => $filename,
        'alt_de' => $metadata['alt_de'] ?? '',
        'alt_en' => $metadata['alt_en'] ?? '',
        'title_de' => $metadata['title_de'] ?? '',
        'title_en' => $metadata['title_en'] ?? '',
        'category' => $metadata['category'] ?? 'gallery',
        'responsive' => $responsiveVersions,
        'size' => $file['size'],
        'type' => $file['type']
    ];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'image' => $imageData
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Upload failed',
        'message' => $e->getMessage()
    ]);
}

function generateResponsiveImages($sourcePath, $originalFilename) {
    $sizes = [400, 800, 1200];
    $versions = [];
    
    // Get image info
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return $versions;
    }
    
    $sourceWidth = $imageInfo[0];
    $sourceHeight = $imageInfo[1];
    $mimeType = $imageInfo['mime'];
    
    // Create image resource
    switch ($mimeType) {
        case 'image/jpeg':
            $source = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($sourcePath);
            break;
        case 'image/webp':
            $source = imagecreatefromwebp($sourcePath);
            break;
        default:
            return $versions;
    }
    
    if (!$source) {
        return $versions;
    }
    
    $baseName = pathinfo($originalFilename, PATHINFO_FILENAME);
    $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
    
    foreach ($sizes as $width) {
        // Skip if source is smaller than target
        if ($sourceWidth <= $width) {
            continue;
        }
        
        $height = (int)($sourceHeight * ($width / $sourceWidth));
        
        // Create resized image
        $resized = imagecreatetruecolor($width, $height);
        
        // Preserve transparency for PNG
        if ($mimeType === 'image/png') {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
        }
        
        imagecopyresampled($resized, $source, 0, 0, 0, 0, $width, $height, $sourceWidth, $sourceHeight);
        
        $resizedFilename = $baseName . '-' . $width . 'w.' . $extension;
        $resizedPath = '../../images/' . $resizedFilename;
        
        // Save resized image
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($resized, $resizedPath, 85);
                break;
            case 'image/png':
                imagepng($resized, $resizedPath, 8);
                break;
            case 'image/webp':
                imagewebp($resized, $resizedPath, 85);
                break;
        }
        
        imagedestroy($resized);
        
        $versions[] = [
            'width' => $width,
            'url' => '/images/' . $resizedFilename
        ];
    }
    
    imagedestroy($source);
    
    return $versions;
}
?>
