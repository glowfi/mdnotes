# Open close principle

Open close principle states that a class should be Open
for extension but close for modification.
This means that you should be able to add new functionality to a class
without changing its existing code.

> OCP violated

In below example in PaymentProcessor everytime we need to add a new
payment processor we need to modify existing code of PaymentProcessor
class.For following OCP we should be able to integrate new payment
processor whithout modifying existing code

```py
class PaymentProcessor:
    def process_payment(self, amount: float, payment_method: str):
        if payment_method == "stripe":
            # code to process payment using Stripe
            pass
        elif payment_method == "paypal":
            # code to process payment using PayPal
            pass


class RefundHandler:
    def handle_refund(self, amount: float):
        # code to handle refund using a specific refund policy
        pass


class EmailService:
    def send_receipt(self, email: str):
        # code to send receipt via email
        pass


class PaymentGateway:
    def __init__(
        self,
        payment_processor: PaymentProcessor,
        refund_handler: RefundHandler,
        email_service: EmailService,
    ):
        self.payment_processor = payment_processor
        self.refund_handler = refund_handler
        self.email_service = email_service

    def process_payment(self, amount: float, payment_method: str):
        if payment_method == "stripe":
            # code to process payment using Stripe
            pass
        elif payment_method == "paypal":
            # code to process payment using PayPal
            pass

    def handle_refund(self, amount: float):
        self.refund_handler.handle_refund(amount)

    def send_receipt(self, email: str):
        self.email_service.send_receipt(email)
```

> OCP follwed

Now, OCP is satisfied:

- The PaymentGateway class is open for extension because we can add new payment methods without changing its code.
- The PaymentGateway class is closed for modification because we don't need to change its existing code to add new functionality.

```py
from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
   @abstractmethod
   def process_payment(self, amount: float):
       pass


class StripePaymentProcessor(PaymentProcessor):
   def process_payment(self, amount: float):
       pass


class PaypalPaymentProcessor(PaymentProcessor):
   def process_payment(self, amount: float):
       pass


class UPIPaymentProcessor(PaymentProcessor):
   def process_payment(self, amount: float):
       pass


class RefundHandler:
   def handle_refund(self, amount: float):
       # code to handle refund using a specific refund policy
       pass


class EmailService:
   def send_receipt(self, email: str):
       # code to send receipt via email
       pass


class PaymentGateway:
   def __init__(
       self,
       payment_processor: PaymentProcessor,
       refund_handler: RefundHandler,
       email_service: EmailService,
   ):
       self.payment_processor = payment_processor
       self.refund_handler = refund_handler
       self.email_service = email_service

   def process_payment(self, amount: float):
       self.payment_processor.process_payment(amount)

   def handle_refund(self, amount):
       self.refund_handler.handle_refund(amount)

   def send_receipt(self, email):
       self.email_service.send_receipt(email)
```
