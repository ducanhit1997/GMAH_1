document.addEventListener("DOMContentLoaded", function (event) {
    LoadNumberReport();
});

function LoadNumberReport() {
    $.ajax({
        type: "GET",
        url: "/api/reportapi/GetReviewReportNumber",
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN,
        },
        success: function (result) {
            $("#numberReport").html(result);
        }
    });
}