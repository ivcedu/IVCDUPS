var m_total_pages = 0;
var m_total_cost = 0;

var m_division_id = "";
var m_cost_center_id = "";
var m_user_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        deleteReportBillingItems();
        setAdminOption();
        
        getLoginInfo();
        if (sessionStorage.getItem('ss_dc_cp_user_id') === null) {
            getDefaultStartEndDate(); 
            getCopierReportDivision();
            initializeTable();
        }
        else {
            $('#start_date').val(sessionStorage.getItem('ss_dc_cp_start_date'));
            $('#end_date').val(sessionStorage.getItem('ss_dc_cp_end_date'));
            m_division_id = sessionStorage.getItem('ss_dc_cp_division_id');
            m_cost_center_id = sessionStorage.getItem('ss_dc_cp_cost_center_id');
            m_user_id = sessionStorage.getItem('ss_dc_cp_user_id');
            getCopierReportDivision();
            initializeTable();
            $("#row_division_id_" + m_division_id).html("<i class='fa fa-minus'></i>");
            getCopierReportCostCenter(m_division_id);
            $("#row_cost_center_id_" + m_cost_center_id).html("<i class='fa fa-minus'></i>");
            getCopierReportUsers(m_cost_center_id);
            $("#row_user_id_" + m_user_id + "_CCID_" + m_cost_center_id).html("<i class='fa fa-minus'></i>");
            getCopierReportPrint(m_cost_center_id, m_user_id);
        }
    }
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////
function initializeTable() {
    $("#tbl_copier_report").tablesorter({ resort: false });
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
        sessionStorage.removeItem('ss_dc_cp_start_date');
        sessionStorage.removeItem('ss_dc_cp_end_date');
        sessionStorage.removeItem('ss_dc_cp_division_id');
        sessionStorage.removeItem('ss_dc_cp_cost_center_id');
        sessionStorage.removeItem('ss_dc_cp_user_id');
            
        getCopierReportDivision();
        return false;
    });
    
    // excel button click //////////////////////////////////////////////////////
    $('#btn_excel').click(function() {
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        location.href = "php/csv_CopierCostCenterReport.php?StartDate=" + start_date + "&EndDate=" + end_date; 
        return false;
    });
    
    // table row division +/- click event //////////////////////////////////////
    $('table').on('click', '[id^="row_division_id_"]', function(e) {
        e.preventDefault();        
        var row_html = $(this).html();
        var first_child_row_id = $(this).attr('id');
        m_division_id = first_child_row_id.replace("row_division_id_", "");
        if (row_html === "<i class=\"fa fa-plus\"></i>") {
            $(this).html("<i class='fa fa-minus'></i>"); 
            getCopierReportCostCenter(m_division_id);
        }
        else {
            $(this).html("<i class='fa fa-plus'></i>");
            var result = new Array();
            result = db_getCopierReportCostCenter($('#start_date').val(), $('#end_date').val(), m_division_id);
            for(var i = 0; i < result.length; i++) {
                var cost_center_id = result[i]['CostCenterID'];
                var result2 = new Array();
                result2 = db_getCopierReportUsers($('#start_date').val(), $('#end_date').val(), cost_center_id);
                for (var j=0; j < result2.length; j++) {
                    var user_id = result2[j]['LoginID'];
                    $(".class_user_id_" + user_id + "_" + cost_center_id).remove();
                }
                $(".class_cost_center_id_" + cost_center_id).remove();
            }
            
            $(".class_division_id_" + m_division_id).remove();
            $("#tbl_copier_report").trigger("update");
            $("#tbl_copier_report").trigger("appendCache");
        }
        return false;
    });
    
    // table row cost center +/- click event ///////////////////////////////////
    $('table').on('click', '[id^="row_cost_center_id_"]', function(e) {
        e.preventDefault();        
        var row_html = $(this).html();
        var second_child_row_id = $(this).attr('id');
        m_cost_center_id = second_child_row_id.replace("row_cost_center_id_", "");
       
        if (row_html === "<i class=\"fa fa-plus\"></i>") {
            $(this).html("<i class='fa fa-minus'></i>"); 
            getCopierReportUsers(m_cost_center_id);
        }
        else {
            $(this).html("<i class='fa fa-plus'></i>");
            var result = new Array();
            result = db_getCopierReportUsers($('#start_date').val(), $('#end_date').val(), m_cost_center_id);
            for(var i = 0; i < result.length; i++) {
                var user_id = result[i]['LoginID'];
                $(".class_user_id_" + user_id + "_" + m_cost_center_id).remove();
            }
            
            $(".class_cost_center_id_" + m_cost_center_id).remove();
            $("#tbl_copier_report").trigger("update");
            $("#tbl_copier_report").trigger("appendCache");
        }
        return false;
    });
    
    // table row users +/- click event /////////////////////////////////////////
    $('table').on('click', '[id^="row_user_id_"]', function(e) {
        e.preventDefault();        
        var row_html = $(this).html();
        var third_child_row_id = $(this).attr('id');
        var ar_str = third_child_row_id.split("_CCID_");
        m_user_id = ar_str[0].replace("row_user_id_", "");
        m_cost_center_id = ar_str[1];
        
        if (row_html === "<i class=\"fa fa-plus\"></i>") {
            $(this).html("<i class='fa fa-minus'></i>");
            getCopierReportPrint(m_cost_center_id, m_user_id);
        }
        else {
            $(this).html("<i class='fa fa-plus'></i>");
            $(".class_user_id_" + m_user_id + "_" + m_cost_center_id).remove();
            $("#tbl_copier_report").trigger("update");
            $("#tbl_copier_report").trigger("appendCache");
        }
        return false;
    });
    
    // table print request click ///////////////////////////////////////////////
    $('table').on('click', '[id^="row_print_request_id_"]', function(e) {
        e.preventDefault();
        var print_request_id = $(this).attr('id').replace("row_print_request_id_", "");
        var result = new Array();
        result = db_getPrintRequest(print_request_id);
        
        sessionStorage.setItem('ivcdups_print_click', "rptCopierReport.html");
        sessionStorage.setItem('ss_dc_cp_start_date', $('#start_date').val());
        sessionStorage.setItem('ss_dc_cp_end_date', $('#end_date').val());
        sessionStorage.setItem('ss_dc_cp_user_id', result[0]['LoginID']);
        if (result[0]['DeviceTypeID'] === "1" || result[0]['DeviceTypeID'] === "2") {
            var dup_cost_center_id = db_getDuplicatingCostCenterID(print_request_id);
            var dup_division_id = db_getDivisionIDByCostCenterID(dup_cost_center_id);
            sessionStorage.setItem('ss_dc_cp_division_id', dup_division_id);
            sessionStorage.setItem('ss_dc_cp_cost_center_id', dup_cost_center_id);
            window.open('viewPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
        else {
            var drp_cost_center_id = db_getDropOffJobCostCenterID(print_request_id);
            var drp_division_id = db_getDivisionIDByCostCenterID(drp_cost_center_id);
            sessionStorage.setItem('ss_dc_cp_division_id', drp_division_id);
            sessionStorage.setItem('ss_dc_cp_cost_center_id', drp_cost_center_id);
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
            $('#nav_new_copier_report').show();
            $('#nav_del_time_exceeded').show();
            $('#menu_administrator').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#nav_new_copier_report').show();
            $('#nav_del_time_exceeded').show();
            $('#menu_administrator').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
            $('#nav_copier_report').show();
            $('#nav_new_copier_report').show();
        }
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
function getCopierReportDivision() {
    m_total_pages = 0;
    m_total_cost = 0;
    
    var result = new Array(); 
    result = db_getCopierReportDivision($('#start_date').val(), $('#end_date').val());
    
    $("#tbl_body").empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        var tmp = result[i];
        m_total_pages += Number(result[i]['TotalPages']);
        m_total_cost += Number(result[i]['TotalCost']);
        body_html += setCopierReportDivisionHTML(result[i]['DivisionID'], result[i]['Division'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#tbl_body").append(body_html);
    $("#tbl_copier_report").trigger("update");
    $("#tbl_copier_report").trigger("appendCache");
    
    $('#total_pages').html(m_total_pages);
    $('#total_cost').html(formatDollar(m_total_cost, 2));
}

function setCopierReportDivisionHTML(division_id, division, total_pages, total_cost) { 
    var tbl_html = "<tr id='first_child_division_id_" + division_id + "'>";
    tbl_html += "<td class='col-md-1' style='text-align: center'><a href=# id='row_division_id_" + division_id + "'><i class='fa fa-plus'></i></a></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-4'>" + division + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";    
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getCopierReportCostCenter(division_id) {
    var result = new Array();
    result = db_getCopierReportCostCenter($('#start_date').val(), $('#end_date').val(), division_id);
    
    $(".class_division_id_" + division_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setCopierReportCostCenterHTML(division_id, result[i]['CostCenterID'], result[i]['CostCenter'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#first_child_division_id_" + division_id).after(body_html);
    $("#tbl_copier_report").trigger("update");
    $("#tbl_copier_report").trigger("appendCache");
}

function setCopierReportCostCenterHTML(division_id, cost_center_id, cost_center, total_pages, total_cost) {
    var tbl_html = "<tr class='class_division_id_" + division_id + "' id='second_child_cost_center_id_" + cost_center_id + "'>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: center'><a href=# id='row_cost_center_id_" + cost_center_id + "'><i class='fa fa-plus'></i></a></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-4'>" + cost_center + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}
////////////////////////////////////////////////////////////////////////////////
function getCopierReportUsers(cost_center_id) {
    var result = new Array();
    result = db_getCopierReportUsers($('#start_date').val(), $('#end_date').val(), cost_center_id);
    
    $(".class_cost_center_id_" + cost_center_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setCopierReportUsersHTML(cost_center_id, result[i]['LoginID'], result[i]['Requestor'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#second_child_cost_center_id_" + cost_center_id).after(body_html);
    $("#tbl_copier_report").trigger("update");
    $("#tbl_copier_report").trigger("appendCache");
}

function setCopierReportUsersHTML(cost_center_id, login_id, requestor, total_pages, total_cost) {
    var tbl_html = "<tr class='class_cost_center_id_" + cost_center_id + "' id='third_child_user_id_" + login_id + "_" + cost_center_id + "'>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: center'><a href=# id='row_user_id_" + login_id + "_CCID_" + cost_center_id + "'><i class='fa fa-plus'></i></a></td>";
    tbl_html += "<td class='col-md-4' style='font-style: italic;'>" + requestor + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'></td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}

////////////////////////////////////////////////////////////////////////////////
function getCopierReportPrint(cost_center_id, user_id) {
    var result = new Array();
    result = db_getCopierReportPrint($('#start_date').val(), $('#end_date').val(), cost_center_id, user_id);
    
    $(".class_user_id_" + user_id + "_" + cost_center_id).empty();
    var body_html = "";
    for(var i = 0; i < result.length; i++) { 
        body_html += setCopierReportPrintHTML(user_id, result[i]['PrintRequestID'], result[i]['RequestTitle'], result[i]['Created'], result[i]['TotalPages'], formatDollar(Number(result[i]['TotalCost']), 2));
    }
    $("#third_child_user_id_" + user_id + "_" + cost_center_id).after(body_html);
    $("#tbl_copier_report").trigger("update");
    $("#tbl_copier_report").trigger("appendCache");
}

function setCopierReportPrintHTML(user_id, print_request_id, request_title, modified, total_pages, total_cost) {
    var tbl_html = "<tr class='class_user_id_" + user_id + "_" + m_cost_center_id + "'>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-1'></td>";
    tbl_html += "<td class='col-md-4' style='font-style: italic;'><a href=# id='row_print_request_id_" + print_request_id +  "'>" + request_title + "</a></td>";
    tbl_html += "<td class='col-md-2' style='text-align: center;'>" + modified + "</td>";
    tbl_html += "<td class='col-md-1' style='text-align: right;'>" + total_pages + "</td>";
    tbl_html += "<td class='col-md-2' style='text-align: right;'>" + total_cost + "</td>";
    tbl_html += "</tr>";
    return tbl_html;
}