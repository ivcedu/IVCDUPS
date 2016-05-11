var m_table;
var m_honor_student_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        setDefaultOption();
        setAdminOption();
        
        getLoginInfo();
        getHonorStudentList();
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
    $('#btn_new_student').click(function() {
        m_honor_student_id = "";
        
        clearModalSection();
        $('#mod_new_student_header').html("New Honor Student Setting");
        $('#mod_new_student').modal('show');
        return false;
    });
    
    // table row contract click ////////////////////////////////////////////////
    $('table').on('click', 'a[id^="honor_student_id_"]', function(e) {
        e.preventDefault();
        m_honor_student_id = $(this).attr('id').replace("honor_student_id_", "");
        var result = new Array();
        result = db_getHonorStudentByID(m_honor_student_id);
        
        clearModalSection();
        $('#mod_btn_delete').show();
        $('#mod_new_student_header').html("Edit Honor Student Setting");
        $('#mod_student_mame').val(result[0]['HonorStudentName']);
        $('#mod_student_email').val(result[0]['HonorStudentEmail']);
        $('#mod_new_student').modal('show');
        return false;
    });
    
    // modal save button click /////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var student_name = textReplaceApostrophe($.trim($('#mod_student_mame').val()));
        var student_email = textReplaceApostrophe($.trim($('#mod_student_email').val()));
        
        if (m_honor_student_id === "") {
            db_insertHonorStudent(student_name, student_email);
        }
        else {
            db_updateHonorStudent(m_honor_student_id, student_name, student_email);
        }

        getHonorStudentList();
        $('#mod_new_student').modal('hide');
        return false;
    });
    
    // modal delete button click ///////////////////////////////////////////////
    $('#mod_btn_delete').click(function() { 
        db_deleteHonorStudent(m_honor_student_id);
        
        getHonorStudentList();
        $('#mod_new_student').modal('hide');
        return false;
    });

    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_honor_student_list').DataTable({ paging: false, bInfo: false, searching: false });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setDefaultOption() {
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

////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////
function getHonorStudentList() {
    var result = new Array(); 
    result = db_getHonorStudentList();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_new_student_header').html("");
    $('#mod_student_mame').val("");
    $('#mod_student_email').val("");
    $('#mod_btn_delete').hide();
}