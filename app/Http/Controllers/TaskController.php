<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Logging awal untuk melihat data yang diterima
        Log::info('Data request untuk pembuatan tugas:', $request->all());

        // Validasi request
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'deadline' => 'required|date',
            'class_id' => 'required|exists:classes,id',
        ]);

        // Logging data yang telah divalidasi
        Log::info('Data yang berhasil divalidasi:', $validatedData);

        try {
            // Membuat tugas
            $task = Task::create([
                'title' => $request->title,
                'description' => $request->description,
                'deadline' => $request->deadline,
                'class_id' => $request->class_id,
                'created_by' => Auth::id(),
            ]);

            // Logging data tugas yang dibuat
            Log::info('Tugas berhasil dibuat:', $task->toArray());

            // Mengembalikan respons Inertia
            return back()->with('success', 'Tugas baru berhasil dibuat!');

        } catch (\Exception $e) {
            // Logging error jika terjadi kesalahan
            Log::error('Error saat membuat tugas:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Mengembalikan respons Inertia dengan pesan error
//            return Inertia::render('Tasks/Index', [
//                'message' => 'Terjadi kesalahan saat membuat tugas.',
//                'error' => $e->getMessage(),
//            ])->withErrors([
//                'general' => 'Terjadi kesalahan saat membuat tugas. Coba lagi nanti.',
//            ]);
            return back()->with('error', $e->getMessage());
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'deadline' => 'sometimes|date',
        ]);

        $task->update($request->only(['title', 'description', 'deadline']));

//        return response()->json([
//            'message' => 'Tugas berhasil diperbarui!',
//        ]);
        return back()->with('message', 'Tugas berhasil diperbarui!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

//        return response()->json([
//            'message' => 'Tugas berhasil dihapus!',
//        ]);
        return back()->with('message', 'Tugas berhasil dihapus!');

    }
}
