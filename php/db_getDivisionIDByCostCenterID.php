<?php
    require("config.php");

    $CostCenterID = filter_input(INPUT_POST, 'CostCenterID');
    
    $query = "SELECT DivisionID FROM [".$dbDatabase."].[dbo].[CostCenter] WHERE CostCenterID = '" . $CostCenterID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DivisionID']);