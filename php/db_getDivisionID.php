<?php
    require("config.php");

    $Division = filter_input(INPUT_POST, 'Division');
    
    $query = "SELECT TOP(1) DivisionID FROM [".$dbDatabase."].[dbo].[Division] WHERE Division = '" . $Division . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DivisionID']);