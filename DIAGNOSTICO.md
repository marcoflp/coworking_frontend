# 🔍 GUIA DE DIAGNÓSTICO - FRONTEND vs BACKEND

## 🛠️ Como Diagnosticar Problemas

### 1. **Abrir DevTools do Navegador**
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba **Console**
- Vá para a aba **Network**

### 2. **Testar a Funcionalidade**
- Tente editar um usuário
- Observe os logs no **Console**
- Observe as requisições na aba **Network**

---

## 📊 **INTERPRETANDO OS LOGS**

### ✅ **Se aparecer no Console:**
```
🔄 Enviando dados: {nome: "João", email: "joao@test.com", telefone: "123"}
📍 URL: /usuarios/1
🔧 Método: PATCH
✅ Resposta da API: 200 {...}
```
**= PROBLEMA NO FRONTEND** (dados chegam na API mas não atualizam na tela)

### ❌ **Se aparecer no Console:**
```
🔄 Enviando dados: {nome: "João", email: "joao@test.com", telefone: "123"}
📍 URL: /usuarios/1
🔧 Método: PATCH
❌ Erro na requisição: Error...
📊 Status: 400/401/403/500
📝 Dados do erro: {...}
```
**= PROBLEMA NO BACKEND** (API retorna erro)

---

## 🌐 **VERIFICANDO NA ABA NETWORK**

### **Procure por:**
- Requisição `PATCH /usuarios/1`
- Status da resposta (200, 400, 401, 403, 500)
- Dados enviados (Request Payload)
- Dados recebidos (Response)

### **Status Codes:**
- `200` = Sucesso ✅
- `400` = Dados inválidos ❌
- `401` = Não autorizado ❌
- `403` = Sem permissão ❌
- `404` = Usuário não encontrado ❌
- `500` = Erro interno do servidor ❌

---

## 🔧 **TESTES MANUAIS**

### **Teste 1: Verificar Token**
```javascript
// No Console do navegador:
console.log('Token:', localStorage.getItem('token'));
console.log('Usuario:', JSON.parse(localStorage.getItem('usuario')));
```

### **Teste 2: Testar API Diretamente**
```javascript
// No Console do navegador:
fetch('http://localhost:4000/usuarios/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    nome: 'Teste',
    email: 'teste@test.com',
    telefone: '123456789'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Dados:', data))
.catch(error => console.error('Erro:', error));
```

---

## 🎯 **CENÁRIOS COMUNS**

### **Cenário 1: Requisição com Status 200 mas não atualiza**
- **Problema**: Frontend não recarrega os dados
- **Solução**: Verificar se `carregar()` está sendo chamado

### **Cenário 2: Status 401 (Unauthorized)**
- **Problema**: Token inválido ou expirado
- **Solução**: Fazer logout e login novamente

### **Cenário 3: Status 403 (Forbidden)**
- **Problema**: Usuário sem permissão
- **Solução**: Verificar se é admin ou se pode editar próprios dados

### **Cenário 4: Status 400 (Bad Request)**
- **Problema**: Dados inválidos enviados
- **Solução**: Verificar formato dos dados no Request Payload

### **Cenário 5: Status 500 (Internal Server Error)**
- **Problema**: Erro no backend
- **Solução**: Verificar logs do servidor backend

---

## 🚨 **CHECKLIST DE DIAGNÓSTICO**

### **Frontend:**
- [ ] Logs aparecem no console?
- [ ] Dados corretos sendo enviados?
- [ ] Token presente no header?
- [ ] Função `carregar()` é chamada após sucesso?

### **Backend:**
- [ ] Servidor está rodando?
- [ ] Endpoint `/usuarios/:id` existe?
- [ ] Método PATCH está implementado?
- [ ] Validação de token funciona?
- [ ] Permissões estão corretas?

### **Network:**
- [ ] Requisição aparece na aba Network?
- [ ] Status code da resposta?
- [ ] Headers corretos?
- [ ] Payload correto?

---

## 🔍 **PRÓXIMOS PASSOS**

1. **Execute o teste** e observe os logs
2. **Identifique** se é frontend ou backend
3. **Se for frontend**: Verifique se `carregar()` funciona
4. **Se for backend**: Verifique logs do servidor
5. **Remova os logs** após resolver o problema

---

**💡 Dica**: Sempre teste primeiro com um usuário admin para descartar problemas de permissão!