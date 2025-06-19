/**
 * Todo型定義
 * アプリケーション全体で使用するTodoアイテムの型を定義
 */
export interface Todo {
  readonly id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Todo優先度の型定義
 */
export type TodoPriority = "low" | "medium" | "high";

/**
 * Todo作成時の入力型
 * id、createdAt、updatedAtは自動生成されるため除外
 */
export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;

/**
 * Todo更新時の入力型
 * 部分的な更新を可能にする
 */
export type UpdateTodoInput = Partial<
  Pick<Todo, "title" | "description" | "completed" | "priority">
>;

/**
 * Todo優先度の表示ラベル
 */
export const TODO_PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
} as const;

/**
 * Todo優先度の色設定
 */
export const TODO_PRIORITY_COLORS: Record<TodoPriority, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
} as const;
