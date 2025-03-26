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
        return response()->json(MenuCategory::all());
    }

    /**
     * Store a new menu category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = MenuCategory::create([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Menu category created successfully', 'data' => $category], 201);
    }
}


    /**
     * Display the specified resource.
     */
//     public function show(MenuCategory $menuCategory)
//     {
//         //
//     }

//     /**
//      * Show the form for editing the specified resource.
//      */
//     public function edit(MenuCategory $menuCategory)
//     {
//         //
//     }

//     /**
//      * Update the specified resource in storage.
//      */
//     public function update(Request $request, MenuCategory $menuCategory)
//     {
//         //
//     }

//     /**
//      * Remove the specified resource from storage.
//      */
//     public function destroy(MenuCategory $menuCategory)
//     {
//         //
//     }
// }
