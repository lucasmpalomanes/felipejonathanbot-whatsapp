import * as usuariosdb from '../database/usuarios.js'

export const registrarUsuario = async(usuario, nome)=>{
    await usuariosdb.registrarUsuario(usuario, nome)
}

export const atualizarNome = async(usuario, nome)=>{
    await usuariosdb.atualizarNome(usuario, nome)
}

export const verificarRegistro = async(usuario)=>{
    let registrado = await usuariosdb.verificarRegistro(usuario)
    return registrado
}

export const verificarDono = async(usuario)=>{
    await usuariosdb.verificarDono(usuario)
}

export const obterDadosTodosUsuarios = async()=>{
    let usuarios = await usuariosdb.obterTodosUsuarios()
    return usuarios
}

export const obterDadosUsuario = async(usuario)=>{
    let dados = await usuariosdb.obterUsuario(usuario)
    return dados
}

export const obterUsuariosTipo = async(tipo)=>{
    let usuarios = await usuariosdb.obterUsuariosTipo(tipo)
    return usuarios
}

export const limparTipo = async(tipo)=>{
    let limpou = await usuariosdb.limparTipo(tipo)
    return limpou
}

export const alterarLimiteComandosTipo = async(tipo, qtdLimite)=>{
    await usuariosdb.definirLimite(tipo, qtdLimite)
}

export const recebeuBoasVindas = async(usuario)=>{
    await usuariosdb.alterarRecebeuBoasVindas(usuario)
}

export const verificarUltrapassouLimiteComandos = async(usuario)=>{
    let ultrapassou = usuariosdb.ultrapassouLimite(usuario)
    return ultrapassou
}

export const adicionarContagemDiariaComandos = async(usuario)=>{
    await usuariosdb.addContagemDiaria(usuario)
}

export const adicionarContagemTotalComandos = async(usuario)=>{
    await usuariosdb.addContagemTotal(usuario)
}

export const alterarTipoUsuario = async(usuario, tipo)=>{
    let alterou = await usuariosdb.alterarTipoUsuario(usuario, tipo)
    return alterou
}

export const resetarComandosDia = async()=>{
    await usuariosdb.resetarComandosDia()
}

export const resetarGold = async() =>{
    await usuariosdb.resetarGold()
}

export const resetarComandosDiaUsuario = async(usuario)=>{
    await usuariosdb.resetarComandosDiaUsuario(usuario)
}

export const alterarGold = async(usuario, valor)=>{
    await usuariosdb.alterarGold(usuario, valor)
}

export const obterUsuarioAleatorio = async()=>{
    return await usuariosdb.obterUsuarioAleatorio()
}

export const incrementaContagemRoubos = async (id_usuario) => {
    await usuariosdb.incrementaContagemRoubos(id_usuario)
}

export const resetarRoubosDia = async() => {
    await usuariosdb.resetarRoubosDia()
}

export const resetarRoubosDiaUsuario = async(id_usuario) => {
    await usuariosdb.resetarRoubosDiaUsuario(id_usuario)
}

export const atualizaTimestampCooldownRoubo = async(id_usuario, timestamp_atual) => {
    await usuariosdb.atualizaTimestampCooldownRoubo(id_usuario, timestamp_atual)
}

export const obterUsuariosPorGold = async() => {
    return await usuariosdb.obterUsuariosPorGold()
}