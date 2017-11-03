////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        deleteReportSessionItems();
        setAdminOption();

        getLoginInfo();
        cp_Object.getCopierPriceList();
        getCopierPrice();
    }
    else {
        window.open('Login.html', '_self');
        return false;
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
            cp_Object.getCopierPriceList();
            getCopierPrice();
            return false;
        }
    });
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
function getCopierPrice() {    
    $('#s_letter').val(cp_Object.getSingleLetter().toFixed(3));
    $('#d_letter').val(cp_Object.getDoubleLetter().toFixed(3));
    $('#s_letter_color').val(cp_Object.getSingleLetterColor().toFixed(3));
    $('#d_letter_color').val(cp_Object.getDoubleLetterColor().toFixed(3));
    $('#s_legal').val(cp_Object.getSingleLegal().toFixed(3));
    $('#d_legal').val(cp_Object.getDoubleLegal().toFixed(3));
    $('#s_legal_color').val(cp_Object.getSingleLegalColor().toFixed(3));
    $('#d_legal_color').val(cp_Object.getDoubleLegalColor().toFixed(3));
    $('#s_tabloid').val(cp_Object.getSingleTabloid().toFixed(3));
    $('#d_tabloid').val(cp_Object.getDoubleTabloid().toFixed(3));
    $('#s_tabloid_color').val(cp_Object.getSingleTabloidColor().toFixed(3));
    $('#d_tabloid_color').val(cp_Object.getDoubleTabloidColor().toFixed(3));
    $('#s_letter_80').val(cp_Object.getSingleLetter80().toFixed(3));
    $('#d_letter_80').val(cp_Object.getDoubleLetter80().toFixed(3));
    $('#s_letter_color_80').val(cp_Object.getSingleLetterColor80().toFixed(3));
    $('#d_letter_color_80').val(cp_Object.getDoubleLetterColor80().toFixed(3));
    $('#front_cover').val(cp_Object.getFrontCover().toFixed(3));
    $('#front_cover_color').val(cp_Object.getFrontCoverColor().toFixed(3));
    $('#back_cover').val(cp_Object.getBackCover().toFixed(3));
    $('#back_cover_color').val(cp_Object.getBackCoverColor().toFixed(3));
    $('#cut').val(cp_Object.getCut().toFixed(3));
    $('#coil_binding').val(cp_Object.getCoilBinding().toFixed(3));
    $('#comb_binding').val(cp_Object.getCombBinding().toFixed(3));
    $('#booklet').val(cp_Object.getBooklet().toFixed(3));
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
    var s_letter_80 = $('#s_letter_80').val();
    var d_letter_80 = $('#d_letter_80').val();
    var s_letter_color_80 = $('#s_letter_color_80').val();
    var d_letter_color_80 = $('#d_letter_color_80').val();
    var front_cover = $('#front_cover').val();
    var front_cover_color = $('#front_cover_color').val();
    var back_cover = $('#back_cover').val();
    var back_cover_color = $('#back_cover_color').val();
    var cut = $('#cut').val();
    var coil_binding = $('#coil_binding').val();
    var comb_binding = $('#comb_binding').val();
    var booklet = $('#booklet').val();
    
    return db_updateCopierPrice(cp_Object.getCopierPriceID(), s_letter, d_letter, s_letter_color, d_letter_color,
                                s_legal, d_legal, s_legal_color, d_legal_color,
                                s_tabloid, d_tabloid, s_tabloid_color, d_tabloid_color,
                                s_letter_80, d_letter_80, s_letter_color_80, d_letter_color_80,
                                front_cover, front_cover_color, back_cover, back_cover_color, cut,
                                coil_binding, comb_binding, booklet);
}