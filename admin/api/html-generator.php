<?php
// La Scuderia CMS - HTML Generator
// Generates HTML from content.json data

function generateHTML($data, $lang = 'de') {
    // Read the current HTML as template
    $templateFile = ($lang === 'de') ? '../../index.html' : '../../en/index.html';
    
    if (!file_exists($templateFile)) {
        // If English doesn't exist, use German as base
        $templateFile = '../../index.html';
    }
    
    $html = file_get_contents($templateFile);
    
    // Replace SEO meta tags
    $html = replaceSEO($html, $data, $lang);
    
    // Replace navigation
    $html = replaceNavigation($html, $data, $lang);
    
    // Replace content sections
    $html = replaceContent($html, $data, $lang);
    
    // Replace images
    $html = replaceImages($html, $data, $lang);
    
    // Replace links
    $html = replaceLinks($html, $data, $lang);
    
    // Add code injection
    $html = addCodeInjection($html, $data);
    
    // Add AI optimization
    $html = addAIOptimization($html, $data, $lang);
    
    // Update language attribute
    $html = preg_replace('/<html lang="[^"]*">/', '<html lang="' . $lang . '">', $html);
    
    return $html;
}

function replaceSEO($html, $data, $lang) {
    $title = $data['seo']['title_' . $lang];
    $description = $data['seo']['description_' . $lang];
    $keywords = $data['seo']['keywords'];
    
    // Replace title
    $html = preg_replace('/<title>.*?<\/title>/', '<title>' . htmlspecialchars($title) . '</title>', $html);
    
    // Replace meta description
    $html = preg_replace('/<meta name="description" content="[^"]*">/', 
        '<meta name="description" content="' . htmlspecialchars($description) . '">', $html);
    
    // Replace OG description
    $html = preg_replace('/<meta property="og:description" content="[^"]*">/', 
        '<meta property="og:description" content="' . htmlspecialchars($description) . '">', $html);
    
    // Replace OG title
    $html = preg_replace('/<meta property="og:title" content="[^"]*">/', 
        '<meta property="og:title" content="' . htmlspecialchars($title) . '">', $html);
    
    return $html;
}

function replaceNavigation($html, $data, $lang) {
    // Generate navigation menu HTML
    $navHTML = '';
    foreach ($data['navigation']['main_menu'] as $item) {
        $text = $item['text_' . $lang];
        $url = $item['url'];
        $navHTML .= '<li><a href="' . htmlspecialchars($url) . '">' . htmlspecialchars($text) . '</a></li>' . "\n                                          ";
    }
    
    // Replace navigation
    $pattern = '/(<ul class="nav navbar-nav">)(.*?)(<\/ul>)/s';
    $replacement = '$1' . "\n                                          " . $navHTML . '$3';
    $html = preg_replace($pattern, $replacement, $html, 1);
    
    return $html;
}

function replaceContent($html, $data, $lang) {
    // Replace H1
    $h1 = $data['seo']['title_' . $lang];
    $html = preg_replace('/<h1>.*?<\/h1>/', '<h1>' . htmlspecialchars($h1) . '</h1>', $html, 1);
    
    // Replace hero quote
    $quote = $data['sections']['hero_quote']['text_' . $lang];
    $author = $data['sections']['hero_quote']['author'];
    
    $quoteHTML = '<blockquote style="font-style: italic; font-size: 1.2em; margin-top: 1em;">' . "\n" .
                 '                            <p>' . htmlspecialchars($quote) . '</p>' . "\n" .
                 '                            <footer style="margin-top: 0.5em;">' . htmlspecialchars($author) . '</footer>' . "\n" .
                 '                            </blockquote>';
    
    $html = preg_replace('/<blockquote.*?<\/blockquote>/s', $quoteHTML, $html, 1);
    
    // Replace restaurant section text
    if (isset($data['sections']['restaurant'])) {
        $restaurantText = $data['sections']['restaurant']['text_' . $lang];
        $pattern = '/(<div class="introtext"><p>)(.*?)(<\/p>\s*<p>.*?<\/p><\/div>)/s';
        $replacement = '$1' . htmlspecialchars($restaurantText) . '</p></div>';
        $html = preg_replace($pattern, $replacement, $html, 1);
    }
    
    // Replace kitchen section text
    if (isset($data['sections']['kitchen'])) {
        $kitchenText = $data['sections']['kitchen']['text_' . $lang];
        // Find and replace kitchen intro text
        $html = preg_replace(
            '/(id="kitchen".*?<div class="introtext"><p>)(.*?)(<\/p><\/div>)/s',
            '$1' . htmlspecialchars($kitchenText) . '$3',
            $html,
            1
        );
    }
    
    // Replace contact info
    $contact = $data['contact'];
    $contactHTML = '<p><strong>KONTAKT</strong></p>' . "\n" .
                   '<p>' . htmlspecialchars($contact['name']) . '<br />' .
                   htmlspecialchars($contact['address']) . '<br />' .
                   htmlspecialchars($contact['postal_code']) . ' ' . htmlspecialchars($contact['city']) . ' <br />' .
                   'Tel. ' . htmlspecialchars($contact['phone']) . '<br /></p>' . "\n" .
                   '<p>E-Mail: ' . htmlspecialchars($contact['email']) . '</p>';
    
    $html = preg_replace(
        '/(<p><strong>KONTAKT<\/strong><\/p>)(.*?)(<p>E-Mail:.*?<\/p>)/s',
        $contactHTML,
        $html,
        1
    );
    
    // Replace opening hours
    $hours = $data['opening_hours'];
    $hoursHTML = '<h6><strong>ÖFFNUNGSZEITEN</strong><br /></h6>' . "\n" .
                 '<p>' . htmlspecialchars($hours['days']) . '</p>' . "\n" .
                 '<p>' . htmlspecialchars($hours['lunch']) . '</p>' . "\n" .
                 '<p>und</p>' . "\n" .
                 '<p>' . htmlspecialchars($hours['dinner']) . '<br /></p>' . "\n" .
                 '<p>' . htmlspecialchars($hours['note']) . '</p>';
    
    $html = preg_replace(
        '/(<h6><strong>ÖFFNUNGSZEITEN<\/strong>.*?<\/h6>)(.*?)(<\/div>\s*<\/div>\s*<div class="col-sm)/s',
        '$1' . "\n" . $hoursHTML . "\n                  $3",
        $html,
        1
    );
    
    return $html;
}

