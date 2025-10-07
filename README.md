# Redirect Page

Uma aplicação Angular responsiva para redirecionamento automático de URLs e deeplinks para aplicativos Android.

## 🚀 Funcionalidades

- ✅ Recebe URL ou deeplink via parâmetro de query
- ✅ Timer visual de 5 segundos antes do redirecionamento
- ✅ Tema claro e escuro com detecção automática da preferência do sistema
- ✅ Design responsivo para mobile, tablet e desktop
- ✅ Deploy automático no GitHub Pages via GitHub Actions
- ✅ Suporte a acessibilidade (WCAG 2.1)
- ✅ Animações suaves e interface moderna

## 📱 Como usar

### URL básica:
```
https://pedrostefanogv.github.io/redirect/?url=https://google.com
```

### Deeplink para aplicativo Android:
```
https://pedrostefanogv.github.io/redirect/?url=myapp://deep/link/path
```

### Parâmetros suportados:
- `url` - URL ou deeplink de destino
- `deeplink` - Alias para o parâmetro url

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm

### Instalação
```bash
npm install
```

### Desenvolvimento local
```bash
npm start
```

### Build para produção
```bash
npm run build:prod
```

## 🎨 Temas

A aplicação suporta temas claro e escuro:
- Detecção automática da preferência do sistema
- Alternância manual via botão no header
- Preferência salva no localStorage

## 📱 Responsividade

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🚀 Deploy

O deploy é automático via GitHub Actions sempre que há push na branch `main`.

### Configuração manual do GitHub Pages:
1. Vá em Settings > Pages
2. Source: GitHub Actions
3. O workflow fará o deploy automaticamente

## 🔧 Estrutura do projeto

```
src/
├── app/
│   ├── redirect/           # Componente principal
│   ├── services/           # Serviços (tema)
│   ├── app.component.*     # Componente raiz
│   ├── app.module.ts       # Módulo principal
│   └── app-routing.module.ts # Roteamento
├── assets/                 # Recursos estáticos
├── styles.scss            # Estilos globais
├── index.html             # HTML principal
└── 404.html              # Fallback para SPA routing
```

## 🎯 Acessibilidade

- Suporte a navegação por teclado
- Estados de foco visíveis
- Textos alternativos
- Contraste adequado
- Suporte a motion-reduce

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.