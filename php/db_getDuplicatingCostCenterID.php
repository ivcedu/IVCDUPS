<?php
    require("config.php");

    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "SELECT CostCenterID FROM [".$dbDatabase."].[dbo].[Duplicating] WHERE PrintRequestID = '" . $PrintRequestID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['CostCenterID']);