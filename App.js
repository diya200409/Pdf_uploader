import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await axios.get('http://localhost:5000/files');
    setFiles(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      setTitle('');
      setFile(null);
      fetchFiles();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        <h2>Upload PDF in React</h2>
        <form onSubmit={handleUpload} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <h3>Uploaded PDFs:</h3>
      <div className="pdf-list">
        {files.map((f) => (
          <div className="pdf-card" key={f._id}>
            <p>Title: {f.title}</p>
            <button onClick={() => setSelectedFile(f.file)}>Show PDF</button>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="pdf-viewer">
          <h4>Viewing PDF</h4>
          <Document file={`http://localhost:5000/uploads/${selectedFile}`}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
}

export default App;

