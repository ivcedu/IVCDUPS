var m_table_total_page;
var m_table_total_cost;
////////////////////////////////////////////////////////////////////////////////
window.onload = function() {   
    if (sessionStorage.key(0) !== null) {
        setAdminOption();
        getLoginInfo();
        getDefaultStartEndDate();
        
        getDashboardMain($('#start_date').val(), $('#end_date').val());
        getDivisionTotalPages($('#start_date').val(), $('#end_date').val());
        getDivisionTotalCost($('#start_date').val(), $('#end_date').val());
        getBlackWhiteColor($('#start_date').val(), $('#end_date').val());
        getDuplicatingDropOff($('#start_date').val(), $('#end_date').val());
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
    
    // refresh button click ////////////////////////////////////////////////////
    $('#btn_refresh').click(function() {
        getDashboardMain($('#start_date').val(), $('#end_date').val());
        getDivisionTotalPages($('#start_date').val(), $('#end_date').val());
        getDivisionTotalCost($('#start_date').val(), $('#end_date').val());
        getBlackWhiteColor($('#start_date').val(), $('#end_date').val());
        getDuplicatingDropOff($('#start_date').val(), $('#end_date').val());
        return false;
    });
    
    // jquery datatables initialize ////////////////////////////////////////////
    m_table_total_page = $('#tbl_division_total_page_list').DataTable({ paging: false, bInfo: false, searching: false, order: [[ 1, "desc" ]] });
    m_table_total_cost = $('#tbl_division_total_cost_list').DataTable({ paging: false, bInfo: false, searching: false, order: [[ 1, "desc" ]] });
    
    // datepicker
    $('#start_date').datepicker();
    $('#end_date').datepicker();
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
            $('#nav_del_time_exceeded').show();
//            $('#nav_copier_report').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
            $('#nav_user_access').show();
        }
        else if (result[0]['AdminLevel'] === "Admin") {
            $('#nav_completed_list').show();
            $('#nav_del_time_exceeded').show();
//            $('#nav_copier_report').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
            $('#menu_administrator').show();
        }
        else if (result[0]['AdminLevel'] === "Report") {
//            $('#nav_copier_report').show();
            $('#nav_new_copier_report').show();
            $('#nav_dashboard').show();
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
function getLoginInfo() {
    var login_name = sessionStorage.getItem('ls_dc_loginDisplayName');
    $('#login_user').html(login_name);
}

function getDefaultStartEndDate() {
    $('#start_date').datepicker( "setDate", getFistDayOfMothWithSetMonth(-6) );
    $('#end_date').datepicker( "setDate", getCurrentLastDayOfMonth() );
}

////////////////////////////////////////////////////////////////////////////////
function getDashboardMain(start_date, end_date) {
    var result = new Array(); 
    result = getRptDashboardMain(start_date, end_date);
    
    drawC3MainBarChart(result);
}

function drawC3MainBarChart(result) {
    var c3_labels = [];
    var c3_total_pages = [];
    var c3_total_cost = [];
    
    c3_labels.push('x');
    c3_total_pages.push('TotalPages');
    c3_total_cost.push(['TotalCost']);
    
    for (var i = 0; i < result.length; i++) {
        c3_labels.push(result[i]['RptMonth'] + ' ' + result[i]['RptYear']);
        c3_total_pages.push(Number(result[i]['TotalPages']));
        c3_total_cost.push(Number(result[i]['TotalCost']));
    }
    
    c3.generate({
            bindto: '#rpt_dashboard_main',
            data:{
                x: 'x',
                columns: [ c3_labels, c3_total_pages, c3_total_cost ],
                axes: { TotalCost: 'y2' },
                colors: { TotalPages: '#1ab394', TotalCost: '#BABABA' },
                type: 'bar'
//                groups: [ [ 'TotalPages', 'TotalCost' ] ]
            },
            axis: {
                x: { type: 'category' },
                y2: { show: true, tick: { format: d3.format("$") } }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        var format = id === 'TotalCost' ? d3.format('$') : d3.format('');
                        return format(value);
                    }
                }
            }
        });
}

