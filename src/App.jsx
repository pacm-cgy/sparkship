import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ProjectPage from './pages/ProjectPage'
import AuthPage from './pages/AuthPage'
import NewProjectPage from './pages/NewProjectPage'
import { useAuthStore } from './store'


const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } })

function AppInner() {
  const { init } = useAuthStore()
  useEffect(() => { init() }, [])
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/builders" element={<ExplorePage />} />
          <Route path="/p/:id" element={<ProjectPage />} />
          <Route path="/new" element={<NewProjectPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>페이지를 찾을 수 없습니다</h1>
              <a href="/" style={{ color: 'var(--spark)' }}>홈으로 돌아가기</a>
            </div>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppInner />
    </QueryClientProvider>
  )
}
