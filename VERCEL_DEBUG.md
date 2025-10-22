# 🔍 Guía de Debugging para Vercel

## 📋 **Cómo Ver el Error Completo**

### En Vercel Dashboard:

1. **Abre**: https://vercel.com/edgadafis-projects/cypherpunk-hackathon2025
2. **Click** en el deployment más reciente (el primero de la lista)
3. **Click** en la pestaña **"Building"** o **"Logs"**
4. **Copia TODO el texto** que aparece

---

## 🚨 **Errores Comunes y Soluciones**

### Error 1: "Module not found"

```
Could not find a production build in the '.next' directory
```

**Solución**: El build path está mal configurado.

### Error 2: "npm ERR! peer dependency"

```
ERESOLVE unable to resolve dependency tree
```

**Solución**: Ya estamos usando `--legacy-peer-deps`.

### Error 3: "No framework detected"

```
Error: No framework detected in your project
```

**Solución**: Vercel no detecta el Next.js en el subdirectorio.

### Error 4: "Environment variable missing"

```
Missing required environment variable
```

**Solución**: Necesitas configurar variables de entorno en Vercel.

---

## 🔧 **Soluciones a Probar**

### Opción A: Cambiar Root Directory en Vercel (RECOMENDADO)

En lugar de usar `vercel.json`, configura directamente en Vercel:

1. **Ve a**: Settings → General
2. **Root Directory**: Cambia a `prediction-market`
3. **Framework Preset**: Next.js
4. **Node Version**: 18.x o 20.x
5. **Install Command**: `npm install --legacy-peer-deps`
6. **Build Command**: `npm run build`
7. **Output Directory**: `.next`

### Opción B: Usar vercel-simple.json

```bash
mv vercel.json vercel-backup.json
mv vercel-simple.json vercel.json
git add vercel.json
git commit -m "fix: Simplify Vercel configuration"
git push origin main
```

### Opción C: Deploy solo prediction-market/

Crear un **nuevo proyecto en Vercel** solo con el subdirectorio:

1. En Vercel: **Add New Project**
2. **Import** desde GitHub
3. Selecciona el repositorio
4. En **Root Directory**: Escribe `prediction-market`
5. **Deploy**

---

## 📝 **Variables de Entorno Necesarias**

Si el error menciona variables de entorno, agrega estas en Vercel:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

En Vercel:

1. **Settings** → **Environment Variables**
2. **Add** cada variable
3. **Save**
4. **Redeploy**

---

## 🆘 **Qué Información Necesito**

Para ayudarte mejor, comparte:

1. **El log completo** del build en Vercel
2. **La primera línea con "Error:"** que veas
3. **Screenshot** si es posible

---

## 🎯 **Próximo Paso**

**AHORA**: Abre el deployment en Vercel, copia el error completo, y compártelo aquí.
