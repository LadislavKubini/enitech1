<?php
// --- Jednoduché heslo pre admin stránku ---
$admin_user = 'admin';
$admin_pass = 'heslo123';

// Kontrola HTTP Basic Auth
// if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $admin_user || $_SERVER['PHP_AUTH_PW'] !== $admin_pass) {
//     header('WWW-Authenticate: Basic realm="Admin"');
//     header('HTTP/1.0 401 Unauthorized');
//     echo 'Prístup zamietnutý';
//     exit;
// }

// ak už je session platná, nežiadaj znovu Basic Auth
if (empty($_SESSION['admin']) || $_SESSION['admin'] !== true) {

    // kontrola Basic Auth
    if (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== $admin_user || $_SERVER['PHP_AUTH_PW'] !== $admin_pass) {
        header('WWW-Authenticate: Basic realm="Admin"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Prístup zamietnutý';
        exit;
    }

    // ak sme tu => prihlasenie úspešné -> nastav session
    $_SESSION['admin'] = true;

    // voliteľne: ulož kto sa prihlásil a čas
    $_SESSION['admin_user'] = $_SERVER['PHP_AUTH_USER'];
    $_SESSION['admin_login_time'] = time();
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
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Admin_KontaktCV.php</title>
	<link rel="icon" href="favicona-enitech.png">
	<link rel="stylesheet" href="fonts-poppins.css" />
	<link rel="stylesheet" href="fonts-open-sans.css">
	<style>
		html {
			scroll-behavior: smooth;
		}
		body {
			margin: 0.2vw;
			font-family: 'Poppins', 'Open Sans', Arial, Tahoma, sans-serif;
			background-color: #F8FCFF;
		}
	</style>

	<link rel="stylesheet" href="enicss/admin-kontakt.css">
</head>
<body>
	<h1>Správy z Kariéra s prílohami</h1>

	<?php if (empty($messages)): ?>
		<p>Žiadne správy zatiaľ neprišli.</p>
	<?php else: ?>
		<div class="table-container" id="id-tableCont">
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
						<?php
							$dt = new DateTime($msg['cas']);
							$datum = $dt->format('Y-m-d');
							$cas = $dt->format('H:i:s');
						?>
						<tr>
							<td><?= htmlspecialchars($datum) ?>
								<small><?= htmlspecialchars($cas) ?></small>
							</td>
							<td><?= htmlspecialchars($msg['meno']) ?></td>
							<td><?= htmlspecialchars($msg['priezvisko']) ?></td>
							<td><?= htmlspecialchars($msg['telefon']) ?></td>
							<td><a href="mailto:<?= htmlspecialchars($msg['email']) ?>"><?= htmlspecialchars($msg['email']) ?></a></td>
							<td><?= nl2br(htmlspecialchars($msg['sprava'])) ?></td>
							<td><?= !empty($msg['suhlas']) ? 'áno' : 'nie' ?></td>
							<td>
								<div class="subory">
									<?php if (!empty($msg['subory'])): ?>
										<?php foreach ($msg['subory'] as $subor): 
											$filePath = $uploadsDir . '/' . $subor;
											if (file_exists($filePath)): ?>
												<a href="Admin_download.php?file=<?= rawurlencode($subor) ?>" target="_blank"><?= htmlspecialchars($subor) ?></a>
											<?php else: ?>
												<span style="color:red;"><?= htmlspecialchars($subor) ?> (chýba)</span>
											<?php endif; ?>
										<?php endforeach; ?>
									<?php else: ?>
										žiadne
									<?php endif; ?>
								</div>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	<?php endif; ?>
</body>
</html>
