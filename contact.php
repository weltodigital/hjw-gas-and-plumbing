<?php
if ($_POST) {
    // Sanitize input
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $service = filter_var($_POST['service'], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
    $postcode = filter_var($_POST['postcode'], FILTER_SANITIZE_STRING);

    // Validation
    if (empty($name) || empty($phone) || empty($service) || empty($message) || empty($postcode)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }

    // Email configuration
    $to = 'harry@weltonproperty.co.uk';
    $subject = 'New Quote Request from ' . $name;

    // Email body
    $email_body = "New quote request received:\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Phone: " . $phone . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Service: " . $service . "\n";
    $email_body .= "Postcode: " . $postcode . "\n";
    $email_body .= "Message: " . $message . "\n";
    $email_body .= "\nSubmitted: " . date('Y-m-d H:i:s');

    // Headers
    $headers = "From: website@hjwgasandplumbing.co.uk\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Quote request sent successfully!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send quote request.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>