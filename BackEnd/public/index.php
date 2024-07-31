<?php

use App\Kernel;

// Set PHP configuration
ini_set('memory_limit', $_SERVER['PHP_INI_MEMORY_LIMIT'] ?? '256M');
ini_set('upload_max_filesize', $_SERVER['PHP_INI_UPLOAD_MAX_FILESIZE'] ?? '10M');
ini_set('post_max_size', $_SERVER['PHP_INI_POST_MAX_SIZE'] ?? '10M');

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};