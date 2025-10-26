# 🔧 FIX: Error SSL al instalar Solana CLI

## ❌ **ERROR:**

```
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to release.solana.com:443
```

Este error aparece por problemas de SSL/certificados en WSL.

---

## ✅ **SOLUCIÓN 1: Instalar con wget** (MÁS SIMPLE)

En WSL, prueba con `wget` en lugar de `curl`:

```bash
wget -O- https://release.solana.com/v1.18.0/install | sh
```

Si funciona, continúa con:

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
```

Verifica:

```bash
solana --version
```

✅ Si funciona → Continúa con PASO 3 de la guía principal

---

## ✅ **SOLUCIÓN 2: Usar versión más reciente**

A veces las versiones más recientes funcionan mejor:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

O con wget:

```bash
wget -O- https://release.solana.com/stable/install | sh
```

---

## ✅ **SOLUCIÓN 3: Curl con opción insecure** (TEMPORAL)

**⚠️ Solo para desarrollo local:**

```bash
sh -c "$(curl -sSfLk https://release.solana.com/v1.18.0/install)"
```

La opción `-k` permite conexiones inseguras temporalmente.

---

## ✅ **SOLUCIÓN 4: Actualizar certificados SSL**

```bash
# Actualizar paquetes
sudo apt-get update

# Instalar/actualizar certificados
sudo apt-get install -y ca-certificates

# Reintentar instalación
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

---

## ✅ **SOLUCIÓN 5: Instalar vía Cargo** (MÁS CONFIABLE)

Si tienes Rust/Cargo instalado:

```bash
cargo install solana-cli
```

Luego verifica:

```bash
solana --version
```

---

## ✅ **SOLUCIÓN 6: Descarga manual**

1. Descarga el instalador directamente:

```bash
# Crear directorio temporal
mkdir -p ~/temp-solana
cd ~/temp-solana

# Descargar con wget
wget https://github.com/solana-labs/solana/releases/download/v1.18.0/solana-release-x86_64-unknown-linux-gnu.tar.bz2

# Extraer
tar jxf solana-release-x86_64-unknown-linux-gnu.tar.bz2

# Mover a ubicación final
mkdir -p ~/.local/share/solana
mv solana-release ~/.local/share/solana/install

# Agregar al PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Limpiar
cd ~
rm -rf ~/temp-solana
```

---

## 🎯 **RECOMENDACIÓN:**

**Prueba en este orden:**

1. **SOLUCIÓN 1** (wget) ← Más rápida
2. **SOLUCIÓN 2** (versión stable) ← Generalmente funciona
3. **SOLUCIÓN 4** (actualizar certificados) ← Si las anteriores fallan

---

## 📞 **DESPUÉS DE QUE FUNCIONE:**

Una vez que `solana --version` muestre la versión:

1. ✅ **Continúa con PASO 3** de `DEPLOY_MANUAL_PASO_A_PASO.md`
2. ✅ Configurar Devnet
3. ✅ Crear wallet
4. ✅ Build y Deploy

---

**¿Cuál solución quieres probar primero? Te recomiendo la SOLUCIÓN 1 (wget).** 🚀
