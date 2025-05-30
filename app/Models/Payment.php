<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'tip',
        'total_paid',
        'payment_method',
        'amount_received',
        'change_given',
        'status',
        'paid_at',
        'cancelled_at',
        'transaction_id',
        'notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tip' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'change_given' => 'decimal:2',
        'paid_at' => 'datetime',
        'cancelled_at' => 'datetime'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Get formatted payment method
    public function getFormattedPaymentMethodAttribute()
    {
        $methods = [
            'cash' => 'Cash',
            'credit_card' => 'Credit Card',
            'debit_card' => 'Debit Card',
            'mobile_payment' => 'Mobile Payment'
        ];

        return $methods[$this->payment_method] ?? $this->payment_method;
    }

    // Check if payment is completed
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    // Check if payment is cancelled
    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }
}
