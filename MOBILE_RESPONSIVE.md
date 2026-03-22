# Responsividad Mobile — Portfolio Tracker
## Técnica: CSS Media Queries

---

## PROBLEMA ORIGINAL

La app estaba diseñada exclusivamente para desktop. En mobile presentaba estos problemas:

- El header con logo + título + fecha se superponía
- Las 6 cards KPI no entraban en pantalla
- La toolbar con botones se cortaba
- La tabla con 13 columnas era ilegible
- El modal de carga de datos ocupaba más espacio del disponible
- El formulario en 2 columnas quedaba muy apretado

---

## SOLUCIÓN APLICADA

Se agregaron dos bloques de media queries al final del CSS, antes del cierre `</style>`.

### Breakpoints utilizados

| Breakpoint | Dispositivo objetivo |
|------------|----------------------|
| `max-width: 768px` | Tablets y celulares |
| `max-width: 480px` | Celulares chicos |

---

## DETALLE DE CAMBIOS POR SECCIÓN

### 1. Header (`@media max-width: 768px`)

**Problema:** Logo + título + fecha en fila horizontal no caben en pantalla chica.

**Solución:**
```css
header { flex-direction: column; align-items: flex-start; gap: 10px; }
.logo h1 { font-size: 14px; }
.header-date { text-align: left; font-size: 10px; }
```
El header pasa de fila (`row`) a columna (`column`). Logo y fecha se achican.

---

### 2. KPI Grid (`@media max-width: 768px`)

**Problema:** 6 columnas en desktop no caben en mobile.

**Solución:**
```css
.kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
```
Pasa de 6 columnas a 2 columnas. Las 6 cards se distribuyen en 3 filas de 2.
Los valores y labels se achican proporcionalmente.

---

### 3. Toolbar (`@media max-width: 768px`)

**Problema:** Botones en fila horizontal se salen de pantalla.

**Solución:**
```css
.toolbar { flex-direction: column; align-items: stretch; }
.toolbar-left { flex-wrap: wrap; }
```
La toolbar pasa a layout vertical. Los botones ocupan el ancho completo disponible.

---

### 4. Tabla (`@media max-width: 768px`)

**Problema:** 13 columnas son imposibles de mostrar en pantalla chica sin romper el layout.

**Solución — scroll horizontal:**
```css
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
table { min-width: 700px; }
```
La tabla mantiene su ancho mínimo de 700px y el contenedor permite scroll horizontal con touch suave en iOS. El usuario puede deslizar la tabla para ver todas las columnas.

Se achican fuentes y paddings para aprovechar mejor el espacio:
```css
th { font-size: 8.5px; padding: 8px; }
td { font-size: 11px; padding: 9px 8px; }
```

---

### 5. Modal (`@media max-width: 768px`)

**Problema:** El modal de 580px de ancho se corta en pantallas de 375px.

**Solución:**
```css
.modal { width: 100%; max-width: 100vw; max-height: 95vh; border-radius: 0; }
.modal-body { padding: 16px; }
```
El modal ocupa el 100% del ancho de pantalla y hasta el 95% del alto, dejando un pequeño margen superior visible.

---

### 6. Formulario DCA (`@media max-width: 768px`)

**Problema:** El grid de 2 columnas del formulario queda muy apretado.

**Solución:**
```css
.form-grid { grid-template-columns: 1fr; gap: 10px; }
.dca-fields { grid-template-columns: 1fr 1fr; gap: 8px; }
```
Los campos principales pasan a una sola columna. Los campos DCA (fecha, unidades, precio) mantienen 2 columnas porque son más cortos.

---

### 7. Celulares muy chicos (`@media max-width: 480px`)

Ajustes adicionales para pantallas menores a 480px (iPhone SE, etc.):

```css
.kpi-value { font-size: 13px; }
header img { width: 56px !important; height: 56px !important; }
.logo h1 { font-size: 12px; }
```

---

## CÓDIGO COMPLETO AGREGADO

```css
/* ── RESPONSIVE MOBILE ── */
@media (max-width: 768px) {
  .app { padding: 12px; }

  header { flex-direction: column; align-items: flex-start; gap: 10px; margin-bottom: 16px; padding-bottom: 14px; }
  .logo-icon { width: 28px; height: 28px; }
  .logo h1 { font-size: 14px; }
  .header-date { text-align: left; font-size: 10px; }
  .header-date strong { font-size: 11px; }

  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px; }
  .kpi { padding: 10px 12px; }
  .kpi-value { font-size: 15px; }
  .kpi-pct { font-size: 11px; }
  .kpi-sub { font-size: 9.5px; }
  .kpi-label { font-size: 8.5px; }

  .toolbar { flex-direction: column; align-items: stretch; gap: 8px; }
  .toolbar-left { flex-wrap: wrap; }
  .toolbar > div:last-child { display: flex; flex-wrap: wrap; gap: 6px; }
  .btn { font-size: 10px; padding: 7px 12px; }
  .filter-btn { font-size: 9px; padding: 5px 10px; }
  #quote-status { font-size: 9px; }

  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { min-width: 700px; }
  th { font-size: 8.5px; padding: 8px 8px; }
  td { font-size: 11px; padding: 9px 8px; }
  .ticker { font-size: 12px; }
  .date { font-size: 10px; }
  .badge { font-size: 8px; padding: 2px 6px; }
  .dca-badge { font-size: 9px; padding: 2px 7px; }
  .dca-count { font-size: 10px; padding: 2px 7px; }
  .action-btn { width: 22px; height: 22px; font-size: 11px; }
  .toggle-btn { width: 18px; height: 18px; font-size: 9px; }

  .modal { width: 100%; max-width: 100vw; max-height: 95vh; border-radius: 0; }
  .modal-body { padding: 16px; }
  .modal-header { padding: 14px 16px; }
  .modal-footer { padding: 12px 16px; }
  .form-grid { grid-template-columns: 1fr; gap: 10px; }
  .dca-fields { grid-template-columns: 1fr 1fr; gap: 8px; }

  tfoot td { font-size: 11px; padding: 8px; }
}

@media (max-width: 480px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .kpi-value { font-size: 13px; }
  header img { width: 56px !important; height: 56px !important; }
  .logo h1 { font-size: 12px; }
}
```

---

## CONSIDERACIONES PARA EL FUTURO

- **Vista mobile de la tabla**: En una próxima iteración se podría mostrar una vista tipo "card" por posición en mobile en lugar de scroll horizontal, lo que sería más usable.
- **Touch targets**: Los botones de acción (editar/eliminar) son pequeños en mobile. Se podrían agrandar a mínimo 44px para mejor usabilidad táctil.
- **PWA**: Con un archivo `manifest.json` y un service worker se podría convertir en una Progressive Web App instalable en el celular como si fuera una app nativa.
