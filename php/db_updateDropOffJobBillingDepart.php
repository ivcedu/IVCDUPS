<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');

    $query = "UPDATE [".$dbDatabase."].[dbo].[DropOffJob] "
                ."SET DepartmentID = '".$DepartmentID."' "
                ."WHERE PrintRequestID = '".$PrintRequestID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);