# SITE LABORATÓRIO TONON · MATHEUS TONON (RASCUNHO) | SÃO JOÃO DA BOA VISTA - SP | NÍVEL PREMIUM (R$ 10 MIL)

## 1. PAPEL E OBJETIVO
Atue como estúdio completo: direção de arte, UI/UX, front-end, copywriting, SEO local, acessibilidade e conformidade para odontologia. Crie o site do Laboratório Tonon (Matheus Tonon), em São João da Boa Vista - SP, focado em reabilitação oral e estética do sorriso, para **pacientes**.

Objetivo comercial: gerar conversas de agendamento de avaliação pelo WhatsApp.
Quem lê: adultos da cidade e da região que querem recuperar a função e a estética do sorriso, pesquisam com calma, comparam e decidem pela confiança. Quase sempre pelo celular, muitas vezes vindos do Instagram.
Teste dos 5 segundos: "É um trabalho cuidadoso e sério, fica perto, e eu consigo conversar sem compromisso."

Régua de qualidade (o que justifica R$ 10 mil):
- Direção de arte autoral, com um elemento gráfico próprio que ninguém mais usa (ver seção 5), e não um tema de clínica.
- Tipografia editorial como protagonista, ritmo de revista, muito ar, detalhes finos.
- Microinterações discretas e intencionais, rápidas, nunca decorativas.
- Texto curto, humano e específico; zero clichê de odontologia.
- Desempenho e acessibilidade de produto: Lighthouse mobile ≥ 90 em todas as categorias (exceto SEO enquanto for rascunho), WCAG 2.2 AA.
- Cada bloco tratado como peça de portfólio. A sofisticação vem de forma, não de promessa nem de dado inventado.

## 2. MODO RASCUNHO (OBRIGATÓRIO)
- Faixa fixa e discreta no topo: "Rascunho para avaliação. Informações sujeitas a confirmação." Controlada por `CONFIG.rascunho`.
- Sem indexação: metas robots e googlebot "noindex, nofollow"; `vercel.json` na raiz do app com o cabeçalho `X-Robots-Tag: noindex, nofollow`; `public/robots.txt` com `Disallow: /`.
- Canonical e og:url absolutos a partir de `CONFIG.siteUrl` (nunca localhost). Sem og:image até haver imagem real.
- Sem analytics, pixels, cookies ou formulário. Contato só por WhatsApp.
- Todos os dados num único `src/config.ts`.

## 3. DADOS (CONFIG) — fonte: ficha do Google Maps e perfil do Instagram
Use SOMENTE o que está abaixo. O que estiver [A CONFIRMAR] vira placeholder com o comentário "CONFIRMAR COM O CLIENTE".
- Marca: Laboratório Tonon. Responsável: Matheus Tonon (perfil: "CEO | Laboratório Tonon").
- Registro profissional (CRO ou TPD) e responsável técnico: [A CONFIRMAR]. Ambos devem aparecer no rodapé na versão final.
- Endereço: R. Henrique Cabral de Vasconcelos, 2104 - Jardim São Nicolau, São João da Boa Vista - SP, CEP 13876-100.
- Horários: segunda a sábado 08h–18h; domingo fechado.
- WhatsApp e telefone: (19) 98135-7500 → `CONFIG.whatsapp = "5519981357500"`.
- Instagram: https://www.instagram.com/matheus.tonon
- Google Maps: https://maps.app.goo.gl/DzCmDyUCrzpVoUCz7
- Atributos da ficha (podem ser mostrados): atendimento com hora marcada; entrada e banheiro acessíveis para cadeira de rodas; estacionamento gratuito no local (coberto e descoberto) e na rua; cartão de crédito, débito e pagamento por aproximação; empresa que acolhe a comunidade LGBTQ+ e espaço seguro para pessoas trans.
- Áreas de trabalho: o perfil fala em "reabilitação oral" e "reabilitação estética". Qualquer serviço mais específico (lentes, facetas, coroas, próteses, protocolos) é [A CONFIRMAR] e só entra com confirmação.
- NÃO usar: "especialista" (o perfil usa, mas título de especialista exige registro no CFO), "alta performance" (soa como promessa de resultado), "empresa de empreendedoras" (atributo da ficha que precisa ser conferido).
- Não invente: formação, anos de experiência, número de casos, materiais, marcas, tecnologias, preços, depoimentos, prêmios, convênios.

