export interface Task {
    id: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    duedate: string;
    status: 'In Progress' | 'In Review' | 'On Hold' | 'Completed';
    category: 'Development' | 'Testing' | 'Bugs';
    description: {
      summary: string;
      details: string;
      acceptanceCriteria: string[];
      notes: string;
    };
  }