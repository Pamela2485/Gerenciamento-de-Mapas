import MapaGerencial from '../Setor02/MapaGerencial'

function Catarinense({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 05"
      nomeSetor="CATARINENSE"
      localidade="CATARINENSE"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Catarinense