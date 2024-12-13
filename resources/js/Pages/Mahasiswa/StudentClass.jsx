import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, router, useForm} from "@inertiajs/react";
import { useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export default function StudentClass({ classes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [isSubsModalOpen, setIsSubsModalOpen] = useState(false);
    const [taskID,setTaskID] = useState(null)
    const [status, setStatus] = useState(false)
    const [activeTask, setActiveTask] = useState(null);
    const [submissionType, setSubmissionType] = useState(null);
    const [submissionData, setSubmissionData] = useState({
        link: "",
        file: null,
        image: null,
    });

    console.log(classes)

    const openModal = (taskId) => {
        setActiveTask(taskId);
        setIsSubsModalOpen(true);
    };

    console.log('task : ',taskID)

    const closeModal = () => {
        setIsSubsModalOpen(false);
        setSubmissionType(null);
        setSubmissionData({ link: "", file: null, image: null });
    };

    const handleChange = async (assignment) => {
        try {
            // Toggle status berdasarkan status saat ini
            const currentStatus = assignment.submissions[0]?.status;
            const newStatus = currentStatus === 'pending' ? 'done' : 'pending';


            // Kirim permintaan ke server untuk memperbarui status
            const response = await router.post(
                route('student.submissions.update.status', assignment.submissions[0].id),
                { status: newStatus }
            );

            // Periksa respon dan lakukan sesuatu jika berhasil
            // if (response.status === 200) {
            //     console.log('Status updated successfully:', response.data);
            //     setStatus(newStatus); // Update state lokal jika perlu
            // } else {
            //     console.error('Failed to update status:', response);
            // }
            console.log(response)
        } catch (error) {
            // Tangani error
            console.error('Error updating status:', error);
        }
    };


    const handleSubmissionChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setSubmissionData({ ...submissionData, [name]: files[0] });
        } else {
            setSubmissionData({ ...submissionData, [name]: value });
        }
    };

    const toggleCollapse = (taskId) => {
        setActiveTask(prev => (prev === taskId ? null : taskId));
    };

    const { data, setData, post, processing, reset } = useForm({
        code: "", // Code of the class to join
    });

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(activeTask)
        const formData = new FormData();
        formData.append("task_id", taskID);
        formData.append("type", submissionType);

        if (submissionType === "link") {
            formData.append("link", submissionData.link);
        } else if (submissionType === "file") {
            formData.append("file", submissionData.file);
        } else if (submissionType === "image") {
            formData.append("image", submissionData.image);
        }

        try {
            const response = await axios.post(route('student.submissions.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Sesuaikan dengan jenis media yang digunakan
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                closeModal();
            } else {
                toast.error('Terjadi kesalahan saat mengunggah tugas.');
                console.error("Submission error:", response.data.error || 'Unknown error');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengunggah tugas.');
            console.error("Submission error:", error);
        }
    };




    const handleJoinClass = async (e) => {
        e.preventDefault();
        post(route("student.joinClass"), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                toast.success('Kelas berhasil bergabung!');
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat bergabung dengan kelas. Silakan coba lagi.');
            }
        });
    };

    const calculateRemainingTime = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffInMilliseconds = deadlineDate - now;

        if (diffInMilliseconds <= 0) {
            return 'Sudah lewat waktu!';
        }

        const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffInMilliseconds / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);

        if (days > 0) {
            return `${days} hari tersisa`;
        } else if (hours > 0) {
            return `${hours} jam tersisa`;
        } else {
            return `${minutes} menit tersisa`;
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-monza-800">Kelas Mahasiswa</h2>}
        >
            <Head title="Kelas Mahasiswa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-monza-900">
                            <div className="flex justify-between items-center">
                                <p>Daftar Kelas</p>
                                <button
                                    className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Masukkan Kode Kelas
                                </button>
                            </div>

                            {/* Class List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {classes.map((cls) => (
                                    <div
                                        key={cls.class_id}
                                        className={`p-4 border rounded shadow cursor-pointer ${selectedClass?.class_id === cls.class_id ? 'bg-monza-300' : 'hover:bg-monza-100'}`}
                                        onClick={() => handleClassClick(cls)} // Handle class click
                                    >
                                        <h3 className="text-lg font-bold uppercase">{cls.class.name}</h3>
                                        <p className="text-sm text-monza-600">Kode: {cls.class.code}</p>
                                        <p className="text-sm text-monza-600 font-bold">Dosen: {cls.class.teacher.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedClass && (
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-monza-900">
                            <div className="grid justify-between items-center">
                                <h2 className={"font-bold text-2xl capitalize"}>{selectedClass?.class.name}</h2>
                                <h4 className={"font-bold capitalize text-monza-600"}>{selectedClass?.class.teacher.name}</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mt-6">
                                {selectedClass?.class?.tasks?.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className={`p-4 border rounded shadow cursor-pointer ${activeTask === assignment.id ? 'bg-monza-300' : 'hover:bg-monza-100'} ${assignment.submissions[0]?.status !== 'pending' ? 'bg-green-100' : 'bg-monza-300'}`}
                                        onClick={() => {
                                            toggleCollapse(assignment.id)
                                            setTaskID(assignment.id)
                                        }}
                                    >
                                        <div className={"flex justify-between"}>
                                            <div>
                                                <span className={'font-bold text-2xl capitalize'}>{assignment.title}</span>
                                                <p className={`text-sm font-medium text-monza-400 ${activeTask === assignment.id ? 'hidden' : ''}`}>{assignment.description}</p>
                                            </div>
                                            <div>
                                                <p>{new Date(assignment.deadline).toLocaleDateString()}</p>
                                                <p className="text-sm text-gray-500">{calculateRemainingTime(assignment.deadline)}</p>
                                            </div>
                                        </div>
                                        {activeTask === assignment.id && (
                                            <div className="pl-4">
                                                <p>Deskripsi: {assignment.description}</p>
                                                <p>Tanggal Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                                                {assignment.submissions !== null && (
                                                    <div className="pl-4 mt-2">
                                                        {assignment.submissions[0]?.file && (
                                                            <div>
                                                                <p className="text-sm text-gray-600">Preview File: <a
                                                                    href={`/storage/${assignment.submissions[0].file}`} className="text-blue-500"
                                                                    target="_blank" rel="noopener noreferrer">Lihat File</a>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {assignment.submissions[0]?.image && (
                                                            <div>
                                                                <p className="text-sm text-gray-600">Preview Gambar:</p>
                                                                <img src={`/storage/${assignment.submissions[0].image}`} alt="Tugas Dikumpulkan"
                                                                     className="w-full h-auto rounded mt-1"/>
                                                            </div>
                                                        )}
                                                        {assignment.submissions[0]?.link && (
                                                            <div>
                                                                <p className="text-sm text-gray-600">Preview Link: <a
                                                                    href={assignment.submissions[0].link} className="text-blue-500"
                                                                    target="_blank" rel="noopener noreferrer">Lihat Link</a>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={'flex justify-end'}>
                                                    {assignment.submissions.length >0 ? (
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`hs-xs-switch-${assignment.id}`}
                                                                checked={assignment.submissions[0]?.status === 'done'}
                                                                // checked={status}
                                                                onChange={()=> {
                                                                    handleChange(assignment)
                                                                }}
                                                                className="relative w-[35px] h-[21px] bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600
                before:inline-block before:w-4 before:h-4 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                                                            />
                                                            <label
                                                                htmlFor={`hs-xs-switch-${assignment.id}`}
                                                                className="px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                                                            >
                                                                Tandai sebagai selesai
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => openModal(assignment.id)}
                                                                className="px-4 py-2 text-white bg-monza-600 rounded hover:bg-monza-700">
                                                            Unggah Tugas
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Joining Class */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Masukkan Kode Kelas</h2>
                        <form onSubmit={handleJoinClass}>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                className="block w-full p-2 border rounded mb-4"
                                placeholder="Kode kelas"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 w-full text-white bg-monza-600 rounded hover:bg-monza-700"
                                disabled={processing}
                            >
                                Bergabung
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Submitting Tasks */}
            {isSubsModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Unggah Tugas</h2>
                        <div className="mb-4">
                            <button
                                className={`px-4 py-2 w-full rounded ${submissionType === 'link' ? 'bg-monza-600 text-white' : 'border bg-white'}`}
                                onClick={() => setSubmissionType('link')}
                            >
                                Unggah Link
                            </button>
                            <input
                                type="text"
                                name="link"
                                value={submissionData.link}
                                onChange={handleSubmissionChange}
                                className={`block w-full p-2 border rounded mt-2 ${submissionType !== 'link' ? 'hidden' : ''}`}
                                placeholder="URL link"
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                className={`px-4 py-2 w-full rounded ${submissionType === 'file' ? 'bg-monza-600 text-white' : 'border bg-white'}`}
                                onClick={() => setSubmissionType('file')}
                            >
                                Unggah File
                            </button>
                            <input
                                type="file"
                                name="file"
                                onChange={handleSubmissionChange}
                                className={`block w-full p-2 border rounded mt-2 ${submissionType !== 'file' ? 'hidden' : ''}`}
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                className={`px-4 py-2 w-full rounded ${submissionType === 'image' ? 'bg-monza-600 text-white' : 'border bg-white'}`}
                                onClick={() => setSubmissionType('image')}
                            >
                                Unggah Gambar
                            </button>
                            <input
                                type="file"
                                name="image"
                                onChange={handleSubmissionChange}
                                className={`block w-full p-2 border rounded mt-2 ${submissionType !== 'image' ? 'hidden' : ''}`}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 w-full text-white bg-monza-600 rounded hover:bg-monza-700"
                            disabled={processing}
                        >
                            Unggah
                        </button>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 mt-2 w-full text-monza-600 border rounded hover:bg-monza-100"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
