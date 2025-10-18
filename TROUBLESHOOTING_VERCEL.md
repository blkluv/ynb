# 🔧 TROUBLESHOOTING VERCEL - GUÍA VISUAL

## 🎯 DIAGRAMA DE FLUJO DE SOLUCIÓN:

```
¿Tienes "Application error"?
    │
    ├─→ SÍ ─→ ¿Hiciste commit de los fixes?
    │         │
    │         ├─→ NO ─→ Ejecuta: git add . && git commit -m "fix" && git push
    │         │
    │         └─→ SÍ ─→ ¿Configuraste variables en Vercel?
    │                   │
    │                   ├─→ NO ─→ Settings → Environment Variables → Agregar
    │                   │
    │                   └─→ SÍ ─→ ¿Root Directory = "prediction-market"?
    │                             │
    │                             ├─→ NO ─→ Settings → General → Edit Root Directory
    │                             │
    │                             └─→ SÍ ─→ Re-deploy forzado → vercel --prod --force
    │
    └─→ NO ─→ ¡Genial! Continúa con el desarrollo
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES:

### ERROR 1: "Application error: a client-side exception has occurred"

**Síntomas:**

- Página blanca con error genérico
- Consola del navegador muestra errores de React

**Causas posibles:**

| Causa                     | Cómo verificar                          | Solución                           |
| ------------------------- | --------------------------------------- | ---------------------------------- |
| Turbopack en build        | `package.json` tiene `--turbopack`      | Remover flag (✅ ya corregido)     |
| PrivyProvider sin appId   | Vercel → Settings → Env Variables vacío | Agregar `NEXT_PUBLIC_PRIVY_APP_ID` |
| Root directory incorrecto | Vercel → Settings → General             | Cambiar a `prediction-market`      |

**Solución rápida:**

```bash
# 1. Verificar que los fixes estén aplicados:
git log --oneline -1  # Debe mostrar "fix: remove turbopack..."

# 2. Verificar variables en Vercel:
vercel env ls

# 3. Re-deploy:
vercel --prod --force
```

---

### ERROR 2: "Module not found" o "Cannot find module"

**Síntomas:**

- Build falla en Vercel
- Error de módulo no encontrado

**Causa:**

- Cache de node_modules corrupto

**Solución:**

```bash
# En Vercel Dashboard:
# Deployments → ... → Redeploy → Uncheck "Use existing Build Cache"

# O desde terminal:
vercel --prod --force
```

---

### ERROR 3: "404 - This page could not be found"

**Síntomas:**

- Deploy exitoso pero muestra 404
- Assets no se cargan

**Causa:**

- Root directory incorrecto

**Solución:**

1. Ve a: Vercel → Settings → General
2. Busca "Root Directory"
3. Click "Edit"
4. Escribe: `prediction-market`
5. Marca "Override"
6. Click "Save"
7. Re-deploy

---

### ERROR 4: "NEXT_PUBLIC_PRIVY_APP_ID is not defined"

**Síntomas:**

- Consola del navegador muestra warning
- Botón de wallet no funciona

**Causa:**

- Variable de entorno no configurada

**Solución:**

1. Ve a: Vercel → Settings → Environment Variables
2. Click "Add New"
3. Name: `NEXT_PUBLIC_PRIVY_APP_ID`
4. Value: `clzmzasg80013jxlxmvimrjmo`
5. Environment: Marca Production, Preview, Development
6. Click "Save"
7. Re-deploy

---

### ERROR 5: "Build exceeded maximum duration"

**Síntomas:**

- Build toma más de 45 segundos y falla

**Causa:**

- Turbopack o proceso pesado

**Solución:**
✅ Ya corregido al remover `--turbopack`

Si persiste:

```json
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
};
```

---

## 🔍 CÓMO LEER LOS LOGS DE VERCEL:

### Logs de Build:

```
✅ EXITOSO:
> Build completed in 32s
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

❌ ERROR:
> Build failed with error code 1
✗ Error: Cannot find module 'X'
```

### Logs de Runtime (Function Logs):

```
✅ NORMAL:
[GET] / - 200 in 234ms
[GET] /images/prismafi-logo.svg - 200 in 12ms

