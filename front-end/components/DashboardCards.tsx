import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useDeviceMode } from '@/lib/hooks/useDeviceMode'; // Adjust path if needed
import {  DashboardCardsProps} from '@/types/types';




export default function DashboardCards({ statusCounts }: DashboardCardsProps) {
  const deviceMode = useDeviceMode(); // Use the hook to get device mode

  return (
    <Card
      className={`bg-[#171818] shadow-lg ${
        deviceMode === 'mobile' ? 'border-none' : 'border border-white'
      }`}
    >
      <CardHeader className={`p-0 ${
        deviceMode === 'desktop' ? 'px-5' : 'p-0'}`}>
        <CardTitle className="text-[#CAFE14] ">Dashboard</CardTitle>
        <CardDescription className="text-gray-300">Preview Tasks And Tasks Data Here</CardDescription>
      </CardHeader>
      <div className="w-full h-auto flex flex-col sm:flex-row  items-center justify-evenly gap-4 p-0">
        {[
          { status: 'In Progress', count: statusCounts['In Progress'], color: '#9d9bfe' },
          { status: 'In Review', count: statusCounts['In Review'], color: '#ECA7FE' },
          { status: 'On Hold', count: statusCounts['On Hold'], color: '#F6BC54' },
          { status: 'Completed', count: statusCounts.Completed, color: '#5DD66A' },
        ].map(({ status, count, color }) => (
          <Card
            key={status}
            className={` h-[150px] ${
        deviceMode === 'mobile' ? 'w-full' : 'w-[310px] '
      } border border-white rounded-[13px] shadow-lg`}
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