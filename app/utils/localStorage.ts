import type { Todo, CreateTodoInput, UpdateTodoInput } from "~/types/todo";

/**
 * ローカルストレージのキー名
 */
const TODO_STORAGE_KEY = "todoList-app-todos";

/**
 * UUIDを生成する関数
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * ローカルストレージからTodoデータを取得
 */
export function getTodosFromStorage(): Todo[] {
  try {
    const data = localStorage.getItem(TODO_STORAGE_KEY);
    if (!data) {
      return [];
    }

    const todos = JSON.parse(data) as Todo[];
    // Date型に変換
    return todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
    }));
  } catch (error) {
    console.error("Todoデータの取得に失敗しました:", error);
    return [];
  }
}

/**
 * ローカルストレージにTodoデータを保存
 */
export function saveTodosToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Todoデータの保存に失敗しました:", error);
  }
}

/**
 * 新しいTodoを作成
 */
export function createTodo(input: CreateTodoInput): Todo {
  const now = new Date();
  const newTodo: Todo = {
    id: generateId(),
    title: input.title,
    description: input.description,
    completed: input.completed,
    priority: input.priority,
    createdAt: now,
    updatedAt: now,
  };

  const todos = getTodosFromStorage();
  const updatedTodos = [...todos, newTodo];
  saveTodosToStorage(updatedTodos);

  return newTodo;
}

/**
 * 全てのTodoを取得
 */
export function getAllTodos(): Todo[] {
  return getTodosFromStorage();
}

/**
 * IDでTodoを取得
 */
export function getTodoById(id: string): Todo | null {
  const todos = getTodosFromStorage();
  return todos.find((todo) => todo.id === id) || null;
}

/**
 * Todoを更新
 */
export function updateTodo(id: string, input: UpdateTodoInput): Todo | null {
  const todos = getTodosFromStorage();
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return null;
  }

  const updatedTodo: Todo = {
    ...todos[todoIndex],
    ...input,
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;
  saveTodosToStorage(todos);

  return updatedTodo;
}

/**
 * Todoを削除
 */
export function deleteTodo(id: string): boolean {
  const todos = getTodosFromStorage();
  const filteredTodos = todos.filter((todo) => todo.id !== id);

  if (filteredTodos.length === todos.length) {
    return false; // 削除対象が見つからない
  }

  saveTodosToStorage(filteredTodos);
  return true;
}

/**
 * 完了状態を切り替え
 */
export function toggleTodoComplete(id: string): Todo | null {
  const todo = getTodoById(id);
  if (!todo) {
    return null;
  }

  return updateTodo(id, { completed: !todo.completed });
}

/**
 * 完了済みTodoを全て削除
 */
export function deleteCompletedTodos(): number {
  const todos = getTodosFromStorage();
  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const deletedCount = todos.length - incompleteTodos.length;

  saveTodosToStorage(incompleteTodos);
  return deletedCount;
}
