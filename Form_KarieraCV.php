<?php
// Cieľový adresár na uloženie správ a súborov
$dataDir = __DIR__ . '/../enitech-data';
$dataFile = $dataDir . '/messages-cv.json';
$uploadsDir = $dataDir . '/uploads-cv';

if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}
if (!file_exists($uploadsDir)) {
    mkdir($uploadsDir, 0777, true);
}

$meno       = $_POST['meno'] ?? '';
$priezvisko = $_POST['priezvisko'] ?? '';
$telefon    = $_POST['telefon'] ?? '';
$email      = $_POST['email'] ?? '';
$sprava     = $_POST['sprava'] ?? '';
$suhlas     = isset($_POST['suhlas']) ? true : false;

if ((!$meno) || (!$priezvisko) || (!$telefon) || (!$email) || (!$sprava) || (!$suhlas)) {
    die("Server: Error, some of the expected input fields are missing.");
}

// Spracovanie súborov
$uploadedFiles = [];
error_log("DEBUG POST: " . print_r($_POST, true));
error_log("DEBUG FILES: " . print_r($_FILES, true));
if (!empty($_FILES['attachments'])) {
    $attachments = $_FILES['attachments'];
    for ($i = 0; $i < count($attachments['name']); $i++) {
        if ($attachments['error'][$i] === UPLOAD_ERR_OK) {
            $origName = basename($attachments['name'][$i]);
            $timestamp = date("Ymd-His");
            $rand = bin2hex(random_bytes(4));
            $safeName = $timestamp . "-" . $rand . "-" . preg_replace("/[^a-zA-Z0-9._-]/", "_", $origName);

            $target = $uploadsDir . '/' . $safeName;

            if (move_uploaded_file($attachments['tmp_name'][$i], $target)) {
                $uploadedFiles[] = $safeName;
            }
        }
    }
}

// Zostavenie objektu
$data = [
    "meno"       => $meno,
    "priezvisko" => $priezvisko,
    "telefon"    => $telefon,
    "email"      => $email,
    "sprava"     => $sprava,
    "suhlas"     => $suhlas,
    "cas"        => date('c'), // ISO8601 čas
    "subory"     => $uploadedFiles
];

// Uloženie ako JSON riadok (NDJSON)
$line = json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
file_put_contents($dataFile, $line, FILE_APPEND | LOCK_EX);

echo "Server: Thank you, the message has been saved on the server, number of attachments: ".count($uploadedFiles);
?>
