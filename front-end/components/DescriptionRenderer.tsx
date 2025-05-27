'use client';

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Task {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  duedate: string;
  status: "In Progress" | "In Review" | "On Hold" | "Completed";
  category: "Development" | "Testing" | "Bugs";
  description: {
    summary: string;
    details: string;
    acceptanceCriteria: string[];
    notes: string;
  };
}


export function DescriptionRenderer({ task }: { task: Task }) {
  const { description, priority, status, category, duedate } = task;

  const statusColors = {
    "In_Progress": "#9d9bfe",
    "In_Review": "#ECA7FE",
    "On_Hold": "#F6BC54",
    Completed: "#5DD66A",
  };

  const categoryColors = {
    Development: "#38BDF8",
    Testing: "#2DD4BF",
    Bugs: "#EF4444",
    Jira: "#0052CC",
  };

  const priorityColors = {
    High: "#FEAFB2",
    Medium: "#F6BE55",
    Low: "#5CD767",
  };

  if (!categoryColors[category]) {
    console.warn(`Invalid category "${category}" for task ID ${task.id}. Using fallback color.`);
  }

  return (
    <div className="space-y-4 ml-4 overflow-auto">
      <div className="flex items-center gap-2  flex-wrap">
        <Badge
          className="h-[25px] cursor-pointer text-black"
          style={{ backgroundColor: priorityColors[priority] || "#FFFFFF" }}
        >
          {priority}
        </Badge>
        <Badge
          className="h-[25px] cursor-pointer text-black"
          style={{ backgroundColor: statusColors[
      // @ts-expect-error type
            
            status] || "#FFFFFF" }}
        >
          {status.split('_')[0]} {status.split('_')[1]}

        </Badge>
        <Badge
          className="h-[25px] cursor-pointer text-black"
          style={{ backgroundColor: categoryColors[category] || "#FFFFFF" }}
        >
          {category}
        </Badge>
        <Badge className="h-[25px] cursor-pointer text-black bg-gray-200">
          <Calendar className="mr-1 h-4 w-4" />
          {duedate}
        </Badge>
      </div>
      <div className="w-full h-auto  overflow-auto">
        <div>
          <h3 className="text-lg font-semibold   my-2">Summary</h3>
          <p className="text-gray-700 break-words w-[98%]">{description?.summary || "No summary provided"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold   my-2">Details</h3>
          <p className="text-gray-700 break-words w-[98%]">{description?.details || "No details provided"}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold   my-2">Acceptance Criteria</h3>
          <ul className="list-disc pl-5 space-y-1">
            {description?.acceptanceCriteria?.length > 0 ? (
              description.acceptanceCriteria.map((criterion, index) => (
                <li key={index} className="text-gray-700 break-words w-[98%]">{criterion}</li>
              ))
            ) : (
              <li className="text-gray-700 break-words w-[98%]">No acceptance criteria provided</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold   my-2">Notes</h3>
          <p className="text-gray-700 break-words w-[98%]">{description?.notes || "No notes provided"}</p>
        </div>
      </div>
    </div>
  );
}