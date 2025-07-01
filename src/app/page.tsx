"use client";

import { useState, useMemo, ChangeEvent, useCallback, useRef } from "react";
import {
  generateInsights,
  GenerateInsightsOutput,
} from "@/ai/flows/generate-insights-from-upload";
import { generateKnowledgeGraph } from "@/ai/flows/generate-knowledge-graph";
import { enhanceSearch } from "@/ai/flows/enhance-search-with-ai";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UploadCloud,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Loader2,
  Lightbulb,
  BrainCircuit,
  Search,
  ChevronRight,
  Sparkles,
  File,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KnowledgeGraphViewer from "@/components/knowledge-graph-viewer";

type LoadingStates = {
  parsing: boolean;
  generatingGraph: boolean;
  searching: boolean;
};

const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith("image/")) return <FileImage className="h-8 w-8 text-muted-foreground" />;
  if (type.startsWith("video/")) return <FileVideo className="h-8 w-8 text-muted-foreground" />;
  if (type.startsWith("audio/")) return <FileAudio className="h-8 w-8 text-muted-foreground" />;
  if (type === "application/pdf") return <File className="h-8 w-8 text-muted-foreground" />;
  return <FileText className="h-8 w-8 text-muted-foreground" />;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [insights, setInsights] = useState<GenerateInsightsOutput | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingStates>({
    parsing: false,
    generatingGraph: false,
    searching: false,
  });
  const [activeTab, setActiveTab] = useState("insights");

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentContent = useMemo(() => {
    if (!insights) return "";
    return `Summary: ${insights.summary}\n\nKey Insights:\n${insights.keyInsights.join("\n")}`;
  }, [insights]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInsights(null);
      setKnowledgeGraph(null);
      setSearchResults(null);
      setSearchQuery("");
      setActiveTab("insights");
    }
  };

  const handleParse = useCallback(async () => {
    if (!file) return;

    setLoading((prev) => ({ ...prev, parsing: true }));
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fileDataUri = reader.result as string;
        const result = await generateInsights({
          fileDataUri,
          fileType: file.type,
        });
        setInsights(result);
        toast({
          title: "Parsing Successful",
          description: "Key insights have been extracted from your document.",
        });
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to read file." });
      };
    } catch (error) {
      console.error("Error parsing document:", error);
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: "An error occurred while parsing the document.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, parsing: false }));
    }
  }, [file, toast]);

  const handleGenerateGraph = useCallback(async () => {
    if (!documentContent) return;

    setLoading((prev) => ({ ...prev, generatingGraph: true }));
    setKnowledgeGraph(null);
    try {
      const result = await generateKnowledgeGraph({ documentContent });
      setKnowledgeGraph(result.knowledgeGraph);
    } catch (error) {
      console.error("Error generating knowledge graph:", error);
      toast({
        variant: "destructive",
        title: "Graph Generation Failed",
        description: "Could not generate the knowledge graph.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, generatingGraph: false }));
    }
  }, [documentContent, toast]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || !documentContent) return;

    setLoading((prev) => ({ ...prev, searching: true }));
    setSearchResults(null);
    try {
      const result = await enhanceSearch({ query: searchQuery, documentContent });
      setSearchResults(result.enhancedResults);
    } catch (error) {
      console.error("Error enhancing search:", error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "An error occurred during the search.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, searching: false }));
    }
  }, [searchQuery, documentContent, toast]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
            DeepParseXWeb
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Intelligent Document Analysis Platform
          </p>
        </header>

        <Card className="max-w-3xl mx-auto shadow-lg border-2 border-dashed border-muted hover:border-primary transition-colors duration-300">
          <CardHeader className="items-center text-center">
            <UploadCloud className="w-12 h-12 text-primary" />
            <CardTitle>Upload Your Document</CardTitle>
            <CardDescription>
              Supports PDF, Word, Excel, PPT, images, video, and audio formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {!file ? (
              <Button
                size="lg"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-md border bg-secondary/50">
                  <FileIcon type={file.type} />
                  <div className="flex-1">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setFile(null)}>Change</Button>
                </div>
                <Button
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleParse}
                  disabled={loading.parsing}
                >
                  {loading.parsing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Parse Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {insights && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10 max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights"><Lightbulb className="mr-2" />Key Insights</TabsTrigger>
              <TabsTrigger value="graph"><BrainCircuit className="mr-2" />Knowledge Graph</TabsTrigger>
              <TabsTrigger value="search"><Search className="mr-2" />AI Search</TabsTrigger>
            </TabsList>
            <TabsContent value="insights" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{insights.summary}</p>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {insights.keyInsights.map((insight, index) => (
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
                  <CardDescription>
                    Generate a graph to explore relationships within your document.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {!knowledgeGraph && (
                    <Button onClick={handleGenerateGraph} disabled={loading.generatingGraph} size="lg">
                      {loading.generatingGraph ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <BrainCircuit className="mr-2 h-5 w-5" />
                      )}
                      Generate Knowledge Graph
                    </Button>
                  )}
                   {loading.generatingGraph && !knowledgeGraph && (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Generating graph...</p>
                    </div>
                  )}
                  {knowledgeGraph && <KnowledgeGraphViewer graphData={knowledgeGraph} />}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="search" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Search</CardTitle>
                  <CardDescription>
                    Ask questions or search for terms within your document.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="flex space-x-2">
                    <Input
                      type="search"
                      placeholder="e.g., What are the main conclusions?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading.searching}>
                      {loading.searching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                  
                  {loading.searching && (
                     <div className="flex justify-center items-center p-8 mt-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">Searching...</p>
                    </div>
                  )}

                  {searchResults && (
                    <Card className="mt-6 bg-secondary/50">
                      <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{searchResults}</p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
