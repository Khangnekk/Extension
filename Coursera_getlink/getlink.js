
const waitAndExecute = async () => {

    await new Promise(resolve => setTimeout(resolve, 7500));

    console.log("Đã tải xong tài nguyên");
    // logic chính
    let labelElement = document.querySelector('.cds-formLabel-root');
    let labelForAttribute = labelElement.getAttribute('for');
    const startIndex = labelForAttribute.indexOf('~comment');
    const id = labelForAttribute.substring(0, startIndex);
    const currentUrl = window.location.href;
    const url = currentUrl.replace("submit","review/")
    const finalLink = url + id;
    // kết thúc logic chính
    console.log('ID:', id);
    console.log('Link:', finalLink);
    chrome.storage.local.set({ "myVariable": finalLink });
    if (finalLink) {
        // alert("Đã tải xong tài nguyên")
        AppendToast("Đã tải xong tài nguyên");
    }
};

waitAndExecute();

function AppendToast(msg) {
    const targetElement = document.getElementById("rendered-content");
    const newDiv = document.createElement("div");
    newDiv.classList.add("toast");
    const strongElement = document.createElement("strong");
    strongElement.textContent = "Thông báo:";
    const pElement = document.createElement("p");
    pElement.textContent = msg;
    newDiv.appendChild(strongElement);
    newDiv.appendChild(pElement);
    targetElement.appendChild(newDiv);
    const styleElement = document.createElement("style");

    styleElement.textContent = `
    /* CSS cho toast */
    .toast {
        width: 200px;
        height: 60px;
        position: fixed;
        top: 80px;
        right: 36px;
        background-color: rgb(3 136 95);
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transition: all 2.2s ease;
    }

    /* Tùy chỉnh màu nền và màu chữ */
    .toast.success {
        background-color: #4CAF50;
    }

    .toast.error {
        background-color: #F44336;
    }
    `;

    document.head.appendChild(styleElement);
    setTimeout(() => {
        strongElement.textContent = "";
        pElement.textContent = "";
        newDiv.style.width = "0";
    }, 2000);
    setTimeout(() => {
        newDiv.remove();
    }, 3000);
}
