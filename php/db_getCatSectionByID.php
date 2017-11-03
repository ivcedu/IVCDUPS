<?php
    require("config.php");
    
    $CatSectionID = filter_input(INPUT_POST, 'CatSectionID');

    $query = "SELECT * FROM [".$dbDatabase."].[dbo].[CatSection] WHERE CatSectionID = '".$CatSectionID."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);