'use server';

/**
 * @fileOverview A RAG-based chat flow to answer questions from a document.
 *
 * - ragChat - A function that takes a user query and document content and returns an answer.
 * - RagChatInput - The input type for the ragChat function.
 * - RagChatOutput - The return type for the ragChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RagChatInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  documentContent: z.string().describe('The content of the document to use as context.'),
});
export type RagChatInput = z.infer<typeof RagChatInputSchema>;

const RagChatOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type RagChatOutput = z.infer<typeof RagChatOutputSchema>;


export async function ragChat(input: RagChatInput): Promise<RagChatOutput> {
  return ragChatFlow(input);
}

const ragChatPrompt = ai.definePrompt({
  name: 'ragChatPrompt',
  input: { schema: RagChatInputSchema },
  output: { schema: RagChatOutputSchema },
  prompt: `You are a helpful AI assistant. Your task is to answer the user's question based *ONLY* on the provided document content.

Do not use any external knowledge.

If the answer cannot be found within the document content, you must state that the information is not available in the provided document.

User Question: {{{query}}}

Document Content:
---
{{{documentContent}}}
---
`,
});

const ragChatFlow = ai.defineFlow(
  {
    name: 'ragChatFlow',
    inputSchema: RagChatInputSchema,
    outputSchema: RagChatOutputSchema,
  },
  async (input) => {
    const { output } = await ragChatPrompt(input);
    return output!;
  }
);
