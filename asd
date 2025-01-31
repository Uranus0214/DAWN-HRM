<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>薪資查詢系統</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>員工薪資查詢</h1>
        <form id="salary-form">
            <label for="employee-id">員工ID:</label>
            <input type="text" id="employee-id" name="employee-id" required>
            <br><br>
            <label for="month">查詢月份:</label>
            <input type="month" id="month" name="month" required>
            <br><br>
            <button type="submit">查詢薪資</button>
        </form>

        <div id="salary-result" style="display:none;">
            <h2>薪資明細</h2>
            <p>基本薪資: <span id="base-salary"></span></p>
            <p>勞保: <span id="labor-insurance"></span></p>
            <p>健保: <span id="health-insurance"></span></p>
            <p>總薪資: <span id="total-salary"></span></p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
