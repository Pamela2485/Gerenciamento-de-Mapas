import MapaGerencial from '../Setor02/MapaGerencial'

function Albatroz({
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  return (
    <MapaGerencial
      setor="SETOR 05"
      nomeSetor="ALBATROZ"
      localidade="ALBATROZ"
      unidades={unidades}
      fotosUnidades={fotosUnidades}
      alterarSituacao={alterarSituacao}
      excluirUnidade={excluirUnidade}
    />
  )
}

export default Albatroz