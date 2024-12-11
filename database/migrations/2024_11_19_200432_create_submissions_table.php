<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID sebagai primary key
            $table->uuid('task_id'); // Foreign key ke Tasks
            $table->uuid('student_id'); // Foreign key ke Users (Mahasiswa)
            $table->string('link')->nullable(); // URL pengumpulan tugas (opsional)
            $table->string('file')->nullable(); // Path file yang diunggah (opsional)
            $table->string('image')->nullable(); // Path gambar yang diunggah (opsional)
            $table->string('status')->default('pending'); // Status tugas
            $table->timestamps(); // created_at & updated_at

            // Foreign key constraints
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
