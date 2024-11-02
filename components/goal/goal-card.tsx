"use client";

import { useState } from 'react';
import { Goal, Task } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Pencil, Trash2, CheckSquare, Plus, Target } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';
import { TaskDialog } from '../task/task-dialog';
import { TaskCard } from '../task/task-card';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { tasks, addTask, updateTask, deleteTask } = useSupabase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  
  const linkedTasks = tasks.filter(task => task.goalId === goal.id);
  const completedTasks = linkedTasks.filter((task) => task.completed).length;
  const totalTasks = linkedTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskSubmit = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
    } else {
      addTask({ ...task, goalId: goal.id });
    }
    setSelectedTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const priorityCount = linkedTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsDialogOpen(true)}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <Badge variant="outline" className="mt-2">
                {goal.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CheckSquare className="h-3 w-3" />
              <span>
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
          </div>
          <div className="space-x-2">
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onEdit(goal); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Progress Overview</h4>
                <Progress value={progress} className="h-2 mb-2" />
                <p className="text-sm text-gray-600">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Priority Distribution</h4>
                <div className="space-y-1 text-sm">
                  <p>High: {priorityCount.high || 0}</p>
                  <p>Medium: {priorityCount.medium || 0}</p>
                  <p>Low: {priorityCount.low || 0}</p>
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Goal Details</h4>
                <div className="space-y-1 text-sm">
                  <p>Category: {goal.category}</p>
                  <p>Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Tasks</h4>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedTask(undefined);
                    setTaskDialogOpen(true);
                  }}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>

              {linkedTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No tasks yet. Add your first task to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {linkedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={updateTask}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
      />
    </>
  );
}