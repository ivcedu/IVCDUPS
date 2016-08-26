<?php
    require("config.php");
    
    $query = "SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
            . "prrq.RequestTitle, "
            . "prrq.Requestor, "
            . "dvtp.DeviceType, "
            . "'<a href=# id=''unlocked_pr_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''><i class=''iconic iconic-sm iconic-lock-unlocked''></i></a>' "
            . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "WHERE prrq.Locked = 1";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);