import { describe, expect, it } from 'vitest'
import { paraCSV } from './csv'

describe('exportação CSV', () => {
  it('usa ; e escapa aspas, quebras e separador', () => {
    const csv = paraCSV([{ nome: 'TESTE "A"', obs: 'linha1\nlinha2', n: 1 }, { nome: 'x;y', obs: null, n: 2 }])
    expect(csv.startsWith('﻿nome;obs;n\r\n')).toBe(true)
    expect(csv).toContain('"TESTE ""A""";"linha1\nlinha2";1')
    expect(csv).toContain('"x;y";;2')
  })
})
