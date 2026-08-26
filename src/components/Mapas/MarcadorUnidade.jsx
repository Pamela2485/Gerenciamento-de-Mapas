import L from 'leaflet'

function criarIconeUnidade(situacao) {

  const cor =
    situacao === 'cortada'
      ? '#dc3545'
      : '#1683d8'

  return L.divIcon({

    className: 'icone-ponto-unidade',

    html: `
      <div
        style="
          background: ${cor};
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        "
      ></div>
    `,

    iconSize: [18, 18],

    iconAnchor: [9, 9],

    popupAnchor: [0, -9],

  })
}

export default criarIconeUnidade