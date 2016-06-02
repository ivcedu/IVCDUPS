var m_total_pages = 0;
var m_total_cost = 0;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {        
        setAdminOption();
        setUserProfile();
        
        getLoginInfo();
        if (sessionStorage.getItem('ls_dc_pr_user_id') === null) {
            getDefaultStartEndDate(); 
            getBillingReportDepartment();
            initializeTable();
            
        }
        else {
            $('#start_date').val(sessionStorage.getItem('ls_dc_pr_start_date'));
            $('#end_date').val(sessionStorage.getItem('ls_dc_pr_end_date'));
            var depart_id = sessionStorage.getItem('ls_dc_pr_depart_id');
            var user_id = sessionStorage.getItem('ls_dc_pr_user_id');
            getBillingReportDepartment();
            $("#row_depart_id_" + depart_id).html("<i class='fa fa-minus'></i>");
            getBillingReportUsers(depart_id);
            $("#row_user_id_" + user_id + "_DID_" + depart_id).html("<i class='fa fa-minus'></i>");
            getBillingReportPrint(depart_id, user_id);
        }
}
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_billing_report").tablesorter({ });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // refresh button click ////////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        sessionStorage.removeItem('ls_dc_pr_start_date');
        sessionStorage.removeItem('ls_dc_pr_end_date');
        sessionStorage.removeItem('ls_dc_pr_depart_id');
        sessionStorage.removeItem('ls_dc_pr_user_id');
        getBillingReportDepartment();
        return false;
    });
    
    // excel button click //////////////////////////////////////////////////////
    $('#btn_excel').click(function() {
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        location.href = "php/csv_CopierBillingReport.php?StartDate=" + start_date + "&EndDate=" + end_date; 
        return false;
    });
    
    // table row depart + click ////////////////////////////////////////////////
    $('table').on('click', '[id^="row_depart_id_"]', function(e) {
        e.preventDefault();        
        var row_html = $(this).html();
        var first_child_row_id = $(this).attr('id');
        var depart_id = first_child_row_id.replace("row_depart_id_", "");
        if (row_html === "<i class=\"fa fa-plus\"></i>") {
            $(this).html("<i class='fa fa-minus'></i>");            
            getBillingReportUsers(depart_id);
        }
        else {
            $(this).html("<i class='fa fa-plus'></i>");            
            var result = new Array();
            result = db_getBillingReportUsers($('#start_date').val(), $('#end_date').val(), depart_id);
            for(var i = 0; i < result.length; i++) {
                var user_id = result[i]['LoginID'];
                $(".class_user_id_" + user_id).remove();
            }
            $(".class_depart_id_" + depart_id).remove();
            $("#tbl_billing_report").trigger("update");
        }
        return false;
    });
    
    // table row users + click /////////////////////////////////////////////////
    $('table').on('click', '[id^="row_user_id_"]', function(e) {
        e.preventDefault();        
        var row_html = $(this).html();
        var second_child_row_id = $(this).attr('id');
        var ar_str = second_child_row_id.split("_DID_");
        var user_id = ar_str[0].replace("row_user_id_", "");
        var depart_id = ar_str[1];
        
        if (row_html === "<i class=\"fa fa-plus\"></i>") {
            $(this).html("<i class='fa fa-minus'></i>");
            sessionStorage.setItem('ls_dc_pr_start_date', $('#start_date').val());
            sessionStorage.setItem('ls_dc_pr_end_date', $('#end_date').val());
            sessionStorage.setItem('ls_dc_pr_depart_id', depart_id);
            sessionStorage.setItem('ls_dc_pr_user_id', user_id);
            getBillingReportPrint(depart_id, user_id);
        }
        else {
            $(this).html("<i class='fa fa-plus'></i>");
            $(".class_user_id_" + user_id).remove();
            sessionStorage.removeItem('ls_dc_pr_start_date');
            sessionStorage.removeItem('ls_dc_pr_end_date');
            sessionStorage.removeItem('ls_dc_pr_depart_id');
            sessionStorage.removeItem('ls_dc_pr_user_id');
        }
        return false;
    });
    
    // table print request click ///////////////////////////////////////////////
    $('table').on('click', '[id^="row_print_request_id_"]', function(e) {
        e.preventDefault();
        var print_request_id = $(this).attr('id').replace("row_print_request_id_", "");
        var result = new Array();
        result = db_getPrintRequest(print_request_id);
        
        sessionStorage.setItem('ivcdups_print_click', "rptBillingReport.html");
        if (result[0]['DeviceTypeID'] === "1" || result[0]['DeviceTypeID'] === "2") {
            window.open('viewPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
        else {
            window.open('viewDropOff.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
    });
    
    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
            $('#nav_copier_report').show();
        }
    }
}

function setUserProfile() {
    if (sessionStorage.getItem('ls_dc_loginType') !== "Student") {
        $('#nav_my_profile').show();
    }
}

////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

function getDefaultStartEndDate() {
    $('#start_date').datepicker( "setDate", getCurrentFirstDayOfMonth() );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////
function getBillingReportDepartment() {
    m_total_pages = 0;
    m_total_cost = 0;
    
    var result = new Array(); 
    result = db_getBillingReportDepartment($('#start_date').val(), $('#end_date').val());
    
    $("#tbl_body").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        var tmp = result[i];
        m_total_pages += Number(result[i]['TotalPages']);
        m_total_cost += Number(result[i]['TotalCost']);
        body_html += setBillingReportDepartmentHTML(result[i]['DepartmentID'], result[i]['Department'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#tbl_body").append(body_html);
    $("#tbl_billing_report").trigger("update");
    
    $('#total_pages').html(m_total_pages);
    $('#total_cost').html(formatDollar(m_total_cost, 2));
}

function setBillingReportDepartmentHTML(department_id, department, total_pages, total_cost) { 
    var tbl_html = "<tr id='first_child_depart_id_" + department_id + "'>";
    tbl_html += "<td class='col-md-1' style='text-align: center'><a href=# id='row_depart_id_" + department_id + "'><i class='fa fa-plus'></i></a></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-5'>" + department + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";    
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getBillingReportUsers(depart_id) {
    var result = new Array();
    result = db_getBillingReportUsers($('#start_date').val(), $('#end_date').val(), depart_id);
    
    $(".class_depart_id_" + depart_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setBillingReportUsersHTML(depart_id, result[i]['LoginID'], result[i]['Requestor'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#first_child_depart_id_" + depart_id).after(body_html);
    
    $("#tbl_billing_report").trigger("update");
}

function setBillingReportUsersHTML(depart_id, login_id, requestor, total_pages, total_cost) {
    var tbl_html = "<tr class='class_depart_id_" + depart_id + "' id='second_child_user_id_" + login_id + "'>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: center'><a href=# id='row_user_id_" + login_id + "_DID_" + depart_id + "'><i class='fa fa-plus'></i></a></td>";
    tbl_html += "<td class='col-md-5' style='font-style: italic;'>" + requestor + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getBillingReportPrint(depart_id, user_id) {
    var result = new Array();
    result = db_getBillingReportPrint($('#start_date').val(), $('#end_date').val(), depart_id, user_id);
    
    $(".class_user_id_" + user_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setBillingReportPrintHTML(user_id, result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['Created'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#second_child_user_id_" + user_id).after(body_html);
    $("#tbl_billing_report").trigger("update");
}

function setBillingReportPrintHTML(user_id, print_request_id, request_title, modified, total_pages, total_cost) {
    var tbl_html = "<tr class='class_user_id_" + user_id + "'>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-5' style='font-style: italic;'><a href=# id='row_print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'>" + modified + "</td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}