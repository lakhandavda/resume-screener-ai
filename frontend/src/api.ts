import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Candidate {
  name: string;
  score: number;
  strengths: string[];
  gaps: string[];
  summary: string;
  filename: string;
}

export const screenResumes = async (files: File[], jd: string): Promise<Candidate[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('jd', jd);

  const response = await axios.post(`${API_BASE_URL}/screen`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const chatWithResumes = async (
  messages: { role: string; content: string }[],
  context: string,
  onChunk: (chunk: string) => void
) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, context }),
  });

  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    onChunk(chunk);
  }
};
