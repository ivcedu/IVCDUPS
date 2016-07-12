<?php
    require("config.php");
    
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $query = "SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
            . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
            . "prrq.Requestor, "
            . "dvtp.DeviceType, "
            . "dupl.DateNeeded AS DateTimeNeeded, "
            . "CONVERT(VARCHAR(10), trnc.DTStamp, 101) AS DeliveredDate, "
            . "DATEDIFF(DAY, TRY_CONVERT(DATE, dupl.DateNeeded, 101), TRY_CONVERT(DATE, trnc.DTStamp, 101)) AS ExceededDays "
            . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID AND dupl.JobStatusDupID = 5 "
            . "INNER JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "INNER JOIN [".$dbDatabase."].[dbo].[Transaction] AS trnc ON prrq.PrintRequestID = trnc.PrintRequestID AND trnc.Note LIKE 'Status has been changed to Delivered%' "
            . "WHERE TRY_CONVERT(DATE, trnc.DTStamp, 101) > TRY_CONVERT(DATE, dupl.DateNeeded, 101) "
            . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
            . "UNION "
            . "SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
            . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
            . "prrq.Requestor, "
            . "dvtp.DeviceType, "
            . "droj.DateNeeded AS DateTimeNeeded, "
            . "CONVERT(VARCHAR(10), trnc.DTStamp, 101) AS DeliveredDate, "
            . "DATEDIFF(DAY, TRY_CONVERT(DATE, droj.DateNeeded, 101), TRY_CONVERT(DATE, trnc.DTStamp, 101)) AS ExceededDays "
            . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID AND droj.JobStatusDupID = 5 "
            . "INNER JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
            . "INNER JOIN [".$dbDatabase."].[dbo].[Transaction] AS trnc ON prrq.PrintRequestID = trnc.PrintRequestID AND trnc.Note LIKE 'Status has been changed to Delivered%' "
            . "WHERE TRY_CONVERT(DATE, trnc.DTStamp, 101) > TRY_CONVERT(DATE, droj.DateNeeded, 101) "
            . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
            . "GROUP BY prrq.PrintRequestID, prrq.DTStamp, prrq.RequestTitle, prrq.Requestor, dvtp.DeviceType, droj.DateNeeded, "
            . "CONVERT(VARCHAR(10), trnc.DTStamp, 101), DATEDIFF(DAY, TRY_CONVERT(DATE, droj.DateNeeded, 101), TRY_CONVERT(DATE, trnc.DTStamp, 101))";

    $cmd = $dbConn->prepare($query);
    $cmd->execute(); 
    $data = $cmd->fetchAll();

    echo json_encode($data);