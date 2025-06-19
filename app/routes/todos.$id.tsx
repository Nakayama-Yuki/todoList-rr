import { useState, useEffect } from "react";
import { Link, Form, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/todos.$id";
import { getTodoById, updateTodo, deleteTodo } from "~/utils/localStorage";
import type { Todo, UpdateTodoInput, TodoPriority } from "~/types/todo";
import { TODO_PRIORITY_LABELS, TODO_PRIORITY_COLORS } from "~/types/todo";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Todo詳細 | Todoリストアプリ` },
    { name: "description", content: "Todoアイテムの詳細表示と編集" },
  ];
}

/**
 * Todo詳細・編集ページコンポーネント
 * 個別のTodoアイテムの詳細表示と編集機能を提供
 */
export default function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateTodoInput>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Todoデータの読み込み
  useEffect(() => {
    if (!id) {
      setError("TodoのIDが指定されていません");
      setLoading(false);
      return;
    }

    const foundTodo = getTodoById(id);
    if (foundTodo) {
      setTodo(foundTodo);
      setFormData({
        title: foundTodo.title,
        description: foundTodo.description,
        completed: foundTodo.completed,
        priority: foundTodo.priority,
      });
    } else {
      setError("指定されたTodoが見つかりません");
    }
    setLoading(false);
  }, [id]);

  // Todo更新処理
  const handleUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !todo) return;

    const updatedTodo = updateTodo(id, formData);
    if (updatedTodo) {
      setTodo(updatedTodo);
      setIsEditing(false);
    }
  };

  // Todo削除処理
  const handleDeleteTodo = () => {
    if (!id || !confirm("このTodoを削除してもよろしいですか？")) return;

    if (deleteTodo(id)) {
      navigate("/todos");
    }
  };

  // 完了状態切り替え
  const handleToggleComplete = () => {
    if (!id || !todo) return;

    const updatedTodo = updateTodo(id, { completed: !todo.completed });
    if (updatedTodo) {
      setTodo(updatedTodo);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Link
              to="/todos"
              className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block">
              ← Todoリストに戻る
            </Link>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">😕</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">エラー</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                to="/todos"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                Todoリストに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <header className="mb-8">
            <Link
              to="/todos"
              className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block">
              ← Todoリストに戻る
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Todo詳細</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  {isEditing ? "キャンセル" : "編集"}
                </button>
                <button
                  onClick={handleDeleteTodo}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  削除
                </button>
              </div>
            </div>
          </header>

          {/* Todo詳細表示 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
              // 編集フォーム
              <Form onSubmit={handleUpdateTodo} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.priority || "medium"}
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed || false}
                    onChange={(e) =>
                      setFormData({ ...formData, completed: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="completed"
                    className="ml-2 block text-sm text-gray-700">
                    完了済み
                  </label>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors">
                    キャンセル
                  </button>
                </div>
              </Form>
            ) : (
              // 詳細表示
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleComplete}
                    aria-label="完了状態を切り替え"
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}>
                    {todo.completed && "✓"}
                  </button>
                  <h2
                    className={`text-2xl font-bold ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-900"
                    }`}>
                    {todo.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      TODO_PRIORITY_COLORS[todo.priority]
                    }`}>
                    {TODO_PRIORITY_LABELS[todo.priority]}
                  </span>
                </div>

                {todo.description && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      説明
                    </h3>
                    <p
                      className={`text-gray-700 whitespace-pre-wrap ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}>
                      {todo.description}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      作成日時
                    </h3>
                    <p className="text-gray-600">
                      {todo.createdAt.toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      更新日時
                    </h3>
                    <p className="text-gray-600">
                      {todo.updatedAt.toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      状態:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        todo.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {todo.completed ? "完了済み" : "未完了"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
