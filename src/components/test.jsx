import {useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Paper, Button, Input } from '@mui/material';
import QRCode from 'react-qr-code';
import { toast } from "react-toastify";
import * as htmlToImage from "html-to-image";


const Test = () => {
    const [editorText, setEditorText] = useState('');
    const [qrCodeData, setQrCodeData] = useState(null);
    const quillRef = useRef(null);

    const handleChange = (value) => {
        setEditorText(value);
    };

    const handleGenerateQRCode = async () => {
        if (editorText === '') {
            toast.error("You must add some text!");
            return;
        }

        const quillContainer = quillRef.current.getEditor().root;
        try {
            const dataUrl = await htmlToImage.toPng(quillContainer);
            setQrCodeData(dataUrl);
            toast.success("QR Code created successfully!");
        } catch (error) {
            toast.error("Failed to generate QR Code.");
        }
    };

    const handleTextImport = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = () => {
                setEditorText(reader.result);
            };
            reader.readAsText(file);
        } else {
            toast.error("Please upload a valid text file");
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

    return (
        <Box sx={{ padding: 2, width: '90rem', height: '39rem', display: 'flex', flexDirection: 'row' }}>
            <Paper elevation={3} sx={{ padding: 2, width: '60%', marginRight: '2%' }}>
                <h2>Add Your Own Text Here</h2>
                <Input
                    type="file"
                    accept=".txt"
                    onChange={handleTextImport}
                    sx={{ margin: 2 }}
                />
                <ReactQuill
                    ref={quillRef}
                    value={editorText}
                    onChange={handleChange}
                    theme="snow"
                    modules={modules}
                    style={{ minHeight: '300px', height: '200px', width: '100%' }}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleGenerateQRCode}
                    sx={{ marginTop: 2 }}
                >
                    Generate QR Code
                </Button>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, width: '35%' }}>
                {qrCodeData && (
                    <div id="print-content" style={{ margin: '64px' }}>
                        <QRCode value={qrCodeData} size={256} />
                    </div>
                )}
            </Paper>
        </Box>
    );
};

export default Test;
