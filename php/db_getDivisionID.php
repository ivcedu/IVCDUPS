<?php
    require("config.php");

    $CostCenterCode = filter_input(INPUT_POST, 'CostCenterCode');
    
    $query = "SELECT DivisionID FROM [".$dbDatabase."].[dbo].[Division] WHERE CostCenterCode = '" . $CostCenterCode . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DivisionID']);