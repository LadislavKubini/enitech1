<?php
session_start();

// cesta k uploads
$uploadsDir = __DIR__ . '/../enitech-data/uploads-cv/';
$allowedExt = ['jpg','jpeg','png','gif','pdf','doc','docx','txt','rtf'];

// Konfiguracia admina (rovnaka hodnoty ako v hlavnom subore)
// $admin_user = 'admin';
// $admin_pass = 'heslo123';

// ak session nie je platná -> skúsiť Basic Auth (tak ako v hlavnej stránke)
// Týmto postupom: ak bola session nastavená pri prehliadaní hlavnej stránky, nebude sa pýtať
$hasSession = (!empty($_SESSION['admin']) && $_SESSION['admin'] === true);

if (!$hasSession) {
    // Pokus o basic auth - ak je v headeroch správne, nastavíme session a pokračujeme
    if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $admin_user || $_SERVER['PHP_AUTH_PW'] !== $admin_pass) {
        header('WWW-Authenticate: Basic realm="Admin"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Prístup zamietnutý';
        exit;
    }
    // úspešné Basic Auth => nastav session pre ďalšie požiadavky
    $_SESSION['admin'] = true;
    $_SESSION['admin_user'] = $_SERVER['PHP_AUTH_USER'];
    $_SESSION['admin_login_time'] = time();
}

// Teraz už vieme, že užívateľ je povolený (cez session alebo práve autorizoval)
// Pokračujeme so zabezpečeným downloadom:

if (empty($_GET['file'])) {
    http_response_code(400);
    exit('Súbor nebol zadaný.');
}

$requestName = $_GET['file'];
if (substr($requestName, 0, 1) === '.') {
    http_response_code(400);
    exit('Neplatné meno súboru.');
}
$basename = basename($requestName);
$filepath = $uploadsDir . $basename;

$realUploadsDir = realpath($uploadsDir);
$realFile = realpath($filepath);

if ($realFile === false || strpos($realFile, $realUploadsDir) !== 0) {
    http_response_code(404);
    exit('Súbor neexistuje alebo nie je povolený.');
}

$ext = strtolower(pathinfo($realFile, PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt, true)) {
    http_response_code(403);
    exit('Nepovolený typ súboru.');
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$contentType = finfo_file($finfo, $realFile) ?: 'application/octet-stream';
finfo_close($finfo);

// Dynamicky disposition (inline pre obrázky/pdf, attachment pre iné)
$inlineExt = ['jpg','jpeg','png','gif','pdf'];
$disposition = in_array($ext, $inlineExt, true) ? 'inline' : 'attachment';

header('Content-Description: File Transfer');
header('Content-Type: ' . $contentType);
header('Content-Disposition: ' . $disposition . '; filename="' . rawurldecode($basename) . '"');
header('Content-Length: ' . filesize($realFile));
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, max-age=0, must-revalidate');

while (ob_get_level()) {
    ob_end_clean();
}

readfile($realFile);
exit;
?>
