<?php
    require("config.php");

    $query = "SELECT * FROM [IVCDCENTER].[dbo].[CopierPrice]";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);