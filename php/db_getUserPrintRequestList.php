<?php
    require("config.php");

    $Email = filter_input(INPUT_POST, 'Email');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #RESULT (Created nvarchar(255), RequestTitle nvarchar(255), DeviceType nvarchar(255), JobStatus nvarchar(255), TotalCost money, EditButton nvarchar(255))";
    $query_drop_table = "DROP TABLE #RESULT";
    
    $query_insert_result = "INSERT INTO #RESULT SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
                        . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
                        . "dvtp.DeviceType, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN jstp.JobStatusPlot "
                        . "WHEN prrq.DeviceTypeID = 2 THEN jstd.JobStatusDup "
                        . "ELSE drjd.JobStatusDup END AS JobStatus, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN pltt.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 2 THEN dupl.TotalCost "
                        . "ELSE dojb.TotalCost END AS TotalCost, "
                        . "CASE WHEN (prrq.DeviceTypeID = 1 AND (pltt.JobStatusPlotID = 1 OR pltt.JobStatusPlotID = 2)) OR (prrq.DeviceTypeID = 2 AND dupl.JobStatusDupID = 1) "
                        . "THEN '<a href=# id=''edit_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''><i class=''iconic iconic-sm iconic-pencil''></i></a>' "
                        . "ELSE '' END AS EditButton "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq LEFT JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS dojb ON prrq.PrintRequestID = dojb.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS drjd ON dojb.JobStatusDupID = drjd.JobStatusDupID "
                        . "WHERE ((jstp.JobStatusPlotID <> '8' AND jstp.JobStatusPlotID <> '9') "
                        . "OR (jstd.JobStatusDupID <> '5' AND jstd.JobStatusDupID <> '6') "
                        . "OR (dojb.JobStatusDupID <> '5' AND dojb.JobStatusDupID <> '6')) "
                        . "AND prrq.Email = '" . $Email . "'";
    
    $query_get_result = "SELECT	Created, RequestTitle, DeviceType, JobStatus, "
                        . "'$' + convert(varchar, SUM(TotalCost), 1) AS TotalCost, EditButton "
                        . "FROM	#RESULT "
                        . "GROUP BY Created, RequestTitle, DeviceType, JobStatus, EditButton";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_insert_result);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);