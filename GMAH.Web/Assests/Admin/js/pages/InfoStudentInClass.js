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
        url: '/api/classapi/GetStudentInClass?idClass=' + (_ID_CLASS == null ? 0 : _ID_CLASS),
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + _JWT_TOKEN
        },
    },
    columns: [
        { data: "StudentCode" },
        { data: "Fullname" },
        {
            data: null,
            className: "text-center editor-delete",
            defaultContent: '<i class="fa fa-trash"/>',
            orderable: false,
            visible: _IS_ADMIN,
        }
    ]
});

$(document).ready(function () {
    LoadSemesterData();
    LoadClassData();
    LoadStudentData();
    LoadStudentInClass();
});

// Event on click delete
$('#result tbody').on('click', '.editor-delete', function () {
    let row = dataTable.row($(this).closest("tr")).data();
    swal({
        text: `Bạn có muốn xoá học sinh '${row.Fullname}' ra khỏi lớp này không?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            RemoveStudent(row.IdUser);
        }
    });
});

function LoadStudentByClassId() {
    _ID_CLASS = $("#selectedClass").val();
    LoadStudentInClass();
}

function LoadClassBySemesterId() {
    _ID_SEMESTER = $("#selectedSemester").val();
    LoadClassData();
}

function LoadStudentData() {
    $('#selectedStudent').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    $.ajax({
        type: "GET",
        url: "/api/userapi/GetAllStudent",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            $("#selectedStudent").html("");

            if (result.Object !== undefined && result.Object !== null) {
                $('#selectedStudent').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdUser, text: v.Fullname }); }));
            }

            $('#selectedStudent').val(null).trigger('change');
        }
    });
}

function LoadSemesterData() {
    $('#selectedSemester').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    if (_ID_SEMESTER === null || _ID_SEMESTER == 0) {
        $("#mainGroup").hide();
    }

    $.ajax({
        type: "GET",
        url: "/api/semesterapi/getcurrentsemester?viewSemester=2",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            $("#selectedSemester").html("");

            if (result.Data !== undefined && result.Data !== null) {
                $('#selectedSemester').append($.map(result.Data, function (v, i) { return $('<option>', { val: v.IdSemester, text: v.TitleName }); }));
            }

            $('#selectedSemester').val(_ID_SEMESTER == 0 ? null : _ID_SEMESTER).trigger('change');
        }
    });
}

function LoadClassData() {
    $('#selectedClass').attr('disabled', true);
    $('#selectedClass').select2({
        placeholder: 'Chọn một giá trị',
        theme: 'bootstrap4'
    });

    if (_ID_CLASS === null || _ID_CLASS == 0) {
        $("#mainGroup").hide();
    }

    $.ajax({
        type: "GET",
        url: "/api/ClassAPI/GetTeacherClassBySemester?viewScore=true&IdYear=" + _ID_SEMESTER,
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        success: function (result) {
            $('#selectedClass').attr('disabled', false);
            $("#selectedClass").html("");

            if (result.Object !== undefined && result.Object !== null) {
                $('#selectedClass').append($.map(result.Object, function (v, i) { return $('<option>', { val: v.IdClass, text: v.ClassName }); }));
            }

            $('#selectedClass').val(_ID_CLASS == 0 ? null : _ID_CLASS).trigger('change');
        },
    });
}

function LoadStudentInClass() {
    if (_ID_CLASS == null || _ID_CLASS == 0) return;

    $("#mainGroup").hide();
    $("#loading").show();

    dataTable.ajax.url('/api/classapi/GetStudentInClass?idClass=' + (_ID_CLASS == null ? 0 : _ID_CLASS));
    dataTable.ajax.reload();

    $("#mainGroup").show();
    $("#loading").hide();
}

function RemoveStudent(idUser) {
    $("#mainGroup").hide();
    $("#loading").show();

    $.ajax({
        type: "DELETE",
        url: "/api/ClassAPI/RemoveStudentToClass",
        data: {
            IdClass: _ID_CLASS,
            IdUser: idUser
        },
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
                swal("Xoá thành công");
                LoadStudentInClass();
            }
        },
        complete: function () {
            $("#loading").hide();
            $("#mainGroup").show();
        }
    });
}

function AddStudent() {

    let idUser = $("#selectedStudent").val();
    if (idUser == null || idUser == 0) {
        swal("Vui lòng chọn một học sinh muốn thêm vào lớp");
        return;
    }

    swal({
        text: "Bạn có muốn thêm học sinh này vào lớp?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $("#mainGroup").hide();
            $("#loading").show();

            $.ajax({
                type: "PUT",
                url: "/api/ClassAPI/AddStudentToClass",
                data: {
                    IdClass: _ID_CLASS,
                    IdUser: idUser
                },
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
                        swal("Thêm thành công");
                        LoadStudentInClass();
                    }
                },
                complete: function () {
                    $('#selectedStudent').val(null).trigger('change');
                    $("#loading").hide();
                    $("#mainGroup").show();
                }
            });
        }
    });
}