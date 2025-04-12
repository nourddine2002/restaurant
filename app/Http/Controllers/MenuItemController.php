<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\MenuCategory;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    // Get items for a specific category
    public function getItemsByCategory($categoryId)
    {
        $items = MenuItem::where('category_id', $categoryId)->get();
        return response()->json($items);
    }
    // Get all menu items
    public function index()
    {
        $menuItems = MenuItem::with('category')->get();
        return response()->json($menuItems);
    }

    // Create a new menu item
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:menu_categories,id'
        ]);

        $menuItem = MenuItem::create($validatedData);

        return response()->json([
            'message' => 'Menu item created successfully',
            'data' => $menuItem
        ], 201);
    }

    // Update a menu item
        public function update(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'sometimes|exists:menu_categories,id'
        ]);

        $menuItem->update($validatedData);

        return response()->json([
            'message' => 'Menu item updated successfully',
            'data' => $menuItem
        ]);
    }

    // Delete a menu item
    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully'
        ]);
    }
}