const API_BASE_URL = 'http://localhost:3001/api';

export interface ExecutionPayload {
  language: string;
  code: string;
  testCases: any[];
  timeLimit?: number;
  problemId?: string;
}

export const executeCode = async (payload: ExecutionPayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Code execution service error:', error);
    throw new Error(error.message || 'Failed to connect to the execution service.');
  }
};
