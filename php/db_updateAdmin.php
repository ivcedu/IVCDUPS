<?php
    require("config.php");
    
    $AdminID = filter_input(INPUT_POST, 'AdminID');
    $AdminName = filter_input(INPUT_POST, 'AdminName');
    $AdminEmail = filter_input(INPUT_POST, 'AdminEmail');
    $AdminLevel = filter_input(INPUT_POST, 'AdminLevel');
    
    $AdminName = str_replace("'", "''", $AdminName);
    $AdminEmail = str_replace("'", "", $AdminEmail);
    $AdminLevel = str_replace("'", "''", $AdminLevel);

    $query = "UPDATE [".$dbDatabase."].[dbo].[Admin] "
                ."SET AdminName = '".$AdminName."', AdminEmail = '".$AdminEmail."', AdminLevel = '".$AdminLevel."' "
                ."WHERE AdminID = '".$AdminID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);