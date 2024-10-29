console.log("Processo principal")

//importação de pacotes (bibliotecas)
// nativeTheme (forçar um tema no OS)
// Menu (criar um menu personalizado)
// shell (acessar links externos)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')
const path = require('node:path')

//janela principal
let win //importante: neste projeto o escopo da variavel win deve ser global.
function createWindow() {
  nativeTheme.themeSource = 'dark' //janela sempre escura
  win = new BrowserWindow({
    width: 1010, //largura em px
    height: 720, //altura em px
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  //Menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')
}

//janela sobre (secudaria)
function aboutWindow() {
  nativeTheme.themeSource = 'dark'
  //a linha abaixo obtem a jenela principal
  const main = BrowserWindow.getFocusedWindow()
  let about
  // validar a janela pai
  if (main){
    about = new BrowserWindow({
      width: 320,
      height: 160,
      autoHideMenuBar: true, //esconder o menu
      resizable: false, //impedir redimensionamento
      minimizable: false, // impedir minizae a janela
      //titleBarStyle: 'hidden' //esconder a barra de estilo (ex: totem de auto atendimento)
      parent: main, //estabelece uma hierarquia de janelas
      modal: true, //ativa esse comportamento de janela modal
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  about.loadFile('./src/views/sobre.html')
  
  //fechar a janela quando receber mensagem do processo de renderização.
  ipcMain.on('close-about', () => {
      console.log("recebi a mensagem close-about")
      //validar se a janela foi destruida
      if(about && !about.isDestroyed()){
        about.close()
      }
  })
}


//execução assincrona do aplicativo electron
app.whenReady().then(() => {
  createWindow()
  //aboutWindow()
  // comportamento do MAC ao fechar um janela
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// encerrar a aplicação quando a janela for fechada (Linux e Windows)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//template do menu
const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Novo',
        accelerator: 'CmdOrCtrl+N'
      },
      {
        label: 'Abrir',
        accelerator: 'CmdOrCtrl+O'
      },
      {
        label: 'Salvar',
        accelerator: 'CmdOrCtrl+S'
      },
      {
        label: 'Salvar Como',
        accelerator: 'CmdOrCtrl+Shift+S'
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Editar',
    submenu: [
      {
        label: 'Desfazer',
        role: 'undo'
      },
      {
        label: 'Refazer',
        role: 'redo'
      },
      {
        type: 'separator',
        role: 'cut'
      },
      {
        label: 'Copiar',
        role: 'copy'
      },
      {
        label: 'Colar',
        role: 'paste'
      }
    ]
  },
  {
    label: 'Zoom',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      }
    ]
  },
  {
    label: 'Cor',
    submenu: [
      {
        label: 'Amarelo'
      },
      {
        label: 'Azul'
      },
      {
        label: 'Laranja'
      },
      {
        label: 'Pink'
      },
      {
        label: 'Roxo'
      },
      {
        label: 'Verde'
      },
      {
        type: 'separator'
      },
      {
        label: 'Restaurar a cor padrão'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExtenal('https://github.com/LeoMeloLeo/minidev.git')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]