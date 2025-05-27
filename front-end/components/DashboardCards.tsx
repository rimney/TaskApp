import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

interface StatusCounts {
  All: number;
  Completed: number;
  'In Progress': number;
  'In Review': number;
  'On Hold': number;
}

interface DashboardCardsProps {
  statusCounts: StatusCounts;
}

export default function DashboardCards({ statusCounts }: DashboardCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Preview Tasks And Tasks Data Here</CardDescription>
      </CardHeader>
      <div className="w-full h-auto flex flex-col sm:flex-row items-center justify-evenly gap-4 p-4">
        {[
          { status: 'In Progress', count: statusCounts['In Progress'], color: '#9d9bfe' },
          { status: 'In Review', count: statusCounts['In Review'], color: '#ECA7FE' },
          { status: 'On Hold', count: statusCounts['On Hold'], color: '#F6BC54' },
          { status: 'Completed', count: statusCounts.Completed, color: '#5DD66A' },
        ].map(({ status, count, color }) => (
          <Card
            key={status}
            className="w-full sm:w-[300px] h-[150px] border rounded-[13px]"
            style={{ backgroundColor: color }}
          >
            <div className="w-full h-[70px] flex flex-col">
              <span className="text-4xl text-black font-light ml-4">{count}</span>
              <span className="text-2xl font-light text-black ml-4">{status}</span>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}