# 🚀 Deploy PrismaFi to Vercel

## 📋 Pre-requisitos

- ✅ Build exitoso (`npm run build` ✓)
- ✅ Git repository inicializado
- ✅ Cuenta en Vercel (gratis)
- ✅ GitHub/GitLab/Bitbucket account (para conectar repo)

---

## 🎯 Método 1: Deploy Directo con Vercel CLI (Más Rápido)

### **Paso 1: Instalar Vercel CLI**

```powershell
npm install -g vercel
```

### **Paso 2: Login en Vercel**

```powershell
vercel login
```

Esto abrirá tu navegador para autenticarte.

### **Paso 3: Deploy**

Desde el directorio del proyecto:

```powershell
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"
vercel
```

**Responde las preguntas:**
- Set up and deploy? → **Y** (Yes)
- Which scope? → Selecciona tu cuenta
- Link to existing project? → **N** (No)
- What's your project's name? → **prismafi** (o el que prefieras)
- In which directory is your code located? → `.` (presiona Enter)
- Want to override settings? → **N** (No)

### **Paso 4: Deploy a Producción**

```powershell
vercel --prod
```

**¡Listo!** Tu sitio estará en: `https://prismafi.vercel.app` (o el nombre que elegiste)

---

## 🎯 Método 2: Deploy con GitHub + Vercel Dashboard (Recomendado)

### **Paso 1: Crear Repositorio en GitHub**

1. Ve a https://github.com/new
2. Nombre del repo: **prismafi**
3. Descripción: "PrismaFi - AI-powered Prediction Markets on Solana"
4. Visibilidad: **Public** o **Private**
5. Click "Create repository"

### **Paso 2: Conectar Repo Local con GitHub**

```powershell
# En el directorio del proyecto
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: PrismaFi landing page"

# Agregar remote (reemplaza 'tu-usuario' con tu username de GitHub)
git remote add origin https://github.com/tu-usuario/prismafi.git

# Push a GitHub
git branch -M main
git push -u origin main
```

### **Paso 3: Deploy desde Vercel Dashboard**

1. Ve a https://vercel.com/new
2. Click "Import Git Repository"
3. Autoriza acceso a GitHub
4. Selecciona el repo **prismafi**
5. Configuración:
   - **Framework Preset**: Next.js (auto-detectado)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detectado)
   - **Output Directory**: `.next` (auto-detectado)
6. Click "Deploy"

**¡Espera 2-3 minutos y listo!** 🎉

---

## 🔧 Configuración Adicional (Opcional)

### **Variables de Entorno**

Si necesitas agregar env vars en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las variables necesarias:
   - `NEXT_PUBLIC_SOLANA_RPC_URL`
   - `NEXT_PUBLIC_NETWORK` (mainnet-beta, devnet, testnet)

### **Dominios Personalizados**

1. Ve a Settings → Domains
2. Agrega tu dominio: `prismafi.com`
3. Sigue las instrucciones de DNS

---

## 🌐 URLs de Vercel

Después del deploy tendrás:

- **Production URL**: `https://prismafi.vercel.app`
- **Preview URLs**: Cada push genera una URL de preview
- **Domain personalizado**: Configurable en Settings

---

## 🔄 Actualizaciones Automáticas

Una vez conectado a GitHub:

1. **Cada push a `main`** → Deploy automático a producción
2. **Cada PR** → Deploy de preview automático
3. **Rollback fácil** → Click en versión anterior

---

## ✅ Checklist de Pre-Deploy

- [x] `npm run build` exitoso
- [x] No hay errores de ESLint
- [x] TypeScript sin errores
- [x] Git repository inicializado
- [ ] Código en GitHub/GitLab
- [ ] Cuenta en Vercel creada
- [ ] Deploy completado

---

## 🆘 Troubleshooting

### **Error: Build Failed**

```powershell
# Limpiar caché y rebuild
rm -r .next
npm run build
```

### **Error: Git Push Failed**

```powershell
# Verificar remote
git remote -v

# Forzar push (solo si es necesario)
git push -u origin main --force
```

### **Error: Vercel CLI no reconocido**

```powershell
# Reinstalar globalmente
npm install -g vercel

# Verificar instalación
vercel --version
```

---

## 📸 Preview de lo que se desplegará

Tu landing page incluye:

- ✅ Hero Section con PrismaFi branding
- ✅ Benefits con AI messaging
- ✅ How It Works con 3 steps
- ✅ Responsive design (mobile + desktop)
- ✅ Animaciones suaves
- ✅ Dark theme
- ✅ SEO optimizado

---

## 🚀 Comandos Rápidos

```powershell
# Deploy instantáneo con Vercel CLI
vercel --prod

# Ver deploys
vercel ls

# Ver logs
vercel logs

# Abrir dashboard
vercel open
```

---

**¿Listo para desplegar?** Elige el método que prefieras y sigue los pasos. ¡Tu landing page estará en vivo en minutos! 🌟






























