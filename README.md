
# 🌊 Flow Browser - Navegador para Estudos

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Electron-green.svg" alt="Platform">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status">
</div>

<div align="center">
  <h3>🎓 Navegador web focado em produtividade e estudos</h3>
  <p><em>Desenvolvido como Trabalho de Conclusão de Curso (TCC) da ETEC de Sapopemba</em></p>
</div>

---

## 📖 Sobre o Projeto

O **Flow Browser** é um navegador web inovador, desenvolvido especificamente para estudantes que buscam **foco, produtividade e ferramentas integradas** para otimizar seu tempo de estudo. Baseado na tecnologia Electron, o Flow combina a funcionalidade de um navegador tradicional com um ecossistema completo de ferramentas educacionais.

### 🎯 Missão
Proporcionar aos estudantes uma experiência de navegação web que prioriza o foco nos estudos, eliminando distrações e oferecendo ferramentas úteis em um só lugar.

### 🏫 Instituição
- **Escola**: ETEC de Sapopemba (Centro Paula Souza)
- **Curso**: Desenvolvimento de Sistemas
- **Tipo**: Trabalho de Conclusão de Curso (TCC)
- **Ano**: 2024

---

## ✨ Características Principais

### 🚀 **Navegação Inteligente**
- Interface limpa e moderna com foco na produtividade
- Sistema de abas otimizado para múltiplas pesquisas
- Bloqueador de anúncios integrado
- Modo de leitura para melhor concentração
- Favoritos organizados e acessíveis

### 🧠 **IA Integrada**
- **ChatGPT Integration**: Assistente de estudos com IA
- Respostas instantâneas para dúvidas acadêmicas
- Explicações didáticas e resumos personalizados
- Suporte a múltiplas disciplinas

### 🛠️ **Ferramentas de Produtividade**
- **📝 Bloco de Notas**: Sistema completo de anotações
- **⏱️ Temporizador Pomodoro**: Técnica de estudos cronometrados
- **🎨 Conversor de Imagens**: Edição e conversão profissional
- **🧮 Calculadora Científica**: Cálculos complexos integrados
- **🎯 Gerador de QR Code**: Criação rápida de códigos QR
- **🔐 Gerador de Senhas**: Senhas seguras personalizadas
- **📏 Conversor de Unidades**: Medidas, moedas e temperaturas
- **📋 Editor Markdown**: Documentação técnica
- **🔧 Formatador JSON**: Validação e formatação de código

### 🎨 **Personalização Avançada**
- **7 Temas Exclusivos**: Light, Dark, Pink, Purple, Green, Blue, Orange
- **Wallpapers Dinâmicos**: Backgrounds personalizáveis
- **Interface Responsiva**: Adaptação automática a diferentes tamanhos
- **Atalhos Intuitivos**: Navegação rápida e eficiente

---

## 🖥️ Capturas de Tela

### 🏠 Tela Inicial
Uma interface clean e acolhedora com acesso rápido aos sites mais utilizados pelos estudantes.

### 🤖 Assistente IA
Integração completa com ChatGPT para suporte educacional instantâneo.

### 🛠️ Centro de Ferramentas
Acesso centralizado a todas as ferramentas de produtividade integradas.

### 🎨 Sistema de Temas
Personalização completa da interface com múltiplas opções de cores e estilos.

---

## 🚀 Tecnologias Utilizadas

### **Core Technologies**
- **Electron** - Framework para aplicações desktop multiplataforma
- **JavaScript (ES6+)** - Linguagem principal de desenvolvimento
- **HTML5 & CSS3** - Estrutura e estilização moderna
- **Node.js** - Runtime JavaScript para o backend

### **Frontend Framework & Libraries**
- **Tailwind CSS** - Framework CSS utilitário para design responsivo
- **Font Awesome** - Biblioteca de ícones vetoriais
- **WebView API** - Renderização de páginas web integradas

### **APIs & Integrations**
- **OpenAI API** - Integração com ChatGPT para assistência educacional
- **Canvas API** - Manipulação avançada de imagens
- **File System API** - Gerenciamento de arquivos locais
- **Clipboard API** - Operações de cópia e cola

### **Development Tools**
- **NPM** - Gerenciador de pacotes
- **Git** - Controle de versão
- **VSCode** - Ambiente de desenvolvimento

---

## 📦 Instalação e Execução

### **Pré-requisitos**
- Node.js (versão 14 ou superior)
- NPM (incluído com Node.js)
- Git para clonagem do repositório

