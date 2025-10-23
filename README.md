# Coworking PWA - Frontend

Progressive Web App para gerenciamento de reservas de espaços coworking.

## Tecnologias

- React

## Funcionalidades

- CRUD completo de Usuários
- CRUD completo de Salas
- CRUD completo de Reservas

## 🏃 Rodando Localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variável de ambiente
Crie um arquivo `.env`:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

Aplicação rodando em: http://localhost:3000

### 4. Build para produção
```bash
npm run build
```

### 5. Preview do build
```bash
npm run preview
```

## 📦 Deploy no Vercel

### Configurações:

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Environment Variables:**
- `VITE_API_URL`: URL da sua API (ex: https://sua-api.onrender.com)

### Passo a passo:

1. Acesse: https://vercel.com
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy!

## 🔗 Conectando com o Backend

O frontend se conecta com o backend através da variável `VITE_API_URL`.

**Desenvolvimento:**
```env
VITE_API_URL=http://localhost:4000
```

**Produção:**
```env
VITE_API_URL=https://sua-api.onrender.com
```

## 📱 PWA Features

- **Service Worker**: Cache de assets para funcionamento offline
- **Manifest**: Instalável como app nativo
- **Responsivo**: Funciona em desktop, tablet e mobile

## 🎯 Estrutura de Componentes

```
src/
├── componentes/
│   ├── Usuarios.jsx  
│   ├── Salas.jsx      
│   └── Reservas.jsx
├── servicos/
│   └── api.js          
├── estilos/
│   └── estilos.css   
├── App.jsx           
└── main.jsx           
```

## 🧪 Testando

### Testar localmente com backend local:
```bash
cd ../coworking-backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Testar com backend em produção:
```bash
# Criar .env
echo "VITE_API_URL=https://sua-api.onrender.com" > .env

# Rodar
npm run dev
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build

## 🎨 Customização

### Alterar cores e estilos:
Edite `src/estilos/estilos.css`

### Alterar título e ícones:
Edite `public/manifest.json` e `index.html`

### Adicionar novos componentes:
Crie em `src/componentes/` e importe no `App.jsx`
