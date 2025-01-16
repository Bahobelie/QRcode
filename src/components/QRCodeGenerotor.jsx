import  { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Paper, Button, Input } from '@mui/material';
import QRCode from 'react-qr-code';
import { toast } from "react-toastify";
import axios from 'axios';

const TextEditorWithQRCode = () => {
    const [editorText, setEditorText] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [uploadedQRCodeText, setUploadedQRCodeText] = useState('');

    const quillRef = useRef(null);
    const hasShownToast = useRef(false);

    const handleChange = (value) => {
        setEditorText(value);
    };

    const handleGenerateQRCode = () => {
        if (editorText === '' && uploadedQRCodeText==='') {
            toast.error("You must add some text!");
            return;
        }
        setShowQRCode(true);
    };

    useEffect(() => {
        if (showQRCode === true && !hasShownToast.current) {
            toast.success("You created a QR code successfully!");
            hasShownToast.current = true;
        }
    }, [showQRCode]);

    const handlePrint = () => {
        const printContent = document.getElementById('print-content');
        const printWindow = window.open('', '', 'height=500,width=800');
        printWindow.document.write('<html lang="eng"><head><title>Print</title></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file1', file, file.name);

            try {
                const response = await axios.post(
                    'https://api.magicapi.dev/api/v1/capix/faceswap/upload/',
                    formData,
                    {
                        headers: {
                            'accept': 'application/json',
                            'x-magicapi-key': 'cm5z0ql0d0003jr03ggjgiu97',
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setUploadedQRCodeText(response.data.result); // Assuming the API returns the QR code text as `qrCodeText`
                console.log(response.data);
                console.log(uploadedQRCodeText);
            } catch (error) {
                console.error("Upload Error:", error);
            }
        } else {
            toast.error("Please select an image file.");
        }
    };

    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': ['small', 'normal', 'large', 'huge'] }],
            [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const handleClean = () => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.setText('');
            setEditorText('');
            setShowQRCode(false);
        }
    };

    return (
        <Box sx={{ padding: 2, width: '90rem', height: '39rem', display: 'flex', flexDirection: 'row' }}>
            <Paper elevation={3} sx={{ padding: 2, width: '60%', marginRight: '2%' }}>
                <h2>Add Your Own Text Here</h2>
                <Input
                    type="file"
                    accept=".txt"
                    placeholder="This only supports text files"
                    onChange={handleFileUpload}
                    sx={{ margin: 2 }}
                />
                <ReactQuill
                    ref={quillRef}
                    value={editorText}
                    onChange={handleChange}
                    theme="snow"
                    modules={modules}
                    style={{
                        minHeight: '300px',
                        height: '150px',
                        backgroundImage: 'url("/src/assets/imgi.png")',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleClean}
                    sx={{ marginTop: 13 }}
                >
                    Clean Editor
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleGenerateQRCode}
                    sx={{ marginTop: 13, marginLeft: 40 }}
                >
                    Generate QR Code
                </Button>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, width: '35%' }}>
                {showQRCode && (
                    <div id="print-content" style={{ margin: '64px' }}>
                        <QRCode value={editorText + uploadedQRCodeText || 'No text'} size={256} />
                    </div>
                )}

                {showQRCode && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handlePrint}
                        sx={{ margin: 17 }}
                    >
                        Print QR Code
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default TextEditorWithQRCode;
