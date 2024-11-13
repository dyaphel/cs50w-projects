document.getElementById("primaryPhoneButton").addEventListener("click", function() {
    // Create a hidden anchor tag to make the call
    const phoneLink = document.createElement("a");
    phoneLink.href = "tel:{{ contact.phone_number_1 }}";
    phoneLink.style.display = "none";
    document.body.appendChild(phoneLink);
    phoneLink.click();
    document.body.removeChild(phoneLink); // Clean up
});

    // Handle the message button click
document.getElementById("primaryMessageButton").addEventListener("click", function() {
    const messageLink = document.createElement("a");
    messageLink.href = "sms:{{ contact.phone_number_1 }}";  // Open SMS with phone number pre-filled
    messageLink.style.display = "none";
    document.body.appendChild(messageLink);
    messageLink.click();
    document.body.removeChild(messageLink);
});

document.getElementById("secondaryPhoneButton").addEventListener("click", function() {
    // Create a hidden anchor tag to make the call
    const phoneLink = document.createElement("a");
    phoneLink.href = "tel:{{ contact.phone_number_1 }}";
    phoneLink.style.display = "none";
    document.body.appendChild(phoneLink);
    phoneLink.click();
    document.body.removeChild(phoneLink); // Clean up
});

    // Handle the message button click
document.getElementById("secondaryMessageButton").addEventListener("click", function() {
    const messageLink = document.createElement("a");
    messageLink.href = "sms:{{ contact.phone_number_1 }}";  // Open SMS with phone number pre-filled
    messageLink.style.display = "none";
    document.body.appendChild(messageLink);
    messageLink.click();
    document.body.removeChild(messageLink);
});
