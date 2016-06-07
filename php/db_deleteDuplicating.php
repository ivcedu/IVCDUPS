<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query = "DELETE [".$dbDatabase."].[dbo].[Duplicating] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();           

    echo json_encode($result);