function replaceImages($html, $data, $lang) {
    // Replace logo
    if (isset($data['images']['logo_white'])) {
        $logo = $data['images']['logo_white'];
        $html = preg_replace(
            '/(<img src=")[^"]*(" title=")[^"]*(" alt=")[^"]*(" class="logo")/i',
            '$1' . htmlspecialchars($logo['url']) . '$2' . htmlspecialchars($logo['title_' . $lang]) . '$3' . htmlspecialchars($logo['alt_' . $lang]) . '$4',
            $html
        );
    }
    
    // Replace header background
    if (isset($data['images']['header_bg'])) {
        $headerBg = $data['images']['header_bg'];
        $html = preg_replace(
            '/(background-image: url\()[^)]*(\))/i',
            '$1' . htmlspecialchars($headerBg['url']) . '$2',
            $html,
            1
        );
    }
    
    return $html;
}

function replaceLinks($html, $data, $lang) {
    // Replace social media links
    if (isset($data['social_links']['instagram']) && !empty($data['social_links']['instagram'])) {
        $instagram = $data['social_links']['instagram'];
        $html = preg_replace(
            '/(<a href=")[^"]*(" target="_blank" class="instagram">)/i',
            '$1' . htmlspecialchars($instagram) . '$2',
            $html
        );
    }
    
    // Replace footer links
    if (isset($data['footer_links'])) {
        $privacyUrl = $data['footer_links']['privacy_' . $lang];
        $imprintUrl = $data['footer_links']['imprint_' . $lang];
        
        $html = preg_replace(
            '/(<a href=")[^"]*datenschutz[^"]*(")/i',
            '$1' . htmlspecialchars($privacyUrl) . '$2',
            $html
        );
        
        $html = preg_replace(
            '/(<a href=")[^"]*impressum[^"]*(")/i',
            '$1' . htmlspecialchars($imprintUrl) . '$2',
            $html
        );
    }
    
    // Replace CTA buttons
    if (isset($data['cta_buttons']['phone'])) {
        $phoneUrl = $data['cta_buttons']['phone']['url'];
        $html = preg_replace(
            '/(<a href=")tel:[^"]*(")/i',
            '$1' . htmlspecialchars($phoneUrl) . '$2',
            $html
        );
    }
    
    return $html;
}

function addCodeInjection($html, $data) {
    // Add head scripts before </head>
    if (!empty($data['code_injection']['head_scripts'])) {
        $headScripts = "\n" . $data['code_injection']['head_scripts'] . "\n";
        $html = str_replace('</head>', $headScripts . '</head>', $html);
    }
    
    // Add body scripts before </body>
    if (!empty($data['code_injection']['body_scripts'])) {
        $bodyScripts = "\n" . $data['code_injection']['body_scripts'] . "\n";
        $html = str_replace('</body>', $bodyScripts . '</body>', $html);
    }
    
    // Replace OpenTable widget
    if (!empty($data['code_injection']['opentable_widget'])) {
        $widget = $data['code_injection']['opentable_widget'];
        $html = preg_replace(
            '/(<script type=.text\/javascript. src=.\/\/www\.opentable\.de\/widget.*?<\/script>)/s',
            $widget,
            $html
        );
    }
    
    return $html;
}

