# Copilot Instructions - Best Practices

このプロジェクトでは以下の技術スタックを使用しています。これらのベストプラクティスに従ってコードを生成してください。

## 技術スタック

- **React Router v7.6** (App Router)
- **React 19.1**
- **TypeScript v5.8**
- **Tailwind CSS v4**
- **Vite 6.3**
- **pnpm** (パッケージマネージャー)

## 全般的なルール

### プロジェクト構成

- Always use LTS versions of tools when available
- Use pnpm as the package manager
- Follow the established project structure with `app/` directory

### コーディングスタイル

- Use camelCase for variable names
- Use PascalCase for class names and React components
- Always add meaningful comments in Japanese
- Use function declarations instead of const for React components
- Follow accessibility and performance best practices

## React 19.1 Best Practices

### コンポーネント定義

```typescript
// ❌ 避ける
const MyComponent = () => {
  return <div>Hello</div>;
};

// ✅ 推奨
/**
 * マイコンポーネント - 説明をここに記載
 */
function MyComponent() {
  return <div>Hello</div>;
}
```

### 新機能の活用

- **React Compiler**: 自動最適化機能を活用
- **use() Hook**: データフェッチングに use フックを使用
- **Server Actions**: フォーム処理で Server Actions を活用
- **Concurrent Features**: Suspense、Transitions を適切に使用

### パフォーマンス最適化

```typescript
// ✅ React 19の新機能を活用
import { use, Suspense } from "react";

function DataComponent({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise); // React 19の新しいuse Hook

  return <div className="data-container">{/* データ表示 */}</div>;
}

// ✅ Suspenseでラップ
function App() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <DataComponent dataPromise={fetchData()} />
    </Suspense>
  );
}
```

## React Router v7.6 Best Practices

### ルート定義

```typescript
// app/routes.ts
import type { RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/home.tsx",
  },
  {
    path: "/about",
    file: "routes/about.tsx",
  },
  // 動的ルート
  {
    path: "/users/:id",
    file: "routes/users.$id.tsx",
  },
] satisfies RouteConfig;
```

### データローダー

```typescript
// ✅ Route loaderを使用したデータフェッチング
import type { Route } from "./+types/user";

export async function loader({ params }: Route.LoaderArgs) {
  const user = await fetchUser(params.id);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  return { user };
}

export default function UserProfile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="user-profile">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      {/* ユーザー情報表示 */}
    </div>
  );
}
```

### フォーム処理

```typescript
// ✅ React Router v7のaction機能を使用
import type { Route } from "./+types/contact";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  // フォーム処理ロジック
  await submitContact({ name, email });

  return redirect("/contact/success");
}

export default function ContactForm() {
  return (
    <Form method="post" className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        送信
      </button>
    </Form>
  );
}
```

## TypeScript v5.8 Best Practices

### 型定義

```typescript
// ✅ 明示的な型定義
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ ユーティリティ型の活用
type CreateUser = Omit<User, "id" | "createdAt">;
type UpdateUser = Partial<Pick<User, "name" | "email">>;
```

### 新機能の活用

```typescript
// ✅ const型パラメータ (TypeScript 5.0+)
function createArray<const T>(items: readonly T[]): readonly T[] {
  return items;
}

// ✅ satisfies演算子の使用
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies Config;

// ✅ using宣言 (TypeScript 5.2+)
function processFile(filename: string) {
  using file = openFile(filename);
  // ファイル処理
  // 自動でcloseされる
}
```

### 厳密な型チェック

```typescript
// tsconfig.json設定
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Tailwind CSS v4 Best Practices

### 設定ファイル

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // カスタムカラー
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      // カスタムフォント
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    // 必要なプラグインを追加
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
```

### クラス命名規則

```typescript
// ✅ 推奨されるクラス使用法
function Button({ children, variant = "primary" }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

### レスポンシブデザイン

```typescript
// ✅ モバイルファーストアプローチ
function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* グリッドアイテム */}
    </div>
  );
}
```

## Vite 6.3 Best Practices

### 設定ファイル

```typescript
// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  // 開発サーバー設定
  server: {
    port: 3000,
    host: true,
  },
  // ビルド最適化
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@react-router/dom"],
        },
      },
    },
  },
  // 環境変数
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### パフォーマンス最適化

```typescript
// ✅ 動的インポートを使用したコード分割
const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## アクセシビリティ Best Practices

### セマンティック HTML

```typescript
// ✅ 適切なセマンティック要素の使用
function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6">
      <header>
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <time dateTime={article.publishedAt} className="text-gray-500">
          {formatDate(article.publishedAt)}
        </time>
      </header>
      <p className="text-gray-700">{article.excerpt}</p>
      <footer className="mt-4">
        <a
          href={`/articles/${article.id}`}
          className="text-blue-500 hover:underline"
          aria-label={`${article.title}の詳細を読む`}>
          続きを読む
        </a>
      </footer>
    </article>
  );
}
```

### キーボードナビゲーション

```typescript
// ✅ キーボードアクセシビリティ
function Modal({ isOpen, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      // フォーカス管理
      dialogRef.current?.focus();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 rounded-lg p-6"
      onClose={onClose}
      aria-labelledby="modal-title">
      {children}
    </dialog>
  );
}
```

## テスト Best Practices

### コンポーネントテスト

```typescript
// ✅ React Testing Libraryを使用
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import Button from "./Button";

test("ボタンクリックでコールバックが呼ばれる", () => {
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>クリック</Button>);

  const button = screen.getByRole("button", { name: "クリック" });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## パフォーマンス監視

### メトリクス測定

```typescript
// ✅ Web Vitalsの測定
import { onCLS, onFID, onFCP, onLCP, onTTFB } from "web-vitals";

// パフォーマンスメトリクスの送信
function sendToAnalytics(metric: any) {
  // アナリティクスサービスに送信
  console.log(metric);
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

---

## 追加のガイドライン

1. **エラーハンドリング**: 適切なエラーバウンダリを設置
2. **セキュリティ**: XSS 対策、CSP 設定を実装
3. **SEO**: メタタグ、構造化データを適切に設定
4. **国際化**: 多言語対応を考慮した設計
5. **ドキュメント**: コンポーネントと API の適切な文書化

これらのベストプラクティスに従って、高品質で保守性の高いコードを作成してください。
