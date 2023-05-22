var _ID_SEMESTER = 0;

function CreateNewSemester() {
    _ID_SEMESTER = 0;
    openModalSemester("add", null);
}

function getListYear(type, callback) {
    var selectElement = document.getElementById("IdYear");
    var semesterElement = document.getElementById("IdSemester");
    selectElement.innerHTML = "";
    semesterElement.innerHTML = "";
    $.ajax({
        type: "GET",
        url: '/api/semesterapi/getListYear',
        type: 'GET',
        headers: {
            "Authorization": "Bearer " + _JWT_TOKEN
        },
        success: function (result) {
            var options = [
                { value: "0", text: "Chọn học kỳ" },
                { value: "1", text: "2022-2023" },
                { value: "2", text: "2023-2024" },
                { value: "3", text: "2024-2025" },
                { value: "4", text: "2025-2026" },
                { value: "5", text: "2026-2027" },
                { value: "6", text: "2027-2028" },
                { value: "7", text: "2028-2029" },
                { value: "8", text: "2029-2030" }
            ];

            let optionsYearFilter = [];
            if (type === 'add') {
                optionsYearFilter = options.filter(function (option) {
                    return !result.some(function (item) {
                        return item.YearName === option.text && item.IsHasTwoSemester;
                    });
                });
            } else {
                optionsYearFilter = options;
            }

            optionsYearFilter.forEach(function (option) {
                var optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.text = option.text;
                selectElement.appendChild(optionElement);
            });

            if (type !== 'add' && typeof callback === 'function') {
                callback(result);
            }
        },
        complete: function () {
            $("#loading").hide();
            $("#inputform").show();
        }
    });
}

function openModalSemester(type, row) {
    $("#semesterModal").modal("show");
    $("#inputform").hide();
    $("#loading").show();
    getListYear(type, function (data) {
        GetSemester(data, row);
    });
}

function GetSemester(data, row) {
   
    // getListYear return data mới tiếp tục call api dưới đây
    $.ajax({
        type: "GET",
        url: "/api/semesterapi/getsemester/" + row.IdSemester,
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
                var selectElement = document.getElementById("IdYear");
                selectElement.innerHTML = "";
                var yearOps = [
                    { value: "0", text: "Chọn học kỳ" },
                    { value: "1", text: "2022-2023" },
                    { value: "2", text: "2023-2024" },
                    { value: "3", text: "2024-2025" },
                    { value: "4", text: "2025-2026" },
                    { value: "5", text: "2026-2027" },
                    { value: "6", text: "2027-2028" },
                    { value: "7", text: "2028-2029" },
                    { value: "8", text: "2029-2030" }
                ];
                var optionsYearFilter = yearOps.filter(function (option) {
                    return !data.filter((x) => x.YearName !== row.SemesterYear).some(function (item) {
                        return item.YearName === option.text && item.IsHasTwoSemester;
                    });
                });

                for (var i = 0; i < optionsYearFilter.length; i++) {
                    var option = optionsYearFilter[i];
                    if (option.text === result.Object.SemesterYear) {
                        option.selected = true;
                        break;
                    }
                }

                optionsYearFilter.forEach(function (option) {
                    var optionElement = document.createElement("option");
                    optionElement.value = option.value;
                    optionElement.text = option.text;
                    optionElement.selected = option.selected;
                    selectElement.appendChild(optionElement);
                });
                // populate HK
                var selectElementSemester = document.getElementById("IdSemester");
                selectElementSemester.innerHTML = "";
                var optionHK = [
                    { value: "1", text: "Học kỳ 1" },
                    { value: "2", text: "Học kỳ 2" },
                ];
                var isHasTwoSemester = data.find((x) => x.YearName === row.SemesterYear)?.IsHasTwoSemester;
                if (!isHasTwoSemester) {
                    for (var i = 0; i < optionHK.length; i++) {
                        var option = optionHK[i];
                        if (option.text === row.SemesterName) {
                            option.selected = true;
                            break;
                        }
                    }
                    optionHK.forEach(function (option) {
                        var optionElement = document.createElement("option");
                        optionElement.value = option.value;
                        optionElement.text = option.text;
                        optionElement.selected = option.selected;
                        selectElementSemester.appendChild(optionElement);
                    });
                } else {
                    optionHK.filter((x) => x.text === row.SemesterName).forEach(function (option) {
                        var optionElement = document.createElement("option");
                        optionElement.value = option.value;
                        optionElement.text = option.text;
                        optionElement.selected = true;
                        selectElementSemester.appendChild(optionElement);
                    });
                }
                $("[name=ScoreWeight]").val(result.Object.ScoreWeight);
                $("#DateStart").datetimepicker("date", result.Object.DateStart)
                $("#DateEnd").datetimepicker("date", result.Object.DateEnd)
                $("[name=IsCurrentSemester]").prop('checked', result.Object.IsCurrentSemester);

                _ID_SEMESTER = row.IdSemester;
            }
        },
        complete: function () {
            $("#loading").hide();
            $("#inputform").show();
        }
    });
}