### **Passo a Passo**

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/flow-browser.git
cd flow-browser
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API do ChatGPT** (opcional)
   - Obtenha sua chave API em [OpenAI Platform](https://platform.openai.com/)
   - Substitua a chave no arquivo `public/app.js` na variável `CHATGPT_API_KEY`

4. **Execute o aplicativo**
```bash
npm start
```

### **Build para Produção**
```bash
npm run build
```

---

## 🎯 Funcionalidades Detalhadas

### **🌐 Navegação Web**
- **Multi-tab Support**: Múltiplas abas simultâneas
- **Smart Navigation**: Detecção automática de URLs vs. pesquisas
- **Ad Blocker**: Bloqueio de anúncios para melhor foco
- **History Management**: Navegação por histórico (voltar/avançar)
- **Home Page Customizable**: Acesso rápido a sites favoritos

### **🤖 Assistente IA (ChatGPT)**
- **Educational Focus**: Especializado em dúvidas acadêmicas
- **Real-time Responses**: Respostas instantâneas e contextualizadas
- **Multiple Subjects**: Suporte a diversas disciplinas educacionais
- **Conversation History**: Histórico de conversas na sessão
- **Smart Formatting**: Formatação inteligente das respostas

### **📝 Sistema de Notas**
- **Rich Text Support**: Suporte a texto formatado
- **Auto-save**: Salvamento automático local
- **Search & Filter**: Busca e filtragem de notas
- **Export Options**: Exportação em diferentes formatos
- **Organized Storage**: Armazenamento local organizado

### **⏱️ Temporizador Pomodoro**
- **Customizable Timer**: Tempos personalizáveis de estudo
- **Break Reminders**: Lembretes automáticos de pausa
- **Session Tracking**: Acompanhamento de sessões de estudo
- **Audio Notifications**: Notificações sonoras opcionais

### **🎨 Conversor de Imagens Profissional**
- **Format Conversion**: PNG, JPG, WebP, GIF
- **Background Removal**: Remoção inteligente de fundo
- **Image Manipulation**: Rotação, espelhamento, redimensionamento
- **Quality Control**: Controle de qualidade e compressão
- **Batch Processing**: Processamento em lote (futuro)

---

## 🔧 Configurações Avançadas

### **Personalização de Temas**
O Flow Browser oferece 7 temas cuidadosamente desenvolvidos:

- **🌅 Light**: Tema claro e minimalista
- **🌙 Dark**: Tema escuro para reduzir fadiga ocular
- **🌸 Pink**: Tema rosado e acolhedor
- **💜 Purple**: Tema roxo elegante
- **🌿 Green**: Tema verde relaxante
- **💙 Blue**: Tema azul profissional
- **🧡 Orange**: Tema laranja energizante

### **Atalhos de Teclado**
- `Ctrl + T`: Nova aba
- `Ctrl + W`: Fechar aba atual
- `Ctrl + R`: Recarregar página
- `F11`: Modo tela cheia
- `Ctrl + Shift + I`: Ferramentas de desenvolvedor

---

## 📊 Arquitetura do Sistema

### **Estrutura de Arquivos**
```
flow-browser/
├── main.js                 # Processo principal do Electron
├── preload.js             # Script de pré-carregamento
├── package.json           # Configurações e dependências
├── public/                # Arquivos da interface
│   ├── index.html        # Página principal
│   ├── app.js            # Lógica principal da aplicação
│   ├── style.css         # Estilos e temas
│   └── db.js             # Gerenciamento de dados locais
├── assets/               # Recursos estáticos
└── README.md            # Documentação do projeto
```

### **Fluxo de Dados**
1. **Main Process (Electron)**: Gerencia a janela principal e configurações do sistema
2. **Renderer Process**: Interface do usuário e lógica de navegação
3. **WebView**: Renderização de páginas web em ambiente isolado
4. **Local Storage**: Persistência de dados locais (notas, configurações, temas)
5. **External APIs**: Integração com serviços externos (OpenAI)

---

## 🤝 Contribuição

Este projeto foi desenvolvido como TCC, mas contribuições são bem-vindas para melhorias futuras!

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Diretrizes de Contribuição**
- Mantenha o código limpo e bem documentado
- Siga os padrões de código estabelecidos
- Teste todas as funcionalidades antes de submeter
- Inclua documentação para novas features

---

## 🏆 Agradecimentos

### **Orientação Acadêmica**
- **ETEC de Sapopemba** - Infraestrutura e suporte educacional
- **Professores Orientadores** - Guidance técnica e metodológica
- **Centro Paula Souza** - Recursos e oportunidades de aprendizado

### **Tecnologias e Comunidade**
- **Electron Community** - Framework robusto e documentação
- **OpenAI** - API de IA para recursos educacionais
- **Tailwind CSS** - Framework de design moderno
- **Font Awesome** - Biblioteca de ícones abrangente

---

## 📈 Roadmap Futuro

### **Versão 1.1 (Planejada)**
- [ ] Sincronização em nuvem para notas
- [ ] Modo offline avançado
- [ ] Extensões personalizadas
- [ ] Estatísticas de uso detalhadas

### **Versão 1.2 (Planejada)**
- [ ] Colaboração em tempo real
- [ ] Integração com plataformas educacionais
- [ ] API pública para desenvolvedores
- [ ] Versão mobile (React Native)

### **Versão 2.0 (Futuro)**
- [ ] Inteligência artificial local
- [ ] Realidade aumentada para estudos
- [ ] Gamificação do aprendizado
- [ ] Marketplace de plugins

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 Flow Browser - ETEC Sapopemba

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Contato

### **Desenvolvedor Principal**
- **Nome**: [Seu Nome]
- **Email**: [seu.email@etec.sp.gov.br]
- **LinkedIn**: [seu-linkedin]
- **GitHub**: [seu-github]

### **Instituição**
- **ETEC de Sapopemba**
- **Endereço**: [Endereço da ETEC]
- **Site**: [site-oficial]

---

<div align="center">
  <h3>🌊 Desenvolvido com 💙 por estudantes, para estudantes</h3>
  <p><strong>Flow Browser - Onde o foco encontra a tecnologia</strong></p>
  
  <br>
  
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="Made with Love">
  <img src="https://img.shields.io/badge/Built%20for-🎓%20Students-blue.svg" alt="Built for Students">
  <img src="https://img.shields.io/badge/Powered%20by-⚡%20Innovation-yellow.svg" alt="Powered by Innovation">
</div>

---

<div align="center">
  <sub>© 2024 Flow Browser - ETEC de Sapopemba. Todos os direitos reservados.</sub>
</div>
