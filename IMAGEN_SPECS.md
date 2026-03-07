# 🎨 Especificaciones de Imágenes para SEO

## 📊 OG Image (Facebook, LinkedIn, WhatsApp)

**Dimensiones:** 1200 x 630 píxeles
**Formato:** JPG
**Peso:** < 200 KB
**Nombre archivo:** `og-image.jpg`
**Ubicación:** `public/og-image.jpg`

### Diseño Recomendado:

```
┌─────────────────────────────────────────────┐
│ [LOGO BR]                    ROYCE BARBERÍA │ ← 60px padding
│                                             │
│                                             │
│          [FOTO EQUIPO O CORTE]             │ ← Foto centrada
│                                             │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│        ROYCE BARBERÍA                       │ ← Montserrat Bold 72px
│   Estilo Premium para el Hombre Moderno    │ ← Montserrat 36px
│                                             │
│        roycebarber.com                      │ ← Montserrat 28px
└─────────────────────────────────────────────┘
```

### Colores:

- **Fondo:** Negro #000000 o gris oscuro #332b2b
- **Título:** Dorado #B8860B o Rojo #D52323
- **Subtítulo:** Blanco #FFFFFF
- **URL:** Gris claro #CCCCCC

### Elementos visuales:

✅ Logo BR (esquina superior izquierda)
✅ Foto profesional del equipo o corte
✅ Texto legible en móvil (no muy pequeño)
✅ Contraste alto para compartir en modo oscuro

---

## 🐦 Twitter Card

**Puedes usar la MISMA imagen que OG Image**

- Twitter acepta 1200x630px
- Copia `og-image.jpg` como `twitter-card.jpg`
- O usa directamente `og-image.jpg` para ambos

---

## 🎯 Favicon Package

### Imágenes necesarias:

1. **favicon.ico** (Multi-size ICO)
   - Contiene: 16x16, 32x32, 48x48
   - Formato: ICO
   - Ubicación: `public/favicon.ico`

2. **favicon-16x16.png**
   - 16 x 16 píxeles
   - PNG transparente
   - Ubicación: `public/favicon-16x16.png`

3. **favicon-32x32.png**
   - 32 x 32 píxeles
   - PNG transparente
   - Ubicación: `public/favicon-32x32.png`

4. **apple-touch-icon.png**
   - 180 x 180 píxeles
   - PNG (puede tener fondo)
   - Ubicación: `public/apple-touch-icon.png`
   - Para cuando guardan el sitio en iPhone/iPad

5. **android-chrome-192x192.png**
   - 192 x 192 píxeles
   - PNG transparente
   - Ubicación: `public/android-chrome-192x192.png`

6. **android-chrome-512x512.png**
   - 512 x 512 píxeles
   - PNG transparente
   - Ubicación: `public/android-chrome-512x512.png`

### Favicon Design:

- Usar logo BR simplificado
- Solo las letras "BR" en rojo
- Fondo transparente o negro
- Versión muy simple (se verá pequeño)

---

## 🛠️ Herramientas para Favicon

**Opción 1: RealFaviconGenerator (Recomendado)**
https://realfavicongenerator.net/

- Sube tu logo en alta calidad (512x512 PNG)
- Genera TODOS los tamaños automáticamente
- Descarga el zip con todos los archivos

**Opción 2: Favicon.io**
https://favicon.io/favicon-converter/

- Sube imagen PNG cuadrada
- Genera favicon.ico + PNGs

**Opción 3: Canva Export**

- Diseña logo 512x512 en Canva
- Exporta PNG transparente
- Usa RealFaviconGenerator

---

## ✅ Checklist Final

### Archivos a crear:

- [ ] og-image.jpg (1200x630)
- [ ] twitter-card.jpg (o reusar og-image.jpg)
- [ ] favicon.ico
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png
- [ ] android-chrome-192x192.png
- [ ] android-chrome-512x512.png

### Guardar en:

```
public/
  ├── og-image.jpg
  ├── twitter-card.jpg
  ├── favicon.ico
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png
  ├── android-chrome-192x192.png
  └── android-chrome-512x512.png
```

---

## 🚀 Tips de Canva

1. **Crear diseño personalizado:** 1200 x 630 px
2. **Subir assets:**
   - Logo BR rojo
   - Foto equipo/corte que me compartiste
3. **Usar plantilla "Facebook Post"** si no quieres empezar de cero
4. **Exportar:**
   - Formato: JPG
   - Calidad: Alta
   - Comprimir si pesa > 200KB

---

## 📱 Vista Previa Social

Una vez creadas, puedes probar cómo se ven:

**Facebook Debugger:**
https://developers.facebook.com/tools/debug/

**Twitter Card Validator:**
https://cards-dev.twitter.com/validator

**LinkedIn Post Inspector:**
https://www.linkedin.com/post-inspector/

---

**Cuando termines, avísame y actualizo el HTML automáticamente!**
