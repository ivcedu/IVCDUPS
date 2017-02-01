<?php
    require("config.php");
    
    $CostCenterCode = filter_input(INPUT_POST, 'CostCenterCode');
    $Division = filter_input(INPUT_POST, 'Division');
    
    $CostCenterCode = str_replace("'", "''", $CostCenterCode);
    $Division = str_replace("'", "''", $Division);

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[Division] (CostCenterCode, Division) "
                ."VALUES ('$CostCenterCode', '$Division')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);