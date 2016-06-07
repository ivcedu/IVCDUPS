<?php
    require("config.php");

    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "SELECT * FROM [".$dbDatabase."].[dbo].[DropOffJob] WHERE PrintRequestID = '" . $PrintRequestID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);