var m_table;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setAdminOption();
        setUserProfile();
        
        getLoginInfo();
        getDefaultStartEndDate();
        getAdminCompletedList();
}
    else {
        window.open('Login.html', '_self');
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {    
    $('#nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // table row contract click ////////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var print_request_id = $(this).attr('id').replace("print_request_id_", "");
        var result = new Array();
        result = db_getPrintRequest(print_request_id);
        
        sessionStorage.setItem('ivcdups_print_click', "rptCompletedList.html");
        if (result[0]['DeviceTypeID'] === "1" || result[0]['DeviceTypeID'] === "2") {
            window.open('viewPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
        else {
            window.open('viewDropOff.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
    });
    
    // refresh button click ////////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        getAdminCompletedList();
        return false;
    });
    
    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_completed_list').DataTable({ paging: false, bInfo: false, order: [[ 0, "desc" ]] });
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
            $('#nav_del_time_exceeded').show();
            $('#menu_administrator').show();
            $('#nav_copier_price').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_copier_report').show();
            $('#nav_del_time_exceeded').show();
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
function getAdminCompletedList() {
    var result = new Array(); 
    result = result = db_getAdminCompletedList($('#start_date').val(), $('#end_date').val());
    
    m_table.clear();
    m_table.rows.add(result).draw();
}