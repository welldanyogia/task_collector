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
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID sebagai primary key
            $table->string('title'); // Judul tugas
            $table->text('description')->nullable(); // Deskripsi tugas (opsional)
            $table->timestamp('deadline'); // Deadline tugas
            $table->uuid('class_id'); // Foreign key ke Classes
            $table->uuid('created_by'); // Foreign key ke Users (Dosen)
            $table->timestamps(); // created_at & updated_at

            // Foreign key constraints
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
