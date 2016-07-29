var m_table;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        deleteReportSessionItems();
        setAdminOption();
        
        getLoginInfo();
        getAdminPrintList();
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
    
    // table row contract click //////////////////////////////////////////////
    $('table').on('click', 'a', function(e) {
        e.preventDefault();
        var print_request_id = $(this).attr('id').replace("print_request_id_", "");
        var result = new Array();
        result = db_getPrintRequest(print_request_id);
        
        if (result[0]['Locked'] === "1") {
            swal("Error", "Plotter/Duplicating request opened by requestor to edit/cancel. Please try back later", "error");
            return false;
        }
        
        if (result[0]['DeviceTypeID'] === "1" || result[0]['DeviceTypeID'] === "2") {
            window.open('adminPrintRequest.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
        else {
            window.open('adminDropOff.html?print_request_id=' + print_request_id, '_self');
            return false;
        }
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_admin_active_list').DataTable({ paging: false, bInfo: false, searching: false });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setAdminOption() {        
    var login_email = sessionStorage.getItem("ls_dc_loginEmail");
    var result = new Array();
    result = db_getAdminByEmail(login_email);
    
    if (result.length === 1) {
        if (result[0]['AdminLevel'] === "Master") {
            $('#nav_user_access').show();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////
function getAdminPrintList() {
    var result = new Array(); 
    result = db_getAdminPrintRequestList();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}