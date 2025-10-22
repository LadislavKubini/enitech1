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

// --- Cesty k súborom ---
$dataFile   = __DIR__ . '/../enitech-data/messages-cv.json';
$uploadsDir = __DIR__ . '/../enitech-data/uploads-cv';

// Načítanie dát
$messages = [];
if (file_exists($dataFile)) {
    $lines = file($dataFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if ($decoded) {
            $messages[] = $decoded;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<title>Admin - CV správy</title>
<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background: #eee; }
    td a { display: inline-block; margin-right: 5px; }
</style>
</head>
<body>
<h1>Správy s prílohami</h1>

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
                <th>Správa</th>
                <th>Súhlas</th>
                <th>Prílohy</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($messages as $msg): ?>
                <tr>
                    <td><?= htmlspecialchars($msg['cas']) ?></td>
                    <td><?= htmlspecialchars($msg['meno']) ?></td>
                    <td><?= htmlspecialchars($msg['priezvisko']) ?></td>
                    <td><?= htmlspecialchars($msg['telefon']) ?></td>
                    <td><a href="mailto:<?= htmlspecialchars($msg['email']) ?>"><?= htmlspecialchars($msg['email']) ?></a></td>
                    <td><?= nl2br(htmlspecialchars($msg['sprava'])) ?></td>
                    <td><?= !empty($msg['suhlas']) ? 'áno' : 'nie' ?></td>
                    <td>
                        <?php if (!empty($msg['subory'])): ?>
                            <?php foreach ($msg['subory'] as $subor): 
                                $filePath = $uploadsDir . '/' . $subor;
                                if (file_exists($filePath)): ?>
                                    <a href="../enitech-data/uploads-cv/<?= rawurlencode($subor) ?>" target="_blank"><?= htmlspecialchars($subor) ?></a><br>
                                <?php else: ?>
                                    <span style="color:red;"><?= htmlspecialchars($subor) ?> (chýba)</span><br>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        <?php else: ?>
                            žiadne
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

</body>
</html>
