var m_table;
var admin_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {        
        getLoginInfo();
        getAdminList();
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
    
    // new user button click ///////////////////////////////////////////////////
    $('#btn_new_user').click(function() {
        admin_id = "";
        
        clearModalSection();
        $('#mod_new_user_header').html("New User Setting");
        $('#mod_new_user').modal('show');
        return false;
    });
    
    // table row contract click ////////////////////////////////////////////////
    $('table').on('click', 'a[id^="admin_id_"]', function(e) {
        e.preventDefault();
        admin_id = $(this).attr('id').replace("admin_id_", "");
        var result = new Array();
        result = db_getAdminByID(admin_id);
        
        clearModalSection();
        $('#mod_btn_delete').show();
        $('#mod_new_user_header').html("Edit User Setting");
        $('#mod_user_mame').val(result[0]['AdminName']);
        $('#mod_user_email').val(result[0]['AdminEmail']);
        $('#mod_access_level').val(result[0]['AdminLevel']);
        $('#mod_new_user').modal('show');
        return false;
    });
    
    // modal save button click /////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var admin_name = textReplaceApostrophe($.trim($('#mod_user_mame').val()));
        var admin_email = textReplaceApostrophe($.trim($('#mod_user_email').val()));
        var admin_level = $('#mod_access_level').val();
        if (admin_id === "") {
            db_insertAdmin(admin_name, admin_email, admin_level);
        }
        else {
            db_updateAdmin(admin_id, admin_name, admin_email, admin_level);
        }
        
        getAdminList();
        $('#mod_new_user').modal('hide');
        return false;
    });
    
    // modal delete button click ///////////////////////////////////////////////
    $('#mod_btn_delete').click(function() { 
        db_deleteAdmin(admin_id);
        
        getAdminList();
        $('#mod_new_user').modal('hide');
        return false;
    });

    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_usr_access_list').DataTable({ paging: false, bInfo: false, searching: false });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////
function getAdminList() {
    var result = new Array(); 
    result = db_getAdminList();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_new_user_header').html("");
    $('#mod_user_mame').val("");
    $('#mod_user_email').val("");
    $('#mod_access_level').val("Select...");
    $('#mod_btn_delete').hide();
}