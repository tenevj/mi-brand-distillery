<?php
// Include PHPMailer classes
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// The rest of your code remains the same
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $message = $_POST["message"];

    $to = "zhivko.tenev@mibdistillery.com";
    $subject = "New Message from Contact Form";
    $email_body = "
        <html>
        <head>
            <title>New Message from Contact Form</title>
        </head>
        <body>
            <p>You have received a new message from the contact form:</p>
            <table>
                <tr>
                    <th>Name:</th>
                    <td>$name</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>$email</td>
                </tr>
                <tr>
                    <th>Phone:</th>
                    <td>$phone</td>
                </tr>
                <tr>
                    <th>Message:</th>
                    <td>$message</td>
                </tr>
            </table>
        </body>
        </html>
    ";

    // Set up PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'mibdmailer@gmail.com'; // Your Gmail address
        $mail->Password = 'ujcktdzufxpnpeuo'; // App password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('mibdmailer@gmail.com', 'MIBD Mailer');
        //$mail->addAddress($to); // Recipient
        $mail->addAddress('zhivko.tenev@mibdistillery.com');  // First recipient
        $mail->addAddress('deyan.haustov@mibdistillery.com');  // Second recipient

        $mail->addReplyTo($email, $name); // Reply-to address

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $email_body;
        $mail->CharSet = 'UTF-8'; // Explicitly set UTF-8 encoding

        // Send email
        $mail->send();
        echo "success";
    } catch (Exception $e) {
        echo "error: {$mail->ErrorInfo}";
    }
}
?>
