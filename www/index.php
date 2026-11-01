<?php
header("Content-Type: text/plain");
echo "php " . PHP_VERSION . " as " . trim(shell_exec("id -un")) . " path " . parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH) . " query " . ($_SERVER["QUERY_STRING"] ?? "") . "\n";
