<?php
// connection.php is used to connect to the database by creating a PDO as specified below
try {
    $connectstr = "mysql:dbname=musify;host=localhost:3306";
    $db = new PDO($connectstr, "root", "");
} catch (PDOException $e) {
    echo 'connection failed: ' . $e->getMessage();
}

