<?php
    $dbHost = "IEXDBLISTNR";
    // sql 2014 server (production DB)
//    $dbDatabase = "IVCDCENTER";
    // sql 2014 server (development DB)
    $dbDatabase = "DEVDCENTER";
    
    $dbUser = "ivcdcenter";
    $dbPass = "~7QM#pd?X*";

    // MSSQL database connection
    try {
        $dbConn = new PDO("sqlsrv:server=$dbHost;Database=$dbDatabase", $dbUser, $dbPass);
    } 
    catch (PDOException $e) {
        die ($e->getMessage());
    }
