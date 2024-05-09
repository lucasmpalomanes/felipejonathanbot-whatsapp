import Datastore from '@seald-io/nedb'
import * as bot from '../controle/botControle.js'

const db = new Datastore({filename : './database/dados_salvos/usuarios.db', autoload: true})

async function Usuario(id_usuario, nome) {
    const 
    ID_USUARIO = id_usuario,
    NOME = nome,
    COMANDOS_TOTAL = 0,
    COMANDOS_DIA = 0,
    MAX_COMANDOS_DIA = (await bot.obterInformacoesBot()).limite_diario.limite_tipos.comum,
    RECEBEUBOASVINDAS = false,
    TIPO = 'comum',
    GOLD = 50,
    ROUBOS_DIA = 0,
    ROUBOS_TOTAL = 0,
    TIMESTAMP_COOLDOWN_ROUBO = 0

    return {
        id_usuario : ID_USUARIO,
        nome : NOME,
        comandos_total: COMANDOS_TOTAL,
        comandos_dia: COMANDOS_DIA,
        max_comandos_dia : MAX_COMANDOS_DIA,
        recebeuBoasVindas: RECEBEUBOASVINDAS,
        tipo: TIPO,
        gold: GOLD,
        roubos_dia: ROUBOS_DIA,
        roubos_total: ROUBOS_TOTAL,
        timestamp_cooldown_roubo: TIMESTAMP_COOLDOWN_ROUBO
    }
}

export const registrarUsuario = async(id_usuario, nome) =>{
    await db.insertAsync(await Usuario(id_usuario, nome))
}

export const obterUsuario = async (id_usuario) =>{
    let usuario = await db.findOneAsync({id_usuario})
    return usuario
}

export const obterUsuariosTipo = async (tipo) =>{
    let usuarios = await db.findAsync({tipo})
    return usuarios
}

export const obterTodosUsuarios = async()=>{
    let usuarios = await db.findAsync({})
    return usuarios
}

export const verificarRegistro  = async (id_usuario) => {
    let resp = await db.findOneAsync({id_usuario})
    return (resp != null)
}

export const atualizarNome = async(id_usuario,nome) =>{
    await db.updateAsync({id_usuario}, {$set:{nome}})
}

export const verificarDono = async(id_usuario)=>{
    let donoAtual = await db.findOneAsync({id_usuario, tipo: "dono"})
    if(!donoAtual){
        let {limite_diario} = await bot.obterInformacoesBot()
        await db.updateAsync({tipo: "dono"}, {$set: {tipo: "comum",  max_comandos_dia : limite_diario.limite_tipos.comum}}, {multi: true})
        await db.updateAsync({id_usuario}, {$set: {tipo : "dono", max_comandos_dia: null}})
    }
}

export const alterarTipoUsuario = async(id_usuario, tipo)=>{
    let {limite_diario} = await bot.obterInformacoesBot()
    console.log(limite_diario.limite_tipos[tipo])
    if(limite_diario.limite_tipos[tipo] !== undefined){
        await db.updateAsync({id_usuario}, {$set: {tipo, max_comandos_dia: limite_diario.limite_tipos[tipo]}})
        return true
    } else {
        return false
    }
}

export const alterarRecebeuBoasVindas = async(id_usuario, status = true)=>{
    await db.updateAsync({id_usuario}, {$set : {recebeuBoasVindas : status}})
}

export const limparTipo = async(tipo)=>{
    let {limite_diario} = await bot.obterInformacoesBot()
    if(limite_diario.limite_tipos[tipo] === undefined || tipo === "comum") return false
    await db.updateAsync({tipo}, {$set: {tipo: "comum", max_comandos_dia: limite_diario.limite_tipos.comum}}, {multi: true})
    return true
}

export const ultrapassouLimite = async(id_usuario)=>{
    let usuario =  await db.findOneAsync({id_usuario : id_usuario})
    if(usuario.max_comandos_dia == null) return false
    return (usuario.comandos_dia >= usuario.max_comandos_dia)
}

export const addContagemDiaria = async(id_usuario)=>{
    db.updateAsync({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
}

export const addContagemTotal = async(id_usuario)=>{
    db.updateAsync({id_usuario}, {$inc: {comandos_total: 1}})
}

export const definirLimite = async(tipo, limite)=>{
    db.updateAsync({tipo}, {$set: {max_comandos_dia: limite}}, {multi: true})
}

export const resetarComandosDia = async() =>{
    db.updateAsync({}, {$set:{comandos_dia : 0}}, {multi: true})
}

export const resetarGold = async() =>{
    db.updateAsync({}, {$set:{gold : 50, roubos_dia: 0, timestamp_cooldown_roubo: 0}}, {multi: true})
}

export const resetarComandosDiaUsuario = async(id_usuario) =>{
    db.updateAsync({id_usuario}, {$set:{comandos_dia : 0}})
}

export const alterarGold = async(id_usuario, valor) => {
    db.updateAsync({id_usuario}, {$inc:{gold : valor}})
}

// Função para obter um usuário aleatório
export const obterUsuarioAleatorio = async () => {
    // Obtém todos os usuários
    const usuarios = await obterTodosUsuarios();
    
    // Verifica se há usuários na base de dados
    if (usuarios.length === 0) {
        return null; // Retorna null se não houver usuários
    }
    
    // Escolhe aleatoriamente um usuário e retorna o objeto do usuário
    const indiceAleatorio = Math.floor(Math.random() * usuarios.length);
    return usuarios[indiceAleatorio];
}

export const incrementaContagemRoubos = async (id_usuario) => {
    db.updateAsync({id_usuario}, {$inc: {roubos_dia: 1, roubos_total: 1}})
}

export const resetarRoubosDia = async() => {
    db.updateAsync({}, {$set: {roubos_dia: 0}}, {multi: true})
}

export const resetarRoubosDiaUsuario = async(id_usuario) => {
    db.updateAsync({id_usuario}, {$set: {roubos_dia: 0}})
}

export const atualizaTimestampCooldownRoubo = async(id_usuario, timestamp_atual) => {
    db.updateAsync({id_usuario}, {$set: {timestamp_cooldown_roubo: timestamp_atual}})
}

export const obterUsuariosPorGold = async () => {
    // Utiliza o findAsync para obter todos os usuários e os ordena pelo campo 'gold' em ordem decrescente
    let usuarios = await db.findAsync({}).sort({ gold: -1 });
    return usuarios;
}