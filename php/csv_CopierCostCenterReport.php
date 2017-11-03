<?php
    require("config.php");

    $StartDate = filter_input(INPUT_GET, 'StartDate');
    $EndDate = filter_input(INPUT_GET, 'EndDate');

    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #EXCELCOPIER (PrintRequestID int, Division nvarchar(255), CostCenter nvarchar(255), UserName nvarchar(255), RequestTitle nvarchar(255), Created nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #EXCELCOPIER";
    
    $query_duplicating = "INSERT INTO #EXCELCOPIER "
                        . "SELECT prrq.PrintRequestID, "
                        . "dvsn.Division, "
                        . "csct.CostCenterCode + '-' + csct.CostCenter, "
                        . "prrq.Requestor, "
                        . "prrq.RequestTitle, "
                        . "CONVERT(VARCHAR(10), prrq.DTStamp, 101), "
                        . "dupl.TotalPrint AS TotalPages, "
                        . "dupl.TotalCost AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON dupl.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_catalog = "INSERT INTO #EXCELCOPIER "
                        . "SELECT prrq.PrintRequestID, "
                        . "dvsn.Division, "
                        . "csct.CostCenterCode + '-' + csct.CostCenter, "
                        . "prrq.Requestor, "
                        . "prrq.RequestTitle, "
                        . "CONVERT(VARCHAR(10), prrq.DTStamp, 101), "
                        . "ctlg.TotalPrint AS TotalPages, "
                        . "ctlg.TotalCost AS TotalCost "
                        . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[Catalog] AS ctlg ON prrq.PrintRequestID = ctlg.PrintRequestID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON ctlg.CostCenterID = csct.CostCenterID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                        . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON ctlg.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_dropoff = "INSERT INTO #EXCELCOPIER "
                    . "SELECT prrq.PrintRequestID, "
                    . "dvsn.Division, "
                    . "csct.CostCenterCode + '-' + csct.CostCenter, "
                    . "prrq.Requestor, "
                    . "prrq.RequestTitle, "
                    . "CONVERT(VARCHAR(10), prrq.DTStamp, 101), "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [".$dbDatabase."].[dbo].[PrintRequest] AS prrq INNER JOIN [".$dbDatabase."].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[CostCenter] AS csct ON droj.CostCenterID = csct.CostCenterID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[Division] AS dvsn ON csct.DivisionID = dvsn.DivisionID "
                    . "INNER JOIN [".$dbDatabase."].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND TRY_CONVERT(DATE, prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "GROUP BY prrq.PrintRequestID, dvsn.Division, csct.CostCenterCode + '-' + csct.CostCenter, prrq.Requestor, prrq.RequestTitle, CONVERT(VARCHAR(10), prrq.DTStamp, 101)";
    
    $query_get_result = "SELECT * "
                        . "FROM #EXCELCOPIER "
                        . "ORDER BY Division, CostCenter, UserName, Created ASC";

    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
    $dbConn->query($query_catalog);
    $dbConn->query($query_dropoff);

    $cmd = $dbConn->prepare($query_get_result);
    $cmd->execute(); 
    $data = $cmd->fetchAll();
    
    $dbConn->query($query_drop_table);
    
    $filename = "export_copier_billing_report.csv";  
    header("Content-Disposition: attachment; filename=\"$filename\"");
    header("Content-Type: text/csv;");
    $out = fopen("php://output", 'w+');

    // Write the spreadsheet column titles / labels
    fputcsv($out, array('PrintRequestID', 'Division', 'CostCenter', 'UserName', 'RequestTitle', 'Created', 'TotalPages', 'TotalCost'));
    // Write all the records to the spreadsheet
    foreach($data as $row) {
        fputcsv($out, array($row['PrintRequestID'], $row['Division'], $row['CostCenter'], $row['UserName'], $row['RequestTitle'], $row['Created'], $row['TotalPages'], $row['TotalCost']));
    }
    
    fclose($out);
    exit;