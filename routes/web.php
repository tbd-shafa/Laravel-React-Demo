<?php
use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('blogs', BlogController::class);
    Route::patch('blogs/{blog}/update-status', [BlogController::class, 'updateStatus'])
    ->name('blogs.update-status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
