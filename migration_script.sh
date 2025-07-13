#!/bin/bash
# 勤怠管理システムのコンポーネント分割用スクリプト

echo "🚀 コンポーネント分割を開始します..."

# srcディレクトリに移動
cd src

# フォルダ構造を作成
echo "📁 フォルダ構造を作成中..."
mkdir -p components/{common,auth,attendance,edit,holiday,schedule,location}
mkdir -p types hooks utils

# .vscode設定フォルダを作成（プロジェクトルートに）
cd ..
mkdir -p .vscode

# VSCode設定ファイルを作成
echo "⚙️ VSCode設定を作成中..."
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": true,
  "typescript.preferences.organizeImports": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  },
  "emmet.includeLanguages": {
    "typescriptreact": "html"
  }
}
EOF

# TypeScript設定を更新
echo "🔧 TypeScript設定を更新中..."
if [ -f "tsconfig.json" ]; then
  # 既存のtsconfig.jsonをバックアップ
  cp tsconfig.json tsconfig.json.backup
fi

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/components/*": ["components/*"],
      "@/types": ["types/index"],
      "@/utils/*": ["utils/*"],
      "@/hooks/*": ["hooks/*"],
      "@/*": ["*"]
    }
  },
  "include": [
    "src"
  ]
}
EOF

cd src

# インデックスファイルを作成
echo "📝 インデックスファイルを作成中..."

# components/common/index.ts
cat > components/common/index.ts << 'EOF'
export { Header } from './Header';
export { Navigation } from './Navigation';
export { MessageDisplay } from './MessageDisplay';
export { LoadingSpinner } from './LoadingSpinner';
export { CustomModal } from './CustomModal';
export { CurrentTime } from './CurrentTime';
export { TabNavigation } from './TabNavigation';
EOF

# components/attendance/index.ts
cat > components/attendance/index.ts << 'EOF'
export { AttendanceScreen } from './AttendanceScreen';
export { AttendanceStatus } from './AttendanceStatus';
export { ClockButtons } from './ClockButtons';
export { TodayAttendance } from './TodayAttendance';
export { AttendanceTable } from './AttendanceTable';
export { ClockEditDialog } from './ClockEditDialog';
EOF

# components/auth/index.ts
cat > components/auth/index.ts << 'EOF'
export { LoginScreen } from './LoginScreen';
EOF

# components/edit/index.ts
cat > components/edit/index.ts << 'EOF'
export { EditScreen } from './EditScreen';
EOF

# components/holiday/index.ts
cat > components/holiday/index.ts << 'EOF'
export { HolidayScreen } from './HolidayScreen';
EOF

# components/schedule/index.ts
cat > components/schedule/index.ts << 'EOF'
export { ScheduleScreen } from './ScheduleScreen';
EOF

# components/location/index.ts
cat > components/location/index.ts << 'EOF'
export { LocationScreen } from './LocationScreen';
EOF

# hooks/index.ts
cat > hooks/index.ts << 'EOF'
export { useCurrentTime } from './useCurrentTime';
EOF

# utils/index.ts
cat > utils/index.ts << 'EOF'
export { apiClient } from './api';
export * from './constants';
EOF

echo "✅ フォルダ構造とインデックスファイルの作成が完了しました！"
echo ""
echo "📋 次の手順："
echo "1. 元のApp.tsxから各コンポーネントを抽出して対応するファイルに配置"
echo "2. インポート文を新しい構造に合わせて更新"
echo "3. 'npm start' で動作確認"
echo ""
echo "🎯 作成されたフォルダ構造："
echo "src/"
tree src/ 2>/dev/null || find src/ -type d | sed 's|[^/]*/|  |g'
echo ""
echo "🚀 分割作業を開始してください！"