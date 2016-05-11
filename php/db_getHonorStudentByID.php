<?php
    require("config.php");
    
    $HonorStudentID = filter_input(INPUT_POST, 'HonorStudentID');

    $query = "SELECT * FROM [IVCDCENTER].[dbo].[HonorStudent] WHERE HonorStudentID = '" . $HonorStudentID . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);