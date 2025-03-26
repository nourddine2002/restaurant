<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use Illuminate\Http\Request;

class MenuCategoryController extends Controller
{
    /**
     * Fetch all menu categories.
     */
    public function index()
    {
        $categories = MenuCategory::all();
        return response()->json($categories);
    }

    /**
     * Store a new menu category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = MenuCategory::create($validated);

        return response()->json([
            'message' => 'Menu category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Update an existing menu category.
     */
    public function update(Request $request, $id)
    {
        $category = MenuCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Menu category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Delete a menu category.
     */
    public function destroy($id)
    {
        $category = MenuCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Menu category deleted successfully',
        ]);
    }
}
