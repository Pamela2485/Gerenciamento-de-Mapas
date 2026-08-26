import { useState } from 'react'

import {
  carregarUnidades as carregarUnidadesService,
  excluirUnidadeCompleta,
  atualizarSituacaoUnidade,
  cadastrarUnidadeNoBanco,
} from '../services/unidadesService'

import {
  carregarFotosUnidades as carregarFotosUnidadesService,
} from '../services/fotosService'

import {
  enviarFoto as enviarFotoService,
} from '../services/fotosService'

export function useUnidades() {
  const [unidades, setUnidades] =
    useState([])

  const [
    fotosUnidades,
    setFotosUnidades,
  ] = useState([])

  async function carregarDados() {
    try {
      const [
        listaUnidades,
        listaFotos,
      ] = await Promise.all([
        carregarUnidadesService(),
        carregarFotosUnidadesService(),
      ])

      setUnidades(listaUnidades)
      setFotosUnidades(listaFotos)

    } catch (error) {
      console.error(
        'Erro ao carregar dados:',
        error
      )

      throw error
    }
  }

async function excluirUnidade(unidade) {
  if (!unidade) {
    return false
  }

  await excluirUnidadeCompleta(
    unidade
  )

  setUnidades((anterior) =>
    anterior.filter(
      (item) =>
        item.id !== unidade.id
    )
  )

  setFotosUnidades((anterior) =>
    anterior.filter(
      (foto) =>
        Number(foto.unidade_id) !==
        Number(unidade.id)
    )
  )

  return true
}

async function alterarSituacao(id) {
  const unidade =
    unidades.find(
      (item) => item.id === id
    )

  if (!unidade) {
    return false
  }

  const novaSituacao =
    unidade.situacao === 'ativa'
      ? 'cortada'
      : 'ativa'

  await atualizarSituacaoUnidade(
    id,
    novaSituacao
  )

  await carregarDados()

  return {
    unidade,
    novaSituacao,
  }
}

async function cadastrarUnidade({
  formulario,
  fotoFrente,
  fotoHidrometro,
}) {
  const novaUnidade =
    await cadastrarUnidadeNoBanco(
      formulario
    )

  if (fotoFrente) {
    await enviarFotoService({
      arquivo: fotoFrente,
      unidadeId: novaUnidade.id,
      tipo: 'frente',
      matricula:
        formulario.matricula,
    })
  }

  if (fotoHidrometro) {
    await enviarFotoService({
      arquivo: fotoHidrometro,
      unidadeId: novaUnidade.id,
      tipo: 'hidrometro',
      matricula:
        formulario.matricula,
    })
  }

  await carregarDados()

  return novaUnidade
}

  return {
    unidades,
    setUnidades,
    fotosUnidades,
    setFotosUnidades,
    carregarDados,
    excluirUnidade,
    alterarSituacao,
    cadastrarUnidade,
  }
}