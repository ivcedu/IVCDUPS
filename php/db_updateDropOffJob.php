<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $JobStatusDupID = filter_input(INPUT_POST, 'JobStatusDupID');

    $query = "UPDATE [".$dbDatabase."].[dbo].[DropOffJob] "
                ."SET JobStatusDupID = '".$JobStatusDupID."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);