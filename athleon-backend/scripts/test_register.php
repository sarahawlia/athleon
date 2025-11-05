<?php
// Simple HTTP POST to test /api/auth/register
$url = 'http://127.0.0.1:8000/api/auth/register';
$data = [
    'name' => 'CI Test User',
    'email' => 'ci.test.' . time() . '@example.com',
    'telepon' => '081234567890',
    'alamat' => 'Jakarta',
    'jenis_kelamin' => 'Laki-laki',
    'password' => 'secret123',
    'password_confirmation' => 'secret123',
];

$payload = json_encode($data);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$resp = curl_exec($ch);
$err = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP code: $code\n";
if ($err) {
    echo "Curl error: $err\n";
}
echo "Response:\n";
echo $resp . "\n";
