# 🚀 Instrucciones de Deploy - PrismaFi

## ✅ Commit realizado exitosamente

Commit hash: `d673cf1`
Mensaje: "feat: Complete PrismaFi prediction market platform with trading, market creation, and Privy wallet integration"

---

## 📦 Paso 1: Crear repositorio en GitHub

### Opción A: Desde GitHub.com (Recomendado)

1. Ve a https://github.com/new
2. Nombre del repositorio: `prismafi-prediction-market` (o el que prefieras)
3. Descripción: "PrismaFi - Decentralized Prediction Markets on Solana"
4. Visibilidad: Public o Private
5. **NO** inicialices con README, .gitignore o license
6. Click en "Create repository"

### Opción B: Desde terminal (requiere GitHub CLI)

```bash
gh repo create prismafi-prediction-market --public --source=. --remote=origin --push
```

---

## 🔗 Paso 2: Conectar repositorio local con GitHub

Una vez creado el repo en GitHub, ejecuta estos comandos en PowerShell:

```powershell
# Reemplaza con tu URL de GitHub
git remote add origin https://github.com/TU-USUARIO/prismafi-prediction-market.git

# Renombrar rama principal a main
git branch -M main

# Subir código
git push -u origin main
```

---

## 🌐 Paso 3: Deploy a Vercel

### Opción A: Desde Vercel Dashboard (Más fácil)

1. Ve a https://vercel.com/new
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `prismafi-prediction-market`
4. Framework Preset: **Next.js** (auto-detectado)
5. Root Directory: `./` (dejar por defecto)
6. Build Command: `npm run build` (auto-detectado)
7. Output Directory: `.next` (auto-detectado)
8. Install Command: `npm install --legacy-peer-deps`

### Variables de Entorno en Vercel:

Antes de deployar, agrega estas variables:

```
NEXT_PUBLIC_PRIVY_APP_ID=cmgnu14em0109ju0c6c55snav
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

9. Click en **"Deploy"**

### Opción B: Desde Terminal (con Vercel CLI)

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

Cuando pregunte por las settings:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install --legacy-peer-deps`

Luego agrega las variables de entorno:
```bash
vercel env add NEXT_PUBLIC_PRIVY_APP_ID production
# Ingresa: cmgnu14em0109ju0c6c55snav

vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
# Ingresa: devnet

vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
# Ingresa: https://api.devnet.solana.com
```

---

## ⚠️ Configuración Adicional de Privy

Una vez deployed, necesitas actualizar la configuración en Privy Dashboard:

1. Ve a https://dashboard.privy.io
2. Selecciona tu app
3. Ve a "Settings" → "Domains"
4. Agrega tu dominio de Vercel:
   - `https://tu-proyecto.vercel.app`
5. Guarda los cambios

---

## 🔄 Para futuros deploys

Cada vez que hagas cambios:

```bash
# Hacer commit
git add .
git commit -m "descripción de los cambios"
git push

# Vercel auto-deploya desde GitHub
```

O manualmente:
```bash
vercel --prod
```

---

## 📊 URLs después del deploy

- **GitHub**: `https://github.com/TU-USUARIO/prismafi-prediction-market`
- **Vercel Preview**: `https://prismafi-prediction-market-tu-usuario.vercel.app`
- **Vercel Production**: Tu dominio personalizado (si lo configuras)

---

## ✅ Checklist

- [ ] Crear repositorio en GitHub
- [ ] Conectar remote origin
- [ ] Push código a GitHub
- [ ] Deploy a Vercel
- [ ] Agregar variables de entorno
- [ ] Actualizar dominios en Privy Dashboard
- [ ] Verificar que funcione en producción
- [ ] (Opcional) Configurar dominio personalizado

---

## 🐛 Troubleshooting

### Error: "git remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/prismafi-prediction-market.git
```

### Error: "npm ERR! peer dependency" en Vercel
Asegúrate de que el Install Command sea:
```
npm install --legacy-peer-deps
```

### Error: "NEXT_PUBLIC_PRIVY_APP_ID is not set"
Verifica que las variables de entorno estén configuradas en Vercel Dashboard

---

**¿Listo para deployar?** 🚀









