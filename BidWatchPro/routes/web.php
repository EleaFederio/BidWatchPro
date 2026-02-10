<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('contracts', function () {
    return Inertia::render('contracts');
})->middleware(['auth', 'verified'])->name('contracts');

Route::get('calendar', function () {
    return Inertia::render('calendar');
})->middleware(['auth', 'verified'])->name('calendar');

Route::get('announcer', function () {
    return Inertia::render('announcer');
})->middleware(['auth', 'verified'])->name('announcer');

Route::get('engineers', function () {
    return Inertia::render('engineers');
})->middleware(['auth', 'verified'])->name('engineers');

require __DIR__.'/settings.php';
