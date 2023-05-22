var _ID_CLASS = 0;
var _ID_SUBJECT = 0;
var _ID_STUDYFIELD = $("#IdStudyField").val() || 1;
var _ID_Year = $("#IdYear").val() || 1;
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
        url: '/api/classapi/GetClassSubjectScoreType?idStudyField=' + _ID_STUDYFIELD + "&idSubject=" + _ID_SUBJECT,
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + _JWT_TOKEN
        },
    },
    columns: [
        { data: "ScoreName" },
        { data: "ScoreWeight" },
        {
            data: null,
            className: "text-center editor-edit",
            defaultContent: '<i class="fas fa-edit"></i>',
            orderable: false,
            width: "50px",
        },
        {
            data: null,
            className: "text-center editor-delete",
            defaultContent: '<i class="fa fa-trash"/>',
            orderable: false,
            width: "50px",
        }
    ]
});

$(document).ready(function () {
    LoadSemesterData();
    LoadAllYear();
    LoadFieldStudy();
    LoadAllSubject();
});

function LoadAllYear() {
    $.ajax({
        type: "GET",
        url: "/api/userapi/GetAllYear",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            if (result.Object !== undefined && result.Object !== null) {
                $('#IdYear').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.YearId, text: v.YearName }); }));
            }
            $("[name=IdYear]").val(null).trigger('change');

            $('#IdYear').select2({
                placeholder: 'Chọn năm học',
                theme: 'bootstrap4'
            });
        }
    });
}

function LoadFieldStudy() {
    $.ajax({
        type: "GET",
        url: "/api/userapi/GetAllFieldStudy",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            if (result.Object !== undefined && result.Object !== null) {
                $('#IdStudyField').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdField, text: v.FieldName }); }));
            }
            $("[name=IdStudyField]").val(null).trigger('change');

            $('#IdStudyField').select2({
                placeholder: 'Chọn bang',
                theme: 'bootstrap4'
            });
        }
    });
}

function LoadAllSubject() {
    $.ajax({
        type: "GET",
        url: "/api/userapi/GetAllSubject",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            if (result.Object !== undefined && result.Object !== null) {
                $('#IdSubject').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdSubject, text: v.SubjectName }); }));
            }
            $("[name=IdSubject]").val(null).trigger('change');

            $('#IdSubject').select2({
                placeholder: 'Chọn môn',
                theme: 'bootstrap4'
            });
        }
    });
}

function LoadSemesterData() {
    _ID_CLASS = null;
    $('#selectedSemester').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    if (_ID_SEMESTER === null || _ID_SEMESTER == 0) {
        $("#mainGroup").hide();
    }

    return $.ajax({
        type: "GET",
        url: "/api/semesterapi/getcurrentsemester?viewSemester=2",
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

function LoadStudyFieldByYeadId() {
    _ID_Year = $("#IdYear").val();
    if (_ID_Year == null) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/api/userapi/GetListStudyFieldByYear?id=" + _ID_Year,
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            $('#IdStudyField').attr('disabled', false);
            $("#IdStudyField").html("");

            if (result.Object !== undefined && result.Object !== null) {
                $('#IdStudyField').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdField, text: v.FieldName }); }));
            }

            $('#IdStudyField').val(_ID_STUDYFIELD == 0 ? null : _ID_STUDYFIELD).trigger('change');
        },
    });
}

function LoadSubjectByClassId() {
    _ID_CLASS = $("#selectedClass").val();
    LoadClassSubject();
}

function LoadClassSubject() {
    $('#mainGroup').hide();

    $('#selectedSubject').attr('disabled', true);
    $('#selectedSubject').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    if (_ID_CLASS == null || _ID_CLASS == 0) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "/api/ClassAPI/GetSubjectTeacherClass?IdClass=" + _ID_CLASS,
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            $('#selectedSubject').attr('disabled', false);
            $("#selectedSubject").html("");

            if (result.Object !== undefined && result.Object !== null) {
                $('#selectedSubject').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdSubject, text: v.SubjectName }); }));
            }

            $('#selectedSubject').val(_ID_SUBJECT == 0 ? null : _ID_SUBJECT).trigger('change');
        },
    });
}

function LoadScoreType() {
    _ID_SUBJECT = $("#IdSubject").val();
    _ID_STUDYFIELD = $("#IdStudyField").val();

    if (_ID_SUBJECT != 0 && _ID_STUDYFIELD != null) {
        LoadScoreTypeData();
    }
}

function LoadScoreTypeData() {
    dataTable.ajax.url('/api/classapi/GetClassSubjectScoreType?idStudyField=' + (_ID_STUDYFIELD ?? 0) + "&idSubject=" + (_ID_SUBJECT ?? 0));
    dataTable.ajax.reload();
}


$('#result tbody').on('click', '.editor-edit', function () {
    let row = dataTable.row($(this).closest("tr")).data();
    GetScoreType(row.IdScoreType);
});

$('#result tbody').on('click', '.editor-delete', function () {
    let row = dataTable.row($(this).closest("tr")).data();

    swal({
        text: `Bạn có muốn xoá thành phần điểm '${row.ScoreName}' không?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: "DELETE",
                url: "/api/scoreapi/deletescoretype/" + row.IdScoreType,
                dataType: 'json',
                headers: {
                    "Authorization": "Baerer " + _JWT_TOKEN
                },
                success: function (result) {
                    if (!result.IsSuccess) {
                        swal(result.Message, {
                            icon: "error",
                        });
                    }
                    else {
                        swal("Xoá thành phần điểm thành công");
                        dataTable.ajax.reload();
                    }
                }
            });
        }
    });
});

//function OpenModalImportTimeline() {
function OpenModalImportListScore() {
    $("#excelFile").val(null);
    $("#uploadModalFileListScore").modal("show");
}