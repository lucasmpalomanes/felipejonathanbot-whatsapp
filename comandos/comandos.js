
import * as bot from '../controle/botControle.js'

export const listarComandos = async () => {
    let {prefixo} = await bot.obterInformacoesBot()
    return {
        utilidades :[
            `${prefixo}filmes`,
            `${prefixo}series`,
            `${prefixo}gpt`,
            `${prefixo}criarimg`,
            `${prefixo}tabela`,
            `${prefixo}rbg`,
            `${prefixo}ouvir`,
            `${prefixo}audio`,
            `${prefixo}traduz`,
            `${prefixo}voz`,
            `${prefixo}letra`,
            `${prefixo}noticias`,
            `${prefixo}rastreio`,
            `${prefixo}calc`,
            `${prefixo}pesquisa`,
            `${prefixo}moeda`,
            `${prefixo}clima`,
            `${prefixo}ddd`,
            `${prefixo}anime`,
            `${prefixo}qualmusica`
        ],
        info:[
            `${prefixo}menu`,
            `${prefixo}reportar`,
            `${prefixo}meusdados`,
            `${prefixo}info`
        ],
        figurinhas: [
            `${prefixo}s`,
            `${prefixo}simg`,
            `${prefixo}ssf`,
            `${prefixo}emojimix`,
            `${prefixo}tps`,
            `${prefixo}atps`
        ],
        downloads: [
            `${prefixo}play`,
            `${prefixo}yt`,
            `${prefixo}fb`,
            `${prefixo}ig`,
            `${prefixo}tw`,
            `${prefixo}tk`,
            `${prefixo}img`
        ],
        grupo:[
            `${prefixo}status`,
            `${prefixo}fotogrupo`,
            `${prefixo}regras`,
            `${prefixo}blista`,
            `${prefixo}dlista`,
            `${prefixo}listanegra`,
            `${prefixo}add`,
            `${prefixo}ban`,
            `${prefixo}promover`,
            `${prefixo}rebaixar`,
            `${prefixo}mt`,
            `${prefixo}mm`,
            `${prefixo}adms`,
            `${prefixo}enquete`,
            `${prefixo}dono`,
            `${prefixo}mutar`,
            `${prefixo}link`,
            `${prefixo}rlink`,
            `${prefixo}f`,
            `${prefixo}alink`,
            `${prefixo}autosticker`,
            `${prefixo}bv`,
            `${prefixo}afake`,
            `${prefixo}aflood`,
            `${prefixo}apg`,
            `${prefixo}bantodos`,
            `${prefixo}topativos`,
            `${prefixo}contador`, 
            `${prefixo}atividade`,
            `${prefixo}imarcar`,
            `${prefixo}ibanir`,
            `${prefixo}bcmd`,
            `${prefixo}dcmd`
        ],
        diversao:[
            `${prefixo}mascote`,
            `${prefixo}simi`,
            `${prefixo}viadometro`,
            `${prefixo}detector`,
            `${prefixo}massacote`,
            `${prefixo}roletarussa`,
            `${prefixo}casal`,
            `${prefixo}caracoroa`,
            `${prefixo}ppt`,
            `${prefixo}gadometro`,
            `${prefixo}bafometro`,
            `${prefixo}top5`,
            `${prefixo}par`,
            `${prefixo}malacos`,
            `${prefixo}chance`, 
            `${prefixo}fch`,
            `${prefixo}horario`,
            `${prefixo}tiodaingrid`,
            `${prefixo}tiodaingrid`
        ],
        admin:[
            `${prefixo}sair`,
            `${prefixo}pvliberado`,
            `${prefixo}bcmdglobal`,
            `${prefixo}dcmdglobal`,
            `${prefixo}sairgrupos`,
            `${prefixo}infocompleta`,
            `${prefixo}entrargrupo`,
            `${prefixo}bccontatos`,
            `${prefixo}bcgrupos`,
            `${prefixo}fotobot`,
            `${prefixo}nomebot`,
            `${prefixo}nomesticker`,
            `${prefixo}nomeadm`,
            `${prefixo}prefixo`,
            `${prefixo}autostickerpv`,
            `${prefixo}listablock`,
            `${prefixo}bloquear`,
            `${prefixo}usuarios`,
            `${prefixo}limpartipo`,
            `${prefixo}limitediario`,
            `${prefixo}taxalimite`,
            `${prefixo}desbloquear`,
            `${prefixo}estado`,
            `${prefixo}admin`,
            `${prefixo}mudarlimite`,
            `${prefixo}alterartipo`,
            `${prefixo}grupos`,
            `${prefixo}tipos`,
            `${prefixo}rtodos`,
            `${prefixo}r`,
            `${prefixo}verdados`,
            `${prefixo}desligar`,
            `${prefixo}ping`,
            `${prefixo}devtest`
        ],
        excecoes_contagem: [
            `${prefixo}meusdados`,
            `${prefixo}ajuda`,
            `${prefixo}help`,
            `${prefixo}menu`,
            `${prefixo}info`,
            `${prefixo}reportar`
        ]
    }
}


    