var EstimatedFEScore = 0;
var isEnable = false;
// Định nghĩa hàm tính toán điểm khi người dùng nhập giá trị và nhấn nút
function calculateGrade() {
    var urlRaw = window.location.href;
    const url = new URL(urlRaw);
    const searchParams = url.searchParams;
    var course = searchParams.get('course');
    console.log("Course: " + course);
    var EstimatedFEScore = 0;
    if (course != null) {
        EstimatedFEScore = document.getElementById("fees").value;
        console.log(EstimatedFEScore);
        if (EstimatedFEScore == null || EstimatedFEScore == '' || isNaN(EstimatedFEScore)) {
            EstimatedFEScore = 0;
        }
    }
    var tarGet = 5;
    var tarGet2 = 8;
    let total = 0;
    let allRowFE = allSubjectRows[allSubjectRows.length - 1];
    let percentFE = (+$(allRowFE).find('td:nth-child(2)').text().split(' ')[0]) / 100;

    for (let i = 0; i < allSubjectRows.length; i++) {
        let element = allSubjectRows[i];
        let item = $(element).find('td:nth-child(2)');
        if ($(element).children('td').length == 4) {
            item = $(element).find('td:nth-child(1)');
        }
        let weight;
        let value;
        if ($(allSubjectRows[i]).children('td').length == 5) {
            value = $(element).find('td:nth-child(4)');
            weight = $(element).find('td:nth-child(3)');
        } else {
            value = $(element).find('td:nth-child(3)');
            weight = $(element).find('td:nth-child(2)');
        }
        if ($(item).text().includes("FE") ||
            $(item).text().includes("Final") ||
            $(item).text().includes("Total") ||
            +$(value).text() == 0) {
            continue;
        }
        $(item).css({ "color": "blue", "font-weight": "bold" });
        $(allRowFE).css({ "color": "blue", "font-weight": "bold" });
        $(value).css({ "color": "blue", "font-weight": "bold" });
        $(weight).css({ "color": "blue", "font-weight": "bold" });

        var percent = ($(weight).text().split(' ')[0]) / 100;
        console.log(item.text() + ": " + "WEIGHT: " + $(weight).text() + " (" + percent + ") VALUE: " + $(value).text());
        total += +$(value).text() * percent;
    }
    console.log("Total: " + total);
    var diemtrungbinh = (tarGet - (total)) / percentFE;
    var diemgioi = (tarGet2 - (total)) / percentFE;

    var diemdudoan = total + (EstimatedFEScore * percentFE)
    console.log("-------------");

    // Thêm dòng kết quả vào mỗi lần tính toán
    appendPredictionResult(diemtrungbinh, diemgioi, diemdudoan, isEnable, EstimatedFEScore);

    console.log('% FE: ' + percentFE);
    console.log('Diem pass: ' + diemtrungbinh);
}

// Thêm sự kiện cho nút input fees
$('#ctl00_mainContent_divGrade table caption').append(` -<br>
    <div style="padding: 0.25em; border: 2px solid #ccc; min-width: 574px ">
    <div style="display:flex; justify-content:center; align-items: center;">
    <span class="label label-info" style="color: orange; padding: 0; background-color: white; line-height: 1.5; font-weight: bold">
    <img style="border: 1px solid #ccc; border-radius: 8px;" src="https://play-lh.googleusercontent.com/BFYTO8vhN2ZveSWA7XGoQVwei9cCvpi2je5eyDI2a1WoKxTjJJw5Sv8ULoQEGqAYo0g=w240-h480-rw" width=30 />
        FAP Toolkit (Mark Report)
    </span>
    </div>
    <div style="display:flex; justify-content:center; align-items: center; margin-top: 0.5em">
        <div>
        <input type="text" id="fees" autofocus  style="margin: 0.25em; height: 30px; line-height: 1.5; font-weight: normal; padding: 0.5em;font-size: smaller" placeholder="Nhập điểm fe bạn dự đoán mình sẽ nhận được vào đây">
        </div>
        <div>
        <button class="btn btn-success " style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnFees">Dự đoán</button>
        </div>
        <div>
        <button class="btn btn-primary" style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnShowResult">FE cần ? điểm</button>
        </div>
        <div>
        <button class="btn btn-danger" style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnClear">
           Reset
        </button>
        </div>
    </div>
    </div>`);

