<?php
    require("config.php");

    $StartDate = filter_input(INPUT_GET, 'StartDate');
    $EndDate = filter_input(INPUT_GET, 'EndDate');

    $dbConn->setAttribute(constant('PDO::SQLSRV_ATTR_DIRECT_QUERY'), true);
    
    $query_create_table = "CREATE TABLE #EXCELBILLING (PrintRequestID int, BillingDepart nvarchar(255), UserName nvarchar(255), RequestTitle nvarchar(255), Created nvarchar(255), TotalPages int, TotalCost money)";
    $query_drop_table = "DROP TABLE #EXCELBILLING";
    
    $query_duplicating = "INSERT INTO #EXCELBILLING "
                        . "SELECT prrq.PrintRequestID, "
                        . "dprt.Department, "
                        . "prrq.Requestor, "
                        . "prrq.RequestTitle, "
                        . "CONVERT(VARCHAR(10), prrq.DTStamp, 101), "
                        . "dupl.TotalPrint AS TotalPages, "
                        . "dupl.TotalCost AS TotalCost "
                        . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[Duplicating] AS dupl ON prrq.PrintRequestID = dupl.PrintRequestID "
                        . "INNER JOIN [IVCDCENTER].[dbo].[Department] AS dprt ON dupl.DepartmentID = dprt.DepartmentID "
                        . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON dupl.JobStatusDupID = jstd.JobStatusDupID "
                        . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                        . "AND CONVERT(VARCHAR(10), prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."'";
    
    $query_dropoff = "INSERT INTO #EXCELBILLING "
                    . "SELECT prrq.PrintRequestID, "
                    . "dprt.Department, "
                    . "prrq.Requestor, "
                    . "prrq.RequestTitle, "
                    . "CONVERT(VARCHAR(10), prrq.DTStamp, 101), "
                    . "SUM(droj.TotalPrint) AS TotalPages, "
                    . "SUM(droj.TotalCost) AS TotalCost "
                    . "FROM [IVCDCENTER].[dbo].[PrintRequest] AS prrq INNER JOIN [IVCDCENTER].[dbo].[DropOffJob] AS droj ON prrq.PrintRequestID = droj.PrintRequestID "
                    . "INNER JOIN [IVCDCENTER].[dbo].[Department] AS dprt ON droj.DepartmentID = dprt.DepartmentID "
                    . "INNER JOIN [IVCDCENTER].[dbo].[JobStatusDup] AS jstd ON droj.JobStatusDupID = jstd.JobStatusDupID "
                    . "WHERE prrq.LoginType = 'Staff' AND jstd.JobStatusDupID = '5' "
                    . "AND CONVERT(VARCHAR(10), prrq.DTStamp, 101) BETWEEN '".$StartDate."' AND '".$EndDate."' "
                    . "GROUP BY prrq.PrintRequestID, dprt.Department, prrq.Requestor, prrq.RequestTitle, CONVERT(VARCHAR(10), prrq.DTStamp, 101)";
    
    $query_get_result = "SELECT BillingDepart, UserName, RequestTitle, Created, SUM(TotalPages) AS TotalPages, SUM(TotalCost) AS TotalCost "
                        . "FROM #EXCELBILLING GROUP BY BillingDepart, UserName, RequestTitle, Created "
                        . "ORDER BY BillingDepart ASC";

    $dbConn->query($query_create_table);
    $dbConn->query($query_duplicating);
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
    fputcsv($out, array('BillingDepart','UserName','RequestTitle', 'Created', 'TotalPages', 'TotalCost'));
    // Write all the records to the spreadsheet
    foreach($data as $row) {
        fputcsv($out, array($row['BillingDepart'], $row['UserName'], $row['RequestTitle'], $row['Created'], $row['TotalPages'], $row['TotalCost']));
    }
    
    fclose($out);
    exit;