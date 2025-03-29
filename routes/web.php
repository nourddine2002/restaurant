<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\MenuCategoryController;
use App\Http\Controllers\CrtUsers;
use App\Models\MenuCategory;
Route::get('/', function () {
    if (auth()->check()) {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
    return redirect('/login');
});


// ✅ Admin routes are now protected
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', fn() => Inertia::render('admin/AdminDashboard'))->name('dashboard');
    Route::get('/admin/orders', fn() => Inertia::render('admin/Orders'))->name('admin.orders');
    Route::get('/admin/menu', fn() => Inertia::render('admin/Menu'))->name('admin.menu');
    Route::get('/admin/users', fn() => Inertia::render('admin/Users'))->name('admin.users');
    Route::get('/admin/payments', fn() => Inertia::render('admin/Payments'))->name('admin.payments');
    Route::get('/admin/reports', fn() => Inertia::render('admin/Reports'))->name('admin.reports');
    Route::get('/admin/menu/category/{id}/items', fn($id) => Inertia::render('admin/ItemManagement', [
        'categoryId' => $id
    ]))->name('admin.menu.category.items');
    Route::get('/menu-items/{categoryId}', [MenuItemController::class, 'getItemsByCategory']);
    
    Route::get('/admin/tables', [TableController::class, 'index'])->name('admin.tables');
    Route::post('/admin/tables', [TableController::class, 'store'])->name('admin.tables.store');
    Route::put('/admin/tables/{table}', [TableController::class, 'update'])->name('admin.tables.update');
    Route::delete('/admin/tables/{table}', [TableController::class, 'destroy'])->name('admin.tables.destroy');




    
    
});

    // Nouvelle route pour afficher les éléments d'une catégorie
    

// ✅ Waiter routes are now protected
Route::middleware(['auth', 'role:waiter'])->group(function () {
    Route::get('/waiter', fn() => Inertia::render('Waiter/WaiterDashboard'))->name('waiter.dashboard');
    Route::get('/waiter/orders', fn() => Inertia::render('Waiter/Orders'))->name('waiter.orders');
    Route::get('/waiter/new-order', fn() => Inertia::render('Waiter/NewOrder'))->name('waiter.new-order');
    Route::get('/waiter/completed-orders', fn() => Inertia::render('Waiter/OrderHistory'))->name('waiter.completed-orders');
});

// Authenticated user routes (protected by auth middleware)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Authentication routes (e.g., login, register, password reset)
require __DIR__.'/auth.php';

// API routes for user management (note the 'api/' prefix)
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/api/users', [CrtUsers::class, 'index'])->name('admin.users.index');
    Route::post('/api/users', [CrtUsers::class, 'store'])->name('admin.users.store');
    Route::put('/api/users/{id}', [CrtUsers::class, 'update'])->name('admin.users.update');
    Route::delete('/api/users/{id}', [CrtUsers::class, 'destroy'])->name('admin.users.destroy');


    Route::get('/menu-categories', [MenuCategoryController::class, 'index']);
    Route::post('/menu-categories', [MenuCategoryController::class, 'store']);
    Route::put('/menu-categories/{id}', [MenuCategoryController::class, 'update']);
    Route::delete('/menu-categories/{id}', [MenuCategoryController::class, 'destroy']);
    
    // Get menu items for a specific category




});






// 

// Route::get('/menu-items/{categoryId}', [MenuItemController::class, 'getItemsByCategory']);

// Get items for a specific category

// Create a new menu item
Route::post('/menu-items', [MenuItemController::class, 'store']);

// Update a menu item
Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);

// Delete a menu item
Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);


