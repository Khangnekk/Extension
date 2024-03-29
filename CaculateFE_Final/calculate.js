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
    appendPredictionResult(diemtrungbinh, diemgioi,diemdudoan, isEnable,EstimatedFEScore);

    console.log('% FE: ' + percentFE);
    console.log('Diem pass: ' + diemtrungbinh);
}

// Thêm sự kiện cho nút input fees
$('#ctl00_mainContent_divGrade table caption').append(` -<br>
    <div style="padding: 0.25em; border: 2px solid #ccc; ">
    <div style="display:flex; justify-content:center; align-items: center;">
        <div>
        <input type="text" id="fees" autofocus  style="margin: 0.25em; height: 30px; line-height: 1.5; font-weight: normal; padding: 0.5em;font-size: smaller" placeholder="Nhập điểm fe bạn dự đoán mình sẽ nhận được vào đây">
        </div>
        <div>
        <button class="btn btn-success " style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnFees">Dự đoán</button>
        </div>
        <div>
        <button class="btn btn-primary" style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnShowResult">Show FE cần đạt</button>
        </div>
        <div>
        <button class="btn btn-danger" style="margin: 0.25em; padding: 0.2em 0.75em;" type="button" id="btnClear">
           Reset
        </button>
        </div>
    </div>
    </div>`);

// Hàm để thêm dòng kết quả FE vào sau mỗi lần bấm nút
function appendPredictionResult(diemtrungbinh, diemgioi,diemdudoan, isEnable,EstimatedFEScore) {
    if (isEnable == true) {
        $('#ctl00_mainContent_divGrade table caption').find('.feResults').remove();
        $('#ctl00_mainContent_divGrade table caption').append(`
        <div class="feResults" style="padding: 15px; border: 2px solid #ccc; ">
            <span class="label label-info" style="color: orange; padding: 0; background-color: white; line-height: 1.5; font-weight: bold">
                <img style="border: 1px solid #ccc;" src="https://play-lh.googleusercontent.com/BFYTO8vhN2ZveSWA7XGoQVwei9cCvpi2je5eyDI2a1WoKxTjJJw5Sv8ULoQEGqAYo0g=w240-h480-rw" width=30 />
                 FPT University score calculation tool 
            </span>
            <span class="label label-info" style="color: black; padding: 0; background-color: white; line-height: 1.5; font-weight: normal"> 
               - FE cần :<a style="color: red;">${diemtrungbinh.toFixed(2)}</a> điểm để qua môn
            </span> 
            <span class="label label-info" style="color: black; padding: 0;background-color: white; line-height: 1.5; font-weight: normal">
               - FE cần: <a style="color: red;">${diemgioi.toFixed(2)}</a> điểm để average được "8"
            </span>
        </div>`);
        isEnable = false;
    } else {
        $('#ctl00_mainContent_divGrade table caption').append(`
        <div class="feResults" style="padding: 15px; border: 2px solid #ccc; ">
            <span class="label label-info" style="color: black; background-color: white;line-height: 1.5; font-weight: normal">   
                Bạn dự đoán điểm FE môn này là: ${EstimatedFEScore} => Average: ${diemdudoan.toFixed(2)} 
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
btnFees.addEventListener('click', () => {
    isEnable = false;
    calculateGrade();
});
btnShowResult.addEventListener('click', () => {
    isEnable = true;
    calculateGrade();
});
btnClear.addEventListener('click', () => {
    $('.feResults').remove();
});