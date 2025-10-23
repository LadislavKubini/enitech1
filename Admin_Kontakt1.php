<?php
	$admin_user = 'admin';
	$admin_pass = 'heslo123';

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
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Admin_Kontakt1.php</title>
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
<h1>Správy z "Kontaktujte nás"</h1>

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
					<th>Predmet</th>
					<th>Správa</th>
					<th>Súhlas</th>
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
						<td><?= htmlspecialchars($msg['email']) ?></td>
						<td><?= htmlspecialchars($msg['predmet']) ?></td>
						<td><?= nl2br(htmlspecialchars($msg['sprava'])) ?></td>
						<td><?= $msg['suhlas'] ? 'áno' : 'nie' ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
<?php endif; ?>
	<script>
		window.addEventListener('load', function() {
			const tableCont = document.getElementById('id-tableCont');
			tableCont.scrollTop = tableCont.scrollHeight;
		});
	</script>
</body>
</html>
