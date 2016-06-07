<?php
    // sql 2008 r2 server
//    $dbHost = "ivcintdb1";
//    $dbDatabase = "IVCDCENTER";
    // sql 2014 server (production DB)
//    $dbHost = "IEXDBCLST1";
//    $dbDatabase = "IVCDCENTER";
    // sql 2014 server (development DB)
    $dbHost = "IEXDBCLST1";
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
