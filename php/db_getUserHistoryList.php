<?php
    require("config.php");
    
    $Email = filter_input(INPUT_POST, 'Email');
    $StartDate = filter_input(INPUT_POST, 'StartDate');
    $EndDate = filter_input(INPUT_POST, 'EndDate');
    
    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #RESULT (Created nvarchar(255), Completed nvarchar(255), RequestTitle nvarchar(255), DeviceType nvarchar(255), JobStatus nvarchar(255), TotalCost money)";
    $query_drop_table = "DROP TABLE #RESULT";
    
    $query_insert_result = "INSERT INTO #RESULT SELECT CONVERT(VARCHAR(10), prrq.DTStamp, 101) AS Created, "
                        . "CONVERT(VARCHAR(10), prrq.Modified, 101) AS Completed, "
                        . "'<a href=# id=''print_request_id_' + CONVERT(NVARCHAR(255), prrq.PrintRequestID) + '''>' + prrq.RequestTitle + '</a>' AS RequestTitle, "
                        . "dvtp.DeviceType, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN jstp.JobStatusPlot "
                        . "WHEN prrq.DeviceTypeID = 2 THEN jstd.JobStatusDup "
                        . "WHEN prrq.DeviceTypeID = 4 THEN jstc.JobStatusDup "
                        . "ELSE drjd.JobStatusDup END AS JobStatus, "
                        . "CASE WHEN prrq.DeviceTypeID = 1 THEN pltt.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 2 THEN dupl.TotalCost "
                        . "WHEN prrq.DeviceTypeID = 4 THEN ctlg.TotalCost "
                        . "ELSE dojb.TotalCost END AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq LEFT JOIN [".$dbDatabase."].[dbo].[DeviceType] AS dvtp ON prrq.DeviceTypeID = dvtp.DeviceTypeID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Plotter] AS pltt ON prrq.PrintRequestID = pltt.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusPlot] AS jstp ON pltt.JobStatusPlotID = jstp.JobStatusPlotID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstc ON ctlg.JobStatusDupID = jstc.JobStatusDupID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS dojb ON prrq.PrintRequestID = dojb.PrintRequestID "
                        . "LEFT JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS drjd ON dojb.JobStatusDupID = drjd.JobStatusDupID "
                        . "WHERE (jstp.JobStatusPlotID = '8' OR jstp.JobStatusPlotID = '9' "
                        . "OR jstd.JobStatusDupID = '5' OR jstd.JobStatusDupID = '6' "
                        . "OR jstc.JobStatusDupID = '5' OR jstc.JobStatusDupID = '6' "
                        . "OR dojb.JobStatusDupID = '5' OR dojb.JobStatusDupID = '6') "
                        . "AND prrq.Email = '".$Email."' AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_get_result = "SELECT	Created, Completed, RequestTitle, DeviceType, JobStatus, "
                        . "'$' + convert(varchar, SUM(TotalCost), 1) AS TotalCost "
                        . "FROM	#RESULT "
                        . "GROUP BY Created, Completed, RequestTitle, DeviceType, JobStatus";
    
    $dbConn->query($query_create_table);
    $dbConn->query($query_insert_result);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);

    echo json_encode($data);