import MapaGerencial from '../Setor02/MapaGerencial'

function Montreal({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 05"
      nomeSetor="MONTREAL"
      localidade="MONTREAL"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Montreal