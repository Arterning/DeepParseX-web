import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FileImage, File, ArrowRight } from "lucide-react";
import Link from 'next/link';

// Mock data for uploaded files
const mockFiles = [
  { id: '1', name: 'Project Proposal.pdf', type: 'application/pdf', size: '2.3 MB', date: '2024-07-29' },
  { id: '2', name: 'Market-Analysis.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '850 KB', date: '2024-07-28' },
  { id: '3', name: 'Website_Mockup.png', type: 'image/png', size: '1.5 MB', date: '2024-07-28' },
  { id: '4', name: 'Q3-Financials.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '4.1 MB', date: '2024-07-27' },
];

const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith("image/")) return <FileImage className="h-8 w-8 text-primary" />;
  if (type.includes("pdf")) return <File className="h-8 w-8 text-destructive" />;
  return <FileText className="h-8 w-8 text-muted-foreground" />;
};

export default function FilesPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
        <p className="text-lg text-muted-foreground">Browse and manage your uploaded documents.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockFiles.map((file) => (
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
                <CardDescription className="mt-2 text-sm">{file.size} - {file.date}</CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
