<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubmissionController extends Controller
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
        // Debugging: Log incoming request data
        Log::debug('Incoming submission request', [
            'user_id' => Auth::id(),
            'task_id' => $request->task_id ?? null,
            'type' => $request->type ?? null,
            'link' => $request->link ?? null,
            'file' => $request->file('file') ? 'File uploaded' : 'No file',
            'image' => $request->file('image') ? 'Image uploaded' : 'No image'
        ]);

        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'type' => 'required|string|in:link,file,image',
            'link' => 'nullable|required_if:type,link|url',
            'file' => 'nullable|required_if:type,file|file|max:10240', // Max 10MB
            'image' => 'nullable|required_if:type,image|image|max:5120', // Max 5MB
        ]);

        try {
            $data = [
                'task_id' => $request->task_id,
                'student_id' => Auth::id(),
                'type' => $request->type,
            ];

            if ($request->type === 'link') {
                $data['link'] = $request->link; // Menyimpan link di database
            } elseif ($request->type === 'file') {
                $uploadedFile = $request->file('file');
                $path = $uploadedFile->store('submissions', 'public');
                $data['file'] = $path;
            } elseif ($request->type === 'image') {
                $uploadedImage = $request->file('image');
                $path = $uploadedImage->store('submissions', 'public');
                $data['image'] = $path;
            }

            Submission::create($data);

            Log::info('Submission successful', ['student_id' => Auth::id(), 'task_id' => $request->task_id]);

            return response()->json([
                'message' => 'Submission successful!',
                'data' => $data
            ], 200);
//            return redirect()->back()->with('success', 'Submission successful');
        } catch (\Exception $e) {
            Log::error('Submission error', ['error' => $e->getMessage(), 'student_id' => Auth::id(), 'task_id' => $request->task_id]);

            return response()->json([
                'message' => 'Submission failed, please try again.',
                'error' => $e->getMessage()
            ], 500);
//            return redirect()->back()->with('error', `Submission error : {$e->getMessage()}`);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        // Validasi request
        $request->validate([
            'status' => 'required|string|in:pending,done',
        ]);

        try {
            // Cari submission berdasarkan ID
            $submission = Submission::findOrFail($id);

            // Debugging: Log perubahan status
            Log::debug('Updating submission status', [
                'submission_id' => $id,
                'old_status' => $submission->status,
                'new_status' => $request->status,
                'updated_by' => Auth::id()
            ]);

            // Perbarui status submission
            $submission->update([
                'status' => $request->status
            ]);

            Log::info('Submission status updated successfully', [
                'submission_id' => $id,
                'new_status' => $request->status
            ]);

//            return redirect()->back([
//                'message' => 'Status updated successfully!',
//                'data' => $submission
//            ], 200);
            return redirect()->back()->with('status', 'Submission status updated successfully');

        } catch (ModelNotFoundException $e) {
            Log::warning('Submission not found', ['submission_id' => $id]);

//            return response()->json([
//                'message' => 'Submission not found.',
//            ], 404);
            return redirect()->back()->with('error', 'Submission not found');
        } catch (\Exception $e) {
            Log::error('Failed to update submission status', [
                'error' => $e->getMessage(),
                'submission_id' => $id
            ]);
//
//            return response()->json([
//                'message' => 'Failed to update submission status.',
//                'error' => $e->getMessage()
//            ], 500);
            return redirect()->back()->with('error', 'Failed to update submission status');
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
