<?php
// Cieľový adresár na uloženie správ
$dataDir = __DIR__ . '/../enitech-data';
$dataFile = $dataDir . '/messages.json';

// Ak priečinok neexistuje, vytvor ho
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

// Čítanie údajov z POST
$meno       = $_POST['meno'] ?? '';
$priezvisko = $_POST['priezvisko'] ?? '';
$telefon    = $_POST['telefon'] ?? '';
$email      = $_POST['email'] ?? '';
$predmet    = $_POST['predmet'] ?? '';
$sprava     = $_POST['sprava'] ?? '';
$suhlas     = isset($_POST['suhlas']) ? true : false;

// Validácia povinných polí
if ((!$meno) || (!$priezvisko)  || (!$telefon) || (!$email) || (!$predmet) || (!$sprava) || (!$suhlas)) {
    die("Chyba: Niektoré z očakávaných vstupných polí chýba.");
}
// Zostavenie objektu
$data = [
    "meno"       => $meno,
    "priezvisko" => $priezvisko,
    "telefon"    => $telefon,
    "email"      => $email,
    "predmet"    => $predmet,
    "sprava"     => $sprava,
    "suhlas"     => $suhlas,
    "cas"        => date('c') // ISO8601 čas
];

// Uloženie ako JSON riadok
$line = json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
file_put_contents($dataFile, $line, FILE_APPEND | LOCK_EX);

// Odošleme späť jednoduchú HTML odpoveď
echo "<h2>Ďakujeme, správa bola uložená na server.</h2>";
?>
