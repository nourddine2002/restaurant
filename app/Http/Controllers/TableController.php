<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    /**
     * Display all tables.
     */
    public function index(): Response
    {
        $tables = Table::all(); // Fetch all tables

        return Inertia::render('admin/Tables', [
            'tables' => $tables,
        ]);
    }

    /**
     * Store a new table.
     */
    public function store(Request $request)
    {
        // Vérifier ce que contient réellement la requête
        // Le problème est probablement dans la structure des données

        // Simplifions la validation
        $validated = $request->validate([
            'table_number' => 'required|integer|unique:tables,number',
        ]);

        // Créons la table avec les données validées
        $table = new Table();
        $table->number = $validated['table_number'];
        $table->save();

        return redirect()->route('admin.tables');
    }

    /**
     * Update a table number.
     */
    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
            'table_number' => 'required|integer|unique:tables,number,' . $table->id,
        ]);

        $table->number = $validated['table_number'];
        $table->save();

        return redirect()->route('admin.tables');
    }

    /**
     * Delete a table.
     */
    public function destroy(Table $table)
    {
        $table->delete();
        return redirect()->route('admin.tables');
    }
}
