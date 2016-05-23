<?php
    require("config.php");

    $query = "SELECT HonorStudentName, HonorStudentEmail, "
            . "'<a class=''iconic-color-default'' href=# id=''honor_student_id_' + CONVERT(NVARCHAR(255), HonorStudentID) + '''><i class=''iconic iconic-sm iconic-pencil iconic-color-default''></i></a>' "
            . "FROM [IVCDCENTER].[dbo].[HonorStudent] ORDER BY HonorStudentName ASC";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);