# Chivatu

**Significado en Lengua Asturiana**
> 1. Chivato, acusón, soplón.

![](https://i.giphy.com/XHS4eJ3JE67S7UvrjJ.gif)

**Chivatu** es una pequeña librería JavaScript (~1KB minificada) que sirve de sensor de visibilidad. Permite detectar cuando un elemento del DOM entra o sale del viewport utilizando la API _IntersectionObserver_ del navegador.

## Instalación

### Tradicional

Tienes los siguientes ficheros a descargar:
- Compilada
- Compilada y minificada

Incluye el script en el html

### Cómo modulo

Instala con

```sh
npm i chivatu
```

## Uso

```javascript
import Chivatu from 'chivatu';

const chivatu = new Chivatu();

// Lazy images
chivatu.add({
  selector: 'img[data-src]',
  once: true,
  onVisible: (item) => {
    item.src = item.dataset.src;
  }
})
```

## Demos

## Cómo contribuir
