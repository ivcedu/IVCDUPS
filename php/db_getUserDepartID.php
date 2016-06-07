<?php
    require("config.php");

    $Department = filter_input(INPUT_POST, 'Department');
    
    $query = "SELECT DepartmentID FROM [".$dbDatabase."].[dbo].[UserDepart] WHERE Department = '".$Department."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['DepartmentID']);