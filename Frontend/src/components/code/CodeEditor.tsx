import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '', 
  onCodeChange,
  value,
  onChange
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [userQuery, setUserQuery] = useState<string>('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Set focus to the editor when component mounts
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };
  
  const handleSave = () => {
    if (!userQuery.trim()) {
      toast.error('Please enter a description for your code');
      return;
    }

    // Prepare data to send to the backend
    const codeData = {
      code: value || code,
      query: userQuery
    };
    
    // Log data for Postman testing
    console.log('POSTMAN TEST DATA (copy this):');
    console.log(JSON.stringify(codeData, null, 2));
    
    // Show success message without actually sending
    toast.success('Code data logged to console (check DevTools)');
    
    /* 
    // Uncomment when backend is ready
    fetch('http://localhost:8080/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(codeData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      toast.success('Code sent successfully');
    })
    .catch((error) => {
      console.error('Error:', error);
      toast.error('Failed to send code');
    });
    */
  };
  
  return (
    <div className="flex flex-1">
      {/* Main Code Editor Area */}
      <div className="flex-1 p-4">
        <textarea
          ref={editorRef}
          value={value !== undefined ? value : code}
          onChange={onChange || handleCodeChange}
          className="w-full h-full p-4 font-mono text-sm bg-[#0D1117] text-[#E6EDF3] border border-[#30363D] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          spellCheck="false"
          placeholder="Write your code here..."
        />
      </div>
      
      {/* Right Sidebar - Properties */}
      <div className="w-64 p-4 bg-[#161B22] flex flex-col space-y-4 border-l border-[#30363D]">
        <div className="mt-auto">
          <h3 className="text-sm font-medium mb-2 text-[#E6EDF3]">Save Code</h3>
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Enter a description..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
            />
            <Button onClick={handleSave} className="w-full bg-[#238636] hover:bg-[#2EA043] text-white">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
