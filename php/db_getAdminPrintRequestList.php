<?php
    require("config.php");
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #RESULT (Created nvarchar(255), RequestTitle nvarchar(255), Requestor nvarchar(255), DeviceType nvarchar(255), JobStatus nvarchar(255), DueDate nvarchar(255), TotalCost money)";
    $query_drop_table = "DROP TABLE #RESULT";
    
    $query_insert_result = "INSERT INTO #RESULT SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
                        . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
                        . "prrq.Requestor, "
                        . "dvtp.DeviceType, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN jstp.JobStatusPlot "
                        . "ELSE jstd.JobStatusDup END AS JobStatus, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN '' "
                        . "WHEN prrq.DeviceTypeID = 2 THEN dupl.DateNeeded "
                        . "WHEN prrq.DeviceTypeID = 4 THEN catg.DateNeeded "
                        . "ELSE dojb.DateNeeded END AS DueDate, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN pltt.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 2 THEN dupl.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 4 THEN catg.TotalCost "
                        . "ELSE dojb.TotalCost END AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq LEFT JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS dojb ON prrq.PrintRequestID = dojb.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Catalog] AS catg ON prrq.PrintRequestID = catg.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON jstd.JobStatusDupID = dupl.JobStatusDupID OR jstd.JobStatusDupID = dojb.JobStatusDupID OR jstd.JobStatusDupID = catg.JobStatusDupID "
                        . "WHERE (jstp.JobStatusPlotID <> '8' AND jstp.JobStatusPlotID <> '9') "
                        . "OR (jstd.JobStatusDupID <> '5' AND jstd.JobStatusDupID <> '6')";
    
    $query_get_result = "SELECT	Created, RequestTitle, Requestor, DeviceType, JobStatus, DueDate "
                        . "FROM	#RESULT "
                        . "GROUP BY Created, RequestTitle, Requestor, DeviceType, JobStatus, DueDate";

    $dbConn->query($query_create_table);
    $dbConn->query($query_insert_result);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);