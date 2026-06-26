# 🎨 Guía para Subir y Optimizar el Logo

## 📍 Ubicación del Logo

```
📂 prediction-market/public/images/
   └── predictokfun.svg  ← Reemplaza este archivo
```

---

## 🚀 Método Rápido: Subir Tu Logo

### **Opción 1: Via WSL Terminal** ⭐ Recomendado

```bash
# 1. Abre WSL terminal
cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market/public/images

# 2. Copia tu logo desde Windows
# Nota: En WSL, tu C:\ está en /mnt/c/
cp /mnt/c/Users/TU_USUARIO/Downloads/mi-logo.svg ./predictokfun.svg

# 3. Verifica que se copió
ls -lh predictokfun.svg

# 4. Commit y push
cd /home/edgadafi/cypherpunk-hackathon2025
git add prediction-market/public/images/predictokfun.svg
git commit -m "Update logo"
git push
```

### **Opción 2: Via Cursor Editor**

1. Abre Cursor
2. Navega a `prediction-market/public/images/`
3. **Click derecho** → **Reveal in File Explorer**
4. **Arrastra tu archivo** desde tu PC
5. Renombra a `predictokfun.svg` (o `.png`)
6. Git add, commit, push

### **Opción 3: Via Git Clone Local**

```bash
# Si tienes el repo clonado en Windows
cd C:\ruta\a\tu\repo\prediction-market\public\images
copy C:\mi-logo.svg predictokfun.svg
git add predictokfun.svg
git commit -m "Update logo"
git push
```

---

## 🎯 Especificaciones del Logo

### **Formato Ideal: SVG**

**Por qué SVG es mejor:**
- ✅ Escalable sin pérdida de calidad
- ✅ Tamaño pequeño (5-20KB)
- ✅ Se adapta a dark mode fácilmente
- ✅ Retina-ready automáticamente

**SVG Template Optimizado:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
  <!-- Sin width/height fijos -->
  <!-- Usa currentColor para colores dinámicos -->
  
  <g fill="currentColor">
    <!-- Tu logo aquí -->
    <path d="M10,25 L30,10 L30,40 Z"/>
  </g>
