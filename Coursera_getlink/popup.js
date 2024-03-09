chrome.storage.local.get("myVariable", function (result) {
    document.getElementById("btn-getlink").addEventListener("click", function () {
        document.getElementById("btn-copy").innerText = 'Copy';
        document.getElementById("getlink").value = result.myVariable
    });
});

document.getElementById("btn-delete").addEventListener("click", function () {
    document.getElementById("btn-copy").innerText = 'Copy';
    chrome.storage.local.clear();
    document.getElementById("getlink").value = ''
});

document.getElementById("btn-copy").addEventListener("click", function () {
    document.getElementById("btn-copy").innerText = 'Copied!';
    var inputElement = document.getElementById("getlink");
    inputElement.select();
    navigator.clipboard.writeText(inputElement.value)
    .then(function() {
        console.log("Đã copy nội dung vào clipboard!");
    })
    .catch(function(err) {
        console.error("Lỗi khi copy nội dung:", err);
    });
    chrome.storage.local.clear();
    document.getElementById("getlink").value = ''
});