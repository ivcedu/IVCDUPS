<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $LoginName = filter_input(INPUT_POST, 'LoginName');
    $Note = filter_input(INPUT_POST, 'Note');
    
    $LoginName = str_replace("'", "''", $LoginName);
    $Note = str_replace("'", "''", $Note);

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[Transaction] (PrintRequestID, LoginName, Note) "
                ."VALUES ('$PrintRequestID', '$LoginName', '$Note')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);