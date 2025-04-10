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
// Public routes (no auth required)
Route::get('blogs/posts', [BlogController::class, 'show'])->name('blogs.posts');
Route::get('blogs/posts/{id}', [BlogController::class, 'details'])->name('blogs.details');
Route::post('blogs/posts/{id}/review', [BlogController::class, 'storeReview'])->middleware(['auth'])->name('blogs.review');
Route::put('blogs/posts/{id}/review-update', [BlogController::class, 'updateReview'])->middleware(['auth'])->name('blogs.review.update');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
