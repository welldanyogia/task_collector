import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function LecturerClass({ user, classes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [selectedClass, setSelectedClass] = useState(null); // State to hold selected class details
    const [activeTab, setActiveTab] = useState("students");
    const [activeTask, setActiveTask] = useState(null);

    const toggleCollapse = (taskId) => {
        // Jika task yang diklik sudah aktif, tutup; jika tidak, buka
        setActiveTask((prev) => (prev === taskId ? null : taskId));
    };

    console.log(classes)

    // Form handling with Inertia.js
    const { data, setData, post, processing, reset } = useForm({
        name: "", // Name of the class
        code: "", // Code of the class
        teacher_id: user.id, // Current logged-in user ID
    });

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const { data: taskData, setData: setTaskData, post: postTask, processing: taskProcessing, reset: resetTaskForm } = useForm({
        title: "",
        description: "",
        deadline: "",
        class_id: "",
    });


    const handleTaskSubmit = (e) => {
        e.preventDefault();
        postTask(route("tasks.store"), {
            onSuccess: () => {
                setIsTaskModalOpen(false);
                resetTaskForm();
            },
        });
    };


    // Generate unique class code when the modal opens
    useEffect(() => {
        if (isModalOpen) {
            const uniqueCode = generateUniqueCode();
            setGeneratedCode(uniqueCode);
            setData("code", uniqueCode); // Automatically set the code in the form
        }
    }, [isModalOpen]);

    // Function to generate a unique alphanumeric code
    const generateUniqueCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "CLS-";
        for (let i = 0; i < 6; i++) { // Generate a 6-character code
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("classes.store"), {
            onSuccess: () => {
                setIsModalOpen(false); // Close modal on success
                reset(); // Reset form fields
            },
        });
    };

    const handleClassClick = (cls) => {
        setTaskData("class_id",cls.id)
        setSelectedClass(cls); // Set the clicked class as the selected class
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-monza-800">
                    Kelas Dosen
                </h2>
            }
        >
            <Head title="Kelas Dosen" />

            <div className="py-12 space-y-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-monza-900">
                            <div className="flex justify-between items-center">
                                <p>Daftar Kelas Anda</p>
                                {/*Button Tambah Kelas*/}
                                <button
                                    className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Buat Kelas Baru
                                </button>
                            </div>

                            {/* Class List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.code}
                                        className={`p-4 border rounded shadow cursor-pointer ${selectedClass?.code === cls.code ? 'bg-monza-300' : 'hover:bg-monza-100'}`}
                                        onClick={() => handleClassClick(cls)} // Handle class click
                                    >
                                        <h3 className="text-lg font-bold uppercase">{cls.name}</h3>
                                        <p className="text-sm text-monza-600">Kode: {cls.code}</p>
                                        <p className="text-sm text-monza-600">Mahasiswa: {cls.members_count}</p>
                                    </div>
                                ))}

                            </div>

                            {/* Class Details */}
                            {/*{selectedClass && (*/}
                            {/*    <div className="mt-6 p-4 border rounded shadow">*/}
                            {/*        <h3 className="text-lg font-bold uppercase">{selectedClass.name}</h3>*/}
                            {/*        <p className="text-sm text-monza-600">Kode: {selectedClass.code}</p>*/}
                            {/*        <p className="text-sm text-monza-600">Mahasiswa: {selectedClass.members_count}</p>*/}
                            {/*        <p className="text-sm text-monza-600">Dosen: {selectedClass.teacher.name}</p>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </div>
                {
                    selectedClass && (
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-monza-900">
                                    <div className="flex justify-between items-center">
                                        <h2 className={"font-bold text-2xl capitalize"}>{selectedClass?.name}</h2>
                                    </div>

                                    {/* Tabs */}
                                    <div className="mt-6">
                                        <ul className="flex space-x-4 border-b">
                                            <li
                                                className={`cursor-pointer pb-2 ${activeTab === "students" ? "border-b-2 border-monza-600" : "text-monza-600"}`}
                                                onClick={() => setActiveTab("students")}
                                            >
                                                Mahasiswa
                                            </li>
                                            <li
                                                className={`cursor-pointer pb-2 ${activeTab === "assignments" ? "border-b-2 border-monza-600" : "text-monza-600"}`}
                                                onClick={() => setActiveTab("assignments")}
                                            >
                                                Tugas
                                            </li>
                                        </ul>

                                        {/* Tab Content */}
                                        <div className="p-4 border rounded shadow">
                                            {activeTab === "students" ? (
                                                <div>
                                                    <h3 className="text-lg font-bold mb-4">Daftar Mahasiswa</h3>
                                                    <p className="text-sm text-monza-600 mb-2">Jumlah
                                                        Mahasiswa: {selectedClass?.members?.length || 0}</p>
                                                    <div className="overflow-x-auto">
                                                        <table
                                                            className="min-w-full border-collapse border border-monza-300">
                                                            <thead>
                                                            <tr className="bg-monza-200">
                                                                <th className="px-4 py-2 border border-monza-300 text-left">No</th>
                                                                <th className="px-4 py-2 border border-monza-300 text-left">Nama
                                                                    Mahasiswa
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {selectedClass?.members?.map((member, index) => (
                                                                <tr
                                                                    key={member.student.id}
                                                                    className={index % 2 === 0 ? 'bg-monza-50' : 'bg-monza-100'}
                                                                >
                                                                    <td className="px-4 py-2 border border-monza-300">{index + 1}</td>
                                                                    <td className="px-4 py-2 border border-monza-300">{member.student.name}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>


                                            ) : (
                                                <div className="card mb-4 p-4 bg-white rounded shadow">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="text-lg font-bold text-monza-600">Daftar
                                                            Tugas</h3>
                                                        {/*Button Tambah Tugas*/}
                                                        <button
                                                            className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700"
                                                            onClick={() => setIsTaskModalOpen(true)}
                                                        >
                                                            Tambah Tugas Baru
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4 mt-6">
                                                        {selectedClass?.tasks?.map((assignment) => (
                                                            <div
                                                                key={assignment.id}
                                                                className={`p-4 border rounded shadow cursor-pointer ${
                                                                    activeTask === assignment.id ? 'bg-monza-300' : 'hover:bg-monza-100'
                                                                }`}
                                                                onClick={() => toggleCollapse(assignment.id)}
                                                            >
                                                                <div className={'font-bold text-xl capitalize'}>{assignment.title}</div>
                                                                <div className={'font-bold text-sm capitalize'}>Pengumpulan : {selectedClass.done_submissions_count}</div>
                                                                {activeTask === assignment.id && (
                                                                    <div className="pl-4">
                                                                        <p>Deskripsi: {assignment.description}</p>
                                                                        <p>
                                                                            Tanggal
                                                                            Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                                                                        </p>

                                                                        {/* Daftar Pengumpulan Tugas */}
                                                                        <div className="mt-4">
                                                                            <h4 className={`font-bold ${selectedClass.done_submissions_count <= 0 ? 'hidden' : ''}`}>Daftar Pengumpulan Tugas:</h4>
                                                                            {assignment.submissions && assignment.submissions.length > 0 ? (
                                                                                <div className="grid grid-cols-1 gap-4">
                                                                                    {assignment.submissions.filter(submission => submission.status === 'done').map((submission, index) => (
                                                                                        <div key={submission.id} className="border p-4 rounded-lg shadow-md bg-neutral-100">
                                                                                            <p>Nama Siswa: {submission.student.name}</p>
                                                                                            {submission.link && (
                                                                                                <p>Link: <a href={submission.link} target="_blank" rel="noopener noreferrer">{submission.link}</a></p>
                                                                                            )}
                                                                                            {submission.file && (
                                                                                                <p>File: <a href={`/storage/${submission.file}`} target="_blank" rel="noopener noreferrer" className={'text-blue-500'}>Download</a></p>
                                                                                            )}
                                                                                            {submission.image && (
                                                                                                <p>Gambar: <a href={`/storage/${submission.image}`} target="_blank" rel="noopener noreferrer"><img src={`/storage/${submission.image}`} alt="Pengumpulan Gambar" className="w-32 h-32 object-cover rounded-md" /></a></p>
                                                                                            )}
                                                                                            {/*<p>Status: S</p>*/}
                                                                                        </div>
                                                                                    ))}

                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-gray-500">Belum ada
                                                                                    pengumpulan tugas.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* Modal Tambah Kelas */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
                        <h3 className="mb-4 text-lg font-bold">Buat Kelas Baru</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Class Name Input */}
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-monza-700"
                                >
                                    Nama Kelas
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-monza-300"
                                    required
                                />
                            </div>

                            {/* Generated Class Code */}
                            <div className="mb-4">
                                <label
                                    htmlFor="code"
                                    className="block text-sm font-medium text-monza-700"
                                >
                                    Kode Kelas
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    value={generatedCode}
                                    readOnly
                                    className="w-full px-3 py-2 mt-1 border bg-monza-100 rounded focus:outline-none"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-monza-700 bg-monza-200 rounded hover:bg-monza-300"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        reset();
                                    }}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700"
                                                disabled={processing}
                                            >
                                                {processing ? "Menyimpan..." : "Simpan"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

            {/*Modal Tambah Tugas*/}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded shadow-lg">
                        <h3 className="mb-4 text-lg font-bold">Tambah Tugas Baru</h3>
                        <form onSubmit={handleTaskSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-monza-700">
                                    Judul Tugas
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={taskData.title}
                                    onChange={(e) => setTaskData("title", e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-monza-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-monza-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    id="description"
                                    value={taskData.description}
                                    onChange={(e) => setTaskData("description", e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-monza-300"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="deadline" className="block text-sm font-medium text-monza-700">
                                    Batas Waktu
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    value={taskData.deadline}
                                    onChange={(e) => setTaskData("deadline", e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-monza-300"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-monza-700 bg-monza-200 rounded hover:bg-monza-300"
                                    onClick={() => {
                                        setIsTaskModalOpen(false);
                                        resetTaskForm();
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700"
                                    disabled={taskProcessing}
                                >
                                    {taskProcessing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
);
}
