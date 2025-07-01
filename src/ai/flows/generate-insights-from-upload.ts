'use server';

/**
 * @fileOverview A document insights generation AI agent.
 *
 * - generateInsights - A function that handles the document insights generation process.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      'A file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  fileType: z.string().describe('The type of the file (e.g., pdf, docx, etc.)'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document.'),
  keyInsights: z.array(z.string()).describe('Key insights extracted from the document.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI assistant specialized in extracting key insights and summarizing documents.

You will receive a document as input, and your task is to provide a concise summary and extract the most important insights.

Consider the file type when processing the document.

File Type: {{{fileType}}}

Document: {{media url=fileDataUri}}

Summary:
Key Insights:`, // Placeholder - Handlebars doesn't allow complex logic
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
