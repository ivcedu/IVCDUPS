// LDAP get ////////////////////////////////////////////////////////////////////
function getLoginUserInfo(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function getLDAPUserCostCenter(php_file, user, pass) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:php_file,
        data:{username:user, password:pass},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

// get DB //////////////////////////////////////////////////////////////////////
function db_getDeliveryLocation() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDeliveryLocation.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeliveryLocationName(DeliveryLocationID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDeliveryLocationName.php",
        data:{DeliveryLocationID:DeliveryLocationID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeviceType() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDeviceType.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeviceTypeName(DeviceTypeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDeviceTypeName.php",
        data:{DeviceTypeID:DeviceTypeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusPlot() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusPlot.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusPlotName(JobStatusPlotID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusPlotName.php",
        data:{JobStatusPlotID:JobStatusPlotID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusDup() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusDup.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getJobStatusDupName(JobStatusDupID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getJobStatusDupName.php",
        data:{JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperType() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperType.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperTypeName(PaperTypeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperTypeName.php",
        data:{PaperTypeID:PaperTypeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplex() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDuplex.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplexName(DuplexID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDuplexName.php",
        data:{DuplexID:DuplexID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperColor() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperColor.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperColorName(PaperColorID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperColorName.php",
        data:{PaperColorID:PaperColorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCoverColor() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCoverColor.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCoverColorName(CoverColorID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getCoverColorName.php",
        data:{CoverColorID:CoverColorID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBindingName(BindingID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getBindingName.php",
        data:{BindingID:BindingID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartment() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDepartment.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartmentID(Department) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDepartmentID.php",
        data:{Department:Department},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDepartmentName(DepartmentID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDepartmentName.php",
        data:{DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperSize() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPaperSize.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPaperSizeName(PaperSizeID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getPaperSizeName.php",
        data:{PaperSizeID:PaperSizeID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByEmail(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByEmail.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminByID(AdminID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminByID.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserPrintRequestList(Email) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserPrintRequestList.php",
        data:{Email:Email},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserHistoryList(Email, StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserHistoryList.php",
        data:{Email:Email, StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminPrintRequestList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminPrintRequestList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminCompletedList(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminCompletedList.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPrintRequest(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPrintRequest.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAttachment(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAttachment.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getPlotter(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getPlotter.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplicating(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDuplicating.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDropOffJob(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDropOffJob.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getTransaction(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getTransaction.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserProfile(LoginEmail) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserProfile.php",
        data:{LoginEmail:LoginEmail},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getReceipt(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getReceipt.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportDepartment(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportDepartment.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportUsers(StartDate, EndDate, DepartmentID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportUsers.php",
        data:{StartDate:StartDate, EndDate:EndDate, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBillingReportPrint(StartDate, EndDate, DepartmentID, LoginID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBillingReportPrint.php",
        data:{StartDate:StartDate, EndDate:EndDate, DepartmentID:DepartmentID, LoginID:LoginID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCopierPrice() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCopierPrice.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserDepart() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getUserDepart.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserDepartID(Department) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getUserDepartID.php",
        data:{Department:Department},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getUserDepartName(DepartmentID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getUserDepartName.php",
        data:{DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDeliveryTimeExceeded(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getDeliveryTimeExceeded.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDivisionID(Division) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDivisionID.php",
        data:{Division:Division},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDivisionIDByCostCenterID(CostCenterID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDivisionIDByCostCenterID.php",
        data:{CostCenterID:CostCenterID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCostCenterID(CostCenterCode) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getCostCenterID.php",
        data:{CostCenterCode:CostCenterCode},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCostCenterName(CostCenterID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getCostCenterName.php",
        data:{CostCenterID:CostCenterID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCopierReportDivision(StartDate, EndDate) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCopierReportDivision.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCopierReportCostCenter(StartDate, EndDate, DivisionID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCopierReportCostCenter.php",
        data:{StartDate:StartDate, EndDate:EndDate, DivisionID:DivisionID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCopierReportUsers(StartDate, EndDate, CostCenterID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCopierReportUsers.php",
        data:{StartDate:StartDate, EndDate:EndDate, CostCenterID:CostCenterID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCopierReportPrint(StartDate, EndDate, CostCenterID, LoginID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCopierReportPrint.php",
        data:{StartDate:StartDate, EndDate:EndDate, CostCenterID:CostCenterID, LoginID:LoginID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplicatingCostCenterID(PrintRequestID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDuplicatingCostCenterID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCatalogCostCenterID(PrintRequestID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getCatalogCostCenterID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDropOffJobCostCenterID(PrintRequestID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDropOffJobCostCenterID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDuplicatingDepartID(PrintRequestID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDuplicatingDepartID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getDropOffJobDepartID(PrintRequestID) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_getDropOffJobDepartID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getAdminLockedPRList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getAdminLockedPRList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCatSectionByID(CatSectionID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCatSectionByID.php",
        data:{CatSectionID:CatSectionID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCatSectionList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCatSectionList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCatSectionListDataTable() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCatSectionListDataTable.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getCatalogByPrintRequestID(PrintRequestID) {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getCatalogByPrintRequestID.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function db_getBindingList() {
    var result = new Array();
    $.ajax({
        type:"POST",
        url:"php/db_getBindingList.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

// insert DB ///////////////////////////////////////////////////////////////////
function db_insertPrintRequest(DeviceTypeID, DeliveryLocationID, LoginType, LoginID, Requestor, Email, Phone, RequestTitle) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertPrintRequest.php",
        data:{DeviceTypeID:DeviceTypeID, DeliveryLocationID:DeliveryLocationID, LoginType:LoginType, LoginID:LoginID, Requestor:Requestor, Email:Email, Phone:Phone, RequestTitle:RequestTitle},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertPlotter(PrintRequestID, JobStatusPlotID, PaperTypeID, SizeHeight, SizeWidth, TotalCost, WavedProof, Free, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertPlotter.php",
        data:{PrintRequestID:PrintRequestID, JobStatusPlotID:JobStatusPlotID, PaperTypeID:PaperTypeID, SizeHeight:SizeHeight, SizeWidth:SizeWidth, TotalCost:TotalCost, WavedProof:WavedProof, Free:Free, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertDuplicating(PrintRequestID, JobStatusDupID, CostCenterID, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID, ColorCopy, FrontCover, 
                                BackCover, Confidential, ThreeHolePunch, Staple, Cut, BindingID, Booklet, FirstPgColorPrint, LastPgColorPrint, TotalPrint, TotalCost, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertDuplicating.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID, CostCenterID:CostCenterID, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, BindingID:BindingID, Booklet:Booklet, 
                FirstPgColorPrint:FirstPgColorPrint, LastPgColorPrint:LastPgColorPrint, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertDropOffJob(PrintRequestID, JobStatusDupID, CostCenterID, JobName, Pages, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID,
                            ColorCopy, FrontCover, BackCover, Confidential, ThreeHolePunch, Staple, Cut, BindingID, Booklet, FirstPgColorPrint, LastPgColorPrint, TotalPrint, TotalCost, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertDropOffJob.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID, CostCenterID:CostCenterID, JobName:JobName, Pages:Pages, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, 
                BindingID:BindingID, Booklet:Booklet, FirstPgColorPrint:FirstPgColorPrint, LastPgColorPrint:LastPgColorPrint, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertTransaction(PrintRequestID, LoginName, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertTransaction.php",
        data:{PrintRequestID:PrintRequestID, LoginName:LoginName, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertUserProfile(UserName, UserEmail, UserPhone, EmployeeID, DepartmentID) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertUserProfile.php",
        data:{UserName:UserName, UserEmail:UserEmail, UserPhone:UserPhone, EmployeeID:EmployeeID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAttachment(PrintRequestID, FileName, Pages, PDFData) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAttachment.php",
        data:{PrintRequestID:PrintRequestID, FileName:FileName, Pages:Pages, PDFData:PDFData},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertReceipt(PrintRequestID, ReceiptDetail) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertReceipt.php",
        data:{PrintRequestID:PrintRequestID, ReceiptDetail:ReceiptDetail},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertAdmin(AdminName, AdminEmail, AdminLevel) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertAdmin.php",
        data:{AdminName:AdminName, AdminEmail:AdminEmail, AdminLevel:AdminLevel},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertDivision(CostCenterCode, Division) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertDivision.php",
        data:{CostCenterCode:CostCenterCode, Division:Division},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertCostCenter(DivisionID, CostCenterCode, CostCenter) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertCostCenter.php",
        data:{DivisionID:DivisionID, CostCenterCode:CostCenterCode, CostCenter:CostCenter},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertCatSection(Active, FiscalYear, SectionName, Pages, Cost, Options) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertCatSection.php",
        data:{Active:Active, FiscalYear:FiscalYear, SectionName:SectionName, Pages:Pages, Cost:Cost, Options:Options},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

function db_insertCatalog(PrintRequestID, CatSectionID, JobStatusDupID, CostCenterID, Quantity, DateNeeded, TimeNeeded, TotalPrint, TotalCost, Note) {
    var ResultID = "";
    $.ajax({
        type:"POST",
        url:"php/db_insertCatalog.php",
        data:{PrintRequestID:PrintRequestID, CatSectionID:CatSectionID, JobStatusDupID:JobStatusDupID, CostCenterID:CostCenterID, Quantity:Quantity, 
                DateNeeded:DateNeeded, TimeNeeded:TimeNeeded, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            ResultID = JSON.parse(data);
        }
    });
    return ResultID;
}

// update DB ///////////////////////////////////////////////////////////////////
function db_updatePrintRequestDevice(PrintRequestID, DeviceTypeID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestDevice.php",
        data:{PrintRequestID:PrintRequestID, DeviceTypeID:DeviceTypeID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestDelivery(PrintRequestID, DeliveryLocationID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestDelivery.php",
        data:{PrintRequestID:PrintRequestID, DeliveryLocationID:DeliveryLocationID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestModified(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestModified.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePlotter(PrintRequestID, JobStatusPlotID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePlotter.php",
        data:{PrintRequestID:PrintRequestID, JobStatusPlotID:JobStatusPlotID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDuplicating(PrintRequestID, JobStatusDupID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDuplicating.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDropOffJob(PrintRequestID, JobStatusDupID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDropOffJob.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDepartment(PrintRequestID, DepartmentID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDepartment.php",
        data:{PrintRequestID:PrintRequestID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDropOffJobBillingDepart(PrintRequestID, DepartmentID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDropOffJobBillingDepart.php",
        data:{PrintRequestID:PrintRequestID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAttachment(PrintRequestID, FileName, Pages, PDFData) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAttachment.php",
        data:{PrintRequestID:PrintRequestID, FileName:FileName, Pages:Pages, PDFData:PDFData},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAttachmentPages(AttachmentID, Pages) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAttachmentPages.php",
        data:{AttachmentID:AttachmentID, Pages:Pages},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateUserProfile(UserProfileID, UserName, UserEmail, UserPhone, EmployeeID, DepartmentID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateUserProfile.php",
        data:{UserProfileID:UserProfileID, UserName:UserName, UserEmail:UserEmail, UserPhone:UserPhone, EmployeeID:EmployeeID, DepartmentID:DepartmentID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDuplicatingRequest(PrintRequestID, CostCenterID, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID, ColorCopy, FrontCover, BackCover,
                                    Confidential, ThreeHolePunch, Staple, Cut, BindingID, Booklet, FirstPgColorPrint, LastPgColorPrint, TotalPrint, TotalCost, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDuplicatingRequest.php",
        data:{PrintRequestID:PrintRequestID, CostCenterID:CostCenterID, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, 
                BindingID:BindingID, Booklet:Booklet, FirstPgColorPrint:FirstPgColorPrint, LastPgColorPrint:LastPgColorPrint, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateDropOffJobRequest(PrintRequestID, DepartmentID, JobName, Pages, Quantity, DateNeeded, TimeNeeded, PaperSizeID, DuplexID, PaperColorID, CoverColorID, ColorCopy, FrontCover, BackCover, Confidential,
                                    ThreeHolePunch, Staple, Cut, BindingID, Booklet, FirstPgColorPrint, LastPgColorPrint, TotalPrint, TotalCost, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateDropOffJobRequest.php",
        data:{PrintRequestID:PrintRequestID, DepartmentID:DepartmentID, JobName:JobName, Pages:Pages, Quantity:Quantity, DateNeeded:DateNeeded, TimeNeeded:TimeNeeded,
                PaperSizeID:PaperSizeID, DuplexID:DuplexID, PaperColorID:PaperColorID, CoverColorID:CoverColorID, ColorCopy:ColorCopy, FrontCover:FrontCover, 
                BackCover:BackCover, Confidential:Confidential, ThreeHolePunch:ThreeHolePunch, Staple:Staple, Cut:Cut, 
                BindingID:BindingID, Booklet:Booklet, FirstPgColorPrint:FirstPgColorPrint, LastPgColorPrint:LastPgColorPrint, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePlotterRequest(PrintRequestID, PaperTypeID, SizeHeight, SizeWidth, TotalCost, WavedProof, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePlotterRequest.php",
        data:{PrintRequestID:PrintRequestID, PaperTypeID:PaperTypeID, SizeHeight:SizeHeight, SizeWidth:SizeWidth, TotalCost:TotalCost, WavedProof:WavedProof, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updatePrintRequestLocked(PrintRequestID, Locked) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updatePrintRequestLocked.php",
        data:{PrintRequestID:PrintRequestID, Locked:Locked},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateReceipt(PrintRequestID, ReceiptDetail) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateReceipt.php",
        data:{PrintRequestID:PrintRequestID, ReceiptDetail:ReceiptDetail},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateAdmin(AdminID, AdminName, AdminEmail, AdminLevel) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateAdmin.php",
        data:{AdminID:AdminID, AdminName:AdminName, AdminEmail:AdminEmail, AdminLevel:AdminLevel},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateCopierPrice(CopierPriceID, s_letter, d_letter, s_letter_color, d_letter_color,
                                s_legal, d_legal, s_legal_color, d_legal_color,
                                s_tabloid, d_tabloid, s_tabloid_color, d_tabloid_color,
                                s_letter_80, d_letter_80, s_letter_color_80, d_letter_color_80,
                                front_cover, front_cover_color, back_cover, back_cover_color, cut,
                                coil_binding, comb_binding, booklet) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateCopierPrice.php",
        data:{CopierPriceID:CopierPriceID, s_letter:s_letter, d_letter:d_letter, s_letter_color:s_letter_color, d_letter_color:d_letter_color,
                s_legal:s_legal, d_legal:d_legal, s_legal_color:s_legal_color, d_legal_color:d_legal_color,
                s_tabloid:s_tabloid, d_tabloid:d_tabloid, s_tabloid_color:s_tabloid_color, d_tabloid_color:d_tabloid_color,
                s_letter_80:s_letter_80, d_letter_80:d_letter_80, s_letter_color_80:s_letter_color_80, d_letter_color_80:d_letter_color_80,
                front_cover:front_cover, front_cover_color:front_cover_color, back_cover:back_cover, back_cover_color:back_cover_color, cut:cut,
                coil_binding:coil_binding, comb_binding:comb_binding, booklet:booklet},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateCatSectionByID(CatSectionID, Active, FiscalYear, SectionName, Pages, Cost, Options) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateCatSectionByID.php",
        data:{CatSectionID:CatSectionID, Active:Active, FiscalYear:FiscalYear, SectionName:SectionName, Pages:Pages, Cost:Cost, Options:Options},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateCatalogStatus(PrintRequestID, JobStatusDupID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateCatalogStatus.php",
        data:{PrintRequestID:PrintRequestID, JobStatusDupID:JobStatusDupID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_updateCatalogRequest(PrintRequestID, CatSectionID, CostCenterID, Quantity, DateNeeded, TimeNeeded, TotalPrint, TotalCost, Note) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_updateCatalogRequest.php",
        data:{PrintRequestID:PrintRequestID, CatSectionID:CatSectionID, CostCenterID:CostCenterID, Quantity:Quantity, 
                DateNeeded:DateNeeded, TimeNeeded:TimeNeeded, TotalPrint:TotalPrint, TotalCost:TotalCost, Note:Note},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

// delete DB ///////////////////////////////////////////////////////////////////
function db_deleteAttachment(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteAttachment.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deleteDuplicating(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteDuplicating.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deletePlotter(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deletePlotter.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deletePrintRequest(PrintRequestID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deletePrintRequest.php",
        data:{PrintRequestID:PrintRequestID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

function db_deleteAdmin(AdminID) {
    var Result = false;
    $.ajax({
        type:"POST",
        url:"php/db_deleteAdmin.php",
        data:{AdminID:AdminID},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}

// upload attach file //////////////////////////////////////////////////////////
function uploadAttachFile(file_data) {
    var Result = "";
    $.ajax({  
        url: "php/upload_attach_file.php",  
        type: "POST",  
        data: file_data,
        processData: false,  
        contentType: false,  
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function deleteAttachFile(FileLinkName) {
    var Result = false;
    $.ajax({  
        url: "php/delete_attach_file.php",  
        type: "POST",
        data:{FileLinkName:FileLinkName},
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

function pdfGetTotalPages(file_data) {
    var Result = "";
    $.ajax({  
        url: "php/pdf_getTotalPages.php",  
        type: "POST",  
        data: file_data,
        processData: false,  
        contentType: false,  
        async: false,
        success:function(data) {
            Result = JSON.parse(data);
        }  
    });
    return Result;
}

// report DB ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRptDashboardMain(StartDate, EndDate) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_rptDashboardMain.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function getRptDivisionTotalPagesCost(StartDate, EndDate, SortOption) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_rptDivisionTotalPagesCost.php",
        data:{StartDate:StartDate, EndDate:EndDate, SortOption:SortOption},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function getRptBlackWhiteColor(StartDate, EndDate) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_rptBlackWhiteColor.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

function getRptDuplicatingDropOff(StartDate, EndDate) {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/db_rptDuplicatingDropOff.php",
        data:{StartDate:StartDate, EndDate:EndDate},
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function getClientComputerName() {
    var result = "";
    $.ajax({
        type:"POST",
        url:"php/client_computerName.php",
        async: false,  
        success:function(data) {
            result = JSON.parse(data);
        }
    });
    return result;
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function ireportDBgetUserAccess(Username) {   
    var Result = "";
    $.ajax({
        type:"POST",
        url:"php/ireport_db_getUserAccess.php",
        data:{Username:Username},
        async: false,  
        success:function(data) {
            Result = JSON.parse(data);
        }
    });
    return Result;
}