import MapaGerencial from '../Setor02/MapaGerencial'

function Janaina({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 04"
      nomeSetor="JANAINA"
      localidade="JANAINA"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Janaina