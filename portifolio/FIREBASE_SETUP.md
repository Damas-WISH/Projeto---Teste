# Configuração Firebase + Deploy Automático

Este guia explica como configurar o Firebase com ambientes dev e prod, além do deploy automático via GitHub Actions.

## 📋 Pré-requisitos

- Node.js 22.12.0+
- Conta Firebase (https://firebase.google.com)
- Repositório GitHub
- Firebase CLI instalado globalmente

## 🚀 Passo 1: Criar Projetos no Firebase

### Criar projeto DEV:
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome: `seu-portfolio-dev`
4. Siga os passos
5. Habilite Hosting, Firestore, Authentication, Storage (se necessário)

### Criar projeto PROD:
1. Repita o processo acima
2. Nome: `seu-portfolio-prod`

## 🔑 Passo 2: Obter Credenciais Firebase

### Para DEV:
1. No Firebase Console, selecione `seu-portfolio-dev`
2. Clique em ⚙️ > Configurações do projeto
3. Na aba "Contas de serviço", clique em "SDK do Firebase para JavaScript"
4. Copie as credenciais (apiKey, authDomain, etc.)

```javascript
{
  "apiKey": "seu_dev_api_key",
  "authDomain": "seu-portfolio-dev.firebaseapp.com",
  "projectId": "seu-portfolio-dev",
  "storageBucket": "seu-portfolio-dev.appspot.com",
  "messagingSenderId": "seu_dev_sender_id",
  "appId": "seu_dev_app_id",
  "measurementId": "seu_dev_measurement_id"
}
```

### Para PROD:
Repita o processo para o projeto de produção.

## 🔐 Passo 3: Configurar Variáveis Localmente

1. Copie `.env.example` para `.env.dev` e `.env.prod`:
```bash
cp .env.example .env.dev
cp .env.example .env.prod
```

2. Edite `.env.dev` com as credenciais DEV
3. Edite `.env.prod` com as credenciais PROD

⚠️ **Nunca comite estes arquivos!** (já estão no .gitignore)

## 🔑 Passo 4: Configurar GitHub Actions Secrets

1. Vá para seu repositório GitHub
2. Settings > Secrets and variables > Actions
3. Adicione os seguintes secrets:

### DEV Secrets:
```
DEV_FIREBASE_API_KEY
DEV_FIREBASE_AUTH_DOMAIN
DEV_FIREBASE_PROJECT_ID
DEV_FIREBASE_STORAGE_BUCKET
DEV_FIREBASE_MESSAGING_SENDER_ID
DEV_FIREBASE_APP_ID
DEV_FIREBASE_MEASUREMENT_ID
```

### PROD Secrets:
```
PROD_FIREBASE_API_KEY
PROD_FIREBASE_AUTH_DOMAIN
PROD_FIREBASE_PROJECT_ID
PROD_FIREBASE_STORAGE_BUCKET
PROD_FIREBASE_MESSAGING_SENDER_ID
PROD_FIREBASE_APP_ID
PROD_FIREBASE_MEASUREMENT_ID
```

### Firebase Token:
1. Execute localmente:
```bash
firebase login:ci
```
2. Copie o token gerado
3. Adicione como secret `FIREBASE_TOKEN` no GitHub

## 🌳 Passo 5: Configurar Branches

Você deve ter ou criar:
- `main` → Deploy em PROD
- `develop` → Deploy em DEV

## 📦 Passo 6: Instalar Dependências

```bash
cd portifolio
npm install
```

## 🏗️ Passo 7: Inicializar Firebase Localmente (Opcional)

```bash
cd portifolio
firebase login
firebase init
# Selecione: Hosting, Firestore (se quiser), Storage (se quiser)
# Use as configurações existentes no firebase.json
```

## 🎯 Como Usar

### Desenvolvimento Local:
```bash
npm run dev
```

Uses .env.dev automaticamente (configure em astro.config ou em suas variáveis).

### Build Local:
```bash
npm run build
```

### Deploy Manual:

**Dev:**
```bash
npm run deploy:dev
```

**Prod:**
```bash
npm run deploy:prod
```

## ⚙️ Deploy Automático

### Quando você faz push:

1. **Push para `develop`** → Deploy automático em DEV
2. **Push para `main`** → Deploy automático em PROD

O GitHub Actions:
1. ✅ Instala dependências
2. ✅ Carrega as variáveis de ambiente corretas
3. ✅ Faz o build do projeto
4. ✅ Faz deploy no Firebase

## 📊 Verificar Deploy

Após o push, verifique:
1. GitHub Actions: Abra seu repositório > Actions
2. Firebase Console: Verifique o Hosting

## 🆘 Troubleshooting

### "Firebase Token não encontrado"
```bash
firebase login:ci
# Copie o token e adicione como FIREBASE_TOKEN secret
```

### "Projeto não encontrado"
- Verifique se o Project ID está correto nos secrets
- Confirme que o projeto existe no Firebase Console

### "Build falhou"
```bash
cd portifolio
npm install
npm run build
```

### Variáveis de ambiente não carregando
- Confirme que os secrets estão bem nomeados no GitHub
- Verifique que o workflow tem acesso aos secrets

## 📋 Checklist Final

- [ ] Conta Firebase criada e dois projetos configurados
- [ ] Credenciais adicionadas em `.env.dev` e `.env.prod`
- [ ] Todos os secrets adicionados no GitHub
- [ ] Firebase Token configurado
- [ ] Branch `develop` criado
- [ ] Repository > Settings > deployment branches configurado
- [ ] Primeiro push para testar o workflow

## 🎓 Info Adicional

- **Status do Deploy**: https://console.firebase.google.com > seu-projeto > Hosting
- **Logs do GitHub Actions**: Repositório > Actions > Deploy workflow
- **Documentação Firebase Hosting**: https://firebase.google.com/docs/hosting
- **Documentação Astro**: https://docs.astro.build

