# 🔑 Resetear Contraseña de WSL Ubuntu

## 🎯 **Solución Rápida**

### **Opción 1: Resetear Contraseña (Recomendado)**

Desde **PowerShell**:

```powershell
# 1. Cambiar el usuario por defecto a root:
wsl -u root

# 2. Ahora estás como root, resetea la contraseña de tu usuario:
passwd edgar

# 3. Te pedirá nueva contraseña (ingresa una que recuerdes):
# New password: [ingresa tu nueva contraseña]
# Retype new password: [repite la contraseña]
# passwd: password updated successfully

# 4. Sal de root:
exit

# 5. Vuelve a entrar con tu usuario normal:
wsl
```

---

### **Opción 2: Usar Root Permanentemente (Más Fácil)**

Si no quieres lidiar con contraseñas, puedes trabajar siempre como root:

```powershell
# Configurar WSL para usar root por defecto:
ubuntu config --default-user root

# Ahora cuando abras WSL, serás root y no necesitarás contraseña
wsl
```

**Nota:** Esto es seguro en tu máquina local de desarrollo.

---

### **Opción 3: Evitar usar `sudo` (Alternativa)**

Si prefieres no usar root, puedes instalar todo sin `sudo`:

**Para Rust, Solana y Anchor NO necesitas sudo.** Solo lo necesitas para:

- `sudo apt-get update`
- `sudo apt-get install ...`

**Solución:** Usa comandos sin `sudo` o instala las herramientas manualmente:

#### **Instalar sin apt-get:**

En lugar de:

```bash
sudo apt-get install build-essential ...
```

Usa binarios pre-compilados o instaladores que no requieren sudo.

**Rust, Solana y Anchor se pueden instalar completamente sin sudo.**

---

## 📝 **Comandos Actualizados SIN SUDO**

### **Paso 1: Instalar Rust (SIN SUDO)**

```bash
# Configurar PATH primero:
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$HOME/.cargo/bin"

# Instalar Rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Cargar Rust:
source "$HOME/.cargo/env"

# Verificar:
rustc --version
cargo --version
```

### **Paso 2: Instalar Solana (SIN SUDO)**

```bash
# Instalar Solana:
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Agregar al PATH:
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Verificar:
solana --version
```

### **Paso 3: Instalar Anchor (SIN SUDO)**

```bash
# Instalar AVM:
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Instalar Anchor 0.29.0:
avm install 0.29.0
avm use 0.29.0

# Verificar:
anchor --version
```

### **Paso 4: Configurar y Usar**

```bash
# Configurar Solana:
solana config set --url https://api.devnet.solana.com

# Generar wallet:
solana-keygen new

# Airdrop:
solana airdrop 2

# Navegar al proyecto:
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-latam"

# Build (puede que necesites instalar Node/Yarn primero):
anchor build
```

---

## ⚠️ **Si Anchor Build Falla por Dependencias**

Si `anchor build` dice que faltan dependencias del sistema, usa root:

```bash
# Opción A: Resetear contraseña (ver arriba)

# Opción B: Usar root:
exit  # Sal de WSL
wsl -u root  # Entra como root
apt-get update
apt-get install -y build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev
exit
wsl  # Vuelve a tu usuario normal
```

---

## 🎯 **Recomendación**

**La forma más sencilla:**

1. **Resetea tu contraseña** (Opción 1) - Toma 30 segundos
2. **O usa root por defecto** (Opción 2) - No necesitas contraseña nunca

**¿Cuál prefieres?**

---

## 🔄 **Comandos Rápidos**

### **Para Resetear Contraseña:**

```powershell
wsl -u root
passwd edgar
exit
wsl
```

### **Para Usar Root Siempre:**

```powershell
ubuntu config --default-user root
wsl
```

---

**Elige la opción que prefieras y continúa con la instalación! 🚀**






