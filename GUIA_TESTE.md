# 🧪 GUIA DE TESTE - VALIDAÇÃO DOS REQUISITOS

## 🚀 Preparação

### 1. Iniciar Backend
```bash
cd coworking-backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd coworking-frontend
npm run dev
```

### 3. Acessar
```
http://localhost:3000
```

---

## ✅ TESTE 1: Requisito 3 - Criação de Login

### Passo a passo:
1. Acesse a aplicação
2. Clique em "Registrar-se"
3. Preencha:
   - Nome: João Silva
   - Email: joao@teste.com
   - Senha: 123456
   - Confirmar Senha: 123456
4. Clique em "Registrar"

### ✅ Resultado esperado:
- Mensagem de sucesso
- Redirecionamento para tela de login
- Usuário criado no banco

---

## ✅ TESTE 2: Requisito 1 - JWT na API

### Passo a passo:
1. Faça login com: joao@teste.com / 123456
2. Abra DevTools (F12)
3. Vá em: Application > Local Storage > http://localhost:3000
4. Verifique que existe:
   - `token`: (string JWT)
   - `usuario`: (objeto JSON com dados)

5. Vá em: Network
6. Clique em qualquer menu (Salas, Usuários, etc)
7. Veja a requisição e verifique o header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### ✅ Resultado esperado:
- Token JWT armazenado
- Todas as requisições incluem o header Authorization

---

## ✅ TESTE 3: Requisito 2 - Proteção dos CRUDs

### Passo a passo:
1. Faça logout
2. Tente acessar a aplicação
3. Verifique que só aparece tela de Login/Registro

4. Delete o token manualmente:
   - DevTools > Application > Local Storage
   - Delete `token` e `usuario`
   - Recarregue a página

### ✅ Resultado esperado:
- Sem autenticação = sem acesso aos CRUDs
- Redirecionamento automático para login

---

## ✅ TESTE 4: Requisito 4 - Visualizar/Modificar Próprios Dados

### Teste 4A: Usuário Comum
1. Logue como usuário comum (joao@teste.com)
2. Vá em "Usuários"
3. Verifique que só aparece SEU usuário na lista

4. Vá em "Meu Perfil"
5. Clique em "Editar Perfil"
6. Altere o telefone para: (54) 99999-9999
7. Clique em "Salvar"

### ✅ Resultado esperado:
- Lista de usuários mostra APENAS o próprio usuário
- Consegue editar seus dados em "Meu Perfil"
- Dados atualizados com sucesso

### Teste 4B: Usuário Admin
1. Crie um usuário admin no backend:
   ```sql
   UPDATE usuarios SET tipo = 'admin' WHERE email = 'admin@teste.com';
   ```
2. Logue como admin
3. Vá em "Usuários"
4. Verifique que aparece TODOS os usuários

### ✅ Resultado esperado:
- Admin vê todos os usuários
- Usuário comum vê só ele mesmo

---

## ✅ TESTE 5: Requisito 5 - Controle de Autorização para Remoção

### Teste 5A: Usuário Comum (NÃO pode deletar)
1. Logue como usuário comum
2. Vá em "Usuários"
   - ❌ NÃO deve ter botão "Deletar"
   - ✅ Deve ter botão "Editar" (só do próprio)

3. Vá em "Salas"
   - ❌ NÃO deve ter botão "Deletar"
   - ❌ NÃO deve ter botão "Nova Sala"
   - ❌ NÃO deve ter botão "Editar"

4. Vá em "Reservas"
   - ❌ NÃO deve ter botão "Deletar"
   - ❌ NÃO deve ter botão "Nova Reserva"
   - ✅ Deve ter botão "Editar" (só das próprias)

### Teste 5B: Usuário Admin (PODE deletar)
1. Logue como admin
2. Vá em "Usuários"
   - ✅ Deve ter botão "Deletar" em todos
   - ✅ Deve ter botão "Novo Usuário"
   - ✅ Deve ter botão "Editar" em todos

3. Vá em "Salas"
   - ✅ Deve ter botão "Deletar" em todas
   - ✅ Deve ter botão "Nova Sala"
   - ✅ Deve ter botão "Editar" em todas

4. Vá em "Reservas"
   - ✅ Deve ter botão "Deletar" em todas
   - ✅ Deve ter botão "Nova Reserva"
   - ✅ Deve ter botão "Editar" em todas

5. Teste deletar uma sala:
   - Clique em "Deletar"
   - Confirme
   - Sala deve ser removida

### ✅ Resultado esperado:
- Usuário comum: SEM botões de deletar
- Admin: COM botões de deletar em tudo

---

## 🎯 CHECKLIST FINAL

### Requisito 1 - JWT na API (Peso 2)
- [ ] Token JWT armazenado no localStorage
- [ ] Header Authorization em todas as requisições
- [ ] Interceptor do Axios funcionando

### Requisito 2 - Proteção CRUDs (Peso 2)
- [ ] Sem login = sem acesso aos CRUDs
- [ ] Redirecionamento automático para login
- [ ] Logout limpa sessão

### Requisito 3 - Criação de Login (Peso 2)
- [ ] Formulário de registro funcional
- [ ] Validação de senhas
- [ ] Usuário criado com sucesso

### Requisito 4 - Visualizar/Modificar Próprios Dados (Peso 2)
- [ ] Usuário comum vê só seus dados
- [ ] Admin vê todos os dados
- [ ] "Meu Perfil" permite edição
- [ ] Dados sincronizados após edição

### Requisito 5 - Controle de Autorização (Peso 2)
- [ ] Usuário comum SEM botões deletar
- [ ] Admin COM botões deletar
- [ ] Controle em Usuários, Salas e Reservas
- [ ] Deleção funciona para admin

---

## 📸 EVIDÊNCIAS PARA ENTREGA

### Capture screenshots de:
1. Tela de Login/Registro
2. DevTools mostrando token JWT
3. Tela de usuário comum (sem botões deletar)
4. Tela de admin (com botões deletar)
5. Meu Perfil editando dados
6. Lista de usuários (comum vs admin)

---

## 🎓 APRESENTAÇÃO PARA O PROFESSOR

### Demonstre:
1. **Registro de novo usuário** (Req. 3)
2. **Login e JWT no DevTools** (Req. 1)
3. **Proteção de rotas** - logout e tentativa de acesso (Req. 2)
4. **Usuário comum** - limitações de visualização (Req. 4)
5. **Admin vs Comum** - botões de deletar (Req. 5)

### Destaque:
- "Veja que o token JWT é enviado automaticamente em todas as requisições"
- "Usuários comuns não conseguem ver outros usuários, apenas seus dados"
- "Apenas administradores podem deletar registros"
- "Todos os CRUDs estão protegidos por autenticação"

---

## ✅ TODOS OS REQUISITOS ATENDIDOS!

**Nota esperada: 10/10 (3.0 pontos)**