## 4. IMAGENS
- Proibido: sorrisos de banco de imagem, dentes 3D, imagens de procedimento com sangue ou instrumentos.
- Retrato do Matheus, fotos do espaço, da bancada e de peças: usar (em `public/fotos/`, WebP otimizado, com dimensões).
- Antes e depois de pacientes: só numa seção "Casos" controlada por `CONFIG.mostrarCasos`, e só pode ir ao ar com autorização assinada do paciente (TCLE) e publicação pelo cirurgião-dentista responsável, com nome e CRO (CFO, Res. 196/2019). Sem textos de promessa nas legendas.
- Sem fotos: blocos reservados elegantes com legenda "Foto (substituir)" e o elemento gráfico da marca (seção 5).

## 5. IDENTIDADE VISUAL (direção de arte)
Conceito: **"escala de cor"**. Reabilitação estética é, antes de tudo, acertar o tom. O elemento autoral do site é uma régua de amostras inspirada na escala de cor usada para escolher o tom das peças: barras verticais em tons de porcelana, do mais claro ao mais quente, com códigos finos (01, 02, 03...). Aparece no hero, como divisor entre seções e como textura sutil. É original, ligado ao ofício e impossível de confundir com template.
- Paleta: porcelana (#F4F1EC) como fundo; grafite (#161514) para texto e blocos escuros; pedra (#E4DDD2) para superfícies; acento verde-petróleo profundo (#24453F) para botões e itálicos; tons da escala de #F7F2E8 a #D8C3A0. Sem dourado, sem gradiente, sem neon, sem azul-hospital.
- Tipografia: Instrument Serif (display, uso generoso do itálico, uma palavra em itálico por título) + Geist (texto e interface). Google Fonts com display=swap, carregamento sem bloquear a renderização.
- Grid editorial de 12 colunas, margens largas, títulos grandes, rótulos em caixa-alta com espaçamento, numeração 01–0N, filetes de 1 px, raios pequenos e consistentes (8–14 px), sem sombras pesadas.

## 6. MOVIMENTO
- Um único efeito de entrada no título do hero (palavras subindo de um recorte, com leve desfoque).
- Uma revelação suave ao rolar para as seções (opacidade + 12 px), uma vez só.
- Microinteração assinatura: ao passar o mouse ou focar uma amostra da escala, ela "levanta" e mostra o código.
- Tudo respeita `prefers-reduced-motion`. Sem carrossel automático, sem pop-up, sem parallax pesado.

## 7. ESTRUTURA (página única, 7 blocos)
Limites: celular (375 × 812) em até 6 telas; desktop (1280 × 800) em até 4,5 telas. Texto visível total (sem rodapé) até ~320 palavras. Nenhum parágrafo com mais de 3 linhas no celular. Botão de WhatsApp na primeira tela.
1. **Header**: assinatura tipográfica "Tonon" + descritor "Laboratório"; âncoras discretas (Trabalho, Sobre, Contato) no desktop; botão "Agendar avaliação".
2. **Hero**: eyebrow "REABILITAÇÃO ORAL · SÃO JOÃO DA BOA VISTA"; título em serif com itálico (ex.: "Um sorriso planejado *peça por peça*."); uma frase de apoio sem promessa; botão principal de WhatsApp e link "Como chegar"; linha com endereço curto e horário; composição com a escala de cor e espaço para retrato.
3. **O trabalho**: 2 linhas sobre a abordagem (planejamento individual, atenção ao tom e à forma) + áreas de trabalho em cartões numerados (reabilitação oral, reabilitação estética e, se confirmados, serviços específicos). Aviso: "A indicação depende de avaliação individual."
4. **Como funciona**: 3 passos curtos (conversa pelo WhatsApp → avaliação presencial com hora marcada → plano explicado com calma). Sem prazos, sem preços.
5. **Sobre**: retrato (ou bloco reservado), nome, função ("CEO do Laboratório Tonon"), registro [A CONFIRMAR], 2–3 linhas em primeira pessoa sobre o cuidado com cada caso, link para o Instagram.
6. **O espaço**: chips com os atributos da ficha (hora marcada, acessibilidade, estacionamento gratuito, formas de pagamento, espaço acolhedor).
7. **Contato** (fundo grafite): título forte, botões WhatsApp e Como chegar, endereço, horários, Instagram, mapa embutido com `loading="lazy"` só se couber no limite. Rodapé de 1–2 linhas: marca, responsável técnico [A CONFIRMAR], "Conteúdo informativo", privacidade.
Bloco opcional entre 3 e 4: **Casos** (fundo grafite), grade com os antes e depois, rótulo "Antes · Depois" e legenda neutra ("Cada caso tem indicação própria.").
Não criar: depoimentos, FAQ longo, blog, preços, contador, CTA final duplicado.

## 8. WHATSAPP E CONVERSÃO
- Botões no header, hero, trabalho, sobre e contato; barra fixa no celular que só aparece depois que o botão do hero sai da tela; botão flutuante discreto no desktop.
- Link `https://wa.me/{CONFIG.whatsapp}?text={mensagem codificada}`. Geral: "Olá, Matheus! Vi o site do Laboratório Tonon e gostaria de agendar uma avaliação." Por área: cite a área.
- Nunca dizer que a avaliação foi agendada; o clique só inicia a conversa.

## 9. CONTEÚDO E CONFORMIDADE (CFO)
Português do Brasil impecável, tom próximo e calmo, frases de até 14 palavras.
- Sem promessa de resultado, sem "sem dor", "perfeito", "o melhor", "único", "pioneiro", "alta performance", "transforme seu sorriso".
- Antes e depois só com TCLE e responsável com CRO (ver seção 4); sem depoimentos, sem preço, promoção, desconto ou parcelamento destacado.
- Sem "especialista" sem registro de especialidade comprovado.
- Nome do responsável sempre acompanhado do registro (placeholder visível até confirmar) e responsável técnico no rodapé.
- Atenção legal: técnico em prótese dentária não pode atender pacientes diretamente (Lei 5.081/1966 e Lei 6.710/1979). Se o Matheus for TPD, o atendimento ao paciente precisa ser feito por cirurgião-dentista identificado no site. Confirmar antes de publicar.

## 10. SEO
Title: "Laboratório Tonon | Reabilitação oral em São João da Boa Vista - SP". Meta description: "Laboratório Tonon, em São João da Boa Vista: reabilitação oral e estética do sorriso. Agende sua avaliação pelo WhatsApp." H1/H2/H3 corretos, alt útil, Open Graph, canonical. JSON-LD `Dentist` só com nome, endereço, telefone e horário; sem avaliações, sem especialidades.

## 11. STACK E DESEMPENHO
Vite + React + TypeScript + Tailwind 4 + motion; HTML pré-renderizado no build (o texto aparece antes do JS). Estático, sem backend. Mobile-first, sem rolagem horizontal, foco visível, contraste AA, fontes sem bloquear, imagens WebP com dimensões, CLS < 0,05.

## 12. VERIFICAÇÃO ANTES DE ENTREGAR
1. `npm run build` sem erros; servir `dist`.
2. Medir telas de rolagem a 375, 768 e 1280 px e a contagem de palavras; cortar se passar dos limites.
3. Conferir: sem rolagem horizontal; WhatsApp na primeira tela em 375 × 667; links (mensagens certas), Maps, Instagram, âncoras; console limpo; faixa de rascunho; noindex nas três camadas; nenhum "localhost"; reduced-motion.
4. Screenshots em celular e desktop; crítica de diretor de arte (parece template? hierarquia? ritmo? a escala de cor está elegante ou decorativa demais?); corrigir e repetir.
5. Reler o texto procurando promessa, absoluto, título não comprovado ou dado fora da seção 3.
6. Lighthouse mobile e correções.

## 13. ENTREGA
1. README curto: editar `src/config.ts`, trocar fotos, desligar o rascunho, lista do que confirmar.
2. Deploy na Vercel (projeto próprio, pasta raiz do app, acesso público, noindex ativo).
3. Relatório curto: o que foi feito, medições, pendências, link publicado.