</svg>
```

**Checklist SVG:**
- [ ] Tiene `viewBox` (no width/height fijos)
- [ ] Sin estilos inline (`<style>` tags)
- [ ] Colores: `currentColor` o `#FFFFFF`
- [ ] Tamaño del archivo: < 50KB
- [ ] Optimizado con [SVGOMG](https://jakearchibald.github.io/svgomg/)

### **Formato Alternativo: PNG**

**Si prefieres PNG:**
```
Dimensiones:  400x100px (2x) o 600x150px (3x)
Fondo:        Transparente (Alpha channel)
Formato:      PNG-24 (not PNG-8)
Peso:         < 100KB
Optimizado:   via tinypng.com
```

**Colores para Dark Mode:**
- ✅ Logo blanco/claro sobre fondo oscuro
- ✅ O usa versión con outline
- ❌ Evita logo negro (invisible en dark mode)

---

## 🔧 Si el Logo se Ve Diferente

### **Problema 1: Logo se ve oscuro/opaco**

**Causa:** CSS filter o brightness

**Solución:**
```tsx
// En Header.tsx, ajusta estas clases:
className="h-10 w-auto brightness-100 hover:brightness-110"

// Opciones:
brightness-90   // Más oscuro
brightness-100  // Normal
brightness-110  // Más brillante
contrast-100    // Contraste normal
```

### **Problema 2: Logo se ve distorsionado**

**Causa:** Aspect ratio incorrecto

**Solución:**
```tsx
// Prueba diferentes tamaños:
className="h-8 w-auto"   // Pequeño (32px)
className="h-10 w-auto"  // Mediano (40px) ← Actual
className="h-12 w-auto"  // Grande (48px)
className="h-14 w-auto"  // Extra grande (56px)

// O width fijo:
className="w-32 h-auto"  // 128px width
```

### **Problema 3: Logo con fondo blanco**

**Causa:** PNG sin transparencia

**Solución:**
1. Abre tu PNG en Photoshop/GIMP
2. Borra el fondo blanco
3. Guarda como PNG-24 con Alpha
4. O usa SVG (mejor)

### **Problema 4: Colores cambiados**

**Causa:** currentColor o CSS filters

**Solución en SVG:**
```svg
<!-- En lugar de currentColor: -->
<path fill="#FFFFFF" d="..."/>  <!-- Blanco fijo -->
<path fill="#00FF00" d="..."/>  <!-- Color específico -->

<!-- O mantén currentColor para dark mode automático -->
<path fill="currentColor" d="..."/>
```

**Solución en CSS:**
```tsx
// Forzar color específico
className="text-white"  // Logo blanco
className="text-blue-500"  // Logo azul
```

---

## 🎨 Diferentes Versiones del Logo

### **Logo para Dark Mode (Recomendado)**

```bash
# Estructura:
public/images/
  ├── predictokfun.svg          ← Logo principal (blanco)
  ├── prismafi-logo-dark.svg     ← Versión para dark mode
  └── prismafi-logo-light.svg    ← Versión para light mode
```

**Implementación con dual logo:**
```tsx
// En Header.tsx
<Link href="/" className="flex items-center">
  {/* Dark mode logo */}
  <img
    src="/images/predictokfun.svg"
    alt="PredicTok.fun"
    className="h-10 w-auto dark:block hidden"
  />
  
  {/* Light mode logo (si añades light mode) */}
  <img
    src="/images/prismafi-logo-dark.svg"
    alt="PredicTok.fun"
    className="h-10 w-auto dark:hidden block"
  />
</Link>
```

---

## 📐 Tamaños Recomendados por Uso

### **Header/Navigation:**
```
Desktop:  h-10 (40px) o h-12 (48px)
Mobile:   h-8 (32px)
```

### **Landing Page Hero:**
```
Desktop:  h-20 (80px) o h-24 (96px)
Mobile:   h-12 (48px)
```

### **Favicon:**
```
Tamaño:  32x32px, 64x64px, 128x128px
Formato: ICO o PNG
```

---

## 🛠️ Herramientas de Optimización

### **Para SVG:**
1. **SVGOMG** (Online)
   - https://jakearchibald.github.io/svgomg/
   - Drag & drop tu SVG
   - Click "Download"

2. **SVGO** (CLI)
   ```bash
   npx svgo input.svg -o output.svg
   ```

### **Para PNG:**
1. **TinyPNG** (Online)
   - https://tinypng.com/
   - Reduce hasta 70% sin pérdida visible

2. **ImageOptim** (Mac)
   - Free, drag & drop

3. **Squoosh** (Online)
   - https://squoosh.app/
   - Control fino de compresión

---

## ✅ Checklist Final

Antes de subir tu logo:

- [ ] Formato correcto (SVG preferido, PNG alternativo)
- [ ] Tamaño optimizado (< 50KB para SVG, < 100KB para PNG)
- [ ] Fondo transparente (si es PNG)
- [ ] Colores apropiados para dark mode
- [ ] Aspect ratio correcto
- [ ] Probado en diferentes tamaños
- [ ] Archivo nombrado: `predictokfun.svg` o `.png`

---

## 🚀 Proceso Completo

```bash
# 1. Optimiza tu logo (SVGOMG o TinyPNG)

# 2. Sube a WSL
cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market/public/images
cp /mnt/c/ruta/a/tu/logo.svg ./predictokfun.svg

# 3. (Opcional) Ajusta Header.tsx si necesitas cambiar tamaño
# Ver: src/components/layout/Header.tsx línea 49

# 4. Commit y push
cd /home/edgadafi/cypherpunk-hackathon2025
git add prediction-market/public/images/predictokfun.svg
git commit -m "feat: Update logo design"
git push

# 5. Espera deploy de Vercel (~1-2 min)

# 6. Hard refresh en browser (Ctrl+Shift+R)
```

---

## 🎯 Ejemplo: Logo con Texto

Si tu logo tiene texto, asegúrate de:

```svg
<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon -->
  <circle cx="25" cy="25" r="20" fill="currentColor"/>
  
  <!-- Text -->
  <text x="55" y="32" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        font-weight="bold"
        fill="currentColor">
    PredicTok.fun
  </text>
</svg>
```

**O mejor, convierte el texto a paths:**
- En Illustrator: Type → Create Outlines
- En Figma: Flatten / Outline Stroke
- Esto evita problemas de fuentes

---

## 📞 Ayuda Adicional

**Si el logo sigue viéndose mal:**

1. Comparte screenshot del logo actual vs esperado
2. Comparte el archivo del logo (vía GitHub issue o comentario)
3. Dime qué parte se ve diferente:
   - ¿Colores?
   - ¿Tamaño?
   - ¿Distorsión?
   - ¿Fondo?

**Recursos:**
- SVG Tutorial: https://developer.mozilla.org/en-US/docs/Web/SVG
- PNG Optimization: https://tinypng.com/
- Dark Mode Best Practices: https://web.dev/prefers-color-scheme/

---

🎨 **¡Listo para mejorar tu logo!** Sigue los pasos y tu logo se verá perfecto en producción.

