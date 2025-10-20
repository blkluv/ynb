# 🎯 GUÍA PASO A PASO: CONFIGURACIÓN VERCEL

## 🚀 FIXES APLICADOS EN EL CÓDIGO:

✅ **1. Removido `--turbopack` del build** (causaba errores en producción)
✅ **2. Agregado fallback en PrivyProvider** (previene crashes)
✅ **3. Actualizado `vercel.json`** (apunta al directorio correcto)

---

## 📋 AHORA SIGUE ESTOS PASOS EN VERCEL:

### PASO 1️⃣: HACER COMMIT Y PUSH

```bash
# Desde la raíz del proyecto:
git add .
git commit -m "fix: remove turbopack and add production fixes for Vercel"
git push origin main
```

---

### PASO 2️⃣: CONFIGURAR VARIABLES DE ENTORNO EN VERCEL

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **PrismaFi**
3. Click en **Settings** (barra superior)
4. En el menú lateral, click en **Environment Variables**
5. Agrega estas 2 variables:

**Variable 1:**

```
Name: NEXT_PUBLIC_PRIVY_APP_ID
Value: clzmzasg80013jxlxmvimrjmo
Environment: Production, Preview, Development (marca las 3)
```

**Variable 2:**

```
Name: NEXT_PUBLIC_SOLANA_RPC_URL
Value: https://api.devnet.solana.com
Environment: Production, Preview, Development (marca las 3)
```

6. Click **Save** en cada una

---

### PASO 3️⃣: VERIFICAR ROOT DIRECTORY (IMPORTANTE)

1. Desde **Settings** → **General**
2. Busca la sección **Root Directory**
3. Verifica que diga: `prediction-market`
4. Si no está configurado:
   - Click **Edit**
   - Escribe: `prediction-market`
   - Marca **Override**
   - Click **Save**

---

### PASO 4️⃣: RE-DEPLOY MANUAL

**OPCIÓN A: Desde el Dashboard**

1. Ve a la pestaña **Deployments**
2. Click en los 3 puntos del último deployment
3. Click **Redeploy**
4. Selecciona **Use existing Build Cache: NO**
5. Click **Redeploy**

**OPCIÓN B: Desde tu terminal (más rápido)**

```bash
# Instala Vercel CLI si no lo tienes:
npm i -g vercel

# Desde la raíz del proyecto:
vercel --prod --force
```

---

### PASO 5️⃣: MONITOREAR EL BUILD

1. Ve a **Deployments**
2. Click en el deployment en progreso
3. Ve a la pestaña **Building** o **Logs**
4. Espera a que termine (1-3 minutos)

**Busca estos mensajes:**

```
✅ Collecting page data
✅ Generating static pages
✅ Finalizing page optimization
✅ Build successful
```

---

### PASO 6️⃣: VERIFICAR EL DEPLOY

1. Una vez completado, click en **Visit**
2. Deberías ver tu landing page:
   - Logo de PrismaFi ✅
   - "Generate your Prediction Market in 3 steps" ✅
   - Botones "Explore Markets" y "View Demo" ✅
   - Sin error de "Application error" ✅

---

## 🔍 SI AÚN HAY ERRORES:

### Error: "Application error: a client-side exception has occurred"

**Solución:**

1. Abre la consola del navegador (F12)
2. Copia el error completo
3. Ve a Vercel → Deployments → Tu deploy → Function Logs
4. Busca el error ahí también

**Errores comunes:**

| Error                         | Causa                          | Solución                |
| ----------------------------- | ------------------------------ | ----------------------- |
| `PRIVY_APP_ID is not defined` | Variable no configurada        | Paso 2 arriba           |
| `Module not found`            | Build cache corrupto           | Re-deploy con `--force` |
| `404 on static files`         | Root directory mal configurado | Paso 3 arriba           |

---

## 🧪 VERIFICACIÓN LOCAL (OPCIONAL):

Antes de hacer push, puedes probar localmente:

```bash
cd prediction-market

# Instalar dependencias:
npm install --legacy-peer-deps

# Crear .env.local:
echo "NEXT_PUBLIC_PRIVY_APP_ID=clzmzasg80013jxlxmvimrjmo" > .env.local
echo "NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com" >> .env.local

# Build:
npm run build

# Si el build es exitoso, ejecuta:
npm start

# Abre: http://localhost:3000
```

Si funciona localmente, funcionará en Vercel ✅

---

## 📊 CHECKLIST FINAL:

- [ ] Commit y push de los cambios
- [ ] Variables de entorno configuradas en Vercel
- [ ] Root directory = `prediction-market`
- [ ] Re-deploy forzado (sin cache)
- [ ] Build exitoso (sin errores rojos)
- [ ] Landing page visible sin "Application error"
- [ ] Consola del navegador sin errores críticos

---

## 🎉 CUANDO ESTÉ TODO FUNCIONANDO:

Tu sitio debería estar live en:

```
https://tu-proyecto.vercel.app
```

**Funcionalidades actuales:**

- ✅ Landing page completamente funcional
- ✅ Responsive design
- ✅ Header con navegación
- ⏳ Wallet connection (requiere configurar Privy)
- ⏳ Páginas internas (/markets, /portfolio, etc.) - por desarrollar

---

## 📞 SOPORTE:

Si después de seguir TODOS los pasos sigue habiendo errores:

1. **Captura de pantalla del error en el navegador**
2. **Logs del build en Vercel** (Deployments → Build Logs)
3. **Variables de entorno configuradas** (Settings → Environment Variables)
4. **Root Directory configurado** (Settings → General)

Comparte esos 4 elementos para diagnóstico.

---

**Creado:** ${new Date().toLocaleString('es-ES')}
**Versión:** 1.0.0
**Última actualización:** Fixes aplicados para producción



