<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('menu_item_id')->constrained('menu_items');
            $table->integer('quantity')->default(1); // Default quantity is 1
            $table->decimal('price', 8, 2); // Price of the item at the time of order   
            $table->text('notes')->nullable(); // Special instructions for this item
            $table->timestamps();
            $table->index('order_id');
            $table->index('menu_item_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
