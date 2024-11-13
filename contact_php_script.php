<?php
require_once 'lib/swift_required.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "zhivko.tenev@mibdistillery.com";
    $subject = "New Message from Contact Form";
    $body = "Name: $name\nEmail: $email\nMessage: $message";

    $smtp_host = "smtp.gmail.com";
    $smtp_port = 587;
    $smtp_username = "prosek.mailer@gmail.com";
    $smtp_password = "zsoxrqjjtxfjhrzo";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $transport = (new Swift_SmtpTransport($smtp_host, $smtp_port))
        ->setUsername($smtp_username)
        ->setPassword($smtp_password);
    $mailer = new Swift_Mailer($transport);
    $message = (new Swift_Message())
        ->setSubject($subject)
        ->setFrom([$smtp_username => $name])
        ->setTo([$to])
        ->setBody($body);

    if ($mailer->send($message)) {
        echo "Email sent successfully!";
    } else {
        echo "Error sending email.";
        error_log(print_r(error_get_last(), true));
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
?>
