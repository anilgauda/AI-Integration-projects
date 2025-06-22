'use client'
import { Upload } from 'lucide-react'
import React from 'react'

function FileUpload() {
    const [uploading, setUploading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleFileUploadButtonClick = () => {
        const element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', 'application/pdf');
        element.addEventListener('change', async (event) => {
            setError('');
            setSuccess(false);
            if (element.files && element.files.length > 0) {
                const file = element.files.item(0);
                if (file) {
                    const formData = new FormData();
                    formData.append('pdf', file);
                    setUploading(true);
                    try {
                        const res = await fetch('http://localhost:8000/upload/pdf', {
                            method: 'POST',
                            body: formData,
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        setSuccess(true);
                    } catch (e) {
                        setError('Failed to upload PDF. Please try again.');
                    } finally {
                        setUploading(false);
                    }
                }
            }
        });
        element.click();
    };

    return (
        <div className="bg-slate-900 text-white shadow-2xl flex flex-col justify-center items-center p-8 rounded-lg border-slate-800 border w-full max-w-md mx-auto mt-12">
            <button
                onClick={handleFileUploadButtonClick}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-60"
                disabled={uploading}
            >
                <Upload className="w-6 h-6" />
                {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
            <p className="mt-4 text-slate-300 text-sm text-center">Select a PDF file to upload and analyze. Only PDF files are supported.</p>
            {success && <p className="mt-2 text-green-400">Upload successful!</p>}
            {error && <p className="mt-2 text-red-400">{error}</p>}
        </div>
    );
}

export default FileUpload