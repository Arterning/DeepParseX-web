'use server';

/**
 * @fileOverview Flow to generate a knowledge graph from document content.
 *
 * - generateKnowledgeGraph - A function that handles the knowledge graph generation process.
 * - GenerateKnowledgeGraphInput - The input type for the generateKnowledgeGraph function.
 * - GenerateKnowledgeGraphOutput - The return type for the generateKnowledgeGraph function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateKnowledgeGraphInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to generate a knowledge graph from.'),
});
export type GenerateKnowledgeGraphInput = z.infer<
  typeof GenerateKnowledgeGraphInputSchema
>;

const GenerateKnowledgeGraphOutputSchema = z.object({
  knowledgeGraph: z
    .string()
    .describe(
      'A knowledge graph generated from the document content in JSON format.'
    ),
});
export type GenerateKnowledgeGraphOutput = z.infer<
  typeof GenerateKnowledgeGraphOutputSchema
>;

export async function generateKnowledgeGraph(
  input: GenerateKnowledgeGraphInput
): Promise<GenerateKnowledgeGraphOutput> {
  return generateKnowledgeGraphFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateKnowledgeGraphPrompt',
  input: {schema: GenerateKnowledgeGraphInputSchema},
  output: {schema: GenerateKnowledgeGraphOutputSchema},
  prompt: `You are an expert knowledge graph generator. Given the following document content, generate a knowledge graph in JSON format representing the relationships between different entities and concepts.

Document Content: {{{documentContent}}}

Knowledge Graph (JSON):`,
});

const generateKnowledgeGraphFlow = ai.defineFlow(
  {
    name: 'generateKnowledgeGraphFlow',
    inputSchema: GenerateKnowledgeGraphInputSchema,
    outputSchema: GenerateKnowledgeGraphOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
