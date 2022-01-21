let error_email;
let error_email_confirm;
let error_password;
let error_username;
let error_year;
let error_month;
let error_day;
let error_gender;
let is_touched = false;

$(document).ready(function () {
    error_email = $('#error-email');
    error_email_confirm = $('#error-email-confirm');
    error_password = $('#error-password');
    error_username = $('#error-username');
    error_year = $('#error-year');
    error_month = $('#error-month');
    error_day = $('#error-day');
    error_gender = $('#error-gender');

    $('#email').on(" input blur", onEmailChange);
    $('#email-confirm').on(" input blur", onEmailConfirmChange);
    $('#password').on(" input blur", onPasswordChange);
    $('#username').on(" input blur", onUsernameChange);
    $('#year').on(" input blur", onYearChange);
    $('#month').on("change blur", onMonthChange);
    $('#day').on(" input blur", onDayChange);
    $('#gender').on(" input", onGenderChange);

    $('#submit').click(function () {
        onEmailChange();
        onEmailConfirmChange();
        onPasswordChange();
        onUsernameChange();
        onYearChange();
        onMonthChange();
        onDayChange();
        onGenderChange();
    });

});


$('form').submit(function () {
    if ($('#email-confirm').val() !== $('#email').val()) {
        return null;
    }

    $.ajax({
        type: 'POST',
        url: './signup_call.php',
        data: {
            "email": $('#email').val().trim(),
            "password": $('#password').val().trim(),
            "username": $('#username').val().trim(),
            "birth_date": $('#year').val() + $('#month').val() + $('#day').val(),
            "gender": $("form input[type='radio']:checked").val(),
        },
        success: function (data) {
            console.log(data);
            switch (data) {
                case 'USERNAME_EXIST':
                    error_username.text("Questo username è già in uso");
                    error_username.show();
                    break;
                case 'EMAIL_EXIST':
                    error_email.text("Questa e-mail è già in uso");
                    error_email.show();
                    break;
                case 'REGISTERED':
                    window.location = "./signup_success.php";
                    break;
                default:
                    error_gender.text(data);
                    error_gender.show();
            }
        }
    });
});

function isEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function onEmailChange(event) {
    if ($('#email').val().length === 0) {
        error_email.text("Il campo e-mail non può essere vuoto");
        error_email.show();
    } else if (!isEmail($('#email').val())) {
        error_email.text("Rispetta il formato per il campo e-mail");
        error_email.show();
    } else if (is_touched && $('#email-confirm').val() !== $('#email').val()) {
        error_email_confirm.text("Le e-mail non corrispondono");
        error_email_confirm.show();
        error_email.hide();
    } else if ($('#email-confirm').val() === $('#email').val()) {
        error_email_confirm.hide();
        error_email.hide();
    } else {
        error_email.hide();
    }
}

function onEmailConfirmChange(event) {
    is_touched = true;
    if ($('#email-confirm').val().length === 0) {
        error_email_confirm.text("Il campo conferma e-mail non può essere vuoto");
        error_email_confirm.show();
    } else if ($('#email-confirm').val() !== $('#email').val()) {
        error_email_confirm.text("Le e-mail non corrispondono");
        error_email_confirm.show();
    } else {
        error_email_confirm.hide();
    }
}

function onPasswordChange(event) {
    if ($('#password').val().length === 0) {
        error_password.text("Il campo password non può essere vuoto");
        error_password.show();
    } else if ($('#password').val().length < 8) {
        error_password.text("La password deve essere di almeno 8 caratteri");
        error_password.show();
    } else {
        error_password.hide();
    }
}

function onUsernameChange(event) {
    if ($('#username').val().length === 0) {
        error_username.text("Il campo username non può essere vuoto");
        error_username.show();
    } else {
        error_username.hide();
    }
}

function onYearChange(event) {
    if ($('#year').val().length === 0) {
        error_year.text("Il campo anno non può essere vuoto");
        error_year.show();
    } else if ($('#year').val() < 1900) {
        error_year.text("Il campo anno non può essere minore di 1900");
        error_year.show();
    } else if ($('#year').val() > 2007) {
        error_year.text("Il campo anno non può essere maggiore di 2007");
        error_year.show();
    } else if (!$.isNumeric($('#year').val())) {
        error_year.text("Il formato del campo anno non è valido");
        error_year.show();
    } else {
        error_year.hide();
    }
}

function onMonthChange(event) {
    if ($('#month').val() === null) {
        error_month.text("Il campo mese non può essere vuoto");
        error_month.show();
    } else {
        error_month.hide();
    }
}

function onDayChange(event) {
    if ($('#day').val().length === 0) {
        error_day.text("Il campo giorno non può essere vuoto");
        error_day.show();
    } else if (!$.isNumeric($('#day').val())) {
        error_day.text("Il formato del campo giorno non è valido");
        error_day.show();
    } else {
        error_day.hide();
    }
}

function onGenderChange(event) {
    if (checkSelectedGender()) {
        error_gender.text("Il campo sesso non può essere vuoto");
        error_gender.show();
    } else {
        error_gender.hide();
    }
}

function checkSelectedGender() {
    return ($('#gender_option_male:checked').length <= 0 &&
        $('#gender_option_female:checked').length <= 0 &&
        $('#gender_option_nonbinary:checked').length <= 0);
}
