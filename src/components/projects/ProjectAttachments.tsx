import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabaseService } from '@/services/supabase';
import { 
  Paperclip, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  File, 
  X,
  Plus 
} from 'lucide-react';

interface ProjectAttachment {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  url: string;
  uploaded_by: string | null;
  created_at: string;
}

interface ProjectAttachmentsProps {
  projectId: string;
}

export function ProjectAttachments({ projectId }: ProjectAttachmentsProps) {
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAttachments();
  }, [projectId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const attachmentsData = await supabaseService.getProjectAttachments(projectId);
      setAttachments(attachmentsData || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project attachments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of selectedFiles) {
        await supabaseService.uploadProjectAttachment(file, projectId);
      }

      toast({
        title: 'Success',
        description: `${selectedFiles.length} file(s) uploaded successfully`,
      });

      setSelectedFiles([]);
      fetchAttachments();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await supabaseService.deleteProjectAttachment(attachmentId);
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      fetchAttachments();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="h-4 w-4 text-steel-500" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    }
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-4 w-4 text-green-600" />;
    }
    return <File className="h-4 w-4 text-steel-500" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            Project Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            Project Attachments ({attachments.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Files
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Section */}
        <div className="space-y-4">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            id="file-upload"
            accept="*/*"
          />

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-steel-900">
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <Button
                      size="sm"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-steel-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSelectedFile(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Attachments List */}
        <div className="space-y-3">
          {attachments.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <Paperclip className="w-12 h-12 mx-auto mb-4 text-steel-300" />
              <p>No attachments yet</p>
              <p className="text-sm">Upload files to get started</p>
            </div>
          ) : (
            attachments.map((attachment) => (
              <Card key={attachment.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(attachment.file_type)}
                      <div>
                        <p className="font-medium text-steel-900">
                          {attachment.file_name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-steel-500">
                          <span>{formatFileSize(attachment.file_size)}</span>
                          <span>{formatDate(attachment.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(attachment.url, attachment.file_name)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(attachment.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 