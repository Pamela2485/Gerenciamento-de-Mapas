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
      nomeSetor="JANAÍNA"
      localidade="JANAÍNA"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Janaina