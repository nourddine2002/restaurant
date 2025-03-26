<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TableController;
use App\Http\Controllers\MenuCategoryController;
// use App\Http\Controllers\Auth\LoginController;

//use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CrtUsers;
// Public routes

//Route::post('/login', [LoginController::class, 'login'])->name('login');


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ✅ Admin routes are now protected
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', fn() => Inertia::render('admin/AdminDashboard'))->name('dashboard');
    Route::get('/admin/orders', fn() => Inertia::render('admin/Orders'))->name('admin.orders');
    Route::get('/admin/menu', fn() => Inertia::render('admin/Menu'))->name('admin.menu');
    Route::get('/menu-categories', [MenuCategoryController::class, 'index']);
    Route::post('/menu-categories', [MenuCategoryController::class, 'store']);
    Route::put('/menu-categories/{id}', [MenuCategoryController::class, 'update']);
    Route::delete('/menu-categories/{id}', [MenuCategoryController::class, 'destroy']);
    Route::get('/admin/users', fn() => Inertia::render('admin/Users'))->name('admin.users');
    Route::get('/admin/tables', [TableController::class, 'index'])->name('admin.tables');
    Route::post('/admin/tables', [TableController::class, 'store'])->name('admin.tables.store');
    Route::put('/admin/tables/{table}', [TableController::class, 'update'])->name('admin.tables.update');
    Route::delete('/admin/tables/{table}', [TableController::class, 'destroy'])->name('admin.tables.destroy');
    Route::get('/admin/payments', fn() => Inertia::render('admin/Payments'))->name('admin.payments');
    Route::get('/admin/reports', fn() => Inertia::render('admin/Reports'))->name('admin.reports');

    // Nouvelle route pour afficher les éléments d'une catégorie
    Route::get('/menu/{categoryId}/items', function ($categoryId) {
        return Inertia::render('admin/Item', ['categoryId' => $categoryId]);
    })->name('menu.items');
    });



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
});
