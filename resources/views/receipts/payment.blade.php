<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt #{{ $payment->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .total-section {
            text-align: right;
            margin-top: 20px;
        }
        .total-row {
            margin-bottom: 5px;
        }
        .grand-total {
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #333;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $restaurant['name'] }}</h1>
        <p>{{ $restaurant['address'] }}</p>
        <p>Phone: {{ $restaurant['phone'] }} | Email: {{ $restaurant['email'] }}</p>
        <hr>
        <h2>PAYMENT RECEIPT</h2>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span><strong>Receipt #:</strong> {{ $payment->id }}</span>
            <span><strong>Date:</strong> {{ $payment->paid_at->format('Y-m-d H:i:s') }}</span>
        </div>
        <div class="info-row">
            <span><strong>Order #:</strong> {{ $order->id }}</span>
            <span><strong>Table:</strong> {{ $order->table ? $order->table->number : 'N/A' }}</span>
        </div>
        <div class="info-row">
            <span><strong>Server:</strong> {{ $order->user->username }}</span>
            <span><strong>Payment Method:</strong> {{ strtoupper(str_replace('_', ' ', $payment->payment_method)) }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->orderItems as $item)
            <tr>
                <td>{{ $item->menuItem->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->price, 2) }}</td>
                <td>${{ number_format($item->quantity * $item->price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-row">
            <strong>Subtotal:</strong> ${{ number_format($payment->amount, 2) }}
        </div>
        @if($payment->tip > 0)
        <div class="total-row">
            <strong>Tip:</strong> ${{ number_format($payment->tip, 2) }}
        </div>
        @endif
        <div class="grand-total">
            <strong>TOTAL PAID:</strong> ${{ number_format($payment->total_paid, 2) }}
        </div>
        @if($payment->payment_method === 'cash')
        <div class="total-row">
            <strong>Amount Received:</strong> ${{ number_format($payment->amount_received, 2) }}
        </div>
        <div class="total-row">
            <strong>Change:</strong> ${{ number_format($payment->change_given, 2) }}
        </div>
        @endif
    </div>

    <div class="footer">
        <p><strong>Thank you for dining with us!</strong></p>
        <p>Please come again</p>
        <p style="margin-top: 20px; font-size: 10px;">
            This is a computer generated receipt. No signature required.
        </p>
    </div>
</body>
</html>
