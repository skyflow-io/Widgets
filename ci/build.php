<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$fileSystem = new Filesystem();

$result = [];

$composeFinder = new Finder();
$composeFinder->directories()->depth(0)->in('/app/src')->sortByName();

foreach ($composeFinder as $compose) {
    $name = $compose->getBasename();
    $files = [
        'name' => $name,
        'files' => []
    ];
    $filesFinder = new Finder();
    $filesFinder->files()->in('/app/src/' . $name);
    foreach ($filesFinder as $file) {
        $files['files'][] = [
            'directory' => $file->getRelativePath(),
            'filename' => $file->getFilename(),
            'contents' => $file->getContents(),
        ];
    }
    $result[] = $files;
}

$fileSystem->appendToFile('/app/widgets.json', json_encode($result));


$filesFinder = new Finder();
$filesFinder->files()->name('data.json')->in('/app/doc');
foreach ($filesFinder as $file) {
    $result = json_decode($file->getContents(), true)['classes'];
}

$fileSystem->appendToFile('/app/doc/widgets.json', json_encode($result));