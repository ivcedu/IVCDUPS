<?php
    require("config.php");
    
    $AdminID = filter_input(INPUT_POST, 'AdminID');
    
    $query = "DELETE [".$dbDatabase."].[dbo].[Admin] WHERE AdminID = '".$AdminID ."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();           

    echo json_encode($result);