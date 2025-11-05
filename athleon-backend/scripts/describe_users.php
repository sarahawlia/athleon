<?php
// Bootstrap Laravel and run DESCRIBE + SHOW CREATE TABLE for users
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $rows = DB::select('DESCRIBE users');
    echo "DESCRIBE users:\n";
    foreach ($rows as $r) {
        // cast stdClass to array for nicer printing
        $a = (array) $r;
        echo implode(" | ", $a) . "\n";
    }

    echo "\nSHOW CREATE TABLE users:\n";
    $c = DB::select('SHOW CREATE TABLE users');
    if (!empty($c)) {
        $row = (array) $c[0];
        // the CREATE TABLE is in a field that can be 'Create Table' or 'Create Table' depending on MySQL
        $val = null;
        foreach ($row as $k => $v) { if (stripos($k, 'create') !== false) { $val = $v; break; } }
        echo $val . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
