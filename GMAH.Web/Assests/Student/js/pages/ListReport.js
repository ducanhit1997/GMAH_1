var dataTable = $("#result").DataTable({
    "language": {
        "url": "/Assests/Data/datatable-vi.json"
    },
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "info": true,
    "autoWidth": true,
    "responsive": true,
    "processing": true,
    "serverSide": true,
    "ordering": false,
    ajax: {
        url: '/api/reportapi/getmyreport?status=null&idSemester=null',
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + _JWT_TOKEN
        },
    },
    columns: [
        { data: "IdReport" },
        { data: "ReportTypeName" },
        { data: "ReportTitle" },
        { data: "FullnameSubmitReport" },
        { data: "FullnameStudent" },
        { data: "SubmitDateString" },
        { data: "ReportStatusName" },

        {
            data: null,
            className: "text-center editor-edit",
            defaultContent: '<i class="fas fa-edit"></i>',
            orderable: false,
            width: "50px",
        },
    ]
});

$('#result tbody').on('click', '.editor-edit', function () {
    let row = dataTable.row($(this).closest("tr")).data();
    location.href = linkInfo + '/' + row.IdReport;
});

$(document).ready(function () {
    $('#status').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    LoadSemesterData();
    LoadReportData();
});

function LoadReportData() {
    $("#mainGroup").hide();
    $("#loading").show();

    dataTable.ajax.url('/api/reportapi/getmyreport?status=' + $("#status").val() + "&idSemester=" + $("#selectedSemester").val());
    dataTable.ajax.reload();

    $("#mainGroup").show();
    $("#loading").hide();
}

function LoadSemesterData() {
    $('#selectedSemester').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    if (_ID_SEMESTER === null || _ID_SEMESTER == 0) {
        $("#mainGroup").hide();
    }

    return $.ajax({
        type: "GET",
        url: "/api/semesterapi/getcurrentsemester?viewSemester=0",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
    }).then(function (result) {
        $("#selectedSemester").html("");

        if (result.Data !== undefined && result.Data !== null) {
            $('#selectedSemester').append($.map(result.Data, function (v, i) { return $('<option>', { val: v.IdSemester, text: v.TitleName }); }));
        }

        $('#selectedSemester').val(_ID_SEMESTER == 0 ? null : _ID_SEMESTER).trigger('change');
    });
}