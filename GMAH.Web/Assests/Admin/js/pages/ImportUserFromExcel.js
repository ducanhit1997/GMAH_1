document.getElementById('excelFile').addEventListener('change', function (e) {
    var fileName = document.getElementById("excelFile").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = fileName
})

function OpenModalImport() {
    $("#uploadModalFile").modal("show");
}


function ImportFile(actionName) {
    var fileName = $("#excelFile").val();
    if (!fileName) {
        alert("Vui lòng chọn ít nhất 1 file");
        return;
    }

    // Lấy file đưa vào payload
    var formData = new FormData();
    formData.append('file', document.querySelector('#excelFile').files[0]);

    if (actionName == "Student") {
        $.ajax({
            type: "POST",
            url: "/api/userapi/ImportStudentFromExcel",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "Authorization": "Baerer " + _JWT_TOKEN,
            },
            success: function (result) {
                if (result.IsSuccess) {
                    $("#uploadModalFile").modal("hide");
                    let message = "Import thành công, ngoài ra nhưng mã code và username dưới đây đã tồn tại nên sẽ không được import:\n";
                    if (result.StudentCodeExits.length > 0) {
                        message += "Mã code: " + result.StudentCodeExits.join(", ") + "\n";
                    }
                    if (result.UsernameExits.length > 0) {
                        message += "Tên đăng nhập: " + result.UsernameExits.join(", ") + "\n";
                    }
                    if (!result.StudentCodeExits.length && !result.UsernameExits.length) {
                        message = "Import thành công"
                    }
                    swal(message).then(() => {
                        location.reload();
                    });
                } else {
                    $("#uploadModalFile").modal("hide");
                    swal("Đã xảy ra lỗi", result.Message).then(() => {
                        location.reload();
                    });
                }
            },
            error: function (err) {
                $("#uploadModalFile").modal("hide");
                swal("Đã xảy ra lỗi", err).then(() => {
                    location.reload();
                });
            }
        });
    } else if (actionName == "Parent") {
        $.ajax({
            type: "POST",
            url: "/api/userapi/ImportParentFromExcel",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "Authorization": "Baerer " + _JWT_TOKEN,
            },
            success: function (result) {
                if (result.IsSuccess) {
                    $("#uploadModalFile").modal("hide");
                    let message = "Import thành công, ngoài ra nhưng mã code và username dưới đây đã tồn tại nên sẽ không được import:\n";
                    if (result.StudentCodeExits.length > 0) {
                        message += "Mã code: " + result.StudentCodeExits.join(", ") + "\n";
                    }
                    if (result.UsernameExits.length > 0) {
                        message += "Tên đăng nhập: " + result.UsernameExits.join(", ") + "\n";
                    }
                    if (!result.StudentCodeExits.length && !result.UsernameExits.length) {
                        message = "Import thành công"
                    }
                    swal(message).then(() => {
                        location.reload();
                    });
                } else {
                    $("#uploadModalFile").modal("hide");
                    swal("Đã xảy ra lỗi", result.Message).then(() => {
                        location.reload();
                    });
                }
            },
            error: function (err) {
                $("#uploadModalFile").modal("hide");
                swal("Đã xảy ra lỗi", err).then(() => {
                    location.reload();
                });
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/api/userapi/ImportTeacherFromExcel",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "Authorization": "Baerer " + _JWT_TOKEN,
            },
            success: function (result) {
                if (result.IsSuccess) {
                    $("#uploadModalFile").modal("hide");
                    let message = "Import thành công, ngoài ra nhưng mã code và username dưới đây đã tồn tại nên sẽ không được import:\n";
                    if (result.TeacherCodeExits.length > 0) {
                        message += "Mã code: " + result.TeacherCodeExits.join(", ") + "\n";
                    }
                    if (result.UsernameExits.length > 0) {
                        message += "Tên đăng nhập: " + result.UsernameExits.join(", ") + "\n";
                    }
                    if (!result.TeacherCodeExits.length && !result.UsernameExits.length) {
                        message = "Import thành công"
                    }
                    swal(message).then(() => {
                        location.reload();
                    });
                } else {
                    $("#uploadModalFile").modal("hide");
                    swal("Đã xảy ra lỗi", result.Message).then(() => {
                        location.reload();
                    });
                }
            },
            error: function (err) {
                $("#uploadModalFile").modal("hide");
                swal("Đã xảy ra lỗi", err).then(() => {
                    location.reload();
                });
            }
        });
    }


}
