# Single Responsibility Principle

SRP states that a class should do only one thing.
It should have only one reason to change such that
if in the future we need to add some feature we can
easily do it without affecting other parts of the system.
We typically use composition when following this principle.
We basically break down functionailites into different classes,
and each class will be responsible for one thing only and
it may have reference of some other class to fulfill its
responsibilities. (composition is used)

> SRP violated

Below i have taken an example of a payment processor,
which is now handling multiple responsibilites like
process payment,handle refund,send receipt.Now its
completely violating SRP as it has 3 reasons to change
because if payment processor changes(e.g., from Stripe to PayPal) process_payment methods needs
to be changed,if refund policy changes then handle_refund
needs to be changed,if email service changes(e.g., from SendGrid to Mailgun), then send receipt
needs to be changed.
Violating SRP as it handles multiple responsibilites

```py
class PaymentGateway:
    def process_payment(self, amount):
        # code to process payment using a specific payment processor
        pass

    def handle_refund(self, amount):
        # code to handle refund using a specific refund policy
        pass

    def send_receipt(self, email):
        # code to send receipt via email
        pass
```

> SRP Followed

```py
class PaymentProcessor:
    def process_payment(self, amount):
        # code to process payment using a specific payment processor
        pass


class RefundHandler:
    def handle_refund(self, amount):
        # code to handle refund using a specific refund policy
        pass


class EmailService:
    def send_receipt(self, email):
        # code to send receipt via email
        pass


# PaymentGateway class acts as a facade, providing a simple interface to the other classes, while still maintaining the SRP.
class PaymentGateway:
    def __init__(self, payment_processor, refund_handler, email_service):
        self.payment_processor = payment_processor
        self.refund_handler = refund_handler
        self.email_service = email_service

    def process_payment(self, amount):
        self.payment_processor.process_payment(amount)

    def handle_refund(self, amount):
        self.refund_handler.handle_refund(amount)

    def send_receipt(self, email):
        self.email_service.send_receipt(email)
```
