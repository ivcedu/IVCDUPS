<?php
    require("config.php");
    
    $HonorStudentID = filter_input(INPUT_POST, 'HonorStudentID');
    
    $query = "DELETE [".$dbDatabase."].[dbo].[HonorStudent] WHERE HonorStudentID = '".$HonorStudentID ."'";
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute();           

    echo json_encode($result);