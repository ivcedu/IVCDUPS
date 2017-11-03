var m_table;
var cat_section_id = "";

////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    if (sessionStorage.key(0) !== null) {
        getLoginInfo();
        getCatSectionList();
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
    $('#btn_new_section').click(function() {
        cat_section_id = "";
        
        clearModalSection();
        $('#mod_catalog_header').html("New Catalog Section Setting");
        $('#mod_section_active').iCheck('check');
        $('#mod_catalog').modal('show');
        return false;
    });
    
    // table row click event ////////////////////////////////////////////////////
    $('table').on('click', 'a[id^="cat_section_id_"]', function(e) {
        e.preventDefault();
        cat_section_id = $(this).attr('id').replace("cat_section_id_", "");
        var result = new Array();
        result = db_getCatSectionByID(cat_section_id);
        
        clearModalSection();
        $('#mod_catalog_header').html("Edit Catalog Section Setting");
        if (result[0]['Active'] === "1") {
            $("#mod_section_active").iCheck('check');
        }
        else {
            $("#mod_section_active").iCheck('unchecke');
        }
        $('#mod_fiscal_year').val(result[0]['FiscalYear']);
        $('#mod_section_name').val(result[0]['SectionName']);
        $('#mod_total_pages').val(result[0]['Pages']);
        $('#mod_print_cost').val(result[0]['Cost']);
        $("input[name=mod_rdo_option][value=" + result[0]['Options'] + "]").iCheck('check');
        $('#mod_catalog').modal('show');
        return false;
    });
    
    // modal save button click //////////////////////////////////////////////////
    $('#mod_btn_save').click(function() { 
        var active = ($('#mod_section_active').is(':checked') ? true : false);
        var fiscal_year = $.trim($('#mod_fiscal_year').val());
        var section_name = $.trim($('#mod_section_name').val());
        var total_pages = $('#mod_total_pages').val();
        var print_cost = $('#mod_print_cost').val();
        var options = $("input[name=mod_rdo_option]:checked").val();
        
        if (cat_section_id === "") {
            db_insertCatSection(active, fiscal_year, section_name, total_pages, print_cost, options);
        }
        else {
            db_updateCatSectionByID(cat_section_id, active, fiscal_year, section_name, total_pages, print_cost, options);
        }
        
        getCatSectionList();
        $('#mod_catalog').modal('hide');
        return false;
    });
    
    // mod total pages input change event //////////////////////////////////////
    $('#mod_total_pages').change(function() {        
        if (!isValidNumber($(this).val())) {
            $(this).val("0");
        }
        return false;
    });
    
    // mod print cost input change event ///////////////////////////////////////
    $('#mod_print_cost').change(function() {
        if (!isValidCurrency($(this).val())) {
            $(this).val("0.00");
        }
        return false;
    });

    // jquery datatables initialize ////////////////////////////////////////////
    m_table = $('#tbl_catalog_list').DataTable({ paging: false, bInfo: false, searching: false, columnDefs:[{ className: "dt-center", orderable: false, targets: 6 }] });
    
    // iCheck initialize ////////////////////////////////////////////////////////
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '-10%' // optional
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

////////////////////////////////////////////////////////////////////////////////
function getCatSectionList() {
    var result = new Array(); 
    result = db_getCatSectionListDataTable();
    
    m_table.clear();
    m_table.rows.add(result).draw();
}

////////////////////////////////////////////////////////////////////////////////
function clearModalSection() {
    $('#mod_catalog_header').html("");
    $('#mod_fiscal_year').val("");
    $('#mod_section_name').val("");
    $('#mod_total_pages').val("");
    $('#mod_print_cost').val("");
    $('input').iCheck('uncheck');
}