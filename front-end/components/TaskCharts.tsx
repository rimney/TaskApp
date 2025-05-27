import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import React from 'react';

interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  duedate: string;
  status: 'In_Progress' | 'In_Review' | 'On_Hold' | 'Completed';
  category: 'Development' | 'Testing' | 'Bugs';
  description: {
    summary: string;
    details: string;
    acceptanceCriteria: string[];
    notes: string;
  };
}

interface TaskChartsProps {
  tasks: Task[];
}

export default function TaskCharts({ tasks }: TaskChartsProps) {
  const computeChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const statusData: { [key: string]: number[] } = {
      In_Progress: new Array(12).fill(0),
      In_Review: new Array(12).fill(0),
      On_Hold: new Array(12).fill(0),
      Completed: new Array(12).fill(0),
    };
    const categoryData: { [key: string]: number[] } = {
      Development: new Array(12).fill(0),
      Testing: new Array(12).fill(0),
      Bugs: new Array(12).fill(0),
    };

    tasks.forEach((task) => {
      const dueDate = new Date(task.duedate);
      const monthIndex = dueDate.getMonth();
      statusData[task?.status][monthIndex]++;
      categoryData[task.category][monthIndex]++;
    });

    return {
      statusChartData: months.map((month, index) => ({
        month,
        In_Progress: statusData.In_Progress[index],
        In_Review: statusData.In_Review[index],
        On_Hold: statusData.On_Hold[index],
        Completed: statusData.Completed[index],
      })),
      categoryChartData: months.map((month, index) => ({
        month,
        Development: categoryData.Development[index],
        Testing: categoryData.Testing[index],
        Bugs: categoryData.Bugs[index],
      })),
    };
  };

  const statusChartConfig = {
    In_Progress: { label: 'In Progress', color: '#9d9bfe' },
    In_Review: { label: 'In Review', color: '#ECA7FE' },
    On_Hold: { label: 'On Hold', color: '#F6BC54' },
    Completed: { label: 'Completed', color: '#5DD66A' },
  };

  const categoryChartConfig = {
    Development: { label: 'Development', color: '#38BDF8' },
    Testing: { label: 'Testing', color: '#2DD4BF' },
    Bugs: { label: 'Bugs', color: '#EF4444' },
  };

  const { statusChartData, categoryChartData } = computeChartData();

  return (
    <Card className='mt-4 '>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Preview Project Statistics Here</CardDescription>
      </CardHeader>
      <div className="w-full h-auto py-4  flex items-center justify-center">
        <Tabs defaultValue="status" className="w-full max-w-[1300px] px-4 sm:px-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Task Status</TabsTrigger>
            <TabsTrigger value="category">Task Category</TabsTrigger>
          </TabsList>
          <TabsContent value="status">
            <div className="w-full h-[300px] sm:h-[450px] mt-6 sm:mt-10 flex items-center justify-center">
              <ChartContainer config={statusChartConfig} className="w-full max-w-[950px]">
                <BarChart accessibilityLayer data={statusChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    tick={{ fontSize: '12px', dy: 5 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="In_Progress" fill="var(--color-In_Progress)" radius={4} />
                  <Bar dataKey="In_Review" fill="var(--color-In_Review)" radius={4} />
                  <Bar dataKey="On_Hold" fill="var(--color-On_Hold)" radius={4} />
                  <Bar dataKey="Completed" fill="var(--color-Completed)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="category">
            <div className="w-full h-[300px] sm:h-[450px] mt-6 sm:mt-10 flex items-center justify-center">
              <ChartContainer config={categoryChartConfig} className="w-full max-w-[950px]">
                <BarChart accessibilityLayer data={categoryChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    tick={{ fontSize: '12px', dy: 5 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="Development" fill="var(--color-Development)" radius={4} />
                  <Bar dataKey="Testing" fill="var(--color-Testing)" radius={4} />
                  <Bar dataKey="Bugs" fill="var(--color-Bugs)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}