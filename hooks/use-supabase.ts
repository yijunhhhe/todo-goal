"use client";

import { useState, useEffect } from 'react';
import { Task, Goal } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export function useSupabase() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchGoals();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    setTasks(
      data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.due_date,
        completed: task.completed,
        goalId: task.goal_id,
        subtasks: task.subtasks as any[],
        createdAt: task.created_at,
      }))
    );
    setLoading(false);
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return;
    }

    setGoals(
      data.map((goal) => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        targetDate: goal.target_date,
        progress: goal.progress,
        tasks: [],
        createdAt: goal.created_at,
      }))
    );
  };

  const addTask = async (task: Task) => {
    const { data, error } = await supabase.from('tasks').insert([
      {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed,
        goal_id: task.goalId,
        subtasks: task.subtasks,
        created_at: task.createdAt,
      },
    ]).select();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    await fetchTasks();
    if (task.goalId) {
      await updateGoalProgress(task.goalId);
    }
  };

  const updateTask = async (task: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.dueDate,
        completed: task.completed,
        goal_id: task.goalId,
        subtasks: task.subtasks,
      })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    await fetchTasks();
    if (task.goalId) {
      await updateGoalProgress(task.goalId);
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return;
    }

    await fetchTasks();
    if (task?.goalId) {
      await updateGoalProgress(task.goalId);
    }
  };

  const addGoal = async (goal: Goal) => {
    const { error } = await supabase.from('goals').insert([
      {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        target_date: goal.targetDate,
        progress: goal.progress,
        created_at: goal.createdAt,
      },
    ]);

    if (error) {
      console.error('Error adding goal:', error);
      return;
    }

    await fetchGoals();
  };

  const updateGoal = async (goal: Goal) => {
    const { error } = await supabase
      .from('goals')
      .update({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        target_date: goal.targetDate,
        progress: goal.progress,
      })
      .eq('id', goal.id);

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    await fetchGoals();
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }

    await fetchGoals();
  };

  const getTasksByGoal = (goalId: string) => {
    return tasks.filter((task) => task.goalId === goalId);
  };

  const updateGoalProgress = async (goalId: string) => {
    const goalTasks = getTasksByGoal(goalId);
    const completedTasks = goalTasks.filter((task) => task.completed).length;
    const progress = goalTasks.length > 0 ? (completedTasks / goalTasks.length) * 100 : 0;

    const { error } = await supabase
      .from('goals')
      .update({ progress })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal progress:', error);
      return;
    }

    await fetchGoals();
  };

  return {
    tasks,
    goals,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addGoal,
    updateGoal,
    deleteGoal,
    getTasksByGoal,
  };
}