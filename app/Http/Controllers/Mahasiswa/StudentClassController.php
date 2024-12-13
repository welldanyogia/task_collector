<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\ClassMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $classes = ClassMember::where('student_id', Auth::id())
            ->with(['class', 'class.teacher','class.tasks','class.tasks.submissions']) // Load both class and teacher details
            ->get();
        return Inertia::render('Mahasiswa/StudentClass', [
            'user' => $user,
            'classes' => $classes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    public function joinClass(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:classes,code', // Ensure the code exists in the database
        ]);

        $class = Classes::where('code', $request->code)->first();

        // Check if the student is already a member of this class
        if ($class->members->contains('student_id', Auth::id())) {
            Log::warning('Student already joined this class', ['student_id' => Auth::id(), 'class_id' => $request->get('code'),]);
            return back()->withErrors(['error' => 'Anda sudah bergabung dengan kelas ini!']);
        }

        try {
            // Attach student to the class
            $data = [
                'student_id' => Auth::id(),
                'class_id' => $request->get('code'),
            ];
            ClassMember::create($data);
            Log::info('Student joined class successfully', ['student_id' => Auth::id(), 'class_id' => $request->get('code'),]);
            return back()->with('success', 'Kelas berhasil bergabung!');
        } catch (\Exception $e) {
            // Log the exception if something goes wrong
            Log::error('Error joining class', ['error' => $e->getMessage(), 'student_id' => Auth::id(), 'class_id' => $request->get('code'),]);
            return back()->withErrors(['error' => 'Terjadi kesalahan saat bergabung dengan kelas. Silakan coba lagi.']);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
