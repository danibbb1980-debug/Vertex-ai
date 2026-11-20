/**
 * Material do vendedor: cada arquivo .md desta pasta vira uma página.
 * - O número no início do nome define a ordem (1-processo.md, 2-...).
 * - O título é a primeira linha "# Título" do arquivo (ou o nome do arquivo).
 * - Arquivo vazio: em produção a página some; em desenvolvimento aparece
 *   com o aviso "Conteúdo a ser adicionado pelo admin".
 */
const arquivos = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const TITULOS_PADRAO: Record<string, string> = {
  processo: 'Processo',
  'script-de-ligacao': 'Script de ligação',
  objecoes: 'Objeções',
  'roteiro-da-reuniao': 'Roteiro da reunião de 15 minutos',
  'o-que-nunca-prometer': 'O que nunca prometer',
  'preco-e-piso': 'Preço e piso',
}

export interface PaginaMaterial {
  slug: string
  titulo: string
  corpo: string
  vazio: boolean
}

export const paginasMaterial: PaginaMaterial[] = Object.entries(arquivos)
  .map(([caminho, texto]) => {
    const base = caminho.replace(/^\.\//, '').replace(/\.md$/, '')
    const slug = base.replace(/^\d+-/, '')
    const corpo = texto.trim()
    const h1 = corpo.match(/^#\s+(.+)$/m)
    return {
      ordem: base,
      slug,
      titulo: h1?.[1].trim() ?? TITULOS_PADRAO[slug] ?? slug.replace(/-/g, ' '),
      corpo: h1 ? corpo.replace(h1[0], '').trim() : corpo,
      vazio: corpo.length === 0,
    }
  })
  .sort((a, b) => a.ordem.localeCompare(b.ordem, 'pt-BR', { numeric: true }))
  .filter((p) => import.meta.env.DEV || !p.vazio)
  .map(({ ordem: _o, ...p }) => (void _o, p))

export const temMaterial = paginasMaterial.length > 0
