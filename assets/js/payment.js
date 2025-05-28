// payment.js
export function togglePaymentMethod(paymentMethodSelect, bankTransferDetails, cardPaymentForm) {
    // Function to toggle payment method details
    paymentMethodSelect.addEventListener("change", function () {
        const selectedMethod = paymentMethodSelect.value;

        if (selectedMethod === "bank-transfer") {
            bankTransferDetails.style.display = "block";
            cardPaymentForm.style.display = "none";
        } else if (selectedMethod === "card") {
            cardPaymentForm.style.display = "block";
            bankTransferDetails.style.display = "none";
        } else {
            bankTransferDetails.style.display = "none";
            cardPaymentForm.style.display = "none";
        }
    });
}

export function handlePaymentSubmission() {
    const submitPaymentButton = document.getElementById("submitPayment");
    if (submitPaymentButton) {
        submitPaymentButton.addEventListener("click", function (event) {
            event.preventDefault();

            const paymentMethodSelect = document.getElementById("payment-method").value;
            if (paymentMethodSelect === "bank-transfer") {
                const accountNumber = document.getElementById("account-number").value;
                const bankName = document.getElementById("bank-name").value;

                if (accountNumber && bankName) {
                    console.log("Processing bank transfer with account number: " + accountNumber + " at " + bankName);
                    alert("Bank transfer initiated!");
                    hideSubscriptionForm();
                } else {
                    alert("Please fill out all bank transfer details.");
                }
            } else if (paymentMethodSelect === "card") {
                const cardNumber = document.getElementById("card-number").value;
                const expiryDate = document.getElementById("expiry-date").value;
                const cvv = document.getElementById("cvv").value;

                if (cardNumber && expiryDate && cvv) {
                    console.log("Processing card payment for card number: " + cardNumber);
                    alert("Card payment initiated!");
                    hideSubscriptionForm();
                } else {
                    alert("Please fill out all card payment details.");
                }
            } else {
                alert("Please select a payment method.");
            }
        });
    } else {
        console.error("Submit Payment button not found.");
    }
}

function hideSubscriptionForm() {
    const subscriptionFormSection = document.getElementById("subscription-section");
    if (subscriptionFormSection) {
        subscriptionFormSection.style.display = 'none';
    } else {
        console.error("Subscription section not found.");
    }
}
