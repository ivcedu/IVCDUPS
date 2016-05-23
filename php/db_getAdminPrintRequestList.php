<?php
    require("config.php");
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #RESULT (Created nvarchar(255), RequestTitle nvarchar(255), Requestor nvarchar(255), DeviceType nvarchar(255), JobStatus nvarchar(255), TotalCost money)";
    $query_drop_table = "DROP TABLE #RESULT";
    
    $query_insert_result = "INSERT INTO #RESULT SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
                        . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
                        . "prrq.Requestor, "
                        . "dvtp.DeviceType, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN jstp.JobStatusPlot "
                        . "WHEN prrq.DeviceTypeID = 2 THEN jstd.JobStatusDup "
                        . "ELSE drjd.JobStatusDup END AS JobStatus, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN pltt.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 2 THEN dupl.TotalCost "
                        . "ELSE dojb.TotalCost END AS TotalCost "
                        . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq LEFT JOIN [IVCDCENTER].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[DropOffJob] AS dojb ON prrq.PrintRequestID = dojb.PrintRequestID "
                        . "LEFT JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS drjd ON dojb.JobStatusDupID = drjd.JobStatusDupID "
                        . "WHERE (jstp.JobStatusPlotID <> '8' AND jstp.JobStatusPlotID <> '9') "
                        . "OR (jstd.JobStatusDupID <> '5' AND jstd.JobStatusDupID <> '6') "
                        . "OR (drjd.JobStatusDupID <> '5' AND drjd.JobStatusDupID <> '6')";
    
    $query_get_result = "SELECT	Created, RequestTitle, Requestor, DeviceType, JobStatus, "
                        . "'$' + convert(varchar, SUM(TotalCost), 1) AS TotalCost "
                        . "FROM	#RESULT "
                        . "GROUP BY Created, RequestTitle, Requestor, DeviceType, JobStatus";

    $dbConn->query($query_create_table);
    $dbConn->query($query_insert_result);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);