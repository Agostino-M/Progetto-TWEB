<?php
session_start();
if (!isset($_SESSION['username'])) {
    ?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <!--    Author: Agostino Messina
            Index.php is the first page of the whole application.
            Here you can log in for registered users,
            or you can go to the registration page using the appropriate button below
        -->
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/index.css">
        <link rel="icon" href="img/Musify_favicon.png">
        <script src="https://code.jquery.com/jquery-3.5.1.js"
                integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
        <title>Accedi - Musify</title>
    </head>

    <body>

    <div id="head">
        <img src="img/Musify_small.svg" alt="Musify logo">
    </div>

    <hr>

    <div id="frame">
        <h4>Per continuare, accedi a Musify</h4>

        <form action="javascript:void(0);">
            <div class="row">
                <label for="login-username" class="control-label">
                    Indirizzo e-mail o username
                </label>
                <input type="text" class="form-control" id="login-username" placeholder="Indirizzo e-mail o username"
                       title="Indirizzo e-mail o username"
                       required maxlength="50">
                <label id="error-username" class="control-label-validation" for="login-username">Errore</label>

            </div>
            <div class="row">
                <label for="login-password">
                    Password
                </label>
                <input type="password" id="login-password" placeholder="Password" title="Password" class="form-control"
                       required maxlength="100">
                <label id="error-password" class="control-label-validation" for="login-password">Errore</label>
                <label id="general-error" class="control-label-validation">Errore</label>
            </div>

            <div id="submit-button">
                <input type="submit" id="submit" class="btn" alt="Accedi" title="Accedi" value="Accedi">
            </div>
        </form>

        <hr>

        <div class="row">
            <div id="no-account" class="row">
                <h3>Non hai un account?</h3>
            </div>
        </div>
        <div class="row">
            <a href="php/signup.php " id="sign-up-link" class="btn fullwidth" title="Iscriviti a Musify">Iscriviti a
                Musify</a>
        </div>
    </div>

    </body>
    <script src="js/index.js" type="text/javascript"></script>

    </html>

    <?php
} else {
    header("Location: ./php/home.php");
}
?>
