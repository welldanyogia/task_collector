<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Dosen\LecturerClassController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\TaskController;
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

Route::get('/dashboard', [DashboardController::class, 'index']
)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/student/class',[\App\Http\Controllers\Mahasiswa\StudentClassController::class, 'index'])->name('student.class');
    Route::get('/lecturer/class',[\App\Http\Controllers\Dosen\LecturerClassController::class, 'index'])->name('lecturer.class');

    Route::post('/classes', [LecturerClassController::class, 'store'])->name('classes.store');
    Route::post('/join/classes', [\App\Http\Controllers\Mahasiswa\StudentClassController::class, 'joinClass'])->name('student.joinClass');


});

Route::middleware(['auth'])->group(function () {
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::post('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::post('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    Route::post('/submissions', [SubmissionController::class, 'store'])->name('student.submissions.store');
    Route::post('/submissions/{id}/status', [SubmissionController::class, 'updateStatus'])->name('student.submissions.update.status');

});



require __DIR__.'/auth.php';
