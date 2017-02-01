<?php
    require("config.php");
    
    $DivisionID = filter_input(INPUT_POST, 'DivisionID');
    $CostCenterCode = filter_input(INPUT_POST, 'CostCenterCode');
    $CostCenter = filter_input(INPUT_POST, 'CostCenter');
    
    $CostCenterCode = str_replace("'", "''", $CostCenterCode);
    $CostCenter = str_replace("'", "''", $CostCenter);

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[CostCenter] (DivisionID, CostCenterCode, CostCenter) "
                ."VALUES ('$DivisionID', '$CostCenterCode', '$CostCenter')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);