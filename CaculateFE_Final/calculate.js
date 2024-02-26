let allSubjectRows = document.querySelectorAll('#ctl00_mainContent_divGrade table tbody tr');
(function calculateGrade() {
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
    var diemgioi = (tarGet2 - (total))/ percentFE;
    var urlRaw = window.location.href;
    const url = new URL(urlRaw);
    const searchParams = url.searchParams;
    var course = searchParams.get('course');
    console.log("Course: "+course);
    var EstimatedFEScore = 0;
    if(course != null){
        EstimatedFEScore = prompt("Bạn nghĩ là bạn được bao nhiêu điểm FE\nNếu bấm 'Cancel' thì điểm FE mặc định là: 0");
        if(EstimatedFEScore == null || EstimatedFEScore == ''|| isNaN(EstimatedFEScore)){
            EstimatedFEScore = 0;
        }  
    }
    console.log(EstimatedFEScore)
    var diemdudoan = total + (EstimatedFEScore * percentFE)  
    console.log("-------------");
    $('#ctl00_mainContent_divGrade table caption').append(` -<br>
    <div style="padding: 15px; border: 2px solid #ccc; ">
        <span class="label label-info" style="color: orange; padding: 0; background-color: white; line-height: 1.5; font-weight: bold">
            <img style="border: 1px solid #ccc;"
            src="https://play-lh.googleusercontent.com/BFYTO8vhN2ZveSWA7XGoQVwei9cCvpi2je5eyDI2a1WoKxTjJJw5Sv8ULoQEGqAYo0g=w240-h480-rw" width=30 />
             FPT University score calculation tool 
        </span>
        <span class="label label-info" style="color: black; padding: 0; background-color: white; line-height: 1.5; font-weight: normal"> 
           - FE cần :<a style="color: red;">${diemtrungbinh.toFixed(2)}</a> điểm để qua môn
        </span> 
        <span class="label label-info" style="color: black; padding: 0;background-color: white; line-height: 1.5; font-weight: normal">
           - FE cần: <a style="color: red;">${diemgioi.toFixed(2)}</a> điểm để average được "8"
        </span>
        <span class="label label-info" style="color: black; background-color: white;line-height: 1.5; font-weight: normal">   
        Bạn dự đoán điểm FE môn này là: ${EstimatedFEScore} => Average: ${diemdudoan.toFixed(2) } 
        </span>
    </div>`);
    console.log('% FE: ' + percentFE);
    console.log('Diem pass: ' + diemtrungbinh);
})();