❌ ERROR:
[GET] / - 500 in 1234ms
Error: NEXT_PUBLIC_PRIVY_APP_ID is not defined
```

---

## 📸 SCREENSHOTS DE CONFIGURACIÓN CORRECTA:

### 1. Environment Variables:

```
NEXT_PUBLIC_PRIVY_APP_ID
  Value: clz••••••mo (oculto)
  Environments: Production ✓ Preview ✓ Development ✓

NEXT_PUBLIC_SOLANA_RPC_URL
  Value: https://api.devnet.solana.com
  Environments: Production ✓ Preview ✓ Development ✓
```

### 2. General Settings:

```
Root Directory: prediction-market ✓
Build Command: (Auto-detected)
Output Directory: (Auto-detected)
Install Command: (Auto-detected)
```

### 3. Build Settings (from vercel.json):

```json
{
  "buildCommand": "cd prediction-market && npm run build",
  "outputDirectory": "prediction-market/.next",
  "installCommand": "cd prediction-market && npm install --legacy-peer-deps"
}
```

---

## 🧪 COMANDOS DE DIAGNÓSTICO:

### Verificar variables de entorno:

```bash
vercel env ls
# Debe mostrar: NEXT_PUBLIC_PRIVY_APP_ID y NEXT_PUBLIC_SOLANA_RPC_URL
```

### Ver logs del último deploy:

```bash
vercel logs
```

### Verificar configuración del proyecto:

```bash
vercel inspect
```

### Build local (para debugging):

```bash
cd prediction-market
npm run build 2>&1 | tee build-log.txt
```

---

## 💡 TIPS PRO:

### 1. Deploy Preview para Testing:

```bash
# Hacer deploy de una rama sin afectar producción:
git checkout -b test-fix
git push origin test-fix
# Vercel automáticamente crea un preview URL
```

### 2. Variables de entorno por Environment:

- **Development:** Para testing local
- **Preview:** Para ramas feature/PRs
- **Production:** Para main branch

### 3. Rollback rápido:

Si un deploy rompe todo:

1. Ve a Deployments
2. Encuentra el último deploy funcional
3. Click "..." → "Promote to Production"

### 4. Monitor de Performance:

Vercel Analytics te muestra:

- Tiempo de carga
- Errores en runtime
- Visitas y geografía

---

## 🆘 ÚLTIMO RECURSO:

Si nada de lo anterior funciona:

### Opción 1: Re-import del proyecto

1. Elimina el proyecto en Vercel
2. Re-importa desde GitHub
3. Configura Root Directory: `prediction-market`
4. Agrega variables de entorno
5. Deploy

### Opción 2: Usar Vercel CLI

```bash
# Desde prediction-market/:
cd prediction-market
vercel link
vercel env add NEXT_PUBLIC_PRIVY_APP_ID production
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
vercel --prod
```

### Opción 3: Verificar localmente primero

```bash
# Simula el build de Vercel:
cd prediction-market
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
npm start
```

---

## 📞 CHECKLIST FINAL ANTES DE PEDIR AYUDA:

Si después de TODOS estos pasos sigue fallando, recopila:

- [ ] Screenshot del error en el navegador (con consola F12 abierta)
- [ ] Logs completos del build en Vercel
- [ ] Screenshot de Environment Variables configuradas
- [ ] Screenshot de Root Directory setting
- [ ] Resultado de `git log --oneline -5`
- [ ] Resultado de `vercel env ls`

---

## 🎯 RESUMEN DE 3 COMANDOS MÁGICOS:

```bash
# 1. Push de los fixes
git add . && git commit -m "fix: vercel production fixes" && git push

# 2. Configurar variables (hacer en Vercel Dashboard manualmente)
#    NEXT_PUBLIC_PRIVY_APP_ID = clzmzasg80013jxlxmvimrjmo
#    NEXT_PUBLIC_SOLANA_RPC_URL = https://api.devnet.solana.com

# 3. Re-deploy forzado
vercel --prod --force
```

---

**Última actualización:** ${new Date().toLocaleString('es-ES')}
**Nivel de complejidad:** 🟢 Básico - Seguir paso a paso
