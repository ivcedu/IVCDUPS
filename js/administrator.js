var m_table;

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        getAdminPrintList();
        initializeTable();
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
        var currentId = $(this).attr('id');
        var print_request_id = currentId.replace("print_request_id_", "");
        
        window.open('printRequest.html?print_request_id=' + print_request_id, '_self');
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_admin_active_list').DataTable({ paging: false, bInfo: false, searching: false });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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