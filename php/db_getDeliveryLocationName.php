<?php
    require("config.php");

    $DeliveryLocationID = filter_input(INPUT_POST, 'DeliveryLocationID');
    
    $query = "SELECT DeliveryLocation FROM [".$dbDatabase."].[dbo].[DeliveryLocation] WHERE DeliveryLocationID = '" . $DeliveryLocationID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DeliveryLocation']);