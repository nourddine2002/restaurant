<?php
namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Store a new order item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $menuItem = MenuItem::findOrFail($validated['menu_item_id']);
        $orderItem = OrderItem::create([
            'order_id' => $validated['order_id'],
            'menu_item_id' => $validated['menu_item_id'],
            'quantity' => $validated['quantity'],
            'price' => $menuItem->price,
            'notes' => $validated['notes'],
        ]);

        // Update the total amount of the order
        $order = Order::findOrFail($validated['order_id']);
        $order->update([
            'total_amount' => $order->orderItems()->sum(DB::raw('quantity * price')),
        ]);

        return response()->json($orderItem, 201);
    }

    /**
     * Update an existing order item.
     */
    public function update(Request $request, $id)
    {
        $orderItem = OrderItem::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $orderItem->update($validated);

        // Recalculate the total amount of the order
        $order = $orderItem->order;
        $order->update([
            'total_amount' => $order->orderItems()->sum(DB::raw('quantity * price')),
        ]);

        return response()->json($orderItem);
    }

    /**
     * Remove an order item.
     */
    public function destroy($id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $order = $orderItem->order;

        $orderItem->delete();

        // Recalculate the total amount of the order
        $order->update([
            'total_amount' => $order->orderItems()->sum(DB::raw('quantity * price')),
        ]);

        return response()->json(['message' => 'Order item deleted successfully']);
    }
}