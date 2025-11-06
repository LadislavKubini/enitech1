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
		thead th {
  			font-size: smaller;
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
    <colgroup>
      <col class="col-1">
      <col class="col-2">
      <col class="col-3">
      <col class="col-4">
      <col class="col-5">
      <col class="col-6">
    </colgroup>

    <thead>
      <tr>
        <th>Čas</th>
        <th>Meno<br>Priezvisko</th>
        <th>Telefón<br>Email</th>
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
          <td><?= htmlspecialchars($datum) ?><br><small><?= htmlspecialchars($cas) ?></small></td>
          <td><strong><?= htmlspecialchars($msg['meno']) ?><br><?= htmlspecialchars($msg['priezvisko']) ?></strong></td>
          <td><?= htmlspecialchars($msg['telefon']) ?><br><?= htmlspecialchars($msg['email']) ?></td>
          <td><?= htmlspecialchars($msg['predmet']) ?></td>
          <td><?= nl2br(htmlspecialchars($msg['sprava'])) ?></td>
          <td><?= $msg['suhlas'] ? 'áno' : 'nie' ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php endif; ?>
	<!-- 🔹 MODÁLNE OKNO -->
	<div id="modal" class="modal">
	<div class="modal-content">
		<span class="modal-close">&times;</span>

		<h2>Detail správy</h2>
		<div id="modal-body"></div>

		<div class="modal-footer">
		<button id="btn-close">Close</button>
		<button id="btn-delete">Delete</button>
		</div>
	</div>
	</div>

	<script>
		window.addEventListener('load', function() {
			const tableCont = document.getElementById('id-tableCont');
			tableCont.scrollTop = tableCont.scrollHeight;
		});
	</script>
	<!-- modalny dialog -->
	<script>
		document.addEventListener('DOMContentLoaded', () => {
		const rows = document.querySelectorAll('.table-container tbody tr');
		const modal = document.getElementById('modal');
		const modalBody = document.getElementById('modal-body');
		const closeBtn = document.getElementById('btn-close');
		const closeX = document.querySelector('.modal-close');
		const deleteBtn = document.getElementById('btn-delete');

		let selectedRow = null;

		// 🔹 Zvýraznenie pri hover (CSS zvláda) + doubleclick -> modal
		rows.forEach((row, index) => {
			row.addEventListener('dblclick', () => {
			selectedRow = row;
			const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerHTML);
			modalBody.innerHTML = `
				<p><strong>Čas:</strong><br>${cells[0]}</p>
				<p><strong>Meno a priezvisko:</strong><br>${cells[1]}</p>
				<p><strong>Telefón / Email:</strong><br>${cells[2]}</p>
				<p><strong>Predmet:</strong><br>${cells[3]}</p>
				<p><strong>Správa:</strong><br>${cells[4]}</p>
				<p><strong>Súhlas:</strong> ${cells[5]}</p>
			`;
			modal.classList.add('show');
			});
		});

		// 🔹 Zatváranie
		function closeModal() {
			modal.classList.remove('show');
		}
		closeBtn.addEventListener('click', closeModal);
		closeX.addEventListener('click', closeModal);
		window.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});

		// 🔹 Delete – v realite by si volal AJAX, tu iba simulácia
		deleteBtn.addEventListener('click', () => {
			if (confirm('Naozaj zmazať túto správu?')) {
			const next = selectedRow.nextElementSibling;
			selectedRow.remove();
			closeModal();
			if (next) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
			// tu by si doplnil fetch('/delete.php', {method: 'POST', body: JSON.stringify({...})})
			}
		});
		});
	</script>	
</body>
</html>
