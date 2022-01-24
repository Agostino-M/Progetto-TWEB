<!DOCTYPE html>
<html lang="en">

<head>
    <!--    Author: Agostino Messina
        signup.php is the page for registering a new user.
        All he needs to do is fill in the form with personal data that meet the specified requirements
     -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/signup.css">
    <link rel="icon" href="../img/Musify_favicon.png">
    <script src="https://code.jquery.com/jquery-3.5.1.js"
            integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
    <title>Iscriviti - Musify</title>
</head>

<body>

<div id="head">
    <img src="../img/Musify_small.svg" alt="Musify logo">
</div>

<hr>

<div id="frame">
    <h2>Iscriviti gratuitamente per iniziare ad ascoltare.</h2>

    <form action="javascript:void(0);">
        <div class="row">
            <label for="email">Qual è il tuo indirizzo e-mail?</label>
            <input class="form-control" type="email" id="email" name="email" placeholder="Inserisci la tua e-mail."
                   title="Inserisci la tua e-mail." required>
            <label id="error-email" class="control-label-validation" for="email">Errore</label>
        </div>

        <div class="row">
            <label for="email-confirm">Conferma la tua e-mail</label>
            <input class="form-control" type="email" id="email-confirm" name="confirm"
                   placeholder="Inserisci nuovamente la tua e-mail." title="Inserisci nuovamente la tua e-mail."
                   required>
            <label id="error-email-confirm" class="control-label-validation" for="email-confirm">Errore</label>
        </div>

        <div class="row">
            <label for="password">Crea una password</label>
            <input class="form-control" type="password" id="password" pattern=".{8,}" name="password"
                   placeholder="Crea una password." title="Crea una password." required>
            <label id="error-password" class="control-label-validation" for="password">Errore</label>
        </div>

        <div class="row">
            <label for="username">Come ti dobbiamo chiamare?</label>
            <input class="form-control" type="text" id="username" name="displayname" required maxlength="20"
                   placeholder="Inserisci un nome del profilo." title="Inserisci un nome del profilo.">
            <label id="error-username" class="control-label-validation" for="username">Errore</label>
        </div>

        <div class="row">
            <div>
                <label>Qual è la data del tuo compleanno?</label>
            </div>

            <div class="data">
                <div id="div-year">
                    <label for="year">Anno</label>
                    <input class="form-control" type="text" id="year" inputmode="numeric" maxlength="4" name="year"
                           pattern="(19[0-9]{2})|(200)[0-7]" placeholder="AAAA" title="Inserisci l'anno" required>
                </div>

                <div id="div-month">
                    <label for="month">Mese</label>
                    <select class="form-control" id="month" name="month" title="Inserisci il mese" required>
                        <option selected disabled value="-1">Mese</option>
                        <option value="01">Gennaio</option>
                        <option value="02">Febbraio</option>
                        <option value="03">Marzo</option>
                        <option value="04">Aprile</option>
                        <option value="05">Maggio</option>
                        <option value="06">Giugno</option>
                        <option value="07">Luglio</option>
                        <option value="08">Agosto</option>
                        <option value="09">Settembre</option>
                        <option value="10">Ottobre</option>
                        <option value="11">Novembre</option>
                        <option value="12">Dicembre</option>
                    </select>
                </div>

                <div id="div-day">
                    <label for="day">Giorno</label>
                    <input class="form-control" type="text" id="day" inputmode="numeric" maxlength="2" name="day"
                           pattern="((0?[1-9])|([12][0-9])|(3[01]))" placeholder="GG" title="Inserisci il giorno"
                           required>
                </div>
            </div>
            <label id="error-year" class="control-label-validation" for="year">Errore</label>
            <label id="error-month" class="control-label-validation" for="month">Errore</label>
            <label id="error-day" class="control-label-validation" for="day">Errore</label>
        </div>

        <fieldset role="radiogroup">
            <legend>Di che sesso sei?</legend>
            <div id="gender">
                <div>
                    <input type="radio" id="gender_option_male" name="gender" required value="M">
                    <label for="gender_option_male">Maschio</label>
                </div>
                <div>
                    <input type="radio" id="gender_option_female" name="gender" required value="F">
                    <label for="gender_option_female">Femmina</label>
                </div>
                <div>
                    <input type="radio" id="gender_option_nonbinary" name="gender" required value="N">
                    <label for="gender_option_nonbinary">Non binario</label>
                </div>
            </div>
            <label id="error-gender" class="control-label-validation" for="gender">Errore</label>

        </fieldset>

        <div id="submit">
            <button type="submit" id="submit-button" class="btn">
                Iscriviti
            </button>
        </div>
        <div id="login">
            <p>Hai un account?
                <a href="../index.php">Accedi</a>.
            </p>
        </div>
    </form>
</div>
<script src="../js/signup.js" type="text/javascript"></script>

</body>

</html>
