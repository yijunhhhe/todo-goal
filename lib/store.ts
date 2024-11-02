import { Task, Goal } from './types';

class LocalStore {
  private getTasks(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  private getGoals(): Goal[] {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : [];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  private saveGoals(goals: Goal[]): void {
    localStorage.setItem('goals', JSON.stringify(goals));
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter((t) => t.id !== taskId);
    this.saveTasks(tasks);
  }

  getAllTasks(): Task[] {
    return this.getTasks();
  }

  addGoal(goal: Goal): void {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  }

  updateGoal(updatedGoal: Goal): void {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === updatedGoal.id);
    if (index !== -1) {
      goals[index] = updatedGoal;
      this.saveGoals(goals);
    }
  }

  deleteGoal(goalId: string): void {
    const goals = this.getGoals().filter((g) => g.id !== goalId);
    this.saveGoals(goals);
  }

  getAllGoals(): Goal[] {
    return this.getGoals();
  }

  getTasksByGoal(goalId: string): Task[] {
    return this.getTasks().filter((task) => task.goalId === goalId);
  }

  updateGoalProgress(goalId: string): void {
    const tasks = this.getTasksByGoal(goalId);
    const completedTasks = tasks.filter((task) => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const goals = this.getGoals();
    const goalIndex = goals.findIndex((g) => g.id === goalId);
    if (goalIndex !== -1) {
      goals[goalIndex].progress = progress;
      this.saveGoals(goals);
    }
  }
}

export const store = new LocalStore();