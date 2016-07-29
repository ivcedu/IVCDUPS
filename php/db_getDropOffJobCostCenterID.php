<?php
    require("config.php");

    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "SELECT TOP (1) CostCenterID FROM [".$dbDatabase."].[dbo].[DropOffJob] WHERE PrintRequestID = '" . $PrintRequestID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['CostCenterID']);