"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FileImage, File, ArrowRight, Loader2 } from "lucide-react";
import Link from 'next/link';
import AuthGuard from "@/components/auth-guard";
import { useEffect, useState } from "react";
import { querySysDocList, SysDocRes } from "@/lib/file";

const FileIcon = ({ type }: { type: string }) => {
 if (type?.startsWith("image/")) return <FileImage className="h-8 w-8 text-primary" />;
 if (type?.includes("pdf")) return <File className="h-8 w-8 text-destructive" />;
 return <FileText className="h-8 w-8 text-muted-foreground" />;
};

export default function FilesPage() {
 const [files, setFiles] = useState<SysDocRes[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await querySysDocList({}); // Fetching all files for now
        setFiles(response.items);
      } catch (err) {
        setError("Failed to fetch files.");
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
 }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
          <p className="text-lg text-muted-foreground">Browse and manage your uploaded documents.</p>
        </header>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading files...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-destructive text-lg">{error}</div>
        )}
        {!loading && !error && files.length === 0 && (
          <div className="text-center text-muted-foreground text-lg">No files found.</div>
        )}
        {!loading && !error && files.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow group">
                <Link href={`/files/${file.id}`} className="block h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <FileIcon type={file.type} />
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg truncate">{file.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB - {new Date(file.created_time).toLocaleDateString()}</CardDescription>
                </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
