function clickButton() {
    var buttons = document.querySelectorAll('button.AssemblyButtonBase.AssemblyTextButton.AssemblyTextButton--secondary.AssemblyButtonBase--large.AssemblyButtonBase--padding');
    var buttonFound = false;

    buttons.forEach(function(button) {
        if (button.textContent.includes('Hiển thị thêm')) {
            button.click();
            buttonFound = true;
        }
    });

    if (buttonFound) {
        // Gửi thông báo để hiện loading animation
        chrome.runtime.sendMessage({ showLoading: true });

        // Đợi 2 giây rồi gọi extractData
        setTimeout(() => {
            extractData();
            // Gửi thông báo để ẩn loading animation
            chrome.runtime.sendMessage({ showLoading: false });
        }, 2000);
    } else {
        extractData(); // Nếu không tìm thấy nút "Hiển thị thêm", tiến hành trích xuất dữ liệu ngay lập tức
    }
}

function extractData() {
    const questionDivs = document.querySelectorAll('.s1mdxb3l.s1dwwm4d');
    const answerDivs = document.querySelectorAll('.s1mdxb3l.l150nly7');

    const qaList = [];

    for (let i = 0; i < Math.min(questionDivs.length, answerDivs.length); i++) {
        const questionText = questionDivs[i].textContent.trim();
        const answerText = answerDivs[i].textContent.trim();

        qaList.push({
            question: questionText + " ",
            answer: answerText + " "
        });
    }

    // Gửi dữ liệu đã trích xuất về popup
    chrome.runtime.sendMessage({ extractedData: qaList });

    console.table(qaList);
}

// Gọi hàm clickButton ngay lập tức khi script được tiêm vào trang
clickButton();