function addAIOptimization($html, $data, $lang) {
    $aiContent = '';
    
    // Add FAQ Schema
    if (!empty($data['ai_optimization']['faq'])) {
        $faqSchema = generateFAQSchema($data['ai_optimization']['faq'], $lang);
        $aiContent .= "\n" . $faqSchema;
    }
    
    // Add enhanced Schema.org
    $enhancedSchema = generateEnhancedSchema($data, $lang);
    
    // Replace existing schema or add new one
    if (strpos($html, '<script type="application/ld+json">') !== false) {
        $html = preg_replace(
            '/(<script type="application\/ld\+json">)(.*?)(<\/script>)/s',
            '$1' . "\n" . $enhancedSchema . "\n" . '$3',
            $html,
            1
        );
    }
    
    // Add AI meta tags before </head>
    if (isset($data['ai_optimization']['chatgpt_tags'])) {
        $tags = $data['ai_optimization']['chatgpt_tags'];
        $aiMetaTags = "\n" . '<!-- AI Optimization Tags -->' . "\n";
        $aiMetaTags .= '<meta name="ai:cuisine" content="' . htmlspecialchars($tags['cuisine_type']) . '">' . "\n";
        $aiMetaTags .= '<meta name="ai:price_level" content="' . htmlspecialchars($tags['price_level']) . '">' . "\n";
        $aiMetaTags .= '<meta name="ai:specialties" content="' . htmlspecialchars(implode(', ', $tags['specialties'])) . '">' . "\n";
        $aiMetaTags .= '<meta name="ai:best_for" content="' . htmlspecialchars(implode(', ', $tags['best_for'])) . '">' . "\n";
        $aiMetaTags .= '<meta name="ai:description" content="' . htmlspecialchars($data['ai_optimization']['ai_description']) . '">' . "\n";
        
        $html = str_replace('</head>', $aiMetaTags . $aiContent . '</head>', $html);
    }
    
    return $html;
}

function generateFAQSchema($faqs, $lang) {
    $faqItems = [];
    foreach ($faqs as $faq) {
        $faqItems[] = [
            '@type' => 'Question',
            'name' => $faq['question_' . $lang],
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => $faq['answer_' . $lang]
            ]
        ];
    }
    
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => $faqItems
    ];
    
    return '<script type="application/ld+json">' . "\n" . json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n" . '</script>';
}

function generateEnhancedSchema($data, $lang) {
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'Restaurant',
        'name' => $data['contact']['name'],
        'description' => $data['seo']['description_' . $lang],
        'servesCuisine' => $data['schema_enhanced']['serves_cuisine'],
        'priceRange' => $data['schema_enhanced']['price_range'],
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => $data['contact']['address'],
            'addressLocality' => $data['contact']['city'],
            'postalCode' => $data['contact']['postal_code'],
            'addressCountry' => 'DE'
        ],
        'telephone' => '+49-' . str_replace(' ', '', $data['contact']['phone']),
        'email' => $data['contact']['email'],
        'url' => 'https://www.la-scuderia.de'
    ];
    
    // Add opening hours
    $schema['openingHoursSpecification'] = [
        [
            '@type' => 'OpeningHoursSpecification',
            'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens' => '12:00',
            'closes' => '15:00'
        ],
        [
            '@type' => 'OpeningHoursSpecification',
            'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens' => '18:30',
            'closes' => '24:00'
        ]
    ];
    
    // Add chef info
    if (isset($data['schema_enhanced']['chef'])) {
        $schema['chef'] = [
            '@type' => 'Person',
            'name' => $data['schema_enhanced']['chef']['name'],
            'jobTitle' => $data['schema_enhanced']['chef']['title']
        ];
    }
    
    // Add ratings if available
    if ($data['schema_enhanced']['review_count'] > 0) {
        $schema['aggregateRating'] = [
            '@type' => 'AggregateRating',
            'ratingValue' => $data['schema_enhanced']['average_rating'],
            'reviewCount' => $data['schema_enhanced']['review_count']
        ];
    }
    
    // Add menu items if available
    if (!empty($data['schema_enhanced']['menu_items'])) {
        $menuSections = [];
        foreach ($data['schema_enhanced']['menu_items'] as $item) {
            $menuSections[] = [
                '@type' => 'MenuItem',
                'name' => $item['name'],
                'description' => $item['description'],
                'offers' => [
                    '@type' => 'Offer',
                    'price' => str_replace('€', '', $item['price']),
                    'priceCurrency' => 'EUR'
                ]
            ];
        }
        
        if (!empty($menuSections)) {
            $schema['hasMenu'] = [
                '@type' => 'Menu',
                'hasMenuItem' => $menuSections
            ];
        }
    }
    
    return json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>
