//REQUERINDO MODULOS
import moment from "moment-timezone"
import path from 'node:path'
import { MessageTypes } from '../baileys/mensagem.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as api from '../lib/api.js'
import { consoleErro, criarTexto, erroComandoMsg, primeiraLetraMaiuscula, timestampParaData } from '../lib/util.js'
import * as usuarios from '../controle/usuariosControle.js'
import { participanteExiste } from '../database/grupos.js'
import { atualizaTimestampCooldownRoubo, obterTodosUsuarios } from '../database/usuarios.js'
import * as bot from '../controle/botControle.js'

export const diversao = async(c, mensagemInfoCompleta) => {
    const {msgs_texto, ownerNumber} = mensagemInfoCompleta
    const {botNumber, botInfoJSON} = mensagemInfoCompleta.bot
    const {groupId, groupOwner, isGroupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
    const {command, sender, textoRecebido, args, id, chatId, isGroupMsg, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList, username} = mensagemInfoCompleta.mensagem
    const {prefixo, nome_bot, nome_adm} = botInfoJSON

    let cmdSemPrefixo = command.replace(prefixo, "")

    try {
        switch(cmdSemPrefixo){
            case "tiodaingrid":
                try {
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                        let _idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                        let valorRoubado = Math.floor(Math.random() * 30)
                        let _indexAleatorio = Math.floor(Math.random() * _idParticipantesAtuais.length)
                        let _pessoaEscolhida1 = _idParticipantesAtuais[_indexAleatorio]
                        let _respostaTexto = criarTexto("O tio da Ingrid roubou " + valorRoubado + " golds do(a) @{p1}! 🪙🤑💹", _pessoaEscolhida1.replace("@s.whatsapp.net", ''),)
                        await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.espera , id)               
                        await socket.sendTextWithMentions(c, chatId, _respostaTexto, [_pessoaEscolhida1])
                        usuarios.alterarGold(_pessoaEscolhida1, -valorRoubado)
                } catch (err) {
                    throw err
                }
                break
    
            case 'detector' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let imgsDetector = ['verdade','vaipra','mentiroso','meengana','kao','incerteza','estresse','conversapraboi']
                    let indexAleatorio = Math.floor(Math.random() * imgsDetector.length)
                    await socket.replyFile(c,MessageTypes.image, chatId, './media/detector/calibrando.png', msgs_texto.diversao.detector.espera, id)
                    await socket.replyFile(c,MessageTypes.image, chatId, `./media/detector/${imgsDetector[indexAleatorio]}.png`, '', quotedMsgObj)
                } catch(err){
                    throw err
                }
                break

            case 'simi':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let perguntaSimi = textoRecebido.slice(6).trim()
                    await api.simiResponde(perguntaSimi).then(async ({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.simi.resposta, timestampParaData(Date.now()), resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'viadometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.viadometro.apenas_um, id)
                    let respostas = msgs_texto.diversao.viadometro.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.viadometro.resposta,respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    throw err
                }
                break
            
            case 'bafometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if (mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.bafometro.apenas_um, id)
                    let respostas = msgs_texto.diversao.bafometro.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.bafometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    throw err
                }
                break

            case 'chance' :
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let num = Math.floor(Math.random() * 100), temaChance = textoRecebido.slice(8).trim()
                    if(quotedMsg){ 
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), quotedMsgObj)
                    } else {
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), id)
                    }
                } catch(err){
                    throw err
                }
                break

            case "caracoroa":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let ladosMoeda = ["cara","coroa"]
                    let textoUsuario = textoRecebido.slice(11).toLowerCase().trim()
                    if(!ladosMoeda.includes(textoUsuario)) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    await socket.reply(c, chatId, msgs_texto.diversao.caracoroa.espera, id)
                    let indexAleatorio = Math.floor(Math.random() * ladosMoeda.length)
                    let vitoriaUsuario = ladosMoeda[indexAleatorio] == textoUsuario
                    let textoResultado
                    if(vitoriaUsuario){
                        textoResultado = criarTexto(msgs_texto.diversao.caracoroa.resposta.vitoria, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                    } else {
                        textoResultado = criarTexto(msgs_texto.diversao.caracoroa.resposta.derrota, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                    }
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, path.resolve(`media/caracoroa/${ladosMoeda[indexAleatorio]}.png`), textoResultado, id)
                } catch(err){
                    throw err
                }
                break

            case "ppt":
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    let ppt = ["pedra","papel","tesoura"], indexAleatorio = Math.floor(Math.random() * ppt.length)
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(!ppt.includes(args[1].toLowerCase())) return await socket.reply(c, chatId, msgs_texto.diversao.ppt.opcao_erro, id)
                    let escolhaBot = ppt[indexAleatorio], iconeEscolhaBot = null, escolhaUsuario = args[1].toLowerCase(), iconeEscolhaUsuario = null, vitoriaUsuario = null
                    if(escolhaBot == "pedra"){
                        iconeEscolhaBot = "✊"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = null, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = false, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = true, iconeEscolhaUsuario = "✋"
                    } else if(escolhaBot == "papel"){
                        iconeEscolhaBot = "✋"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = false, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = true, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = null, iconeEscolhaUsuario = "✋"
                    } else  {
                        iconeEscolhaBot = "✌️"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = true, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = null, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = false, iconeEscolhaUsuario = "✋"
                    }
                    let textoResultado = ''
                    if(vitoriaUsuario == true) {
                        let premio = 30
                        usuarios.alterarGold(dadosUsuario.id_usuario, premio)
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.vitoria, iconeEscolhaUsuario, iconeEscolhaBot)
                        textoResultado += "\nReceba " + premio + " moedas";
                    }else if(vitoriaUsuario == false){
                        let punicao = -15
                        usuarios.alterarGold(dadosUsuario.id_usuario, punicao)
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.derrota, iconeEscolhaUsuario, iconeEscolhaBot)
                        textoResultado += "\nPerdeu " + Math.abs(punicao) + " moedas";
                    } else {
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.empate, iconeEscolhaUsuario, iconeEscolhaBot)
                    }
                    await socket.reply(c, chatId, textoResultado, id)
                } catch(err){
                    throw err
                }
                break

            case "massacote":
            case 'mascote':
                try{
                    const mascoteFotoURL = "https://i.imgur.com/mVwa7q4.png"
                    await socket.replyFileFromUrl(c, MessageTypes.image,chatId, mascoteFotoURL, 'Whatsapp Jr.', id)
                } catch(err){
                    throw err
                }
                break 

            case 'malacos':
                try{
                    const malacosFotoURL = "https://i.imgur.com/7bcn2TK.jpg"
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, malacosFotoURL,'Somos o problema', id)
                } catch(err){
                    throw err
                }
                break

            case 'roletarussa':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(groupOwner),1)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(botNumber),1)
                    if(idParticipantesAtuais.length == 0) return await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.sem_membros, id)
                    let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let participanteEscolhido = idParticipantesAtuais[indexAleatorio]
                    let respostaTexto = criarTexto(msgs_texto.diversao.roletarussa.resposta, participanteEscolhido.replace("@s.whatsapp.net", ''))
                    await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.espera , id)
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [participanteEscolhido])
                    await socket.removeParticipant(c, chatId, participanteEscolhido)
                } catch(err){
                    throw err
                }
                break
            
            case 'casal':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    let idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 2) return await socket.reply(c, chatId, msgs_texto.diversao.casal.minimo, id)
                    let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let pessoaEscolhida1 = idParticipantesAtuais[indexAleatorio]
                    idParticipantesAtuais.splice(indexAleatorio,1)
                    indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let pessoaEscolhida2 = idParticipantesAtuais[indexAleatorio]
                    let respostaTexto = criarTexto(msgs_texto.diversao.casal.resposta, pessoaEscolhida1.replace("@s.whatsapp.net", ''), pessoaEscolhida2.replace("@s.whatsapp.net", ''))
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [pessoaEscolhida1, pessoaEscolhida2])
                } catch(err){
                    throw err
                }
                break

            case 'gadometro':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.gadometro.apenas_um , id)
                    let respostas = msgs_texto.diversao.gadometro.respostas 
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if (mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.gadometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)       
                } catch(err){
                    throw err
                }
                break

            case 'top5':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let temaRanking = textoRecebido.slice(6).trim(), idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 5) return await socket.reply(c, chatId,msgs_texto.diversao.top5.erro_membros, id)
                    let respostaTexto = criarTexto(msgs_texto.diversao.top5.resposta_titulo, temaRanking), mencionarMembros = []
                    for (let i = 0 ; i < 5 ; i++){
                        let medalha = ""
                        switch(i+1){
                            case 1:
                                medalha = '🥇'
                            break
                            case 2:
                                medalha = '🥈'
                            break
                            case 3:
                                medalha = '🥉'
                            break
                            default:
                                medalha = ''
                        }
                        let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                        let membroSelecionado = idParticipantesAtuais[indexAleatorio]
                        respostaTexto += criarTexto(msgs_texto.diversao.top5.resposta_itens, medalha, i+1, membroSelecionado.replace("@s.whatsapp.net", ''))
                        mencionarMembros.push(membroSelecionado)
                        idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(membroSelecionado),1)                
                    }
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mencionarMembros)
                } catch(err){
                    throw err
                }
                break

            case 'par':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(mentionedJidList.length !== 2) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let respostas = msgs_texto.diversao.par.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length)
                    let respostaTexto = criarTexto(msgs_texto.diversao.par.resposta, mentionedJidList[0].replace("@s.whatsapp.net", ''), mentionedJidList[1].replace("@s.whatsapp.net", ''), respostas[indexAleatorio])
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mentionedJidList)
                } catch(err){
                    throw err
                }
                break

            case "fch":
                try{
                    await api.obterCartasContraHu().then(async({resultado})=>{
                        await socket.reply(c, chatId, resultado, id)
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break    

            case "horario":
                try{
                    if(moment().tz("America/Sao_Paulo").format("HH") == "22" && moment().tz("America/Sao_Paulo").format("mm") == "22" || moment().tz("America/Sao_Paulo").format("HH") == "17" && moment().tz("America/Sao_Paulo").format("mm") == "17"){
                        let idKaren = "553195499971@s.whatsapp.net"
                        let respostaTexto = criarTexto("Horário da @{p1} 🇧🇷🇧🇷", idKaren.replace("@s.whatsapp.net", ''))
                        await socket.sendTextWithMentions(c, chatId, respostaTexto, [idKaren])
                        const karenimgFotoURL = "https://static.poder360.com.br/2022/08/Bolsonaro-capa-plano-de-governo-PL-2022-9.ago_.2022-848x477.jpg"
                        await socket.replyFileFromUrl(c, MessageTypes.image, chatId, karenimgFotoURL,'JPMC', id)
                        break
                    } else await socket.sendText(c, chatId, moment.tz("America/Sao_Paulo").format("HH:mm"))    
                } catch(err) {
                    throw err
                } //Não colocar break

            case "jpmc":
                try{
                    const jpmcFotoURL = "https://scontent.fgru6-1.fna.fbcdn.net/v/t39.30808-1/275542689_1586052051773204_8318614967093960045_n.jpg?stp=dst-jpg_s200x200&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wG2VI1LpkPYQ7kNvgH7TKCx&_nc_ht=scontent.fgru6-1.fna&oh=00_AfDvoPXjd4iKrb-Jrof5aZE0r202zMvdtx1NNW5XUAnLsw&oe=66407338"
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, jpmcFotoURL,'JPMC', id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            case "sexoanal":
                try {
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                        let _idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                        _idParticipantesAtuais.splice(_idParticipantesAtuais.indexOf(botNumber),1)
                        if(_idParticipantesAtuais.length <= 3) return await socket.reply(c, chatId, "Quantidade de membros insuficiente", id)
                        let _indexAleatorio = Math.floor(Math.random() * _idParticipantesAtuais.length)
                        let _pessoaEscolhida1 = _idParticipantesAtuais[_indexAleatorio]
                        let idPedras = "5511945553143@s.whatsapp.net"
                        let _respostaTexto = criarTexto("O cuzinho do @{p1} foi penetrado pelo(a) @{p2}, que ganhou 10 golds! 😈🤤", idPedras.replace("@s.whatsapp.net", ''), _pessoaEscolhida1.replace("@s.whatsapp.net", ''),)
                        await usuarios.alterarGold(_pessoaEscolhida1, 10)
                        await socket.sendTextWithMentions(c, chatId, _respostaTexto, [idPedras, _pessoaEscolhida1])
                } catch (err) {
                    throw err
                }
                break

            case "statusgold":
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    let nomeUsuario = username
                    await socket.reply(c, chatId, "Golds do usuário " + nomeUsuario + ": " + dadosUsuario.gold, id)
                } catch(err){
                    throw err
                }
                break

            case "roubargold":
                try{
                    if(!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, "Por favor, marque apenas um usuário", id)
                    let timestamp_atual = Math.round(new Date().getTime()/1000)

                    let dadosLadrao = await usuarios.obterDadosUsuario(sender)

                    if(dadosLadrao.roubos_dia >= 5 && timestamp_atual < dadosLadrao.timestamp_cooldown_roubo){
                        return await socket.reply(c, chatId, "Você já roubou demais hoje. Por favor, tente novamente amanhã 👮‍♂️🚓\n\n_NOVIDADE: Por 50 Golds você agora pode comprar um *Kit Carioca* (comando !kitcarioca) e voltar a roubar!_", id)
                    } else if(dadosLadrao.roubos_dia >= 5){
                        usuarios.resetarRoubosDiaUsuario(dadosLadrao.id_usuario)
                    }

                    let idResposta, alvo

                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender

                    let dadosAlvo = await usuarios.obterDadosUsuario(alvo)
                    if(dadosAlvo.gold <= 0) return await socket.reply(c, chatId, "Tá duro dorme! Esse usuário não tem gold suficiente para ser roubado :(", id)

                    if(dadosLadrao.roubos_dia == 4){
                        await usuarios.atualizaTimestampCooldownRoubo(dadosLadrao.id_usuario, timestamp_atual + 86400)
                    }

                    await usuarios.incrementaContagemRoubos(sender)


                    await socket.reply(c, chatId, "🎲 Testando a sorte... 🎲", id)               

                    //Testa o sucesso:
                    let sucesso = Math.floor(Math.random() * 10)

                    if(sucesso > 4){
                        //Se o roubo dá certo
                        let valorRoubado = Math.floor(Math.random() * Math.abs(0.8 * dadosAlvo.gold))
                        await usuarios.alterarGold(dadosAlvo.id_usuario, -valorRoubado)
                        await usuarios.alterarGold(dadosLadrao.id_usuario, valorRoubado)

                        let _respostaTexto = criarTexto("@{p1} roubou com sucesso " + valorRoubado + " golds do(a) @{p2}! 🔫☯️🎭", sender.replace("@s.whatsapp.net", ''), alvo.replace("@s.whatsapp.net", ''))
                        await socket.sendTextWithMentions(c, chatId, _respostaTexto, [sender, alvo])
                    } else {
                        //Se nao conseguir roubar
                        if(dadosLadrao.gold > 0) {
                            let valorRoubado = Math.floor(Math.random() * Math.abs(0.8 * dadosLadrao.gold))

                            await usuarios.alterarGold(dadosAlvo.id_usuario, valorRoubado)
                            await usuarios.alterarGold(dadosLadrao.id_usuario, -valorRoubado)

                            let _respostaTexto = criarTexto("@{p1} falhou ao tentar roubar @{p2} e acabou perdendo " + valorRoubado + " golds para ele(a). \nMuito azar ❌❌❌", sender.replace("@s.whatsapp.net", ''), alvo.replace("@s.whatsapp.net", ''))
                            await socket.sendTextWithMentions(c, chatId, _respostaTexto, [sender, alvo])
                        } else {
                            let _respostaTexto = criarTexto("@{p1} falhou ao tentar roubar @{p2} e não tinha gold nem pra perder. \nMuito azar ❌❌❌", sender.replace("@s.whatsapp.net", ''), alvo.replace("@s.whatsapp.net", ''))
                            await socket.sendTextWithMentions(c, chatId, _respostaTexto, [sender, alvo])
                        }
                    }
                } catch(err){
                    throw err
                } break

                case "rankgold":
                    try {
                        if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                            let _idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                            let _usuariosPorGold = await usuarios.obterUsuariosPorGold()
                            let _respostaTexto = "*Ranking de membros com mais golds:*\n\n"
                            let mencoes = []

                            let i = 0, j = 0
                            for(i = 0; i < _usuariosPorGold.length; i++){
                                if(_idParticipantesAtuais.includes(_usuariosPorGold[i].id_usuario)){
                                    j++
                                    _respostaTexto += criarTexto("*" + j + "º lugar: @{p1}* com *" + _usuariosPorGold[i].gold + " golds!* \n\n", _usuariosPorGold[i].id_usuario.replace("@s.whatsapp.net", ''))
                                    mencoes.push(_usuariosPorGold[i].id_usuario)
                                }
                            }
                            await socket.sendTextWithMentions(c, chatId, _respostaTexto, mencoes)
                    } catch (err) {
                        throw err
                    }
                    break

                case "kitcarioca":
                    try{
                        if(!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                        let dadosUsuario = await usuarios.obterDadosUsuario(sender)
                        
                        if(dadosUsuario.gold < 50)
                            await socket.reply(c, chatId, "Golds insuficientes para a compra do *Kit Carioca* 😭\n\nSão necessários 50 Golds 🪙")
                        else {
                            await usuarios.alterarGold(dadosUsuario.id_usuario, -50)
                            await usuarios.resetarRoubosDiaUsuario(dadosUsuario.id_usuario)
                            await socket.reply(c, chatId, "Parabéns! 🥳\nVocê comprou um *Kit Carioca* e já pode voltar a roubar!")
                        }
                    } catch(err) { 
                        throw err
                    } break
        }
    } catch(err){
        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "DIVERSÃO")
    }
    
}