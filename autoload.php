<?php
require_once 'vendor/autoload.php';

spl_autoload_register(function ($class_name) {
    require_once __DIR__.'/'.str_replace('\\', '/', $class_name).'.php';
});
