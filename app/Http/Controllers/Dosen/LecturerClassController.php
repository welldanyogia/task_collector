<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\ClassMember;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LecturerClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user()->load('classes');
        $classes = Classes::where('teacher_id', Auth::id())
            ->with(['members', 'tasks', 'tasks.submissions', 'teacher', 'members.student', 'tasks.submissions.student']) // Load relasi
            ->withCount(['members']) // Hitung jumlah members
            ->withCount([
                'tasks as done_submissions_count' => function (Builder $query) {
                    $query->whereHas('submissions', function (Builder $subQuery) {
                        $subQuery->where('status', 'done');
                    });
                },
            ])
            ->get();

//            ->get();
        return Inertia::render('Dosen/LecturerClass', [
            'user' => $user,
            'classes' => $classes,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:classes,code',
            'teacher_id' => 'required|exists:users,id',
        ]);

        // Set class ID to match the code
        $data = $request->all();
        $data['id'] = $data['code']; // Assign code to id

        Classes::create($data);

        return back()->with('success', 'Kelas baru berhasil dibuat!');
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
