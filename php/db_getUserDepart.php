<?php
    require("config.php");

    $query = "SELECT * FROM [".$dbDatabase."].[dbo].[UserDepart] ORDER BY Department ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);