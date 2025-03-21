<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/admin', function () {
    return Inertia('admin/AdminDashboard');
});

Route::get('/admin/orders', function () {
    return Inertia('admin/Orders');
})->name('admin.orders');

Route::get('/admin/menu', function () {
    return Inertia('admin/Menu');
})->name('admin.menu');

Route::get('/admin/users', function () {
    return Inertia('admin/Users');
})->name('admin.users');
Route::get('/admin/tables', function () {
    return Inertia('admin/Tables');
})->name('admin.tables');

Route::get('/admin/payments', function () {
    return Inertia('admin/Payments');
})->name('admin.payments');

Route::get('/admin/reports', function () {
    return Inertia('admin/Reports');
})->name('admin.reports');

Route::get('/waiter', fn() => Inertia('Waiter/WaiterDashboard'))->name('waiter.dashboard');
Route::get('/waiter/orders', fn() => Inertia('Waiter/Orders'))->name('waiter.orders');
Route::get('/waiter/new-order', fn() => Inertia('Waiter/NewOrder'))->name('waiter.new-order');
Route::get('/waiter/completed-orders', fn() => Inertia('Waiter/OrderHistory'))->name('waiter.new-order');

