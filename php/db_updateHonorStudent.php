<?php
    require("config.php");
    
    $HonorStudentID = filter_input(INPUT_POST, 'HonorStudentID');
    $HonorStudentName = filter_input(INPUT_POST, 'HonorStudentName');
    $HonorStudentEmail = filter_input(INPUT_POST, 'HonorStudentEmail');

    $query = "UPDATE [IVCDCENTER].[dbo].[HonorStudent] "
                ."SET HonorStudentName = '".$HonorStudentName."', HonorStudentEmail = '".$HonorStudentEmail."' "
                ."WHERE HonorStudentID = '".$HonorStudentID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);