////////////////////////////////////////////////////////////////////////////////
function getDivisionTotalPages(start_date, end_date) {
    var result = new Array(); 
    result = getRptDivisionTotalPagesCost(start_date, end_date, 'TotalPages');
    
    drawC3TotalPagesPieChart(result);
    m_table_total_page.clear();
    m_table_total_page.rows.add(result).draw();
}

function drawC3TotalPagesPieChart(result) {
    var c3_pie_data = [];
    
    for (var i = 0; i <= 7; i++) {
        var raw_data = [];
        raw_data.push(result[i]['Division']);
        raw_data.push(Number(result[i]['TotalPages']));
        c3_pie_data.push(raw_data);
    }
    
    var num_other_data = 0;
    for (var j = 8; j < result.length; j++) {
        num_other_data += Number(result[j]['TotalPages']);
    }
    var other_data = [];
    other_data.push('Other');
    other_data.push(num_other_data);
    c3_pie_data.push(other_data);
    
    c3.generate({
            bindto: '#rpt_division_total_page',
            data:{
                columns: c3_pie_data,
                type: 'pie'
            }
        });
}

////////////////////////////////////////////////////////////////////////////////
function getDivisionTotalCost(start_date, end_date) {
    var result = new Array(); 
    result = getRptDivisionTotalPagesCost(start_date, end_date, 'TotalCost');
    drawC3TotalCostPieChart(result);
    
    var result2 = new Array(); 
    result2 = getRptDivisionTotalPagesCost(start_date, end_date, 'MoneyFormat');
    m_table_total_cost.clear();
    m_table_total_cost.rows.add(result2).draw();
}

function drawC3TotalCostPieChart(result) {
    var c3_pie_data = [];
    
    for (var i = 0; i <= 7; i++) {
        var raw_data = [];
        raw_data.push(result[i]['Division']);
        raw_data.push(Number(result[i]['TotalCost']));
        c3_pie_data.push(raw_data);
    }
    
    var num_other_data = 0;
    for (var j = 8; j < result.length; j++) {
        num_other_data += Number(result[j]['TotalCost']);
    }
    var other_data = [];
    other_data.push('Other');
    other_data.push(num_other_data);
    c3_pie_data.push(other_data);
    
    c3.generate({
            bindto: '#rpt_division_total_cost',
            data:{
                columns: c3_pie_data,
                type: 'pie'
            }
        });
}

////////////////////////////////////////////////////////////////////////////////
function getBlackWhiteColor(start_date, end_date) {
    var result = new Array(); 
    result = getRptBlackWhiteColor(start_date, end_date);
    
    drawC3BlackWhiteColorPieChart(result);
}

function drawC3BlackWhiteColorPieChart(result) {
    var c3_pie_data = [];
    
    for (var i = 0; i < result.length; i++) {
        var raw_data = [];
        raw_data.push(result[i]['ColorCopy'] + ": " + Number(result[i]['TotalPages']));
        raw_data.push(Number(result[i]['TotalPages']));
        c3_pie_data.push(raw_data);
    }
    
    c3.generate({
            bindto: '#rpt_bw_color',
            data:{
                columns: c3_pie_data,
                type: 'pie'
            }
        });
}

////////////////////////////////////////////////////////////////////////////////
function getDuplicatingDropOff(start_date, end_date) {
    var result = new Array(); 
    result = getRptDuplicatingDropOff(start_date, end_date);
    
    drawC3DuplicatingDropOffPieChart(result);
}

function drawC3DuplicatingDropOffPieChart(result) {
    var c3_pie_data = [];
    
    for (var i = 0; i < result.length; i++) {
        var raw_data = [];
        raw_data.push(result[i]['PrintType'] + ": " + Number(result[i]['TotalPages']));
        raw_data.push(Number(result[i]['TotalPages']));
        c3_pie_data.push(raw_data);
    }
    
    c3.generate({
            bindto: '#rpt_dup_drop_off',
            data:{
                columns: c3_pie_data,
                type: 'pie'
            }
        });
}