<?php
try {
    $db = null;
    @include "./connection.php";
    $username = $db->quote($_POST['username']);
    $email = $db->quote($_POST['email']);
    $password = $db->quote(sha1($_POST['password']));
    $birth_date = $db->quote($_POST['birth_date']);
    $gender = $db->quote($_POST['gender']);

    if (!isset($_POST['username']) ||
        !isset($_POST['email']) ||
        !isset($_POST['password']) ||
        !isset($_POST['birth_date']) ||
        !isset($_POST['gender'])) {
        echo "Error: some fields are not set";

    } else if (strlen($_POST['username']) > 20) {
        echo "Error: username too long";

    } else if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        echo "Error: E-mail pattern not recognised";

    } else {
        $query_user = $db->prepare("SELECT username
                                  FROM users
                                  WHERE users.username = $username;");
        $query_email = $db->prepare("SELECT email
                                    FROM users
                                    WHERE users.email = $email;");
        $query_user->execute();
        $query_email->execute();
        $results = $query_user->fetchAll();

        if (($query_user->rowCount() == 0) && ($query_email->rowCount() == 0)) {
            $insert_query = $db->prepare("INSERT INTO users (
                   username,
                   email,
                   password,
                   birth_date,
                   gender)
                   VALUES ($username,
                           $email,
                           $password,
                           $birth_date,
                           $gender);"
            );
            $insert_query->execute();
            echo "REGISTERED";
        } else if ($query_user->rowCount() > 0)
            echo 'USERNAME_EXIST';
        else
            echo 'EMAIL_EXIST';
    }

} catch (Exception $e) {
    echo "error: " . $e->getMessage();
}
