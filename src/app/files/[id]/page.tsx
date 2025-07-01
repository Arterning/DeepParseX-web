"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BrainCircuit, ChevronRight } from "lucide-react";
import KnowledgeGraphViewer from "@/components/knowledge-graph-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for a single file's details
const mockFileDetail = {
  id: '1',
  name: 'Project Proposal.pdf',
  summary: 'This document outlines a proposal for the DeepParseXWeb project, an intelligent platform for document analysis. It covers the project goals, target audience, key features, and a high-level technical architecture. The proposal emphasizes the use of AI for generating insights and knowledge graphs from various file formats.',
  keyInsights: [
    'Utilize Genkit for building AI flows for insight generation.',
    'Support multiple file types including PDF, DOCX, and images.',
    'The core features are AI-powered search, knowledge graph visualization, and automated summarization.',
    'The platform will be built using Next.js and ShadCN UI for a modern, responsive user experience.',
  ],
  knowledgeGraph: JSON.stringify({
    nodes: [
      { id: "1", label: "DeepParseXWeb", type: "Project" },
      { id: "2", label: "Genkit", type: "Technology" },
      { id: "3", label: "Next.js", type: "Technology" },
      { id: "4", label: "AI Search", type: "Feature" },
      { id: "5", label: "Knowledge Graph", type: "Feature" },
    ],
    edges: [
      { from: "1", to: "2", label: "uses" },
      { from: "1", to: "3", label: "uses" },
      { from: "1", to: "4", label: "has feature" },
      { from: "1", to: "5", label: "has feature" },
      { from: "4", to: "2", label: "powered by" },
    ],
  }, null, 2),
};


export default function FileDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch file data based on params.id
  // For this prototype, we always show data for file with id '1'
  const file = mockFileDetail;


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight truncate">{file.name}</h1>
        <p className="text-lg text-muted-foreground">Detailed analysis and insights for mock file: {params.id}</p>
      </header>

      <Tabs defaultValue="insights" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights"><Lightbulb className="mr-2" />Key Insights</TabsTrigger>
            <TabsTrigger value="graph"><BrainCircuit className="mr-2" />Knowledge Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="mt-6">
            <Card>
            <CardHeader>
                <CardTitle>Document Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">{file.summary}</p>
            </CardContent>
            </Card>
            <Card className="mt-6">
            <CardHeader>
                <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                {file.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                    <ChevronRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{insight}</span>
                    </li>
                ))}
                </ul>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="graph" className="mt-6">
            <Card>
            <CardHeader>
                <CardTitle>Knowledge Graph Visualization</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <KnowledgeGraphViewer graphData={file.knowledgeGraph} />
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
