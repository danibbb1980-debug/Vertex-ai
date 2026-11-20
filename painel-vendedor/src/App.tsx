import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AlvoProvider } from './auth/Alvo'
import { useAuth } from './auth/AuthProvider'
import Layout from './components/Layout'
import { supabaseConfigurado } from './lib/supabase'
import Comissao from './pages/Comissao'
import Hoje from './pages/Hoje'
import LeadDetalhe from './pages/LeadDetalhe'
import LeadForm from './pages/LeadForm'
import Leads from './pages/Leads'
import Login from './pages/Login'
import Mais from './pages/Mais'
import ReuniaoDetalhe from './pages/ReuniaoDetalhe'
import ReuniaoNova from './pages/ReuniaoNova'
import Reunioes from './pages/Reunioes'
import SemAcesso from './pages/SemAcesso'

const Admin = lazy(() => import('./pages/admin/Admin'))
const Desempenho = lazy(() => import('./pages/Desempenho'))
const Material = lazy(() => import('./pages/Material'))

function SemConfiguracao() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-[1.75rem] font-bold">Falta configurar o Supabase</h1>
      <p className="mt-2 text-tinta-2">
        Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> (veja <code>.env.example</code> e o README).
      </p>
    </main>
  )
}

export default function App() {
  const { carregando, session, perfil } = useAuth()
  if (!supabaseConfigurado) return <SemConfiguracao />
  if (carregando) return <p className="p-6 text-tinta-2" role="status">Carregando…</p>
  if (!session) return <Login />
  if (!perfil || !perfil.ativo) return <SemAcesso />

  return (
    <AlvoProvider>
      <BrowserRouter>
        <Suspense fallback={<p className="p-6 text-tinta-2" role="status">Carregando…</p>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Hoje />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/novo" element={<LeadForm />} />
            <Route path="leads/:id" element={<LeadDetalhe />} />
            <Route path="leads/:id/editar" element={<LeadForm />} />
            <Route path="reunioes" element={<Reunioes />} />
            <Route path="reunioes/nova" element={<ReuniaoNova />} />
            <Route path="reunioes/:id" element={<ReuniaoDetalhe />} />
            <Route path="comissao" element={<Comissao />} />
            <Route path="desempenho" element={<Desempenho />} />
            <Route path="material" element={<Material />} />
            <Route path="material/:slug" element={<Material />} />
            <Route path="mais" element={<Mais />} />
            <Route path="admin" element={<Admin />} />
            <Route path="admin/:aba" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AlvoProvider>
  )
}
