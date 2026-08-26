import MapaGerencial from '../Setor02/MapaGerencial'

function OlhoDagua({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 06"
      nomeSetor="OLHO D'ÁGUA"
      localidade="OLHO D'ÁGUA"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default OlhoDagua