"use client";

import { useState } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { TaskCard } from '@/components/task/task-card';
import { GoalCard } from '@/components/goal/goal-card';
import { TaskDialog } from '@/components/task/task-dialog';
import { GoalDialog } from '@/components/goal/goal-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Target, CheckSquare } from 'lucide-react';
import { Task, Goal } from '@/lib/types';

export default function Home() {
  const { tasks, goals, loading, addTask, updateTask, deleteTask, addGoal, updateGoal, deleteGoal } =
    useSupabase();
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();

  const handleTaskSubmit = (task: Task) => {
    if (selectedTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    setSelectedTask(undefined);
  };

  const handleGoalSubmit = (goal: Goal) => {
    if (selectedGoal) {
      updateGoal(goal);
    } else {
      addGoal(goal);
    }
    setSelectedGoal(undefined);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setGoalDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Task & Goal Manager</h1>
        <p className="text-gray-600">Organize your tasks and achieve your goals</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
          </TabsList>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              if (activeTab === 'tasks') {
                setSelectedTask(undefined);
                setTaskDialogOpen(true);
              } else {
                setSelectedGoal(undefined);
                setGoalDialogOpen(true);
              }
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Add {activeTab === 'tasks' ? 'Task' : 'Goal'}
          </Button>
        </div>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p className="text-gray-600">Create your first task to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
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
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-gray-600">Set your first goal to start tracking progress</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
      />

      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        goal={selectedGoal}
        onSubmit={handleGoalSubmit}
      />
    </div>
  );
}