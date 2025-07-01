"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type?: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
}

interface KnowledgeGraphData {
  nodes: Node[];
  edges: Edge[];
}

interface KnowledgeGraphViewerProps {
  graphData: string;
}

const KnowledgeGraphViewer = ({ graphData }: KnowledgeGraphViewerProps) => {
  const data: KnowledgeGraphData | null = useMemo(() => {
    try {
      // Sometimes the AI wraps the JSON in markdown code block
      const sanitizedData = graphData.replace(/^```json\n|```$/g, '');
      const parsed = JSON.parse(sanitizedData);
      if (parsed.nodes && parsed.edges) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse knowledge graph data:', error);
      return null;
    }
  }, [graphData]);

  if (!data) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Graph Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">
            The generated knowledge graph data could not be parsed. It might be in an incorrect format.
          </p>
          <details className="mt-4 text-sm">
            <summary>Show raw data</summary>
            <pre className="mt-2 p-2 bg-muted rounded-md text-xs whitespace-pre-wrap">
              <code>{graphData}</code>
            </pre>
          </details>
        </CardContent>
      </Card>
    );
  }

  const nodeMap = new Map(data.nodes.map(node => [node.id, node]));

  return (
    <div className="space-y-6 text-left">
      <Card>
        <CardHeader>
          <CardTitle>Entities</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.nodes.map(node => (
            <Badge key={node.id} variant="secondary" className="text-sm px-3 py-1">
              {node.label}
              {node.type && <span className="ml-2 text-muted-foreground opacity-75">({node.type})</span>}
            </Badge>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Relationships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.edges.map((edge, index) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);

            if (!fromNode || !toNode) return null;

            return (
              <div key={index} className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg animate-fade-in transition-all hover:bg-muted">
                <Badge variant="default" className="text-base">{fromNode.label}</Badge>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground italic">{edge.label}</span>
                    <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                <Badge variant="default" className="text-base">{toNode.label}</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeGraphViewer;
