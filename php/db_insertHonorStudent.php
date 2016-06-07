<?php
    require("config.php");
    
    $HonorStudentName = filter_input(INPUT_POST, 'HonorStudentName');
    $HonorStudentEmail = filter_input(INPUT_POST, 'HonorStudentEmail');

    $query = "INSERT INTO [".$dbDatabase."].[dbo].[HonorStudent] (HonorStudentName, HonorStudentEmail) "
                ."VALUES ('$HonorStudentName', '$HonorStudentEmail')";  
    
    $cmd = $dbConn->prepare($query);
    $cmd->execute();
    $ResultID = $dbConn->lastInsertId();

    echo json_encode($ResultID);