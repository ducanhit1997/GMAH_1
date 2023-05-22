document.getElementById('excelFile').addEventListener('change', function (e) {
    var fileName = document.getElementById("excelFile").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = fileName
})

function OpenModalImport() {
    $("#uploadModalFile").modal("show");
    $("#excelFile").val(null);
}



function ImportListScoreType() {
    var fileName = $("#excelFile").val();
    if (!fileName) {
        alert("Vui lòng chọn ít nhất 1 file");
        return;
    }
    // Lấy file đưa vào payload
    var formData = new FormData();
    formData.append('file', document.querySelector('#excelFile').files[0]);

    $.ajax({
        type: "POST",
        url: "/api/scoreapi/ImportListScoreType",
        // url: "/api/userapi/ImportStudentFromExcel",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN,
        },
        success: function (result) {
            if (result.IsSuccess) {
                $("#uploadModalFileListScore").modal("hide");
                let message = "Import thành công, ngoài ra nhưng bang dưới đây không tồn tại nên sẽ không được import:\n";
                if (result.StudyFieldsNotExits.length > 0) {
                    message += "Bang: " + result.StudyFieldsNotExits.join(", ") + "\n";
                }
                if (!result.StudyFieldsNotExits.length) {
                    message = "Import thành công"
                }
                swal(message).then(() => {
                    location.reload();
                });
            } else {
                $("#uploadModalFileListScore").modal("hide");
                swal("Đã xảy ra lỗi", result.Message).then(() => {
                    location.reload();
                });
            }
        },
        error: function (err) {
            $("#uploadModalFileListScore").modal("hide");
            swal("Đã xảy ra lỗi", err).then(() => {
                location.reload();
            });
        }
    });
}
