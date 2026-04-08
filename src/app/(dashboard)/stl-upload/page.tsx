'use client';

import React, { useState } from 'react';
import { UploadBox } from '@/components/ui/UploadBox';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api/client';

export default function STLUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('stl_files', f));





      await new Promise(r => setTimeout(r, 1500));
      
      setSuccess(true);
      setFiles([]); // Clear box
    } catch (err) {
      setError("Failed to upload files. Check your network or file size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 pt-32 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-[#0c2a50]">Print Your Own Files</h1>
        <p className="text-[#1a4073] mt-3 text-lg">
          Upload your .STL or .3MF files directly. We'll automatically check them for manifold issues and calculate a price quote.
        </p>
      </div>

      <Card className="shadow-2xl border-t-8 border-t-orange-500">
        <CardContent className="p-8 space-y-8">
          
          {success && (
             <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4">
               <CheckCircle2 size={48} className="text-green-500 mb-2" />
               <h3 className="text-2xl font-bold">Upload Successful!</h3>
               <p className="mt-2 text-green-800">Your files are now being analyzed. We'll email you a quote shortly.</p>
               <Button variant="outline" className="mt-4 border-green-500 text-green-700 hover:bg-green-100" onClick={() => setSuccess(false)}>
                 Upload More Files
               </Button>
             </div>
          )}

          {!success && (
            <>
              <UploadBox 
                files={files} 
                onFilesChange={setFiles} 
                accept=".stl, .3mf" 
                label="Drop your STL or 3MF files here" 
              />
              
              {error && <p className="text-red-500 font-medium text-sm text-center">{error}</p>}

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full text-lg shadow-md"
                disabled={files.length === 0}
                isLoading={loading}
                onClick={handleUpload}
              >
                Upload and Analyze
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
