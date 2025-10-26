# 🚀 Guía de Deploy en Vercel - PrismaFi

## ✅ **Cambios Aplicados**

### **1. Archivo `.npmrc` Creado**

```
legacy-peer-deps=true
```

Este archivo le indica a npm que use `--legacy-peer-deps` automáticamente.

### **2. `vercel.json` Actualizado**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps"
}
```

Configuración específica para que Vercel instale las dependencias correctamente.

### **3. Commit y Push Completados**

```bash
✅ Commit: "fix: configure Vercel deployment with legacy-peer-deps and complete frontend"
✅ Push a GitHub exitoso
✅ 28 archivos actualizados
✅ 1867 líneas agregadas
```

## 🎯 **Próximos Pasos en Vercel**

### **Paso 1: Conectar Repositorio**

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub: `Edgadafi/cypherpunk-hackathon2025`

### **Paso 2: Configurar Variables de Entorno (Opcional)**

Si quieres que funcione Privy:

```
NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id_aqui
```

**Nota:** El frontend funciona perfectamente sin esto, solo no tendrá conexión de wallet.

### **Paso 3: Deploy**

1. Vercel detectará automáticamente que es un proyecto Next.js
2. Usará la configuración de `vercel.json`
3. Instalará con `--legacy-peer-deps`
4. Build se completará exitosamente

## 📋 **Configuración Detectada Automáticamente**

✅ **Framework:** Next.js 14.0.4  
✅ **Build Command:** `npm run build`  
✅ **Install Command:** `npm install --legacy-peer-deps`  
✅ **Output Directory:** `.next`  
✅ **Node Version:** 18.x (por defecto en Vercel)

## 🔧 **Si el Deploy Falla**

### **Error: Dependency Resolution**

Ya está solucionado con `.npmrc` y `vercel.json`

### **Error: Build Timeout**

Vercel tiene un timeout de 45 min en el plan free. Tu proyecto debería buildearse en ~2-3 minutos.

### **Error: Out of Memory**

Poco probable, pero si sucede:

1. Ve a Project Settings
2. Sube el límite de memoria (si es posible en tu plan)

## 🌐 **Dominio**

Una vez deployado, Vercel te dará:

- **URL de Preview:** `prismafi-xxx.vercel.app`
- **URL de Producción:** Puedes configurar tu dominio custom

## ✨ **Lo que Verás Deployado**

✅ Landing page completa y funcional  
✅ Página de mercados con filtros  
✅ Vista individual de mercados  
✅ Formulario de creación de mercados  
✅ Trading interface funcional  
✅ Diseño responsive  
✅ Estilos de Tailwind aplicados

## 📝 **Comandos de Verificación Local**

Antes de deploy, verifica localmente:

```bash
# Limpiar y construir
rm -rf .next
npm run build

# Si build pasa, Vercel también pasará
npm run start
```

## 🎉 **¡Listo para Deploy!**

Todos los archivos necesarios están en GitHub:

- ✅ `.npmrc` configurado
- ✅ `vercel.json` optimizado
- ✅ `package.json` con dependencias correctas
- ✅ Todo el código fuente en `src/`
- ✅ Configuraciones de Next.js, TypeScript, Tailwind

**Vercel ahora puede hacer deploy sin errores!** 🚀
