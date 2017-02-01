<?php
    require("config.php");
    
    $UserProfileID = filter_input(INPUT_POST, 'UserProfileID');
    $UserName = filter_input(INPUT_POST, 'UserName');
    $UserEmail = filter_input(INPUT_POST, 'UserEmail');
    $UserPhone = filter_input(INPUT_POST, 'UserPhone');
    $EmployeeID = filter_input(INPUT_POST, 'EmployeeID');
    $DepartmentID = filter_input(INPUT_POST, 'DepartmentID');
    
    $UserName = str_replace("'", "''", $UserName);
    $UserEmail = str_replace("'", "", $UserEmail);

    $query = "UPDATE [".$dbDatabase."].[dbo].[UserProfile] "
                ."SET UserName = '".$UserName."', UserEmail = '".$UserEmail."', UserPhone = '".$UserPhone."', EmployeeID = '".$EmployeeID."', DepartmentID = '".$DepartmentID."' "
                ."WHERE UserProfileID = '".$UserProfileID."'";
    
    $cmd = $dbConn->prepare($query);
    $result = $cmd->execute(); 

    echo json_encode($result);