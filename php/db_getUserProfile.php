<?php
    require("config.php");
    
    $LoginEmail = filter_input(INPUT_POST, 'LoginEmail');

    $query = "SELECT * FROM [".$dbDatabase."].[dbo].[UserProfile] WHERE UserEmail = '" . $LoginEmail . "'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);