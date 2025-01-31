function querySalary() {
    let employeeID = document.getElementById("employeeID").value;
    let resultDiv = document.getElementById("result");

    // 這裡應該連接 Google Sheets 或 Firebase
    if (employeeID === "12345") {
        resultDiv.innerHTML = "您的薪資：NT$50,000";
    } else {
        resultDiv.innerHTML = "查無此員工編號";
    }
}
