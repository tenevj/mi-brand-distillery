<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $message = $_POST["message"];

    $to = "deyan.haustov@mibdistillery.com, zhivko.tenev@mibdistillery.com, ztenev@prosek.com,";
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

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: <' . $email . '>' . "\r\n";


    if (mail($to, $subject, $email_body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