// Hàm để thêm dòng kết quả FE vào sau mỗi lần bấm nút
function appendPredictionResult(diemtrungbinh, diemgioi, diemdudoan, isEnable, EstimatedFEScore) {
    if (isEnable == true) {
        $('#ctl00_mainContent_divGrade table caption').find('.feResults').remove();
        $('#ctl00_mainContent_divGrade table caption').append(`
        <div class="feResults" style="padding: 3px 15px; border: 2px solid #ccc; ">
            <span class="label label-info" style="color: black; padding: 0; background-color: white; line-height: 1.5; font-weight: normal"> 
               - FE cần :<a style="color: blue;">${diemtrungbinh.toFixed(2)}</a> điểm để qua môn
            </span> 
            <span class="label label-info" style="color: black; padding: 0;background-color: white; line-height: 1.5; font-weight: normal">
               - FE cần: <a style="color: blue;">${diemgioi.toFixed(2)}</a> điểm để average được <a style="color: green;">"8"</a>
            </span>
        </div>`);
        isEnable = false;
    } else {
        $('#ctl00_mainContent_divGrade table caption').append(`
        <div class="feResults" style="padding: 3px 15px; border: 2px solid #ccc; ">
            <span class="label label-info" style="color: black; background-color: white;line-height: 1.5; font-weight: normal">   
                Bạn dự đoán điểm FE môn này là:<a style="color: blue;"> ${EstimatedFEScore} </a>=> Average: <a style="color: blue;">${diemdudoan.toFixed(2)} </a>
            </span>
        </div>`);
    }

}

// Lấy tất cả các hàng chứa thông tin môn học
let allSubjectRows = document.querySelectorAll('#ctl00_mainContent_divGrade table tbody tr');

// Thêm sự kiện cho nút dự đoán điểm
const btnFees = document.getElementById("btnFees");
const btnShowResult = document.getElementById("btnShowResult");
const btnClear = document.getElementById("btnClear");
window.addEventListener("load", (event) => {
    var url = window.location.href;
    if (url.includes("fap.fpt.edu.vn/Grade/")) {
        isEnable = true;
        calculateGrade();
        if (btnShowResult != null)
            btnShowResult.style.display = 'none';
    }
});

if (btnFees != null) {
    btnFees.addEventListener('click', () => {
        isEnable = false;
        calculateGrade();
    });
}
if (btnShowResult != null) {
    btnShowResult.addEventListener('click', () => {
        isEnable = true;
        calculateGrade();
        btnShowResult.style.display = 'none';
    });
}
if (btnClear != null) {
    btnClear.addEventListener('click', () => {
        $('.feResults').remove();
        btnShowResult.style.display = 'block';
    });
}
$('#ctl00_mainContent_ghichu').append(`
    <div style="padding: 0.25em; border: 2px solid #ccc;  width: 100%; margin: 0.3em 0;display:flex; justify-content:center; align-items: center; ">
        <div style="display:flex; justify-content:center; align-items: center;">
            <span class="label label-info" style="color: orange; font-size: 1em; padding: 0; background-color: white; line-height: 1.5; font-weight: bold">
                <img style="border: 1px solid #ccc; border-radius: 8px;" src="https://play-lh.googleusercontent.com/BFYTO8vhN2ZveSWA7XGoQVwei9cCvpi2je5eyDI2a1WoKxTjJJw5Sv8ULoQEGqAYo0g=w240-h480-rw" width=30 />
                FAP Toolkit (View Schedule)
            </span>
        </div>
        <div style="padding: 3px 15px;">
            <span class="label label-info" style="color: black; font-size: 1em; padding: 0; background-color: white; line-height: 1.5; font-weight: normal"> 
               - Chọn 1 ngày trong ô WEEK, hệ thống sẽ tự động lấy ra lịch học 1 tuần có chứa ngày đó
            </span> 
            <br>
            <span class="label label-info" style="color: black; font-size: 1em; padding: 0;background-color: white; line-height: 1.5; font-weight: normal">
               - Ngày được chọn sẽ được highlight
            </span>
        </div>
    </div>`);

