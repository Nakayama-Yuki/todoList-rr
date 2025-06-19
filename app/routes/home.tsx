import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todoリストアプリ" },
    {
      name: "description",
      content: "React Router v7とローカルストレージを使ったTodoリストアプリ",
    },
  ];
}

/**
 * ホームページコンポーネント
 * Todoリストアプリのメインエントリーポイント
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* ヘッダーセクション */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              📝 Todoリストアプリ
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              React Router v7とローカルストレージを使った、
              モダンで使いやすいタスク管理アプリです。
            </p>
          </header>

          {/* 機能紹介セクション */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-2">タスク管理</h3>
                <p className="text-gray-600">
                  タスクの作成、編集、削除、完了状態の切り替えが可能
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">優先度設定</h3>
                <p className="text-gray-600">
                  高・中・低の優先度設定で重要なタスクを管理
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-4">💾</div>
                <h3 className="text-lg font-semibold mb-2">永続化</h3>
                <p className="text-gray-600">
                  ローカルストレージでデータを自動保存
                </p>
              </div>
            </div>
          </section>

          {/* アクションボタン */}
          <section className="space-y-4">
            <Link
              to="/todos"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-colors duration-200 text-lg">
              Todoリストを見る
            </Link>
            <p className="text-gray-500">
              まずはTodoリストページでタスクを管理してみましょう
            </p>
          </section>

          {/* 技術スタック */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Built with React Router v7 + React 19 + TypeScript + Tailwind CSS
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
