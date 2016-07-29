<?php
    require("config.php");

    $CostCenterCode = filter_input(INPUT_POST, 'CostCenterCode');
    
    $query = "SELECT CostCenterID FROM [".$dbDatabase."].[dbo].[CostCenter] WHERE CostCenterCode = '" . $CostCenterCode . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['CostCenterID']);