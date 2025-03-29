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

    // Admindashboard routes 
    Route::get('/admin', fn() => Inertia::render('admin/AdminDashboard'))->name('dashboard');
    Route::get('/admin/orders', fn() => Inertia::render('admin/Orders'))->name('admin.orders');
    Route::get('/admin/menu', fn() => Inertia::render('admin/Menu'))->name('admin.menu');
    Route::get('/admin/users', fn() => Inertia::render('admin/Users'))->name('admin.users');
    Route::get('/admin/payments', fn() => Inertia::render('admin/Payments'))->name('admin.payments');
    Route::get('/admin/reports', fn() => Inertia::render('admin/Reports'))->name('admin.reports');

    //USERS CRUD 
    Route::get('/api/users', [CrtUsers::class, 'index'])->name('admin.users.index');
    Route::post('/api/users', [CrtUsers::class, 'store'])->name('admin.users.store');
    Route::put('/api/users/{id}', [CrtUsers::class, 'update'])->name('admin.users.update');
    Route::delete('/api/users/{id}', [CrtUsers::class, 'destroy'])->name('admin.users.destroy');

    // Menu Items CRUD
    Route::get('/admin/menu/category/{slug}/items', function($slug) {
    $category = MenuCategory::where('slug', $slug)->firstOrFail();
    return Inertia::render('admin/ItemManagement', [
        'categoryId' => $category->id,
        'categoryName' => $category->name,
    ]);
    })->name('admin.menu.category.items');
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);
    Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);


    
    //List items in a category :

    Route::get('/menu-items/{categoryId}', [MenuItemController::class, 'getItemsByCategory']);

    //Table CRUD
    Route::get('/admin/tables', [TableController::class, 'index'])->name('admin.tables');
    Route::post('/admin/tables', [TableController::class, 'store'])->name('admin.tables.store');
    Route::put('/admin/tables/{table}', [TableController::class, 'update'])->name('admin.tables.update');
    Route::delete('/admin/tables/{table}', [TableController::class, 'destroy'])->name('admin.tables.destroy');

    // Menu Categories CRUD
    Route::get('/menu-categories', [MenuCategoryController::class, 'index']);
    Route::post('/menu-categories', [MenuCategoryController::class, 'store']);
    Route::put('/menu-categories/{id}', [MenuCategoryController::class, 'update']);
    Route::delete('/menu-categories/{id}', [MenuCategoryController::class, 'destroy']);
    


    
    
});

    

// ✅ Waiter routes are now protected
Route::middleware(['auth', 'role:waiter'])->group(function () {
    Route::get('/waiter', fn() => Inertia::render('Waiter/WaiterDashboard'))->name('waiter.dashboard');
    Route::get('/waiter/orders', fn() => Inertia::render('Waiter/Orders'))->name('waiter.orders');
    Route::get('/waiter/new-order', fn() => Inertia::render('Waiter/NewOrder'))->name('waiter.new-order');
    Route::get('/waiter/completed-orders', fn() => Inertia::render('Waiter/OrderHistory'))->name('waiter.completed-orders');
});

require __DIR__.'/auth.php';
