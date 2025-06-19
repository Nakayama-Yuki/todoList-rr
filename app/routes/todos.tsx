import { useState, useEffect } from "react";
import { Link, Form, useNavigate } from "react-router";
import type { Route } from "./+types/todos";
import {
  getAllTodos,
  createTodo,
  toggleTodoComplete,
  deleteTodo,
  deleteCompletedTodos,
} from "~/utils/localStorage";
import type { Todo, CreateTodoInput, TodoPriority } from "~/types/todo";
import { TODO_PRIORITY_LABELS, TODO_PRIORITY_COLORS } from "~/types/todo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todoリスト | Todoリストアプリ" },
    { name: "description", content: "すべてのTodoアイテムを管理" },
  ];
}

/**
 * Todoリストページコンポーネント
 * 全てのTodoアイテムの表示と基本的なCRUD操作を提供
 */
export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateTodoInput>({
    title: "",
    description: "",
    completed: false,
    priority: "medium",
  });
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const navigate = useNavigate();

  // Todoデータの読み込み
  useEffect(() => {
    setTodos(getAllTodos());
  }, []);

  // フィルタリング済みTodoリスト
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  // 新しいTodoを作成
  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTodo = createTodo(formData);
    // 最新のtodos状態を参照して新しいTodoを追加
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setFormData({
      title: "",
      description: "",
      completed: false,
      priority: "medium",
    });
    setShowForm(false);
  };

  // Todo完了状態を切り替え
  const handleToggleComplete = (id: string) => {
    const updatedTodo = toggleTodoComplete(id);
    if (updatedTodo) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    }
  };

  // Todoを削除
  const handleDeleteTodo = (id: string) => {
    if (deleteTodo(id)) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // 完了済みTodoを全て削除
  const handleDeleteCompleted = () => {
    const deletedCount = deleteCompletedTodos();
    if (deletedCount > 0) {
      setTodos(todos.filter((todo) => !todo.completed));
    }
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block">
                ← ホームに戻る
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Todoリスト</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
              {showForm ? "キャンセル" : "新しいTodo"}
            </button>
          </div>
        </header>

        {/* 新規作成フォーム */}
        {showForm && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">新しいTodoを作成</h2>
            <Form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Todoのタイトルを入力"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="詳細な説明（オプション）"
                />
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TodoPriority,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                  作成
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors">
                  キャンセル
                </button>
              </div>
            </Form>
          </section>
        )}

        {/* フィルターとサマリー */}
        <section className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                すべて ({todos.length})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === "active"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                未完了 ({activeTodosCount})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                完了済み ({completedTodosCount})
              </button>
            </div>
            {completedTodosCount > 0 && (
              <button
                onClick={handleDeleteCompleted}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-full text-sm transition-colors">
                完了済みを削除
              </button>
            )}
          </div>
        </section>

        {/* Todoリスト */}
        <section>
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">
                {filter === "all"
                  ? "まだTodoがありません。新しいTodoを作成してみましょう！"
                  : filter === "active"
                  ? "未完了のTodoはありません。"
                  : "完了済みのTodoはありません。"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <article
                  key={todo.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleComplete(todo.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                      aria-label={todo.completed ? "未完了に戻す" : "完了としてマーク"}
                      title={todo.completed ? "未完了に戻す" : "完了としてマーク"}
                    >
                      {todo.completed && "✓"}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-semibold ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}>
                          {todo.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            TODO_PRIORITY_COLORS[todo.priority]
                          }`}>
                          {TODO_PRIORITY_LABELS[todo.priority]}
                        </span>
                      </div>
                      {todo.description && (
                        <p
                          className={`text-sm mb-2 ${
                            todo.completed ? "text-gray-400" : "text-gray-600"
                          }`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-400">
                        作成: {todo.createdAt.toLocaleDateString("ja-JP")}
                        {todo.updatedAt.getTime() !==
                          todo.createdAt.getTime() && (
                          <span className="ml-2">
                            更新: {todo.updatedAt.toLocaleDateString("ja-JP")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/todos/${todo.id}`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-3 rounded text-sm transition-colors">
                        編集
                      </Link>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm transition-colors">
                        削除
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
