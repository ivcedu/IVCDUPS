<?php
    require("config.php");

    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "SELECT * FROM [".$dbDatabase."].[dbo].[Transaction] WHERE PrintRequestID = '" . $PrintRequestID . "' ORDER BY TransactionID DESC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);