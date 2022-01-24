/**
 * This file contains all the listener and function to call the login.php service in order to log the user.
 * Some input checks are performed by listener functions
 * @author  Agostino Messina
 */

//global variables
let error_username;
let error_password;

//document ready
$(document).ready(function () {
    error_username = $('#error-username');
    error_password = $('#error-password');
    general_error = $('#general-error');
    $('#login-username').on("input blur", onUsernameChange);
    $('#login-password').on("input blur", onPasswordChange);
    $('#login-password').keyup(function (event) {
        if (event.originalEvent.getModifierState("CapsLock")) {
            general_error.text("Caps lock è attivo");
            general_error.show();
        } else general_error.hide();
    });
    $('#submit').click(function () {
        onUsernameChange();
        onPasswordChange();
    });
});

//submit listener for the login form
$('form').submit(function () {
    $.get("./php/login.php", 'username=' + $('#login-username').val() +
        "&password=" + $('#login-password').val(),
        function (data) {
            switch (data) {
                case 'PSW_ERR':
                    error_password.text("La password è errata");
                    error_password.show();
                    break;
                case 'USR_ERR':
                    error_username.text("L'indirizzo e-mail o username non esiste");
                    error_username.show();
                    break;
                case 'LOGGED':
                    window.location = "php/home.php";
                    break;
                default:
                    general_error.text(data);
                    general_error.show();
            }
        },
    );
});

/**
 * listener function for checking the username field and returning detailed errors to the view
 * @param event
 */
function onUsernameChange(event) {
    if ($('#login-username').val().length === 0) {
        error_username.text("Il campo username non può essere vuoto");
        $('#login-username').addClass("invalid");
        error_username.show();
    } else {
        $('#login-username').removeClass("invalid");
        error_username.hide();
    }
}

/**
 * listener function for checking the password field and returning detailed errors to the view
 * @param event
 */
function onPasswordChange(event) {
    if ($('#login-password').val().length === 0) {
        error_password.text("Il campo password non può essere vuoto");
        $('#login-password').addClass("invalid");
        error_password.show();
    } else {
        $('#login-password').removeClass("invalid");
        error_password.hide();
    }
}

