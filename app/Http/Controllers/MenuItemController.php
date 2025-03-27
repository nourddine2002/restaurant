<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuItemController extends Controller
{
    public function index($categoryId)
    {
        $menuItems = MenuItem::where('category_id', $categoryId)->get();
        return response()->json($menuItems);
    }

    public function store(Request $request, $categoryId)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if category exists
        $category = Category::findOrFail($categoryId);

        // Create new menu item
        $menuItem = new MenuItem();
        $menuItem->name = $request->input('name');
        $menuItem->price = $request->input('price');
        $menuItem->description = $request->input('description');
        $menuItem->category_id = $categoryId;
        $menuItem->save();

        return response()->json([
            'message' => 'Menu item created successfully',
            'data' => $menuItem
        ], 201);
    }

    public function update(Request $request, $categoryId, $itemId)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find the menu item
        $menuItem = MenuItem::where('id', $itemId)
            ->where('category_id', $categoryId)
            ->firstOrFail();

        // Update menu item
        $menuItem->name = $request->input('name');
        $menuItem->price = $request->input('price');
        $menuItem->description = $request->input('description');
        $menuItem->save();

        return response()->json([
            'message' => 'Menu item updated successfully',
            'data' => $menuItem
        ]);
    }

    public function destroy($categoryId, $itemId)
    {
        // Find the menu item
        $menuItem = MenuItem::where('id', $itemId)
            ->where('category_id', $categoryId)
            ->firstOrFail();

        // Delete the menu item
        $menuItem->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully'
        ]);
    }
}