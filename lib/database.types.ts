export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          due_date: string
          completed: boolean
          goal_id: string | null
          subtasks: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          due_date: string
          completed?: boolean
          goal_id?: string | null
          subtasks?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          due_date?: string
          completed?: boolean
          goal_id?: string | null
          subtasks?: Json
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          target_date: string
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          target_date: string
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          target_date?: string
          progress?: number
          created_at?: string
        }
      }
    }
  }
}