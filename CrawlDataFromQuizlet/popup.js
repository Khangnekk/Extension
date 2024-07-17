document.getElementById('export-btn').addEventListener('click', () => {
    // Query the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Inject content.js into the active tab
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ['content.js']
            }
        );
    });
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.extractedData) {
        const messageElement = document.getElementById('message');
        const extractedData = message.extractedData;

        if (extractedData.length > 0) {
            const count = extractedData.length;
            messageElement.textContent = `Export successfully: ${count} items`;
            console.table(extractedData);
            messageElement.style.color = 'green';

            document.getElementById('download-btn').style.display = 'block';
            document.getElementById('send-btn').style.display = 'block';
            document.getElementById('flashcardSetName').style.display = 'block';

            window.extractedData = extractedData;
        } else {
            messageElement.textContent = 'Export failed';
            messageElement.style.color = 'red';
        }
    }
});

document.getElementById('download-btn').addEventListener('click', () => {
    if (window.extractedData) {
        generateExcelFile(window.extractedData);
    } else {
        console.error('No data to download.');
    }
});

document.getElementById('send-btn').addEventListener('click', () => {
    if (window.extractedData) {
        sendDataToServer(window.extractedData);
    } else {
        console.error('No data to send.');
    }
});

// Function to generate Excel file
function generateExcelFile(data) {
    const flashcardSetName = document.getElementById('flashcardSetName').value;

    const wb = XLSX.utils.book_new();
    const ws_data = [['Question', 'Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6', 'Option7', 'Option8', 'Option9', 'Option10', 'Answer']];

    data.forEach(item => {
        const { question, options } = extractQuestionAndOptions(item.question);
        ws_data.push([
            question,
            options[0] || '',
            options[1] || '',
            options[2] || '',
            options[3] || '',
            options[4] || '',
            options[5] || '',
            options[6] || '',
            options[7] || '',
            options[8] || '',
            options[9] || '',
            item.answer
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, flashcardSetName);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flashcardSetName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function sendDataToServer(data) {
    const flashcardSetName = document.getElementById('flashcardSetName').value;

    const dataToSend = {
        name: flashcardSetName,
        questions: data
    };

    fetch('http://localhost:5160/api/FlashcardSets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            console.table(dataToSend);
            throw new Error('Failed to send data to the server.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data sent successfully:', data);
        console.table(dataToSend);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function extractQuestionAndOptions(questionStr) {
    const regex = /([a-z]\)|[A-Z]\.|[a-z]\.|[A-Z]\))/g;

    const parts = questionStr.split(regex).map(part => part.trim()).filter(Boolean);

    const question = parts.shift();

    const options = [];
    for (let i = 0; parts.length > 1 && i < parts.length; i += 2) {
        options.push(parts[i] + ' ' + (parts[i + 1] || ''));
    }

    return { question, options };
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('Crawl data quizlet Extension Installed');
});


document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo hoặc chọn phần tử animation loading
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');

    // Lắng nghe các thông báo từ background script
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.showLoading) {
            // Hiển thị loading animation
            loadingElement.style.display = 'block';
            contentElement.style.display = 'none';
        } else if (message.showLoading === false) {
            // Ẩn loading animation
            loadingElement.style.display = 'none';
            contentElement.style.display = 'block';
        } else if (message.extractedData) {
            // Xử lý dữ liệu đã trích xuất và hiển thị nó
            displayData(message.extractedData);
        }
    });

    function displayData(data) {
        const qaContainer = document.getElementById('qa-container');
        qaContainer.innerHTML = '';

        data.forEach(qa => {
            const qaElement = document.createElement('div');
            qaElement.className = 'qa-item';
            qaElement.innerHTML = `<p><strong>Question:</strong> ${qa.question}</p><p><strong>Answer:</strong> ${qa.answer}</p>`;
            qaContainer.appendChild(qaElement);
        });
    }
});
