/**
 * Segurança e desempenho
 */

const { contextBridge, ipcRenderer } = require('electron')

//processos de comunicação entre renderer e main
contextBridge.exposeInMainWorld('api', {
    // a linha abaixo cria uma função que envia um mensagem ao processo principal
    fecharJanela: () => ipcRenderer.send('close-about')
})
