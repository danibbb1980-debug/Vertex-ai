// Teste rápido: npx tsx scripts/testar-horarios.ts
import { statusAgora, opcoesDeHorario, textoDoDia } from '../src/lib/horarios'
const casos: [string, string][] = [
  ['2026-11-23T10:00:00-03:00', 'seg 10h'],
  ['2026-11-23T12:00:00-03:00', 'seg 12h'],
  ['2026-11-26T09:00:00-03:00', 'qui 9h'],
  ['2026-11-26T17:00:00-03:00', 'qui 17h'],
  ['2026-11-27T13:00:00-03:00', 'sex 13h (intervalo)'],
  ['2026-11-27T16:30:00-03:00', 'sex 16h30'],
  ['2026-11-27T19:30:00-03:00', 'sex 19h30'],
  ['2026-11-28T14:00:00-03:00', 'sáb 14h'],
  ['2026-11-29T10:00:00-03:00', 'dom 10h'],
  ['2026-11-24T07:00:00-03:00', 'ter 7h'],
]
for (const [iso, rot] of casos) console.log(rot.padEnd(22), '→', statusAgora(new Date(iso)).texto)
for (let d = 0; d < 7; d++) console.log(d, textoDoDia(d), opcoesDeHorario(d).join(' '))
