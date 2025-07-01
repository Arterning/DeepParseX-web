// Enhance Search with AI flow

'use server';

/**
 * @fileOverview Enhances the search interface with AI to provide more relevant results based on the context of the search queries.
 *
 * - enhanceSearch - A function that takes a search query and document content and returns enhanced search results.
 * - EnhanceSearchInput - The input type for the enhanceSearch function.
 * - EnhanceSearchOutput - The return type for the enhanceSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSearchInputSchema = z.object({
  query: z.string().describe('The search query entered by the user.'),
  documentContent: z.string().describe('The content of the document to search through.'),
});
export type EnhanceSearchInput = z.infer<typeof EnhanceSearchInputSchema>;

const EnhanceSearchOutputSchema = z.object({
  enhancedResults: z
    .string()
    .describe(
      'The enhanced search results that are more relevant to the query based on the context.'
    ),
});
export type EnhanceSearchOutput = z.infer<typeof EnhanceSearchOutputSchema>;

export async function enhanceSearch(input: EnhanceSearchInput): Promise<EnhanceSearchOutput> {
  return enhanceSearchFlow(input);
}

const enhanceSearchPrompt = ai.definePrompt({
  name: 'enhanceSearchPrompt',
  input: {schema: EnhanceSearchInputSchema},
  output: {schema: EnhanceSearchOutputSchema},
  prompt: `You are an AI assistant designed to enhance search results based on the context of the search queries.

  User Query: {{{query}}}
  Document Content: {{{documentContent}}}

  Based on the user query and the document content, provide enhanced search results that are more relevant to the query.
  Return the enhanced search results only.
  `,
});

const enhanceSearchFlow = ai.defineFlow(
  {
    name: 'enhanceSearchFlow',
    inputSchema: EnhanceSearchInputSchema,
    outputSchema: EnhanceSearchOutputSchema,
  },
  async input => {
    const {output} = await enhanceSearchPrompt(input);
    return output!;
  }
);
