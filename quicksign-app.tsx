import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PenTool, Mail } from 'lucide-react';

const QuickSignApp = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [signature, setSignature] = useState('');
  const [initialField, setInitialField] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFileUrl(fileUrl);
    }
  }, [file]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleInitialChange = (event) => {
    setInitialField(event.target.value);
  };

  const handleSaveTemplate = () => {
    setTemplates([...templates, { file, signature, initialField }]);
    setSelectedTemplate(templates.length);
  };

  const handleEmailDocument = () => {
    // Logic to send the signed document via email
    setShowEmailModal(false);
  };

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    setLastPos({ x: event.clientX - event.target.offsetLeft, y: event.clientY - event.target.offsetTop });
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(event.clientX - event.target.offsetLeft, event.clientY - event.target.offsetTop);
    ctx.stroke();
    setLastPos({ x: event.clientX - event.target.offsetLeft, y: event.clientY - event.target.offsetTop });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>QuickSign E-Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block font-medium mb-2">
              Upload Document
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>

          {fileUrl && (
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    value={signature}
                    onChange={handleSignatureChange}
                    placeholder="Add Signature"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5 text-gray-500" />
                  <Input
                    type="text"
                    value={initialField}
                    onChange={handleInitialChange}
                    placeholder="Add Initials"
                  />
                </div>
                <Button onClick={handleSaveTemplate}>Save as Template</Button>
              </div>
              <div className="border rounded-lg overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="w-full h-full"
                />
                <img src={fileUrl} alt="Uploaded Document" className="absolute top-0 left-0 w-full h-full" />
              </div>
            </div>
          )}

          {templates.length > 0 && (
            <div>
              <label htmlFor="template-select" className="block font-medium mb-2">
                Select Template
              </label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(parseInt(e.target.value))}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              >
                <option value={null}>Select a template</option>
                {templates.map((template, index) => (
                  <option key={index} value={index}>
                    Template {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Email Document</span>
          </Button>
        </div>
      </CardContent>

      {showEmailModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Email Signed Document
                    </h3>
                    <div className="mt-2">
                      <Input
                        type="email"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleEmailDocument}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send
                </Button>
                <Button
                  onClick={() => setShowEmailModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuickSignApp;
