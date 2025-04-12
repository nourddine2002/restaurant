<?php

namespace App\Http\Controllers;

use App\Models\MenuCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class MenuCategoryController extends Controller
{
    /**
     * Fetch all menu categories.
     */
    public function index()
    {
        $categories = MenuCategory::all()->map(function ($category) {
            // Consistently use Storage::url for image path
            $category->image = $category->image 
                ? Storage::url($category->image)
                : null;
            return $category;
        });

        return response()->json($categories);
    }

    /**
     * Store a new menu category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:3000',
        ]);
    
        // Store image and get path - using a consistent directory
        $filename = time() . '.' . $request->file('image')->getClientOriginalExtension();
        $imagePath = $request->file('image')->storeAs('menu-categories', $filename, 'public');
        
        $category = MenuCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'image' => str_replace('public/', '', $imagePath), // Store path without 'public/'
            'status' => true,
            'order' => 0,
        ]);
    
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'image' => Storage::url($category->image),
                'slug' => $category->slug
            ]
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
        'slug' => 'nullable|string|unique:menu_categories,slug,' . $category->id,
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:3000',
        'status' => 'nullable|boolean',
        'order' => 'nullable|integer',
    ]);

    // Generate unique slug
    $slug = $validated['slug'] ?? Str::slug($validated['name']);
    $originalSlug = $slug;
    $counter = 1;
    while (MenuCategory::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
        $slug = $originalSlug . '-' . $counter++;
    }

    $validated['slug'] = $slug;
    $validated['status'] = $validated['status'] ?? $category->status;
    $validated['order'] = $validated['order'] ?? $category->order;

    // Handle image upload
    if ($request->hasFile('image')) {
        // Delete old image if it exists
        if ($category->image) {
            Storage::delete('public/' . $category->image);
        }

        $image = $request->file('image');
        $filename = time() . '.' . $image->getClientOriginalExtension();
        // Use the same path as in store method
        $path = $image->storeAs('menu-categories', $filename, 'public');
        $validated['image'] = str_replace('public/', '', $path);
    }

    $category->update($validated);

    // Return category with updated image URL
    return response()->json([
        'message' => 'Menu category updated successfully',
        'data' => [
            'id' => $category->id,
            'name' => $category->name,
            'image' => $category->image ? Storage::url($category->image) : null,
            'slug' => $category->slug,
            'status' => $category->status,
            'order' => $category->order
        ],
    ]);
}
    /**
     * Delete a menu category.
     */
    public function destroy($id)
    {
        $category = MenuCategory::findOrFail($id);

        // Delete category image if exists
        if ($category->image) {
            Storage::delete('public/' . $category->image);
        }

        $category->delete();

        return response()->json([
            'message' => 'Menu category deleted successfully',
        ]);
    }

    /**
     * Get active categories with their available items.
     */
    public function getCategoriesWithItems()
    {
        $categories = MenuCategory::with(['menuItems' => function ($query) {
            $query->where('availability', true);
        }])->where('status', true)->get()->map(function ($category) {
            // Ensure images have proper URLs
            $category->image = $category->image ? Storage::url($category->image) : null;
            
            // Also fix any image paths in menu items if needed
            if ($category->menuItems && count($category->menuItems) > 0) {
                $category->menuItems->map(function ($item) {
                    if ($item->image) {
                        $item->image = Storage::url($item->image);
                    }
                    return $item;
                });
            }
            
            return $category;
        });

        return response()->json($categories);
    }
}