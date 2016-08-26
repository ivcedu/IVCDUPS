var m_table;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        deleteReportSessionItems();
        setAdminOption();
        
        getLoginInfo();
        getAdminLockedPRList();
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
    
    // table row unlocked icon click ///////////////////////////////////////////
    $('table').on('click', 'a[id^="unlocked_pr_id_"]', function() {
        var print_request_id = $(this).attr('id').replace("unlocked_pr_id_", "");  
        db_updatePrintRequestLocked(print_request_id, false);
        getAdminLockedPRList();
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_admin_locked_list').DataTable({ paging: false, bInfo: false, searching: false });
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
function getAdminLockedPRList() {
    var result = new Array(); 
    result = db_getAdminLockedPRList();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}