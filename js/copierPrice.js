var m_copier_price_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setDefaultOption();
        setAdminOption();
        
        getLoginInfo();
        getCopierPrice();
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
    
    // save button click ///////////////////////////////////////////////////////
    $('#btn_update').click(function() {
        if (updateCopierPrice()) {
            swal({title: "Success", text: "Copier Price setting has been updated successfully", type: "success"});
            getCopierPrice();
            return false;
        }
    });
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
function getCopierPrice() {
    var result = new Array(); 
    result = db_getCopierPrice();
    
    if (result.length === 1) {
        m_copier_price_id = result[0]['CopierPriceID'];
        $('#s_letter').val(Number(result[0]['s_letter']).toFixed(3));
        $('#d_letter').val(Number(result[0]['d_letter']).toFixed(3));
        $('#s_letter_color').val(Number(result[0]['s_letter_color']).toFixed(3));
        $('#d_letter_color').val(Number(result[0]['d_letter_color']).toFixed(3));
        $('#s_legal').val(Number(result[0]['s_legal']).toFixed(3));
        $('#d_legal').val(Number(result[0]['d_legal']).toFixed(3));
        $('#s_legal_color').val(Number(result[0]['s_legal_color']).toFixed(3));
        $('#d_legal_color').val(Number(result[0]['d_legal_color']).toFixed(3));
        $('#s_tabloid').val(Number(result[0]['s_tabloid']).toFixed(3));
        $('#d_tabloid').val(Number(result[0]['d_tabloid']).toFixed(3));
        $('#s_tabloid_color').val(Number(result[0]['s_tabloid_color']).toFixed(3));
        $('#d_tabloid_color').val(Number(result[0]['d_tabloid_color']).toFixed(3));
        $('#front_cover').val(Number(result[0]['front_cover']).toFixed(3));
        $('#front_cover_color').val(Number(result[0]['front_cover_color']).toFixed(3));
        $('#back_cover').val(Number(result[0]['back_cover']).toFixed(3));
        $('#back_cover_color').val(Number(result[0]['back_cover_color']).toFixed(3));
        $('#cut').val(Number(result[0]['cut']).toFixed(3));
    }
}

////////////////////////////////////////////////////////////////////////////////
function updateCopierPrice() {
    var s_letter = $('#s_letter').val();
    var d_letter = $('#d_letter').val();
    var s_letter_color = $('#s_letter_color').val();
    var d_letter_color = $('#d_letter_color').val();
    var s_legal = $('#s_legal').val();
    var d_legal = $('#d_legal').val();
    var s_legal_color = $('#s_legal_color').val();
    var d_legal_color = $('#d_legal_color').val();
    var s_tabloid = $('#s_tabloid').val();
    var d_tabloid = $('#d_tabloid').val();
    var s_tabloid_color = $('#s_tabloid_color').val();
    var d_tabloid_color = $('#d_tabloid_color').val();
    var front_cover = $('#front_cover').val();
    var front_cover_color = $('#front_cover_color').val();
    var back_cover = $('#back_cover').val();
    var back_cover_color = $('#back_cover_color').val();
    var cut = $('#cut').val();
    
    if (m_copier_price_id !== "") {
        return db_updateCopierPrice(m_copier_price_id, s_letter, d_letter, s_letter_color, d_letter_color,
                                    s_legal, d_legal, s_legal_color, d_legal_color,
                                    s_tabloid, d_tabloid, s_tabloid_color, d_tabloid_color,
                                    front_cover, front_cover_color, back_cover, back_cover_color, cut);
    }
    else {
        return false;
    }
}