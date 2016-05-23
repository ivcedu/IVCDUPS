var m_table;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        setDefaultOption();
        setAdminOption();
        setUserProfile();
        
        getLoginInfo();
        getUserPrintList();
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
    
    $('#mobile_nav_logout').click(function() {
        sessionStorage.clear();
        window.open('Login.html', '_self');
        return false;
    });
    
    // table row contract click //////////////////////////////////////////////
    $('table').on('click', 'a[id^="print_request_id_"]', function(e) {
        e.preventDefault();
        var print_request_id = $(this).attr('id').replace("print_request_id_", ""); 
        var result = new Array();
        result = db_getPrintRequest(print_request_id);
        
        if (result[0]['DeviceTypeID'] === "1" || result[0]['DeviceTypeID'] === "2") {
            window.open('viewPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
        else {
            window.open('viewDropOff.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
    });
    
    $('table').on('click', 'a[id^="edit_request_"]', function() {
        var print_request_id = $(this).attr('id').replace("edit_request_id_", "");        
        if (printRequestLocked(print_request_id)) {
            swal({title: "Warning", text: "Duplicating center is already working on your request. Please contact Jose Delgado at 949.451.5297", type: "warning"});
            getUserPrintList();
            return false;
        }
        else {
            window.open('editPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
    });

    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_usr_active_list').DataTable({ paging: false, bInfo: false, searching: false, columnDefs: [{ orderable: false, targets: 5 }] });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setDefaultOption() {
    $('#nav_my_profile').hide();
    $('#nav_completed_list').hide();
    $('#nav_copier_report').hide();
    $('#menu_administrator').hide();
    $('#nav_copier_price').hide();
    $('#nav_user_access').hide();
}

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

////////////////////////////////////////////////////////////////////////////////
function printRequestLocked(print_request_id) {
    var result = new Array();
    result = db_getPrintRequest(print_request_id);
    
    if (result[0]['Locked'] === "1") {
        return true;
    }
    else {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////
function getUserPrintList() {
    var result = new Array(); 
    result = db_getUserPrintRequestList(sessionStorage.getItem("ls_dc_loginEmail"));
    
    var total_cost = 0.0;
    for(var i = 0; i < result.length; i++) { 
        total_cost += Number(result[i]['TotalCost'].replace('$', ''));
    }
    
    $('#total_cost').html(formatDollar(total_cost, 2));
    
    m_table.clear();
    m_table.rows.add(result).draw();
}