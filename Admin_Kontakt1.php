<?php
// --- Jednoduché heslo pre admin stránku ---
$admin_user = 'admin';
$admin_pass = 'heslo123'; // zmeň na bezpečné heslo

// Kontrola HTTP Basic Auth
if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $admin_user || $_SERVER['PHP_AUTH_PW'] !== $admin_pass) {
    header('WWW-Authenticate: Basic realm="Admin"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Prístup zamietnutý';
    exit;
}

// --- Cesta k JSON súboru mimo webroot ---
$dataFile = __DIR__ . '/../enitech-data/messages.json';

// Načítanie dát
$messages = [];
if (file_exists($dataFile)) {
    $lines = file($dataFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $messages[] = json_decode($line, true);
    }
}
?>
<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<title>Admin - správy</title>
<style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
    th { background: #eee; }
</style>
</head>
<body>
<h1>Správy od používateľov</h1>

<?php if (empty($messages)): ?>
    <p>Žiadne správy zatiaľ neprišli.</p>
<?php else: ?>
    <table>
        <thead>
            <tr>
                <th>Čas</th>
                <th>Meno</th>
                <th>Priezvisko</th>
                <th>Telefón</th>
                <th>Email</th>
                <th>Predmet</th>
                <th>Správa</th>
                <th>Súhlas</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($messages as $msg): ?>
                <tr>
                    <td><?= htmlspecialchars($msg['cas']) ?></td>
                    <td><?= htmlspecialchars($msg['meno']) ?></td>
                    <td><?= htmlspecialchars($msg['priezvisko']) ?></td>
                    <td><?= htmlspecialchars($msg['telefon']) ?></td>
                    <td><?= htmlspecialchars($msg['email']) ?></td>
                    <td><?= htmlspecialchars($msg['predmet']) ?></td>
                    <td><?= nl2br(htmlspecialchars($msg['sprava'])) ?></td>
                    <td><?= $msg['suhlas'] ? 'áno' : 'nie' ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

</body>
</html>
