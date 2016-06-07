<?php
    require("config.php");
    
    $PrintRequestID = filter_input(INPUT_POST, 'PrintRequestID');
    
    $query1 = "DELETE [".$dbDatabase."].[dbo].[Attachment] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query2 = "DELETE [".$dbDatabase."].[dbo].[Duplicating] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query3 = "DELETE [".$dbDatabase."].[dbo].[Plotter] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query4 = "DELETE [".$dbDatabase."].[dbo].[PrintRequest] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query5 = "DELETE [".$dbDatabase."].[dbo].[Transaction] WHERE PrintRequestID = '".$PrintRequestID ."'";
    $query6 = "DELETE [".$dbDatabase."].[dbo].[Receipt] WHERE PrintRequestID = '".$PrintRequestID ."'";
    
    $cmd = $dbConn->prepare($query1);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query2);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query3);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query4);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query5);
    $result = $cmd->execute();
    
    $cmd = $dbConn->prepare($query6);
    $result = $cmd->execute();

    echo json_encode($result);