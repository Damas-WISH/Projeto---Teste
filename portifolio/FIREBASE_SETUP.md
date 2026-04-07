# Configuração Firebase + Deploy Automático

Este guia explica como publicar o projeto no Firebase Hosting e configurar deploy automático via GitHub Actions usando o projeto Firebase atual.

## 📋 Pré-requisitos

- Node.js 22.12.0+
- Conta Firebase (https://firebase.google.com)
- Repositório GitHub
- Firebase CLI instalado globalmente

## 🚀 Passo 1: Confirmar o Projeto Firebase

Projeto configurado atualmente:

```text
projeto--teste-21287
```

Se você quiser continuar usando apenas esse projeto, não precisa criar um segundo ambiente agora.

## 🔑 Passo 2: Obter Credenciais Firebase

### Para o projeto atual:
1. No Firebase Console, selecione `projeto--teste-21287`
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

## 🔐 Passo 3: Configurar Variáveis Localmente

1. Crie `.env.dev` a partir de `.env.example`:
```bash
cp .env.example .env.dev
```

2. Edite `.env.dev` com as credenciais do projeto atual

⚠️ **Nunca comite estes arquivos!** (já estão no .gitignore)

## 🔑 Passo 4: Configurar GitHub Actions Secrets

1. Vá para seu repositório GitHub
2. Settings > Secrets and variables > Actions
3. Adicione o seguinte secret:

### Secret para deploy do Hosting:
```
FIREBASE_SERVICE_ACCOUNT
```

Esse secret deve guardar o JSON completo da service account com permissão de deploy no Firebase Hosting.

### Como gerar as service accounts
O caminho oficial do Firebase para isso e para os workflows do GitHub é:
```bash
firebase init hosting:github
```

Se preferir manter os workflows já criados no repositório, crie as credenciais manualmente:
1. Firebase Console > Projeto > Configurações > Contas de serviço
2. Gere uma chave privada JSON para o projeto atual
3. Salve o conteúdo JSON no secret `FIREBASE_SERVICE_ACCOUNT`

## 🌳 Passo 5: Configurar Branches

Você só precisa da branch:
- `main` → Deploy live automático

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

Usa `.env.dev` automaticamente via `--mode dev`.

### Build Local:
```bash
npm run build
```

Se quiser manter só um ambiente, use `npm run build:dev` como referência do que vai para o ar.

### Publicar no Firebase Hosting:
1. Faça login no Firebase CLI:
```bash
firebase login
```

2. Crie `.firebaserc` com base em `.firebaserc.example` e coloque os IDs reais dos seus projetos.

3. Vincule o projeto local:
```bash
firebase use live
```

4. Faça o deploy:
```bash
npm run deploy
```

### Deploy Manual:

**Live:**
```bash
npm run deploy
```

## ⚙️ Deploy Automático

Os workflows já preparados neste repositório fazem o seguinte:
- Pull Request: cria preview temporário no Firebase Hosting
- Push em `main`: publica no Hosting live
- `workflow_dispatch`: permite rodar manualmente pelo GitHub Actions

### Quando você faz push:

1. **Push para `main`** → Deploy automático no site live
2. **Pull Request** → Preview automático para validação

O GitHub Actions:
1. ✅ Instala dependências
2. ✅ Faz o build do projeto
3. ✅ Publica no Firebase Hosting
4. ✅ Faz deploy no Firebase

## 📊 Verificar Deploy

Após o push, verifique:
1. GitHub Actions: Abra seu repositório > Actions
2. Firebase Console: Verifique o Hosting

## 🆘 Troubleshooting

### "Secret FIREBASE_SERVICE_ACCOUNT não encontrado"
- Confirme que o secret `FIREBASE_SERVICE_ACCOUNT` existe no GitHub
- Verifique se o valor salvo é o JSON completo da service account

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

- [ ] Projeto Firebase configurado
- [ ] Credenciais adicionadas em `.env.dev`
- [ ] Secret `FIREBASE_SERVICE_ACCOUNT` adicionado no GitHub
- [ ] Branch `main` publicada no GitHub
- [ ] Primeiro push para testar o workflow

## 🎓 Info Adicional

- **Status do Deploy**: https://console.firebase.google.com > seu-projeto > Hosting
- **Logs do GitHub Actions**: Repositório > Actions > Deploy workflow
- **Documentação Firebase Hosting**: https://firebase.google.com/docs/hosting
- **Documentação Astro**: https://docs.astro.build

