import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function CentralizarMapa({ unidades }) {
  const mapa = useMap()

  useEffect(() => {
    if (!unidades || unidades.length === 0) {
      mapa.setView(
        [-28.68, -49.37],
        15
      )

      return
    }

    const pontos = unidades
      .filter(
        (unidade) =>
          Array.isArray(unidade.posicao) &&
          unidade.posicao.length === 2 &&
          !isNaN(unidade.posicao[0]) &&
          !isNaN(unidade.posicao[1])
      )
      .map(
        (unidade) =>
          unidade.posicao
      )

    if (pontos.length === 0) {
      return
    }

    if (pontos.length === 1) {
      mapa.setView(
        pontos[0],
        18
      )

      return
    }

    const limites =
      L.latLngBounds(pontos)

    mapa.fitBounds(
      limites,
      {
        padding: [50, 50],
        maxZoom: 18,
      }
    )
  }, [unidades, mapa])

  return null
}

export default CentralizarMapa