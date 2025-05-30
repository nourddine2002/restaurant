<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $payment->id }}</title>
</head>
<body>
    <h1>Invoice #{{ $payment->id }}</h1>
    <p>Order ID: {{ $payment->order_id }}</p>
    <p>Amount: {{ $payment->amount }} MAD</p>
    <p>Tip: {{ $payment->tip_amount }} MAD</p>
    <p>Payment Method: {{ $payment->payment_method }}</p>
    <p>Status: {{ $payment->status }}</p>
    <p>Date: {{ $payment->paid_at }}</p>
</body>
</html>
