<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MenuItem;
use App\Models\MenuCategory;
use App\Models\Table;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;


class OrderController extends Controller
{
    /**
     * Display a listing of all orders.
     */
    public function index()
    {
        $orders = Order::with(['table', 'user', 'orderItems.menuItem'])->get();
        return response()->json($orders);
    }

    /**
     * Display the details of a specific order.
     */
    public function show($id)
    {
        $order = Order::with(['table', 'user', 'orderItems.menuItem'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the status of an order.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Preparing,Ready,Served,Paid,Canceled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json($order);
    }

    /**
     * Update an existing order (e.g., modify items or other details).
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // Validate and update order details
        $validated = $request->validate([
            'table_id' => 'nullable|exists:tables,id',
            'user_id' => 'nullable|exists:users,id',
            'total_amount' => 'nullable|numeric',
            'status' => 'nullable|string|in:Pending,Preparing,Ready,Served,Paid,Canceled',
        ]);

        $order->update($validated);

        return response()->json($order);
    }
    public function create()
    {
        $tables = Table::where('status', 'available')->get();
        $menuItems = MenuItem::all();
        $menuCategories = MenuCategory::all();
        
        // Format image paths for categories
        foreach ($menuCategories as $category) {
            if ($category->image) {
                // If the image path doesn't start with http:// or https://, add the storage path
                if (!Str::startsWith($category->image, ['http://', 'https://'])) {
                    $category->image = asset('storage/' . $category->image);
                }
            }
        }
        
        // Format image paths for menu items if needed
        foreach ($menuItems as $item) {
            if (isset($item->image)) {
                if (!Str::startsWith($item->image, ['http://', 'https://'])) {
                    $item->image = asset('storage/' . $item->image);
                }
            }
        }
        
        return Inertia::render('admin/CreateOrder', [
            'tables' => $tables,
            'menuItems' => $menuItems,
            'menuCategories' => $menuCategories,
        ]);

    }
    public function waitercreate()
    {
        $tables = Table::where('status', 'available')->get();
        $menuItems = MenuItem::all();
        $menuCategories = MenuCategory::all();
        
        // Format image paths for categories
        foreach ($menuCategories as $category) {
            if ($category->image) {
                // If the image path doesn't start with http:// or https://, add the storage path
                if (!Str::startsWith($category->image, ['http://', 'https://'])) {
                    $category->image = asset('storage/' . $category->image);
                }
            }
        }
        
        // Format image paths for menu items if needed
        foreach ($menuItems as $item) {
            if (isset($item->image)) {
                if (!Str::startsWith($item->image, ['http://', 'https://'])) {
                    $item->image = asset('storage/' . $item->image);
                }
            }
        }
        
        return Inertia::render('Waiter/NewOrder', [
            'tables' => $tables,
            'menuItems' => $menuItems,
            'menuCategories' => $menuCategories,
        ]);

    }

    
public function store(Request $request)
{
    // Validate the incoming request data
    $validated = $request->validate([
        'table_id' => 'required|exists:tables,id',
        'notes' => 'nullable|string',
        'items' => 'required|array|min:1',
        'items.*.menu_item_id' => 'required|exists:menu_items,id',
        'items.*.quantity' => 'required|integer|min:1',
    ]);

    DB::beginTransaction();
    try {
        // Create the order
        $order = Order::create([
            'table_id' => $validated['table_id'],
            'notes' => $validated['notes'],
            'user_id' => auth()->id(), // Use the authenticated user's ID
            'total_amount' => 0, // Will calculate later
        ]);

        $totalAmount = 0;

        // Attach order items
        foreach ($validated['items'] as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_item_id']);
            $subtotal = $menuItem->price * $item['quantity'];
            $totalAmount += $subtotal;

            $order->orderItems()->create([
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $menuItem->price,
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // Update total amount
        $order->update(['total_amount' => $totalAmount]);

        DB::commit();
        return response()->json(['message' => 'Order created successfully'], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to create order', 'details' => $e->getMessage()], 500);
    }
}

/**
 * Display orders for the current authenticated user with ability to add more items.
 */
public function myOrders()
{
    // Get all orders for the current authenticated user
    $orders = Order::with(['table', 'orderItems.menuItem'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

    $tables = Table::all();
    $menuItems = MenuItem::all();
    $menuCategories = MenuCategory::all();
    
    // Format image paths for categories
    foreach ($menuCategories as $category) {
        if ($category->image) {
            if (!Str::startsWith($category->image, ['http://', 'https://'])) {
                $category->image = asset('storage/' . $category->image);
            }
        }
    }
    
    // Format image paths for menu items
    foreach ($menuItems as $item) {
        if (isset($item->image)) {
            if (!Str::startsWith($item->image, ['http://', 'https://'])) {
                $item->image = asset('storage/' . $item->image);
            }
        }
    }
    
    // Determine which page to render based on user role
    if (Auth::user()->hasRole('waiter')) {
        return Inertia::render('Waiter/ActiveOrders', [
            'orders' => $orders,
            'tables' => $tables,
            'menuItems' => $menuItems,
            'menuCategories' => $menuCategories,
        ]);
    } else {
        return Inertia::render('admin/Myorders', [
            'orders' => $orders,
            'tables' => $tables,
            'menuItems' => $menuItems,
            'menuCategories' => $menuCategories,
        ]);
    }
}

/**
 * Add more items to an existing order.
 */
public function addToOrder(Request $request, $id)
{
    // Validate the incoming request data
    $validated = $request->validate([
        'items' => 'required|array|min:1',
        'items.*.menu_item_id' => 'required|exists:menu_items,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.notes' => 'nullable|string',
    ]);

    $order = Order::findOrFail($id);
    
    // Check if the authenticated user owns this order
    if ($order->user_id != Auth::id()) {
        return response()->json(['error' => 'Unauthorized access to this order'], 403);
    }

    DB::beginTransaction();
    try {
        $totalAmount = $order->total_amount;

        // Add new items to the order
        foreach ($validated['items'] as $item) {
            $menuItem = MenuItem::findOrFail($item['menu_item_id']);
            $subtotal = $menuItem->price * $item['quantity'];
            $totalAmount += $subtotal;

            $order->orderItems()->create([
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'price' => $menuItem->price,
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // Update total amount
        $order->update(['total_amount' => $totalAmount]);

        DB::commit();
        return response()->json(['message' => 'Items added to order successfully'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => 'Failed to add items to order', 'details' => $e->getMessage()], 500);
    }
}
}