<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\MenuCategoryController;
use App\Http\Controllers\CrtUsers;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;

// Models
use App\Models\MenuCategory;

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect('/login');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->group(function () {

    // Dashboard Pages
    Route::get('/admin', fn() => Inertia::render('admin/AdminDashboard'))->name('dashboard');
    Route::get('/admin/orders', fn() => Inertia::render('admin/Orders'))->name('admin.orders');
    Route::get('/admin/menu', fn() => Inertia::render('admin/Menu'))->name('admin.menu');
    Route::get('/admin/users', fn() => Inertia::render('admin/Users'))->name('admin.users');
    Route::get('/admin/payments', fn() => Inertia::render('admin/Payments'))->name('admin.payments');
    Route::get('/admin/reports', fn() => Inertia::render('admin/Reports'))->name('admin.reports');

    // Users CRUD
    Route::prefix('/api/users')->name('admin.users.')->group(function () {
        Route::get('/', [CrtUsers::class, 'index'])->name('index');
        Route::post('/', [CrtUsers::class, 'store'])->name('store');
        Route::put('/{id}', [CrtUsers::class, 'update'])->name('update');
        Route::delete('/{id}', [CrtUsers::class, 'destroy'])->name('destroy');
    });

    // Menu Categories
    Route::prefix('/api/menu-categories')->group(function () {
    Route::get('/', [MenuCategoryController::class, 'index']);
    Route::post('/', [MenuCategoryController::class, 'store']);
    Route::put('/{id}', [MenuCategoryController::class, 'update']);
    Route::delete('/{id}', [MenuCategoryController::class, 'destroy']);
    Route::get('/with-items', [MenuCategoryController::class, 'getCategoriesWithItems']);
    });
    

    // Menu Items
    Route::get('/admin/menu/category/{slug}/items', function ($slug) {
        $category = MenuCategory::where('slug', $slug)->firstOrFail();
        return Inertia::render('admin/ItemManagement', [
            'categoryId' => $category->id,
            'categoryName' => $category->name,
        ]);
    })->name('admin.menu.category.items');

    Route::get('/admin/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-items/{categoryId}', [MenuItemController::class, 'getItemsByCategory']);
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);


    // Tables CRUD
    Route::get('/admin/tables', [TableController::class, 'index'])->name('admin.tables');
    Route::post('/admin/tables', [TableController::class, 'store'])->name('admin.tables.store');
    Route::put('/admin/tables/{table}', [TableController::class, 'update'])->name('admin.tables.update');
    Route::delete('/admin/tables/{table}', [TableController::class, 'destroy'])->name('admin.tables.destroy');

    // Orders

    Route::get('/admin/orders/create', [OrderController::class, 'create']);
    Route::prefix('/api/orders')->group(function () {
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::get('/', [OrderController::class, 'index']);
    Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
});
    
});

Route::prefix('/api/orders')->group(function () {
Route::post('/', [OrderController::class, 'store'])->name('orders.store');
})->middleware('auth');

    


/*
|--------------------------------------------------------------------------
| Waiter Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:waiter'])->group(function () {
    Route::get('/waiter', fn() => Inertia::render('Waiter/WaiterDashboard'))->name('waiter.dashboard');
    Route::get('/waiter/orders', fn() => Inertia::render('Waiter/Orders'))->name('waiter.orders');
    Route::get('/waiter/create-order', fn() => Inertia::render('Waiter/NewOrder'))->name('waiter.new-order');
    Route::get('/waiter/completed-orders', fn() => Inertia::render('Waiter/OrderHistory'))->name('waiter.completed-orders');
    Route::get('/waiter/create-order', [OrderController::class, 'waitercreate']);


});


require __DIR__.'/auth.php';
