<?php
    require("config.php");

    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "SELECT DepartmentID FROM [".$dbDatabase."].[dbo].[Duplicating] WHERE PrintRequestID = '" . $PrintRequestID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DepartmentID']);