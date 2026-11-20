import { useState, type FormEvent } from 'react'
import { mensagemErro, supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha })
    setEnviando(false)
    if (error) setErro(mensagemErro(error))
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <p className="text-[1.0625rem] font-bold tracking-[-0.01em]">
        Lumivo <span className="font-normal text-tinta-2">vendas</span>
      </p>
      <h1 className="mt-6 text-[1.75rem] font-bold leading-tight tracking-[-0.015em]">Entrar</h1>
      <p className="mt-1 text-[0.9375rem] text-tinta-2">Use o e-mail e a senha que o Pedro criou para você.</p>
      <form onSubmit={entrar} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-[0.9375rem] font-medium">E-mail</label>
          <input id="email" type="email" autoComplete="email" inputMode="email" required className="campo" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="senha" className="text-[0.9375rem] font-medium">Senha</label>
          <input id="senha" type="password" autoComplete="current-password" required className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        {erro && <p role="alert" className="rounded-md bg-vermelho-fundo px-3 py-2.5 text-[0.9375rem] text-vermelho">{erro}</p>}
        <button type="submit" className="botao-primario mt-1 !min-h-12" disabled={enviando || !email || !senha}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-8 text-micro text-tinta-2">Esqueceu a senha? Peça ao Pedro para redefinir.</p>
    </main>
  )
}