function parseDate(dateString) {
    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    return new Date(year, month - 1, day);
}

function SaveSemester() {
    var semesterYear = $("#IdYear option:selected").text();
    var semesterName = $("#IdSemester option:selected").text();
    var dateStartInput = document.querySelector('input[name="DateStart"]').value;
    var dateEndInput = document.querySelector('input[name="DateEnd"]').value;
    if (semesterYear === "Chọn học kỳ") {
        swal("Vui lòng chọn học kỳ");
        return;
    }
    if (!dateStartInput || !dateEndInput) {
        swal("Vui lòng chọn ngày bắt đầu và kết thúc học kỳ");
        return;
    }
    var startDate = parseDate(dateStartInput);
    var endDate = parseDate(dateEndInput);

    if (semesterName === 'Học kỳ 1') {
        var semesterStart = new Date('09/01/' + semesterYear.split('-')[0]);
        var semesterEnd = new Date('01/31/' + semesterYear.split('-')[1]);
        var conditionHK1 = startDate < endDate && startDate >= semesterStart && startDate < semesterEnd && endDate > semesterStart && endDate <= semesterEnd;

        if (!conditionHK1) {
            swal(`Thời gian HK1 phải nằm trong khoảng từ 01/09/${semesterYear.split('-')[0]} đến 31/01/${semesterYear.split('-')[1]}`);
            return;
        }
    } else if (semesterName === 'Học kỳ 2') {
        var semesterStart = new Date('02/01/' + semesterYear.split('-')[1]);
        var semesterEnd = new Date('05/31/' + semesterYear.split('-')[1]);
        var conditionHK2 = startDate < endDate && startDate >= semesterStart && startDate < semesterEnd && endDate > semesterStart && endDate <= semesterEnd;

        if (!conditionHK2) {
            swal(`Thời gian HK2 phải nằm trong khoảng từ 01/02/${semesterYear.split('-')[1]} đến 31/05/${semesterYear.split('-')[1]}`);
            return;
        }
    }
    $("#inputform").hide();
    $("#loading").show();

    $.ajax({
        type: "POST",
        url: "/api/semesterapi/savesemester",
        dataType: 'json',
        headers: {
            "Authorization": "Baerer " + _JWT_TOKEN
        },
        data: {
            IdSemester: _ID_SEMESTER,
            SemesterYear: $("#IdYear option:selected").text(),
            SemesterName: $("#IdSemester option:selected").text(),
            ScoreWeight: $("[name=ScoreWeight]").val(),
            DateStart: $("#DateStart").datetimepicker("date")?.format('yyyy-MM-DDT00:00:00') ?? null,
            DateEnd: $("#DateEnd").datetimepicker("date")?.format('yyyy-MM-DDT00:00:00') ?? null,
            IsCurrentSemester: $("[name=IsCurrentSemester]").is(":checked"),
        },
        success: function (result) {
            if (!result.IsSuccess) {
                swal(result.Message, {
                    icon: "error",
                });
            }
            else {
                swal("Lưu dữ liệu thành công");
                dataTable.ajax.reload();
                $("#semesterModal").modal("hide");
                window.location.reload();
            }
        },
        complete: function () {
            $("#loading").hide();
            $("#inputform").show();
        }
    });
}

function onYearChange() {
    var selectedYearId = document.getElementById("IdYear").value;
    var selectElement = document.getElementById("IdSemester");
    if (selectedYearId !== "0") {
        $.ajax({
            type: "GET",
            url: "/api/semesterapi/GetListSemesterByYear/" + selectedYearId,
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + _JWT_TOKEN
            },
            success: function (result) {
                selectElement.innerHTML = "";
                var optionHK = [
                    { value: "1", text: "Học kỳ 1" },
                    { value: "2", text: "Học kỳ 2" },
                ];
                // Tạo và thêm các phần tử option vào select
                if (result.length) {
                    var resultFilter = optionHK.filter(function (option) {
                        return !result.some(function (item) {
                            return item.SemesterName === option.text;
                        });
                    });
                    resultFilter.forEach(function (option) {
                        var optionElement = document.createElement("option");
                        optionElement.value = option.value;
                        optionElement.text = option.text;
                        selectElement.appendChild(optionElement);
                    });
                } else {
                    optionHK.forEach(function (option) {
                        var optionElement = document.createElement("option");
                        optionElement.value = option.value;
                        optionElement.text = option.text;
                        selectElement.appendChild(optionElement);
                    });
                }
            },
        });
    } else {
        selectElement.innerHTML = "";
    }
}