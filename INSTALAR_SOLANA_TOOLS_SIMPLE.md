# 🛠️ Instalación Simple de Solana Tools en WSL

## ✅ **Estado Actual**

- [x] ✅ Solana CLI instalado (`solana-cli 3.0.3`)
- [ ] ❌ Rust NO instalado
- [ ] ⚠️ Anchor instalado pero versión incorrecta

---

## 🎯 **Plan de Instalación**

Vamos a instalar en este orden:

1. **Rust** (prerequisito para Anchor)
2. **Anchor CLI** (versión correcta)
3. **Verificar todo funciona**

---

## 📋 **Comandos para Ejecutar**

### **Paso 1: Instalar Rust (2-3 minutos)**

```bash
wsl bash -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source ~/.cargo/env && rustc --version && cargo --version"
```

**Debería mostrar:**

```
rustc 1.xx.x
cargo 1.xx.x
```

---

### **Paso 2: Instalar Anchor CLI (10-15 minutos)**

```bash
wsl bash -c "source ~/.cargo/env && cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && ~/.cargo/bin/avm install 0.29.0 && ~/.cargo/bin/avm use 0.29.0 && ~/.cargo/bin/anchor --version"
```

**Debería mostrar:**

```
anchor-cli 0.29.0
```

---

### **Paso 3: Configurar PATH permanente**

```bash
wsl bash -c "echo 'export PATH=\"\$HOME/.cargo/bin:\$HOME/.local/share/solana/install/active_release/bin:\$PATH\"' >> ~/.bashrc && source ~/.bashrc"
```

---

### **Paso 4: Verificar instalación completa**

```bash
wsl bash -c "source ~/.cargo/env && rustc --version && solana --version && anchor --version"
```

**Debería mostrar:**

```
rustc 1.xx.x
solana-cli 3.0.3
anchor-cli 0.29.0
```

---

## ⚡ **Instalación Rápida (Todo en Uno)**

Si prefieres ejecutar todo de una vez (toma ~15-20 min):

```bash
wsl bash -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source ~/.cargo/env && cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && ~/.cargo/bin/avm install 0.29.0 && ~/.cargo/bin/avm use 0.29.0 && echo 'export PATH=\"\$HOME/.cargo/bin:\$HOME/.local/share/solana/install/active_release/bin:\$PATH\"' >> ~/.bashrc && echo '' && echo '✅ INSTALACIÓN COMPLETADA' && rustc --version && solana --version && ~/.cargo/bin/anchor --version"
```

---

## 🎯 **Después de la Instalación**

Una vez que todo esté instalado:

### **Compilar el programa Anchor:**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor build"
```

### **Ejecutar tests:**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor test"
```

### **Deploy a Devnet:**

```bash
wsl bash -c "cd prediction-market-latam && source ~/.cargo/env && anchor deploy --provider.cluster devnet"
```

---

## 🐛 **Troubleshooting**

### **Si `cargo` no se encuentra después de instalar Rust:**

```bash
wsl bash -c "source ~/.cargo/env && cargo --version"
```

### **Si `anchor` no se encuentra después de instalar:**

```bash
wsl bash -c "~/.cargo/bin/anchor --version"
```

### **Si hay error de versión de Anchor:**

```bash
wsl bash -c "~/.cargo/bin/avm list && ~/.cargo/bin/avm use 0.29.0"
```

---

## ⏱️ **Tiempos Estimados**

| Paso                    | Duración      |
| ----------------------- | ------------- |
| Rust                    | 2-3 min       |
| Anchor (avm install)    | 2-3 min       |
| Anchor (anchor install) | 10-15 min     |
| **Total**               | **15-20 min** |

---

**¿Quieres que ejecute la instalación automática (todo en uno)?**

- **A)** Sí, ejecuta el comando completo (15-20 min, automático)
- **B)** Paso a paso (verificando cada etapa)
- **C)** Solo instalar lo que falta (Rust + fix Anchor)


















