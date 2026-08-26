import MapaGerencial from '../Setor02/MapaGerencial'

function Setor03({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 03"
      nomeSetor="ESPLANADA"
      localidade="ESPLANADA"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Setor03
