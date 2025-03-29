<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
            'slug' => 'nullable|string|unique:menu_categories,slug', // Allow null or unique slug
            'image' => 'nullable|string',
            'status' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);
        // Generate a slug if it's not provide

    $slug = Str::slug($validated['name']);
    $originalSlug = $slug;
    $counter = 1;

    while (MenuCategory::where('slug', $slug)->exists()) {
        $slug = $originalSlug . '-' . $counter;
        $counter++;
    }

    $category = MenuCategory::create([
        'name' => $validated['name'],
        'slug' => $slug,
        'status' => true, // Default value
        'order' => 0, // Default value
    ]);
        return response()->json(['data' => $category,], 201);
    }

    /**
     * Update an existing menu category.
     */
    public function update(Request $request, $id)
    {
        $category = MenuCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:menu_categories,slug,' . $category->id,
            'image' => 'nullable|string',
            'status' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);
        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;

        while (MenuCategory::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }   
        $validated['slug'] = $slug;
        $validated['status'] = $validated['status'] ?? $category->status; // Keep the current status if not provided
        $validated['order'] = $validated['order'] ?? $category->order; // Keep the current order if not provided
        $validated['image'] = $validated['image'] ?? $category->image; // Keep the current image if not provided

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
