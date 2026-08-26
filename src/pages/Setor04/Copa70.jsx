import MapaGerencial from '../Setor02/MapaGerencial'

function Copa70({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 04"
      nomeSetor="COPA 70"
      localidade="COPA 70"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Copa70