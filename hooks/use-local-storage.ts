"use client";

import { useState, useEffect } from 'react';
import { Task, Goal } from '@/lib/types';
import { store } from '@/lib/store';

export function useLocalStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setTasks(store.getAllTasks());
    setGoals(store.getAllGoals());
  }, []);

  const addTask = (task: Task) => {
    store.addTask(task);
    setTasks(store.getAllTasks());
  };

  const updateTask = (task: Task) => {
    store.updateTask(task);
    setTasks(store.getAllTasks());
    if (task.goalId) {
      store.updateGoalProgress(task.goalId);
      setGoals(store.getAllGoals());
    }
  };

  const deleteTask = (taskId: string) => {
    store.deleteTask(taskId);
    setTasks(store.getAllTasks());
  };

  const addGoal = (goal: Goal) => {
    store.addGoal(goal);
    setGoals(store.getAllGoals());
  };

  const updateGoal = (goal: Goal) => {
    store.updateGoal(goal);
    setGoals(store.getAllGoals());
  };

  const deleteGoal = (goalId: string) => {
    store.deleteGoal(goalId);
    setGoals(store.getAllGoals());
  };

  const getTasksByGoal = (goalId: string) => {
    return store.getTasksByGoal(goalId);
  };

  return {
    tasks,
    goals,
    addTask,
    updateTask,
    deleteTask,
    addGoal,
    updateGoal,
    deleteGoal,
    getTasksByGoal,
  };
}