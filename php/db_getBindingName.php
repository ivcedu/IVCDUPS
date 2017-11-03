<?php
    require("config.php");

    $BindingID = filter_input(INPUT_POST, 'BindingID');
    
    $query = "SELECT Binding FROM [".$dbDatabase."].[dbo].[Binding] WHERE BindingID = '".$BindingID."'";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetch();

    echo json_encode($data['Binding']);