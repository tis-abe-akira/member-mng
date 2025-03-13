# Technical Context

## Technology Stack
- Framework: React 18+
- Language: TypeScript
- Build Tool: Vite
- Package Manager: npm

## Development Environment
- Editor: VS Code
- Node.js: Latest LTS version
- ESLint for code quality
- TypeScript configuration for strict type checking

## Project Structure
```
src/
├── components/
│   ├── Chat/
│   ├── MemberDetail/
│   ├── MemberForm/
│   ├── MemberList/
│   └── TagManagement/
├── hooks/
├── storage/
│   └── StorageAdapter.ts
├── types/
├── assets/
└── App.tsx
```

## Key Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0"
}
```

## Type Definitions
Located in `src/types/index.ts`:
- Member interfaces
- Chat message types
- Tag definitions

## Storage Layer
1. StorageAdapter
   - インターフェース定義
   - LocalStorage実装
   - 将来の拡張性を考慮した非同期API

## Custom Hooks
1. useMembers.ts
   - Member CRUD operations with persistence
   - Local state management
   - Async storage operations

2. useChats.ts
   - Chat message handling
   - Conversation state

3. useTags.ts
   - Tag management
   - Tag assignments

## Build Configuration
- Vite config for development and production
- TypeScript configuration for type checking
- ESLint for code quality enforcement

## Development Workflow
1. Development server: `npm run dev`
2. Type checking: `npm run typecheck`
3. Build: `npm run build`
4. Lint: `npm run lint`
