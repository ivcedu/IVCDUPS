var print_request_id = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setActiveMenu();
        setAdminOption();
        getLoginInfo();
        
        getURLParameters();
        getPrintRequest();
        getTransactionHistory();
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function getURLParameters() {
    var searchStr = location.search;
    //var section = location.hash.substring(1,location.hash.length);
    var searchArray = new Array();
    while (searchStr!=='') 
    {
        var name, value;
        // strip off leading ? or &
        if ((searchStr.charAt(0)==='?')||(searchStr.charAt(0)==='&')) 
            searchStr = searchStr.substring(1,searchStr.length);
        // find name
        name = searchStr.substring(0,searchStr.indexOf('='));
        // find value
        if (searchStr.indexOf('&')!==-1) 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.indexOf('&'));
        else 
            value = searchStr.substring(searchStr.indexOf('=')+1,searchStr.length);
        // add pair to an associative array
        value = value.replace("%20", " ");
        searchArray[name] = value;
        // cut first pair from string
        if (searchStr.indexOf('&')!==-1) 
            searchStr =  searchStr.substring(searchStr.indexOf('&')+1,searchStr.length);
        else 
            searchStr = '';
    }
    
    print_request_id = searchArray['print_request_id'];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {  
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // icon close button click /////////////////////////////////////////////////
    $('#ico_btn_close').click(function() {
        var click_from = sessionStorage.getItem("ivcdups_print_click");
        if (click_from === "userHome.html") {
            window.open('userHome.html', '_self');
            return false;
        }
        else if (click_from === "rptMyHistory.html") {
            window.open('rptMyHistory.html', '_self');
            return false;
        }
        else if (click_from === "rptCompletedList.html") {
            window.open('rptCompletedList.html', '_self');
            return false;
        }
        else if (click_from === "rptBillingReport.html") {
            window.open('rptBillingReport.html', '_self');
            return false;
        }
        else if (click_from === "rptCopierReport.html") {
            window.open('rptCopierReport.html', '_self');
            return false;
        }
        else if (click_from === "rptDeliveryTimeExceeded.html") {
            window.open('rptDeliveryTimeExceeded.html', '_self');
            return false;
        }
    });
    
    // icon print button click /////////////////////////////////////////////////
    $('#ico_btn_print').click(function() {
        window.open('printingPR.html?print_request_id=' + print_request_id, '_blank');
        return false;
    });
    
    // nav menu administrator click ////////////////////////////////////////////
    $('#menu_administrator').click(function() {
        $("#nav_reports").removeClass("active");
        $("#nav_sub_reports").addClass("collapse");
        
        $("#menu_sub_administrator").removeClass("collapse");
        $("#menu_administrator").removeClass("collapse");
        $("#menu_administrator").addClass("active");
    });
    
    ////////////////////////////////////////////////////////////////////////////
    $('#attachment_file').click(function() {  
        var result = new Array();
        result = db_getAttachment(print_request_id);
        
        if (result.length === 1) {
            var url_pdf = "attach_files/" + result[0]['FileLinkName'];
            var login_from = sessionStorage.getItem("ls_dc_loginFrom");
            url_pdf = login_from.replace("IVCDUPS", "DCenter").replace("ivcdups", "DCenter").replace("Login.html", "") + url_pdf;
            window.open(url_pdf, '_blank');
            return false;
        }
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setActiveMenu() {
    var click_from = sessionStorage.getItem("ivcdups_print_click");
    if (click_from === "userHome.html") {
        $("#nav_my_home").addClass("active");
    }
    else if (click_from === "rptMyHistory.html") {
        $("#nav_sub_reports").removeClass("collapse");
        $("#nav_reports").addClass("active");
        $("#nav_my_history").addClass("active");
    }
    else if (click_from === "rptCompletedList.html") {
        $("#nav_sub_reports").removeClass("collapse");
        $("#nav_reports").addClass("active");
        $("#nav_completed_list").addClass("active");
    }
    else if (click_from === "rptCopierReport.html") {
        $("#nav_sub_reports").removeClass("collapse");
        $("#nav_reports").addClass("active");
        $("#nav_new_copier_report").addClass("active");
    }
    else if (click_from === "rptDeliveryTimeExceeded.html") {
        $("#nav_sub_reports").removeClass("collapse");
        $("#nav_reports").addClass("active");
        $("#nav_del_time_exceeded").addClass("active");
    }
}

function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPrintRequest() {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result.length === 1) {
        var device_type_id = result[0]['DeviceTypeID'];
        setRequestorInformation(device_type_id, result[0]['LoginType'], result[0]['LoginID'], result[0]['Requestor'], result[0]['Email'], result[0]['Phone'], result[0]['RequestTitle']);
        
        if (device_type_id === "1") {
            $('#prt_header_title').html("View Plotter Request");
            $('#attachment_section').show();
            setAttachment();
            $('#plotter_section').show();
            setPlotter(result[0]['DTStamp'], result[0]['Modified']);
        }
        else if (device_type_id === "2") {
            $('#prt_header_title').html("View Duplicating Request");
            $('#attachment_section').show();
            setAttachment();
            $('#duplicating_section').show();
            setDuplicating(result[0]['DTStamp'], result[0]['Modified']);
        }
        else {
            $('#prt_header_title').html("View Catalog Request");
            $('#catalog_section').show();
            setCatalog(result[0]['DTStamp'], result[0]['Modified']);
        }
    }
}

function setRequestorInformation(device_type_id, login_type, login_id, requestor, email, phone, request_title) {
    $('#requestor').html(requestor);
    $('#email').html(email);
    $('#phone').html(phone);
    
    if (login_type === "Staff") {
        $('#login_type').html("Employee ID:");
    }
    else {
        $('#login_type').html("Student ID:");
    }
    
    $('#login_id').html(login_id);
    $('#request_title').html(request_title);
    $('#device_type').html(db_getDeviceTypeName(device_type_id));
}

function setAttachment() {
    var result = new Array();
    result = db_getAttachment(print_request_id);
    
    if (result.length === 1) {        
        $('#attachment_file').html(result[0]['FileName']);
        $('#pdf_pages').html(result[0]['Pages']);
    }
}

function setPlotter(dtstamp, modified) {    
    var result = new Array();
    result = db_getPlotter(print_request_id);
    if (result.length === 1) {        
        $('#job_status').html(db_getJobStatusPlotName(result[0]['JobStatusPlotID']));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        $('#paper_type').html(db_getPaperTypeName(result[0]['PaperTypeID']));
        $('#size_height').html(result[0]['SizeHeight']);
        $('#plot_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
        if (result[0]['WavedProof'] === "1") {
            $("#ckb_waved_proof").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_waved_proof").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Free'] === "") {
            $('#honor_student').show();
        }
        
        $('#plot_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
    }
}

function setDuplicating(dtstamp, modified) {
    var result = new Array();
    result = db_getDuplicating(print_request_id);
    if (result.length === 1) {        
        $('#job_status').html(db_getJobStatusDupName(result[0]['JobStatusDupID']));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        if (result[0]['DepartmentID'] !== "0") {
            $('#billing_depart').html(db_getDepartmentName(result[0]['DepartmentID']));
        }
        else {
            $('#billing_depart').html(db_getCostCenterName(result[0]['CostCenterID']));
        }

        $('#quantity').html(result[0]['Quantity']);
        $('#date_needed').html(result[0]['DateNeeded']);
        $('#time_needed').html(result[0]['TimeNeeded']);
        $('#paper_size').html(db_getPaperSizeName(result[0]['PaperSizeID']));
        $('#duplex').html(db_getDuplexName(result[0]['DuplexID']));
        $('#paper_color').html(db_getPaperColorName(result[0]['PaperColorID']));
        $('#cover_color').html(db_getCoverColorName(result[0]['CoverColorID']));
        if (result[0]['ColorCopy'] === "1") {
            $("#ckb_color_copy").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_color_copy").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['FrontCover'] === "1") {
            $("#ckb_front_cover").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_front_cover").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['BackCover'] === "1") {
            $("#ckb_back_cover").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_back_cover").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Confidential'] === "1") {
            $("#ckb_confidential").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_confidential").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['ThreeHolePunch'] === "1") {
            $("#ckb_three_hole_punch").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_three_hole_punch").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Staple'] === "1") {
            $("#ckb_staple").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
            $("#ckb_staple").append("<i class='fa fa-square-o fa-lg'></i>");
        }
        if (result[0]['Cut'] === "1") {
            $("#ckb_cut").append("<i class='fa fa-check-square-o fa-lg'></i>");
        }
        else {
           $("#ckb_cut").append("<i class='fa fa-square-o fa-lg'></i>"); 
        }
        $('#dup_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
        
        $('#dup_total_print').html(result[0]['TotalPrint']);
        $('#dup_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
    }
}

function setCatalog(dtstamp, modified) {
    var result = new Array();
    result = db_getCatalogByPrintRequestID(print_request_id);
    if (result.length === 1) { 
        $('#job_status').html(db_getJobStatusDupName(result[0]['JobStatusDupID']));
        if (modified === null) {
            $('#modified').html(convertDBDateTimeToString(dtstamp));
        }
        else {
            $('#modified').html(convertDBDateTimeToString(modified));
        }
        
        var result2 = new Array();
        result2 = db_getCatSectionByID(result[0]['CatSectionID']);
        
        $('#cat_billing_depart').html(db_getCostCenterName(result[0]['CostCenterID']));
        $('#cat_fiscal_year').html(result2[0]['FiscalYear']);
        $('#cat_section_options').html(result2[0]['Options']);
        $('#cat_section_pages').html(result2[0]['Pages']);
        $('#cat_section_list').html(result2[0]['SectionName']);
        $('#cat_section_cost').html(formatDollar(Number(result2[0]['Cost']), 2));
        $('#cat_quantity').html(result[0]['Quantity']);
        $('#cat_date_needed').html(result[0]['DateNeeded']);
        $('#cat_time_needed').html(result[0]['TimeNeeded']);
        $('#cat_note').html(result[0]['Note'].replace(/\n/g, "<br>"));
        
        $('#cat_total_print').html(result[0]['TotalPrint']);
        $('#cat_total_cost').html(formatDollar(Number(result[0]['TotalCost']), 2));
    }
}

////////////////////////////////////////////////////////////////////////////////
function getTransactionHistory() {
    var result = new Array();
    result = db_getTransaction(print_request_id);
    
    var html = "";
    for (var i = 0; i < result.length; i++) {
        var dt_stamp = convertDBDateTimeToString(result[i]['DTStamp']);
        var login_name = result[i]['LoginName'];
        var note = result[i]['Note'];
        html += login_name + " : " + dt_stamp + "<br>" + note.replace(/\n/g, "<br>") + "<br><br>";
    }
    
    $("#transaction_history").append(html);
}