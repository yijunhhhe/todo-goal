"use client";

import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Pencil, Trash2, Target } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const { goals } = useLocalStorage();
  const linkedGoal = goals.find((g) => g.id === task.goalId);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onComplete({ ...task, completed: !task.completed })}
          />
          <div>
            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            {linkedGoal && (
              <div className="flex items-center gap-1 mt-1">
                <Target className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">{linkedGoal.title}</span>
              </div>
            )}
          </div>
        </div>
        <Badge variant="secondary" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{task.description}</p>
        {task.subtasks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Subtasks</h4>
            <ul className="space-y-2">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => {
                      const updatedSubtasks = task.subtasks.map((st) =>
                        st.id === subtask.id ? { ...st, completed: !st.completed } : st
                      );
                      onComplete({ ...task, subtasks: updatedSubtasks });
                    }}
                  />
                  <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </div>
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}