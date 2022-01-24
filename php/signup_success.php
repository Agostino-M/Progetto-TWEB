<!DOCTYPE html>
<html lang="en">
<head>
    <!--    Author: Agostino Messina
    signup_success.php is a really simple page.
    It consists of two messages and a redirect to login page with a 4 seconds timer
-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Musify - Success Registered</title>
    <link rel="stylesheet" href="../css/signup.css">
</head>
<body>

<div id="head">
    <img src="../img/Musify_small.svg" alt="Musify logo">
</div>

<hr>

<div id="frame">
    <h2>Registered Success</h2>

    <h3> You will be redirect... </h3>
    <script>
        setTimeout(function () {
            window.location = "../index.php";
        }, 4000);

    </script>
</body>
</html>