// Lắng nghe sự kiện khi trang web được tải
window.addEventListener("load", (event) => {
    var url = window.location.href;

    if (url != 'https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx'
        || sessionStorage.getItem('selectedDate') == null)
        sessionStorage.setItem('selectedDate', getCurrentDate().toString());
    var dropdown = document.getElementById('ctl00_mainContent_drpSelectWeek');
    if (dropdown != null)
        dropdown.hidden = 'true';

    var inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.id = 'selectedDate';
    var sSelectDate = formatDate(sessionStorage.getItem('selectedDate'));
    inputDate.value = sSelectDate;
    var thElements = document.querySelectorAll('table th');
var isFirstThProcessed = false; 

thElements.forEach(function(th) {
    if (!isFirstThProcessed) { 
        th.style.width = "15.5%"; 
        isFirstThProcessed = true; 
    } else {
        th.style.width = "12.5%"; 
    }

    th.style.textAlign = "center"; 
    if (th.textContent.trim() === convertDateFormat(sSelectDate)) { 
        th.style.backgroundColor = "rgb(241 102 102)";
        th.style.color = "white"; 
        th.style.fontWeight = "bold"; 
        th.style.borderRadius = "9px";
    }
});



    inputDate.setAttribute('onchange', "javascript:setTimeout('__doPostBack(\\'ctl00$mainContent$drpSelectWeek\\',\\'\\')', 0)");

    var dropdownParent = document.getElementById('ctl00_mainContent_drpSelectWeek');
    if (dropdownParent != null)
        dropdownParent.parentNode.insertBefore(inputDate, dropdownParent.parentNode.lastElementChild);

    // Lắng nghe sự kiện khi người dùng chọn một ngày trong input date
    inputDate.addEventListener('change', function () {
        var selectedDate = new Date(this.value);
        var selectedWeek = getWeekNumber(selectedDate);
        console.log(selectedWeek);

        selectOptionByValue(selectedWeek);
        sessionStorage.setItem('selectedDate', selectedDate);
    });
});

function getCurrentDate() {
    // Tạo một đối tượng Date mới, đại diện cho thời điểm hiện tại
    var currentDate = new Date();

    // Lấy ngày, tháng và năm từ đối tượng Date
    var day = currentDate.getDate(); // Lấy ngày (1 đến 31)
    var month = currentDate.getMonth() + 1; // Lấy tháng (0 đến 11, cần cộng thêm 1)
    var year = currentDate.getFullYear(); // Lấy năm (4 chữ số)

    // Biến đổi ngày, tháng và năm thành chuỗi
    var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    console.log(formattedDate); // In ra ngày hiện tại dưới dạng yyyy-mm-dd
    return formattedDate;
}

// Hàm để lấy số tuần trong năm từ một ngày cụ thể
function getWeekNumber(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNumber.toString().padStart(2, '0');
}

function selectOptionByValue(value) {
    var dropdown = document.getElementById('ctl00_mainContent_drpSelectWeek');
    for (var i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value === value) {
            dropdown.selectedIndex = i;
            break;
        }
    }
}

function formatDate(dateString) {
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');

    // Tạo chuỗi mới với định dạng "yyyy-mm-dd"
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

function convertDateFormat(dateString) {
    var parts = dateString.split('-');
    var day = parts[2];
    var month = parts[1];
    // Trả về chuỗi có định dạng "dd/mm"
    return day + '/' + month;
}