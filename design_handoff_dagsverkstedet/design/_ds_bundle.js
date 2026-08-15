/* @ds-bundle: {"format":4,"namespace":"HandzOnAutoCareDesignSystem_1e2dc9","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Tick","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"PriceTag","sourcePath":"components/core/PriceTag.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"StatTile","sourcePath":"components/core/StatTile.jsx"},{"name":"StatStrip","sourcePath":"components/core/StatTile.jsx"},{"name":"VippsButton","sourcePath":"components/core/VippsButton.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RegNrInput","sourcePath":"components/forms/RegNrInput.jsx"},{"name":"SearchField","sourcePath":"components/forms/SearchField.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"CategoryFilter","sourcePath":"components/navigation/CategoryFilter.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"BOOKING_STEPS","sourcePath":"components/navigation/StepProgress.jsx"},{"name":"StepProgress","sourcePath":"components/navigation/StepProgress.jsx"},{"name":"BranchCard","sourcePath":"components/patterns/BranchCard.jsx"},{"name":"Carousel","sourcePath":"components/patterns/Carousel.jsx"},{"name":"ServiceCard","sourcePath":"components/patterns/ServiceCard.jsx"},{"name":"StampCard","sourcePath":"components/patterns/StampCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"5ac00839f04c","components/core/Button.jsx":"7cf6a32e77f0","components/core/Card.jsx":"2181c0847f68","components/core/Chip.jsx":"fd69beb3a770","components/core/Icon.jsx":"dd4f1bc2ec83","components/core/PriceTag.jsx":"42124e8dd202","components/core/SectionHeader.jsx":"8a2a1bb25387","components/core/StatTile.jsx":"a5a1af693e93","components/core/VippsButton.jsx":"3ed10824ca43","components/feedback/EmptyState.jsx":"a1ef7d1bc4a4","components/feedback/Toast.jsx":"2592c26955d3","components/forms/Input.jsx":"cf904d4d35b9","components/forms/RegNrInput.jsx":"d3184738a447","components/forms/SearchField.jsx":"0c18fbef8363","components/forms/Select.jsx":"4b7d93aeb7b2","components/navigation/Breadcrumb.jsx":"07be2a241b13","components/navigation/CategoryFilter.jsx":"108c5a91a451","components/navigation/SiteFooter.jsx":"6f5e96eb4a49","components/navigation/SiteHeader.jsx":"add07f7fa011","components/navigation/StepProgress.jsx":"9ee5971b7a59","components/patterns/BranchCard.jsx":"e32fd73540cf","components/patterns/Carousel.jsx":"2052af6017a0","components/patterns/ServiceCard.jsx":"b8c524c3be92","components/patterns/StampCard.jsx":"3b1ce5bfd6d2","design_handoff_dagsverkstedet/design/data.js":"475aaaaf31d9","design_handoff_dagsverkstedet/design/ds-boot.js":"70bf1338c588","ds-boot.js":"70bf1338c588","ui_kits/admin/sales-data.js":"08eec58fd25d","ui_kits/data.js":"475aaaaf31d9"},"inlinedExternals":[],"unexposedExports":[{"name":"isValidRegNr","sourcePath":"components/forms/RegNrInput.jsx"}]} */

(() => {

const __ds_ns = (window.HandzOnAutoCareDesignSystem_1e2dc9 = window.HandzOnAutoCareDesignSystem_1e2dc9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Lite, ikke-interaktivt statusmerke. Barlow 600, 12,5px, radius 6px. */
function Badge({
  variant = "navyTint",
  dot = false,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `hz-badge hz-badge--${variant} ${className}`
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "hz-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primærknapp i Handz On-systemet. Barlow 600, radius 8px, hårfin ramme der
 * varianten trenger det. Bruk `as="a"` for lenker som ser ut som knapper.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  leadingIcon = null,
  trailingIcon = null,
  as: Tag = "button",
  className = "",
  children,
  ...rest
}) {
  const cls = ["hz-btn", `hz-btn--${variant}`, `hz-btn--${size}`, block ? "hz-btn--block" : "", className].filter(Boolean).join(" ");
  const isButton = Tag === "button";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: loading ? {
      position: "relative",
      ...(rest.style || {})
    } : rest.style
  }, isButton ? {
    type: rest.type || "button"
  } : {}, loading ? {
    "aria-busy": "true",
    disabled: isButton ? true : undefined
  } : {}, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "hz-btn__spinner",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: -8,
      marginTop: -8
    }
  }), !loading && leadingIcon, /*#__PURE__*/React.createElement("span", {
    style: loading ? {
      visibility: "hidden"
    } : undefined
  }, children), !loading && trailingIcon, loading && /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, "Laster"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kort i tre dybdenivåer: hårlinje (standard), nøkkelkort (`elevated`) og
 * valgt (`selected`). Aldri to nivåer i samme kortkontekst.
 */
function Card({
  elevated = false,
  interactive = false,
  selected = false,
  flush = false,
  dark = false,
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  const cls = ["hz-card", elevated ? "hz-card--key" : "", interactive ? "hz-card--interactive" : "", flush ? "hz-card--flush" : "", dark ? "hz-card--dark" : "", selected ? "is-selected" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, Tag === "button" ? {
    type: "button",
    "aria-pressed": selected
  } : {}, rest), children);
}

/** Rund hake for valgte kort i bookingflyten. */
function Tick({
  on = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `hz-tick ${on ? "is-on" : ""}`,
    "aria-hidden": "true"
  }, "\u2713");
}
Object.assign(__ds_scope, { Card, Tick });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Interaktiv filter-pille. Aktiv tilstand er navy-fylt. */
function Chip({
  active = false,
  count,
  as: Tag = "button",
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ["hz-chip", active ? "is-active" : "", className].filter(Boolean).join(" ")
  }, Tag === "button" ? {
    type: "button",
    "aria-pressed": active
  } : {}, rest), children, count != null && /*#__PURE__*/React.createElement("span", {
    className: "hz-chip__count"
  }, count));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const {
  useEffect,
  useRef
} = React;
/**
 * Ikonwrapper rundt Lucide (linjeikoner, 2px strek) — kilden har ingen egen
 * ikonpakke, så Lucide er en flagget substitusjon. Krever at siden laster
 * Lucide UMD: <script src="https://unpkg.com/lucide@0.454.0/dist/umd/lucide.min.js">
 * Piler og skilletegn (→ ← ·) settes som tekst, ikke som ikon.
 */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  label,
  className = "",
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          "stroke-width": strokeWidth
        }
      });
    }
  });
  return /*#__PURE__*/React.createElement("i", {
    ref: ref,
    "data-lucide": name,
    className: className,
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      flex: "none",
      ...style
    },
    "aria-hidden": label ? undefined : "true",
    "aria-label": label,
    role: label ? "img" : undefined
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/PriceTag.jsx
try { (() => {
/** Pris i Barlow 700 med tabular-nums. Format «1 490,-» eller «1 490 kr». */
function PriceTag({
  amount,
  from = false,
  was,
  variant = "inline",
  suffix = ",-",
  vatNote = false,
  className = ""
}) {
  const fmt = n => new Intl.NumberFormat("nb-NO").format(n).replace(/\u00A0/g, " ");
  return /*#__PURE__*/React.createElement("span", {
    className: `hz-price hz-price--${variant} ${className}`
  }, from && /*#__PURE__*/React.createElement("span", {
    className: "hz-price__from"
  }, "fra"), was != null && /*#__PURE__*/React.createElement("span", {
    className: "hz-price__was"
  }, fmt(was), suffix), /*#__PURE__*/React.createElement("span", {
    className: "hz-price__amount"
  }, fmt(amount), suffix), vatNote && /*#__PURE__*/React.createElement("span", {
    className: "hz-price__vat"
  }, "inkl. mva"));
}
Object.assign(__ds_scope, { PriceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PriceTag.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
/** Eyebrow → H2 → ingress → valgfri handling. Fast rytme: 12 / 8 / 24px. */
function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  onDark = false,
  as: Tag = "h2",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["hz-sh", onDark ? "hz-sh--onDark" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "hz-sh__eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement(Tag, {
    className: "hz-sh__title"
  }, title), lead && /*#__PURE__*/React.createElement("p", {
    className: "hz-sh__lead"
  }, lead)), action);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/StatTile.jsx
try { (() => {
/** Nøkkeltall. `strip` er forsidens hårlinjedelte trippel, `tile` er et kort. */
function StatTile({
  value,
  label,
  variant = "strip",
  onDark = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["hz-stat", variant === "tile" ? "hz-stat--tile" : "", onDark ? "hz-stat--onDark" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-stat__value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "hz-stat__label"
  }, label));
}

/** Hårlinjedelt rad av StatTile. */
function StatStrip({
  children,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-stats ${className}`
  }, children);
}
Object.assign(__ds_scope, { StatTile, StatStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/core/VippsButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * «Logg inn med Vipps» i Vipps' egen knappelåsning: oransje #FF5B24-flate,
 * pille-radius, hvitt ordmerke med den hevede prikken. Aldri en generisk
 * knapp med Vipps-tekst, aldri i en annen farge.
 */
function VippsButton({
  label = "Logg inn med",
  block = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: ["hz-vipps", block ? "hz-vipps--block" : "", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    className: "hz-vipps__mark",
    "aria-hidden": "true"
  }, "Vipps", /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, "Vipps"));
}
Object.assign(__ds_scope, { VippsButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/VippsButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
/** Tom tilstand med vei videre. Aldri bare «Ingen treff». */
function EmptyState({
  icon,
  title,
  text,
  action,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-empty ${className}`
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "hz-empty__icon"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "hz-empty__title"
  }, title), text && /*#__PURE__*/React.createElement("p", {
    className: "hz-empty__text"
  }, text), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/** Kort bekreftelse. role="status" for info, role="alert" for feil. */
function Toast({
  variant = "info",
  title,
  text,
  icon,
  onClose,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-toast hz-toast--${variant} ${className}`,
    role: variant === "error" ? "alert" : "status"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "hz-toast__icon"
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hz-toast__title"
  }, title), text && /*#__PURE__*/React.createElement("div", {
    className: "hz-toast__text"
  }, text)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "hz-toast__close",
    onClick: onClose,
    "aria-label": "Lukk melding"
  }, "\u2715"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tekstfelt med label, hjelpetekst og feilmelding. 16px tekst (unngår iOS-zoom). */
function Input({
  label,
  help,
  error,
  id,
  className = "",
  textarea = false,
  ...rest
}) {
  const fieldId = id || rest.name || undefined;
  const describedBy = error ? `${fieldId}-error` : help ? `${fieldId}-help` : undefined;
  const Tag = textarea ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "hz-label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement(Tag, _extends({
    id: fieldId,
    className: `${textarea ? "hz-textarea" : "hz-input"} ${error ? "is-error" : ""}`,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy
  }, rest)), error ? /*#__PURE__*/React.createElement("p", {
    className: "hz-error",
    id: `${fieldId}-error`
  }, error) : help ? /*#__PURE__*/React.createElement("p", {
    className: "hz-help",
    id: `${fieldId}-help`
  }, help) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RegNrInput.jsx
try { (() => {
/**
 * Registreringsnummer — booking steg 2. Sentrert, Barlow 700, 28px, versaler
 * med 0.28em sperring. Normaliserer automatisk til blokkbokstaver uten
 * mellomrom og bindestrek. Gyldig format: to bokstaver + fem sifre.
 */
function RegNrInput({
  value = "",
  onChange,
  error,
  help = "To bokstaver og fem sifre. Prøv f.eks. EB12345.",
  id = "regnr",
  label = "Registreringsnummer",
  className = ""
}) {
  const normalize = v => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "hz-label",
    htmlFor: id
  }, label), /*#__PURE__*/React.createElement("input", {
    id: id,
    className: `hz-regnr ${error ? "is-error" : ""}`,
    value: value,
    onChange: e => onChange && onChange(normalize(e.target.value)),
    placeholder: "EB12345",
    inputMode: "text",
    autoCapitalize: "characters",
    autoComplete: "off",
    spellCheck: false,
    maxLength: 7,
    "aria-invalid": error ? "true" : undefined
  }), error ? /*#__PURE__*/React.createElement("p", {
    className: "hz-error"
  }, error) : /*#__PURE__*/React.createElement("p", {
    className: "hz-help"
  }, help));
}

/** Gyldig norsk skiltformat for personbil. */
function isValidRegNr(value) {
  return /^[A-Z]{2}\d{5}$/.test(String(value || "").toUpperCase());
}
Object.assign(__ds_scope, { RegNrInput, isValidRegNr });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RegNrInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Søkefelt med ledende lupe. Brukes til avdelingssøk. */
function SearchField({
  placeholder = "By eller postnummer",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `hz-search ${className}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "hz-search__icon",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    className: "hz-input",
    placeholder: placeholder
  }, rest)));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Nedtrekk med egen chevron. Samme ramme og høyde som Input. */
function Select({
  label,
  help,
  error,
  id,
  options = [],
  placeholder,
  className = "",
  children,
  ...rest
}) {
  const fieldId = id || rest.name || undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-field ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "hz-label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "hz-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    className: `hz-select ${error ? "is-error" : ""}`,
    "aria-invalid": error ? "true" : undefined
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o)), children), /*#__PURE__*/React.createElement("svg", {
    className: "hz-select-wrap__chevron",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), error ? /*#__PURE__*/React.createElement("p", {
    className: "hz-error"
  }, error) : help ? /*#__PURE__*/React.createElement("p", {
    className: "hz-help"
  }, help) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
/** Sti. Siste ledd er ikke lenke og har aria-current="page". */
function Breadcrumb({
  items = [],
  className = ""
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Sti",
    className: className
  }, /*#__PURE__*/React.createElement("ol", {
    className: "hz-crumbs",
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, items.map((item, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: item.label,
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, last ? /*#__PURE__*/React.createElement("span", {
      className: "hz-crumbs__current",
      "aria-current": "page"
    }, item.label) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: item.href
    }, item.label), /*#__PURE__*/React.createElement("span", {
      className: "hz-crumbs__sep",
      "aria-hidden": "true"
    }, "/")));
  })));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/CategoryFilter.jsx
try { (() => {
/** Horisontal chip-rad med snap på mobil. Første ledd er alltid «Alle». */
function CategoryFilter({
  categories = [],
  value,
  onChange,
  allLabel = "Alle",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-filter hz-scroll ${className}`,
    role: "group",
    "aria-label": "Filtrer tjenester"
  }, /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    active: !value,
    onClick: () => onChange && onChange(null)
  }, allLabel), categories.map(c => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: c.value ?? c,
    active: value === (c.value ?? c),
    count: c.count,
    onClick: () => onChange && onChange(c.value ?? c)
  }, c.label ?? c)));
}
Object.assign(__ds_scope, { CategoryFilter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/CategoryFilter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
const GROUPS = [{
  title: "Informasjon",
  links: ["Om oss", "Bli franchisetaker", "Bli medlem", "SMS & E-post", "Jobb hos oss", "Kontakt oss"]
}, {
  title: "Tjenester",
  links: ["Bilvask", "Polering", "Lakkforsegling", "Full Shine", "Interiør", "Se alle tjenester"]
}, {
  title: "Mine sider",
  links: ["Logg inn", "Ny kunde", "Gavekort", "Bilpleie-guiden"]
}];

/** Footer som speiler kjedens faktiske IA. Skjult i bookingflyten. */
function SiteFooter({
  groups = GROUPS,
  logo = "assets/logo-original.webp",
  promise = "Lever nøkkelen, gjør ærendene dine, hent en skinnende ren bil. 14 avdelinger over hele Norge — 20 år med bilpleie gjort for hånd."
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "hz-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-footer__group"
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Handz On Auto Care",
    style: {
      height: 34,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      color: "var(--body-soft)",
      maxWidth: "34ch"
    }
  }, promise)), groups.map(g => /*#__PURE__*/React.createElement("div", {
    className: "hz-footer__group",
    key: g.title
  }, /*#__PURE__*/React.createElement("h3", null, g.title), /*#__PURE__*/React.createElement("ul", null, g.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    className: "hz-footer__legal"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Handz On Auto Care \xB7 Franchisekjede med 14 lokale avdelinger. Hver avdeling drives av egen juridisk enhet."), /*#__PURE__*/React.createElement("span", null, "Handz On Norway AS, Laguneveien 7, 5239 R\xE5dal \xB7 Org. 821 230 152 MVA"), /*#__PURE__*/React.createElement("span", null, "Registrert i Arbeidstilsynets godkjenningsordning for bilpleie."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Vilk\xE5r"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Personvern"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Cookies"))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
const {
  useState
} = React;
const DEFAULT_LINKS = [{
  href: "/tjenester",
  label: "Tjenester"
}, {
  href: "/avdelinger",
  label: "Avdelinger"
}, {
  href: "/selge-bil",
  label: "Selge bil"
}, {
  href: "/nyheter",
  label: "Nyheter"
}, {
  href: "/gavekort",
  label: "Gavekort"
}, {
  href: "/om-oss",
  label: "Om oss"
}];

/** Sticky, gjennomskinnelig header med hårlinje. Hamburger under 900px. */
function SiteHeader({
  links = DEFAULT_LINKS,
  active,
  logo = "assets/logo-original.webp",
  cta = "Bestill time",
  ctaHref = "/booking",
  onNavigate
}) {
  const [open, setOpen] = useState(false);
  const go = href => e => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "hz-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "hz-header__logo",
    href: "/",
    onClick: go("/"),
    "aria-label": "Handz On Auto Care \u2013 til forsiden"
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Handz On Auto Care"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "hz-header__nav",
    "aria-label": "Hovedmeny"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    href: l.href,
    onClick: go(l.href),
    className: `hz-header__link ${active === l.href ? "is-active" : ""}`,
    "aria-current": active === l.href ? "page" : undefined
  }, l.label)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    as: "a",
    href: ctaHref,
    onClick: go(ctaHref)
  }, cta)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "hz-header__burger",
    "aria-label": "\xC5pne meny",
    "aria-expanded": open,
    onClick: () => setOpen(true)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), open && /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Meny",
    style: {
      position: "fixed",
      inset: 0,
      zIndex: "var(--z-mobilenav)",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "22px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: "Handz On",
    style: {
      height: 38
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(false),
    "aria-label": "Lukk meny",
    style: {
      background: "none",
      border: 0,
      fontSize: 28,
      lineHeight: 1,
      color: "var(--brand-navy)",
      cursor: "pointer"
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Mobilmeny",
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.href,
    href: l.href,
    onClick: go(l.href),
    style: {
      borderBottom: "1px solid var(--line)",
      padding: "18px 0",
      fontFamily: "var(--font-heading)",
      fontSize: 26,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, l.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "lg",
    block: true,
    as: "a",
    href: ctaHref,
    onClick: go(ctaHref)
  }, cta), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16,
      textAlign: "center",
      fontSize: 15,
      color: "var(--muted)"
    }
  }, "14 avdelinger over hele Norge"))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StepProgress.jsx
try { (() => {
/**
 * Bookingflytens 7-segments progresjon. Segmentene er låst — steg slås aldri
 * sammen og hoppes aldri over.
 */
const BOOKING_STEPS = ["Avdeling", "Bilen din", "Tjeneste", "Tidspunkt", "Tillegg", "Oppsummering", "Bekreftelse"];
function StepProgress({
  step = 1,
  steps = BOOKING_STEPS,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-steps ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-steps__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hz-steps__label"
  }, steps[step - 1]), /*#__PURE__*/React.createElement("span", {
    className: "hz-steps__count"
  }, "Steg ", step, " av ", steps.length)), /*#__PURE__*/React.createElement("div", {
    className: "hz-steps__bar",
    role: "progressbar",
    "aria-valuenow": step,
    "aria-valuemin": 1,
    "aria-valuemax": steps.length,
    "aria-label": `Steg ${step} av ${steps.length} — ${steps[step - 1]}`
  }, steps.map((label, i) => /*#__PURE__*/React.createElement("span", {
    key: label,
    className: `hz-steps__seg ${i + 1 < step ? "is-done" : ""} ${i + 1 === step ? "is-current" : ""}`
  }))));
}
Object.assign(__ds_scope, { BOOKING_STEPS, StepProgress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StepProgress.jsx", error: String((e && e.message) || e) }); }

// components/patterns/BranchCard.jsx
try { (() => {
/** Avdelingskort med åpningsstatus, kampanje og «Book her». */
function BranchCard({
  name,
  address,
  postalCode,
  city,
  distance,
  open = true,
  campaign,
  hours = "Man–fre 08–17 (tors. 18) · Lør 10–15 · Søn stengt",
  onBook,
  onDirections,
  selected = false,
  compact = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    elevated: !compact,
    selected: selected,
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__name"
  }, "Handz On ", name), /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__addr"
  }, address, ", ", postalCode, " ", city)), distance && /*#__PURE__*/React.createElement("span", {
    className: "hz-branch__dist"
  }, distance)), /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__meta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: open ? "open" : "closed",
    dot: true
  }, open ? "Åpen nå" : "Stengt nå"), campaign && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "navyTint"
  }, campaign)), !compact && /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__hours"
  }, hours), (onBook || onDirections) && /*#__PURE__*/React.createElement("div", {
    className: "hz-branch__foot"
  }, onBook && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onBook
  }, "Book her"), onDirections && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: "ghost",
    onClick: onDirections
  }, "Veibeskrivelse \u2192")));
}
Object.assign(__ds_scope, { BranchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/BranchCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/Carousel.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
/**
 * Rolig kryssfade for hero-bilder. Kun bildet krysser — tekstpanelet står
 * stille. Pauser ved hover og ved prefers-reduced-motion.
 */
function Carousel({
  slides = [],
  interval = 6000,
  dots = true,
  className = ""
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [paused, slides.length, interval]);
  return /*#__PURE__*/React.createElement("div", {
    className: `hz-carousel ${className}`,
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    "aria-roledescription": "carousel"
  }, slides.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.src,
    className: `hz-carousel__slide ${i === index ? "is-active" : ""}`,
    "aria-hidden": i !== index
  }, /*#__PURE__*/React.createElement("img", {
    src: s.src,
    alt: i === 0 ? s.alt || "" : ""
  }))), dots && slides.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "hz-carousel__dots"
  }, slides.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.src,
    type: "button",
    className: `hz-carousel__dot ${i === index ? "is-active" : ""}`,
    onClick: () => setIndex(i),
    "aria-label": `Vis bilde ${i + 1}`
  }))));
}
Object.assign(__ds_scope, { Carousel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/Carousel.jsx", error: String((e && e.message) || e) }); }

// components/patterns/ServiceCard.jsx
try { (() => {
/**
 * Tjenestekort. `media` = kvadratisk bilde på topp (grid), `row` = 72px
 * miniatyr til venstre (tett liste, forsiden).
 */
function ServiceCard({
  name,
  category,
  duration,
  price,
  description,
  image,
  badge,
  level,
  layout = "media",
  href = "#",
  onClick,
  unavailable = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    elevated: true,
    flush: true,
    interactive: true,
    as: onClick ? "button" : "a",
    href: onClick ? undefined : href,
    onClick: onClick,
    className: `hz-service ${layout === "row" ? "hz-service--row" : ""} ${className}`,
    style: unavailable ? {
      opacity: 0.6
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-service__media"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: ""
  }), badge && layout === "media" && /*#__PURE__*/React.createElement("span", {
    className: "hz-service__badge"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "navy"
  }, badge))), /*#__PURE__*/React.createElement("div", {
    className: "hz-service__body"
  }, layout === "media" && /*#__PURE__*/React.createElement("div", {
    className: "hz-service__cat"
  }, category, " \xB7 ", duration), /*#__PURE__*/React.createElement("div", {
    className: "hz-service__name"
  }, name), layout === "media" && description && /*#__PURE__*/React.createElement("p", {
    className: "hz-service__desc"
  }, description), layout === "row" && /*#__PURE__*/React.createElement("div", {
    className: "hz-service__cat",
    style: {
      textTransform: "none",
      letterSpacing: 0,
      fontSize: 13.5,
      fontFamily: "var(--font-body)"
    }
  }, category, " \xB7 ", duration), level && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "navyTint"
  }, level))), /*#__PURE__*/React.createElement("div", {
    className: "hz-service__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.PriceTag, {
    amount: price,
    from: true
  }), unavailable ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: "muted"
  }, "Ikke tilgjengelig her") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-heading)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--muted-light)"
    }
  }, "Se mer \u2192")));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StampCard.jsx
try { (() => {
/**
 * Kundeklubbens stempelkort (5+1): fem fylte stempler og et fremhevet
 * GRATIS-felt. Ligger på navy. Raden er dekorativ; teksten under bærer
 * betydningen for skjermlesere.
 */
function StampCard({
  filled = 5,
  total = 6,
  className = ""
}) {
  const slots = Array.from({
    length: total - 1
  }, (_, i) => i < filled);
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: "hz-stamp",
    "aria-hidden": "true"
  }, slots.map((on, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "hz-stamp__slot",
    style: on ? undefined : {
      background: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.25)"
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("span", {
    className: "hz-stamp__free"
  }, "GRATIS")), /*#__PURE__*/React.createElement("span", {
    className: "sr-only"
  }, filled, " av ", total, " stempler fylt \u2014 neste utvendige Basic-vask er gratis."));
}
Object.assign(__ds_scope, { StampCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StampCard.jsx", error: String((e && e.message) || e) }); }

// design_handoff_dagsverkstedet/design/data.js
try { (() => {
/* Delt demodata for UI-kittene. Ekte avdelinger, ekte tjenestenavn og ekte
   «fra»-priser fra kjedens katalog (kilde: handzon-1/docs/HANDZON-AUDIT-OG-
   DESIGNBRIEF.md kap. 3 og handzon-1/lib/mock-data.ts). Priser i hele kroner
   inkl. mva. */
window.HZ_DATA = function () {
  const P = window.HZ_ASSET_BASE || "../../assets/photos/";
  const categories = [{
    value: "bilvask",
    label: "Bilvask"
  }, {
    value: "polering",
    label: "Polering"
  }, {
    value: "lakkforsegling",
    label: "Lakkforsegling"
  }, {
    value: "full-shine",
    label: "Full Shine"
  }, {
    value: "interior",
    label: "Interiør"
  }, {
    value: "hjul",
    label: "Dekk & Felg"
  }];
  const services = [{
    id: "vask-utvendig-basic",
    name: "Vask utvendig – Basic",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 540,
    min: 30,
    level: "Basic",
    img: P + "utvendig-handvask-thumb.webp",
    hero: P + "utvendig-handvask.webp",
    desc: "Rask, skånsom utvendig håndvask med felgvask, skum og tørk. Perfekt til jevnt vedlikehold."
  }, {
    id: "vask-utvendig-premium",
    name: "Vask utvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 790,
    min: 50,
    level: "Premium",
    img: P + "utvendig-handvask-thumb.webp",
    hero: P + "utvendig-handvask.webp",
    desc: "Grundig håndvask med to-bøtte-metode, felgvask og skånsom tørk – uten svirvelmerker."
  }, {
    id: "vask-innvendig-premium",
    name: "Vask innvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 790,
    min: 50,
    level: "Premium",
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Støvsuging, rens av alle flater, vinduer innvendig og avtørking av dashbord og konsoll."
  }, {
    id: "vask-ut-innvendig-premium",
    name: "Vask ut-/innvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 1490,
    min: 75,
    level: "Premium",
    popular: true,
    img: P + "utvendig-vask-og-voks-thumb.webp",
    hero: P + "utvendig-vask-og-voks.webp",
    desc: "Komplett vask ute og inne: håndvask utvendig, støvsuging og avtørking av alle flater innvendig."
  }, {
    id: "polering-basic",
    name: "Polering – Basic",
    cat: "polering",
    catLabel: "Polering",
    price: 1990,
    min: 180,
    level: "Basic",
    popular: true,
    img: P + "polering-thumb.webp",
    hero: P + "polering.webp",
    desc: "Maskinpolering som fjerner lette riper og matthet, og gir lakken dybde og glans."
  }, {
    id: "polering-pro",
    name: "Polering – Pro",
    cat: "polering",
    catLabel: "Polering",
    price: 2990,
    min: 240,
    level: "Pro",
    popular: true,
    img: P + "polering-thumb.webp",
    hero: P + "polering.webp",
    desc: "Flertrinns polering som fjerner dypere riper, svirvelmerker og oksidering."
  }, {
    id: "lakkrens-polering-pro",
    name: "Lakkrens + Polering – Pro",
    cat: "polering",
    catLabel: "Polering",
    price: 4490,
    min: 390,
    level: "Pro",
    guarantee: "NANO ~12 mnd",
    img: P + "detaljering.webp",
    hero: P + "detaljering.webp",
    desc: "Full lakkrens med leire og avfetting, deretter flertrinns polering – lakken føles som ny."
  }, {
    id: "keramisk-lakkforsegling",
    name: "Keramisk lakkforsegling",
    cat: "lakkforsegling",
    catLabel: "Lakkforsegling",
    price: 9990,
    min: 480,
    guarantee: "6 års garanti",
    popular: true,
    img: P + "keramisk-coating-thumb.webp",
    hero: P + "keramisk-coating.webp",
    desc: "Graphene-basert forsegling som beskytter lakken i årevis – selvrensende, med dyp glans."
  }, {
    id: "kontrollvask-rebehandling",
    name: "Kontrollvask & rebehandling",
    cat: "lakkforsegling",
    catLabel: "Lakkforsegling",
    price: 1690,
    min: 150,
    img: P + "keramisk-coating-thumb.webp",
    hero: P + "keramisk-coating.webp",
    desc: "Vedlikeholdsvask og oppfrisking av eksisterende forsegling for varig beskyttelse."
  }, {
    id: "full-shine-basic",
    name: "Full Shine – Basic",
    cat: "full-shine",
    catLabel: "Full Shine",
    price: 6490,
    min: 480,
    level: "Basic",
    img: P + "komplett-bilpleie-thumb.webp",
    hero: P + "komplett-bilpleie.webp",
    desc: "Total renovering ute og inne: vask, lakkrens, polering og innvendig dyprens i én behandling."
  }, {
    id: "full-shine-pro",
    name: "Full Shine – Pro",
    cat: "full-shine",
    catLabel: "Full Shine",
    price: 7490,
    min: 570,
    level: "Pro",
    guarantee: "NANO ~12 mnd",
    popular: true,
    img: P + "komplett-bilpleie-thumb.webp",
    hero: P + "komplett-bilpleie.webp",
    desc: "Vår mest komplette pakke: renovering ute og inne, klimadesinfisering og NANO-beskyttelse."
  }, {
    id: "rens-innvendig",
    name: "Rens innvendig (dyprens)",
    cat: "interior",
    catLabel: "Interiør",
    price: 3990,
    min: 330,
    popular: true,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Grundig dyprens: støvsuging, rens av alle flater, tekstil- og skinnrens av seter."
  }, {
    id: "skinn-rens",
    name: "Skinn rens og behandling",
    cat: "interior",
    catLabel: "Interiør",
    price: 1990,
    min: 120,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Rens og næring av skinnseter som hindrer sprekker og holder skinnet mykt."
  }, {
    id: "rens-enkelt-sete",
    name: "Rens av enkelt sete",
    cat: "interior",
    catLabel: "Interiør",
    price: 590,
    min: 45,
    popular: true,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Flekkfjerning og dyprens av ett enkelt sete – for uhellet som skjedde."
  }, {
    id: "ozon-desinfisering",
    name: "Ozon / desinfisering",
    cat: "interior",
    catLabel: "Interiør",
    price: 1690,
    min: 60,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Ozonbehandling som fjerner lukt og desinfiserer kupeen – røyk, dyr og mat."
  }, {
    id: "omlegg-balansering",
    name: "Omlegg og balansering",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 1300,
    min: 75,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Omlegging og balansering av hjulene for jevn slitasje og rolig kjøring."
  }, {
    id: "skift-av-hjul",
    name: "Skift av hjul",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 500,
    min: 30,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Rask og trygg omskodding mellom sommer- og vinterhjul mens du er på senteret."
  }, {
    id: "vask-av-hjul",
    name: "Vask av hjul (løse)",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 250,
    min: 20,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Vask av løse hjul – rene felger og dekk, klare til lagring eller ny montering."
  }];
  const addOns = [{
    id: "asfalt",
    name: "Asfaltfjerning",
    price: 450,
    min: 30,
    desc: "Løser opp asfaltsprut og tjæreflekker på lakk og terskler."
  }, {
    id: "seterens",
    name: "Seterens (ett sete)",
    price: 500,
    min: 45,
    desc: "Dyprens og flekkfjerning av ett sete i tekstil eller skinn."
  }, {
    id: "rute",
    name: "Ruteforsegling",
    price: 349,
    min: 20,
    desc: "Regnavvisende behandling av frontrute og sideruter."
  }, {
    id: "dekkrens",
    name: "Dekkrensing og felgforsegling",
    price: 299,
    min: 20,
    desc: "Syrefri felgrens med beskyttende forsegling og dekkglans."
  }, {
    id: "ozon",
    name: "Luktfjerning (ozon)",
    price: 599,
    min: 45,
    desc: "Fjerner røyk-, dyre- og matlukt permanent."
  }, {
    id: "dyrehaar",
    name: "Fjerning av dyrehår",
    price: 399,
    min: 30,
    desc: "Spesialrens for hundeeiere — fjerner hår fra seter og tepper."
  }];
  const affinity = {
    "vask-ut-innvendig-premium": ["dekkrens", "seterens", "rute"],
    "polering-basic": ["asfalt", "dekkrens", "rute"],
    "polering-pro": ["asfalt", "dekkrens", "rute"],
    "keramisk-lakkforsegling": ["rute", "dekkrens", "asfalt"],
    "rens-innvendig": ["ozon", "seterens", "dyrehaar"],
    "full-shine-pro": ["dekkrens", "ozon", "seterens"]
  };
  const locations = [{
    slug: "lambertseter",
    name: "Lambertseter",
    center: "Lambertseter senter",
    address: "Cecilie Thoresens vei 17–21",
    zip: "1153",
    city: "Oslo",
    region: "Østlandet",
    phone: "479 20 609",
    lat: 59.876,
    lng: 10.806,
    dist: "3,4 km",
    open: true
  }, {
    slug: "sandvika",
    name: "Sandvika",
    center: "Sandvika Storsenter",
    address: "Brodtkorbs gate 7",
    zip: "1338",
    city: "Sandvika",
    region: "Østlandet",
    phone: "479 27 724",
    lat: 59.8883,
    lng: 10.521,
    dist: "11,2 km",
    open: true
  }, {
    slug: "metro",
    name: "Metro",
    center: "Metro Senter",
    address: "Bibliotekgata 30",
    zip: "1473",
    city: "Lørenskog",
    region: "Østlandet",
    phone: "980 53 599",
    lat: 59.9281,
    lng: 10.962,
    dist: "12,8 km",
    open: true
  }, {
    slug: "ski",
    name: "Ski",
    center: "Ski Storsenter",
    address: "Jernbanesvingen 6",
    zip: "1401",
    city: "Ski",
    region: "Østlandet",
    phone: "479 27 723",
    lat: 59.7195,
    lng: 10.836,
    dist: "18,0 km",
    open: false
  }, {
    slug: "triaden",
    name: "Triaden",
    center: "Triaden Lørenskog",
    address: "Gamleveien 88",
    zip: "1461",
    city: "Lørenskog",
    region: "Østlandet",
    phone: "467 09 966",
    lat: 59.95,
    lng: 11.001,
    dist: "19,4 km",
    open: true
  }, {
    slug: "strommen",
    name: "Strømmen",
    center: "Strømmen Storsenter",
    address: "Stasjonsveien 6",
    zip: "2010",
    city: "Strømmen",
    region: "Østlandet",
    phone: "941 77 814",
    lat: 59.9457,
    lng: 11.006,
    dist: "20,1 km",
    open: true
  }, {
    slug: "asker",
    name: "Asker",
    center: "Trekanten",
    address: "Knud Askers vei 26",
    zip: "1383",
    city: "Asker",
    region: "Østlandet",
    phone: "488 43 795",
    lat: 59.8337,
    lng: 10.4352,
    dist: "22,6 km",
    open: true,
    campaign: "Ny avdeling: 15 % på første bestilling"
  }, {
    slug: "skedsmo",
    name: "Skedsmo",
    center: "Skedsmokorset",
    address: "Furuholtet 1",
    zip: "2020",
    city: "Skedsmokorset",
    region: "Østlandet",
    phone: "484 34 321",
    lat: 59.9772,
    lng: 11.033,
    dist: "26,3 km",
    open: true
  }, {
    slug: "jessheim",
    name: "Jessheim",
    center: "Jessheim Storsenter",
    address: "Ringenveien 4",
    zip: "2050",
    city: "Jessheim",
    region: "Østlandet",
    phone: "456 52 461",
    lat: 60.1533,
    lng: 11.173,
    dist: "44,9 km",
    open: true
  }, {
    slug: "lagunen",
    name: "Lagunen",
    center: "Lagunen Storsenter",
    address: "Laguneveien 1",
    zip: "5239",
    city: "Rådal",
    region: "Vestlandet",
    phone: "479 27 731",
    lat: 60.2966,
    lng: 5.3299,
    dist: "304 km",
    open: true,
    campaign: "Sommerkampanje: 20 % på keramisk coating"
  }, {
    slug: "asane",
    name: "Åsane",
    center: "Åsane Storsenter",
    address: "Åsane Storsenter 42, bygg A",
    zip: "5116",
    city: "Ulset",
    region: "Vestlandet",
    phone: "916 74 554",
    lat: 60.469,
    lng: 5.3235,
    dist: "312 km",
    open: true
  }, {
    slug: "forus",
    name: "Forus",
    center: "Forus Handelspark",
    address: "Fabrikkveien 2",
    zip: "4033",
    city: "Stavanger",
    region: "Vestlandet",
    phone: "457 39 525",
    lat: 58.8918,
    lng: 5.7195,
    dist: "298 km",
    open: true
  }, {
    slug: "sorlandssenteret",
    name: "Sørlandssenteret",
    center: "Sørlandssenteret",
    address: "Barstølveien 35",
    zip: "4636",
    city: "Kristiansand",
    region: "Sørlandet",
    phone: "469 86 698",
    lat: 58.1868,
    lng: 8.0793,
    dist: "246 km",
    open: true,
    campaign: "Gratis felgrens ved Full Shine i august"
  }, {
    slug: "moa",
    name: "Moa",
    center: "Moa Syd",
    address: "Moaveien 1",
    zip: "6018",
    city: "Ålesund",
    region: "Vestlandet",
    phone: "920 72 829",
    lat: 62.4665,
    lng: 6.243,
    dist: "441 km",
    open: true
  }];
  const overrides = {
    "lambertseter:full-shine-pro": 7990,
    "lambertseter:vask-utvendig-premium": 849,
    "forus:full-shine-pro": 6990,
    "sandvika:keramisk-lakkforsegling": 9490,
    "moa:keramisk-lakkforsegling": null,
    "ski:polering-pro": null
  };
  const nok = n => new Intl.NumberFormat("nb-NO").format(n).replace(/\u00A0/g, " ");
  const kr = n => nok(n) + ",-";
  const dur = m => m < 60 ? m + " min" : m % 60 === 0 ? Math.floor(m / 60) + " t" : Math.floor(m / 60) + " t " + m % 60 + " min";
  const priceAt = (slug, id) => {
    const key = slug + ":" + id;
    return key in overrides ? overrides[key] : services.find(s => s.id === id).price;
  };
  const availableAt = (slug, id) => priceAt(slug, id) !== null;
  const vehicles = {
    EB12345: {
      make: "Tesla",
      model: "Model Y",
      year: 2023,
      fuel: "Elektrisk",
      color: "Hvit"
    },
    DR34567: {
      make: "Volkswagen",
      model: "Golf",
      year: 2019,
      fuel: "Bensin",
      color: "Grå"
    },
    SU98765: {
      make: "Volvo",
      model: "XC60",
      year: 2021,
      fuel: "Diesel",
      color: "Svart"
    },
    EK55443: {
      make: "Hyundai",
      model: "Kona Electric",
      year: 2024,
      fuel: "Elektrisk",
      color: "Blå"
    }
  };

  /* Kart. Sett window.HZ_GOOGLE_MAPS_KEY = "din-nøkkel" før data.js lastes, så
     brukes Google Maps Embed API — ellers faller vi tilbake til OpenStreetMap. */
  const mapUrl = (loc, zoom = 14) => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) {
      const q = encodeURIComponent(`Handz On ${loc.name}, ${loc.address}, ${loc.zip} ${loc.city}`);
      return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=${zoom}&language=no&region=NO`;
    }
    const dx = 0.06,
      dy = 0.03;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - dx}%2C${loc.lat - dy}%2C${loc.lng + dx}%2C${loc.lat + dy}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`;
  };
  const mapUrlAll = () => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) return `https://www.google.com/maps/embed/v1/search?key=${key}&q=${encodeURIComponent("Handz On Auto Care Norge")}&zoom=5&language=no&region=NO`;
    return "https://www.openstreetmap.org/export/embed.html?bbox=4.2%2C57.8%2C13.2%2C63.4&layer=mapnik&marker=59.876%2C10.806";
  };
  return {
    categories,
    services,
    addOns,
    affinity,
    locations,
    overrides,
    nok,
    kr,
    dur,
    priceAt,
    availableAt,
    vehicles,
    mapUrl,
    mapUrlAll,
    PHOTOS: P
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_dagsverkstedet/design/data.js", error: String((e && e.message) || e) }); }

// design_handoff_dagsverkstedet/design/ds-boot.js
try { (() => {
/* ds-boot.js — laster designsystemets komponenter.
   Førstevalg: den kompilerte bunten (_ds_bundle.js). Finnes den ikke ennå
   (f.eks. rett etter at kildene er skrevet), transpileres komponentkildene
   i nettleseren med Babel Standalone slik at kortene og UI-kittene alltid
   rendrer. Kall HZ.boot(baseUrl).then(render).

   Krever at React, ReactDOM og @babel/standalone allerede er lastet. */
(function () {
  var NS = "HandzOnAutoCareDesignSystem_1e2dc9";
  var SOURCES = ["components/core/Button.jsx", "components/core/VippsButton.jsx", "components/core/Icon.jsx", "components/core/Badge.jsx", "components/core/Chip.jsx", "components/core/Card.jsx", "components/core/PriceTag.jsx", "components/core/StatTile.jsx", "components/core/SectionHeader.jsx", "components/forms/Input.jsx", "components/forms/Select.jsx", "components/forms/SearchField.jsx", "components/forms/RegNrInput.jsx", "components/feedback/Toast.jsx", "components/feedback/EmptyState.jsx", "components/navigation/Breadcrumb.jsx", "components/navigation/CategoryFilter.jsx", "components/navigation/StepProgress.jsx", "components/navigation/SiteHeader.jsx", "components/navigation/SiteFooter.jsx", "components/patterns/ServiceCard.jsx", "components/patterns/BranchCard.jsx", "components/patterns/StampCard.jsx", "components/patterns/Carousel.jsx"];
  var EXPORTS = ["Button", "VippsButton", "Icon", "Badge", "Chip", "Card", "Tick", "PriceTag", "StatTile", "StatStrip", "SectionHeader", "Input", "Select", "SearchField", "RegNrInput", "isValidRegNr", "Toast", "EmptyState", "Breadcrumb", "CategoryFilter", "StepProgress", "BOOKING_STEPS", "SiteHeader", "SiteFooter", "ServiceCard", "BranchCard", "StampCard", "Carousel"];
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function strip(code) {
    return code.replace(/import\s+React[^;]*from\s*["']react["'];?/g, "").replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?/g, "").replace(/^\s*export\s+/gm, "");
  }
  function boot(base) {
    base = base || "";
    if (window[NS]) return Promise.resolve(window[NS]);
    return loadScript(base + "_ds_bundle.js").then(function () {
      return window[NS];
    }).catch(function () {
      return Promise.all(SOURCES.map(function (p) {
        return fetch(base + p).then(function (r) {
          return r.text();
        });
      })).then(function (parts) {
        var hooks = "var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef,useMemo=React.useMemo,useCallback=React.useCallback;\n";
        var body = hooks + parts.map(strip).join("\n");
        var src = body + "\nreturn {" + EXPORTS.join(",") + "};";
        var compiled = window.Babel.transform("(function(React){" + src + "})", {
          presets: ["react"]
        }).code;
        // eslint-disable-next-line no-eval
        window[NS] = window.eval(compiled)(window.React);
        return window[NS];
      });
    });
  }
  window.HZ = {
    boot: boot,
    NS: NS
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_dagsverkstedet/design/ds-boot.js", error: String((e && e.message) || e) }); }

// ds-boot.js
try { (() => {
/* ds-boot.js — laster designsystemets komponenter.
   Førstevalg: den kompilerte bunten (_ds_bundle.js). Finnes den ikke ennå
   (f.eks. rett etter at kildene er skrevet), transpileres komponentkildene
   i nettleseren med Babel Standalone slik at kortene og UI-kittene alltid
   rendrer. Kall HZ.boot(baseUrl).then(render).

   Krever at React, ReactDOM og @babel/standalone allerede er lastet. */
(function () {
  var NS = "HandzOnAutoCareDesignSystem_1e2dc9";
  var SOURCES = ["components/core/Button.jsx", "components/core/VippsButton.jsx", "components/core/Icon.jsx", "components/core/Badge.jsx", "components/core/Chip.jsx", "components/core/Card.jsx", "components/core/PriceTag.jsx", "components/core/StatTile.jsx", "components/core/SectionHeader.jsx", "components/forms/Input.jsx", "components/forms/Select.jsx", "components/forms/SearchField.jsx", "components/forms/RegNrInput.jsx", "components/feedback/Toast.jsx", "components/feedback/EmptyState.jsx", "components/navigation/Breadcrumb.jsx", "components/navigation/CategoryFilter.jsx", "components/navigation/StepProgress.jsx", "components/navigation/SiteHeader.jsx", "components/navigation/SiteFooter.jsx", "components/patterns/ServiceCard.jsx", "components/patterns/BranchCard.jsx", "components/patterns/StampCard.jsx", "components/patterns/Carousel.jsx"];
  var EXPORTS = ["Button", "VippsButton", "Icon", "Badge", "Chip", "Card", "Tick", "PriceTag", "StatTile", "StatStrip", "SectionHeader", "Input", "Select", "SearchField", "RegNrInput", "isValidRegNr", "Toast", "EmptyState", "Breadcrumb", "CategoryFilter", "StepProgress", "BOOKING_STEPS", "SiteHeader", "SiteFooter", "ServiceCard", "BranchCard", "StampCard", "Carousel"];
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function strip(code) {
    return code.replace(/import\s+React[^;]*from\s*["']react["'];?/g, "").replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?/g, "").replace(/^\s*export\s+/gm, "");
  }
  function boot(base) {
    base = base || "";
    if (window[NS]) return Promise.resolve(window[NS]);
    return loadScript(base + "_ds_bundle.js").then(function () {
      return window[NS];
    }).catch(function () {
      return Promise.all(SOURCES.map(function (p) {
        return fetch(base + p).then(function (r) {
          return r.text();
        });
      })).then(function (parts) {
        var hooks = "var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef,useMemo=React.useMemo,useCallback=React.useCallback;\n";
        var body = hooks + parts.map(strip).join("\n");
        var src = body + "\nreturn {" + EXPORTS.join(",") + "};";
        var compiled = window.Babel.transform("(function(React){" + src + "})", {
          presets: ["react"]
        }).code;
        // eslint-disable-next-line no-eval
        window[NS] = window.eval(compiled)(window.React);
        return window[NS];
      });
    });
  }
  window.HZ = {
    boot: boot,
    NS: NS
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-boot.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/sales-data.js
try { (() => {
/* Salgsdata for admin-panelet.
   Deterministisk generert: samme avdeling og dato gir alltid samme tall, så
   demoen er stabil mellom omlastinger. Bygger på ui_kits/data.js (ekte
   avdelinger, tjenester, add-ons og priser).

   Modellen speiler virkeligheten i kjeden: kjøpesenter-avdelinger har mest
   trafikk lørdag, søndag er stengt, og sesongtoppene ligger i april–mai
   (pollen, dekkskift) og september–oktober (vinterforberedelse). */
window.HZ_SALES = function () {
  const D = window.HZ_DATA;

  /* Relativ trafikkvekt per avdeling — Lambertseter og Lagunen er de største. */
  const WEIGHT = {
    lambertseter: 1.35,
    lagunen: 1.3,
    sandvika: 1.15,
    metro: 1.0,
    strommen: 0.95,
    triaden: 0.9,
    asane: 0.9,
    forus: 1.05,
    sorlandssenteret: 0.95,
    skedsmo: 0.8,
    ski: 0.75,
    jessheim: 0.8,
    asker: 0.7,
    moa: 0.75
  };
  const CHANNELS = [["nett", "Nettbooking", 0.58], ["skranke", "Drop-in i skranken", 0.27], ["telefon", "Telefon", 0.15]];
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = a + 0x6d2b79f5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parse = s => new Date(s + "T12:00:00");
  const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
  /* Mandag som første dag i uka (norsk standard). */
  const startOfWeek = d => {
    const x = new Date(d);
    const w = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - w);
    x.setHours(12, 0, 0, 0);
    return x;
  };
  const isoWeek = d => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = (t.getUTCDay() + 6) % 7;
    t.setUTCDate(t.getUTCDate() - day + 3);
    const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
    const fd = (first.getUTCDay() + 6) % 7;
    first.setUTCDate(first.getUTCDate() - fd + 3);
    return 1 + Math.round((t - first) / 604800000);
  };

  /* Sesongfaktor — 1,0 er snitt. */
  function season(month) {
    return [0.82, 0.85, 1.0, 1.28, 1.24, 1.05, 0.88, 0.95, 1.22, 1.3, 1.02, 0.9][month];
  }
  function weekday(day) {
    return [0, 0.92, 0.88, 0.95, 1.05, 1.18, 1.35, 0][day === 0 ? 7 : day];
  }
  const cache = new Map();

  /* Alle ordrer for én avdeling på én dag. */
  function ordersForDay(slug, dateStr) {
    const key = slug + "|" + dateStr;
    if (cache.has(key)) return cache.get(key);
    const d = parse(dateStr);
    const out = [];
    if (d.getDay() === 0) {
      cache.set(key, out);
      return out;
    } // søndag stengt

    const r = rng(hash(key));
    const base = 7.2 * (WEIGHT[slug] || 0.85) * season(d.getMonth()) * weekday(d.getDay());
    const count = Math.max(1, Math.round(base + (r() - 0.5) * 3.2));
    const open = 8;
    const close = d.getDay() === 6 ? 14 : 16;
    const avail = D.services.filter(s => D.availableAt(slug, s.id));
    for (let i = 0; i < count; i += 1) {
      /* Tjenestevalg vektet mot vask og de populære pakkene. */
      const roll = r();
      let pool;
      if (roll < 0.46) pool = avail.filter(s => s.cat === "bilvask");else if (roll < 0.62) pool = avail.filter(s => s.cat === "interior");else if (roll < 0.76) pool = avail.filter(s => s.cat === "polering");else if (roll < 0.86) pool = avail.filter(s => s.cat === "hjul");else if (roll < 0.94) pool = avail.filter(s => s.cat === "full-shine");else pool = avail.filter(s => s.cat === "lakkforsegling");
      if (!pool.length) pool = avail;
      const svc = pool[Math.floor(r() * pool.length)];
      const price = D.priceAt(slug, svc.id);

      /* Add-ons: affinitet først, ~38 % festerate. */
      const addOns = [];
      const aff = D.affinity[svc.id] || [];
      if (r() < 0.38) {
        const src = aff.length ? aff : D.addOns.map(a => a.id);
        addOns.push(src[Math.floor(r() * src.length)]);
        if (r() < 0.22 && src.length > 1) {
          const second = src[Math.floor(r() * src.length)];
          if (second !== addOns[0]) addOns.push(second);
        }
      }
      const addSum = addOns.reduce((n, id) => n + D.addOns.find(a => a.id === id).price, 0);
      const member = r() < 0.41;
      const discount = member ? Math.round(price * 0.1) : 0;
      let cr = r();
      let channel = CHANNELS[2][0];
      for (const [id,, w] of CHANNELS) {
        if (cr < w) {
          channel = id;
          break;
        }
        cr -= w;
      }
      out.push({
        id: `${slug}-${dateStr}-${i}`,
        date: dateStr,
        loc: slug,
        hour: open + Math.floor(r() * (close - open)),
        serviceId: svc.id,
        addOns,
        member,
        channel,
        base: price,
        addSum,
        discount,
        total: price + addSum - discount
      });
    }
    out.sort((a, b) => a.hour - b.hour);
    cache.set(key, out);
    return out;
  }
  function ordersInRange(slug, from, to) {
    const slugs = slug === "alle" ? D.locations.map(l => l.slug) : [slug];
    const out = [];
    for (let d = new Date(from); d <= to; d = addDays(d, 1)) {
      const ds = iso(d);
      for (const s of slugs) out.push(...ordersForDay(s, ds));
    }
    return out;
  }

  /* Periodevindu + bøtter for diagrammet. */
  function range(period, anchor) {
    const a = new Date(anchor);
    if (period === "dag") {
      return {
        from: a,
        to: a,
        label: a.toLocaleDateString("nb-NO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      };
    }
    if (period === "uke") {
      const from = startOfWeek(a);
      const to = addDays(from, 6);
      return {
        from,
        to,
        label: `Uke ${isoWeek(from)} · ${from.getDate()}.–${to.getDate()}. ${to.toLocaleDateString("nb-NO", {
          month: "long",
          year: "numeric"
        })}`
      };
    }
    if (period === "maaned") {
      const from = new Date(a.getFullYear(), a.getMonth(), 1, 12);
      const to = new Date(a.getFullYear(), a.getMonth() + 1, 0, 12);
      return {
        from,
        to,
        label: from.toLocaleDateString("nb-NO", {
          month: "long",
          year: "numeric"
        })
      };
    }
    const from = new Date(a.getFullYear(), 0, 1, 12);
    const to = new Date(a.getFullYear(), 11, 31, 12);
    return {
      from,
      to,
      label: String(a.getFullYear())
    };
  }
  function shift(period, anchor, dir) {
    const a = new Date(anchor);
    if (period === "dag") return addDays(a, dir);
    if (period === "uke") return addDays(a, dir * 7);
    if (period === "maaned") return new Date(a.getFullYear(), a.getMonth() + dir, 1, 12);
    return new Date(a.getFullYear() + dir, a.getMonth(), 1, 12);
  }
  function previousAnchor(period, anchor) {
    return shift(period, anchor, -1);
  }
  const WD = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];
  const MO = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
  function buckets(period, anchor, orders) {
    const r = range(period, anchor);
    if (period === "dag") {
      const out = [];
      for (let h = 8; h <= 16; h += 1) {
        const list = orders.filter(o => o.hour === h);
        out.push({
          x: `${String(h).padStart(2, "0")}`,
          full: `Kl. ${String(h).padStart(2, "0")}–${String(h + 1).padStart(2, "0")}`,
          sum: list.reduce((n, o) => n + o.total, 0),
          count: list.length
        });
      }
      return out;
    }
    if (period === "uke") {
      const out = [];
      for (let i = 0; i < 7; i += 1) {
        const d = addDays(r.from, i);
        const ds = iso(d);
        const list = orders.filter(o => o.date === ds);
        out.push({
          x: WD[i],
          full: d.toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "short"
          }),
          sum: list.reduce((n, o) => n + o.total, 0),
          count: list.length,
          closed: d.getDay() === 0
        });
      }
      return out;
    }
    if (period === "maaned") {
      const out = [];
      const days = r.to.getDate();
      for (let i = 1; i <= days; i += 1) {
        const d = new Date(r.from.getFullYear(), r.from.getMonth(), i, 12);
        const ds = iso(d);
        const list = orders.filter(o => o.date === ds);
        out.push({
          x: i % 2 === 1 || days <= 20 ? String(i) : "",
          full: d.toLocaleDateString("nb-NO", {
            weekday: "long",
            day: "numeric",
            month: "long"
          }),
          sum: list.reduce((n, o) => n + o.total, 0),
          count: list.length,
          closed: d.getDay() === 0
        });
      }
      return out;
    }
    const out = [];
    for (let m = 0; m < 12; m += 1) {
      const list = orders.filter(o => parse(o.date).getMonth() === m);
      out.push({
        x: MO[m],
        full: new Date(r.from.getFullYear(), m, 1).toLocaleDateString("nb-NO", {
          month: "long",
          year: "numeric"
        }),
        sum: list.reduce((n, o) => n + o.total, 0),
        count: list.length
      });
    }
    return out;
  }
  function summarize(orders) {
    const sum = orders.reduce((n, o) => n + o.total, 0);
    const count = orders.length;
    const addRevenue = orders.reduce((n, o) => n + o.addSum, 0);
    const discount = orders.reduce((n, o) => n + o.discount, 0);
    const members = orders.filter(o => o.member).length;
    const withAdd = orders.filter(o => o.addOns.length).length;
    return {
      sum,
      count,
      avg: count ? Math.round(sum / count) : 0,
      vat: Math.round(sum / 5 * 100) / 100,
      addRevenue,
      discount,
      memberShare: count ? members / count : 0,
      attachRate: count ? withAdd / count : 0
    };
  }
  function byService(orders) {
    const map = new Map();
    for (const o of orders) {
      const cur = map.get(o.serviceId) || {
        count: 0,
        sum: 0
      };
      cur.count += 1;
      cur.sum += o.base - o.discount;
      map.set(o.serviceId, cur);
    }
    return [...map.entries()].map(([id, v]) => ({
      service: D.services.find(s => s.id === id),
      ...v
    })).sort((a, b) => b.sum - a.sum);
  }
  function byCategory(orders) {
    const map = new Map();
    for (const o of orders) {
      const svc = D.services.find(s => s.id === o.serviceId);
      const cur = map.get(svc.cat) || {
        count: 0,
        sum: 0
      };
      cur.count += 1;
      cur.sum += o.total;
      map.set(svc.cat, cur);
    }
    return D.categories.map(c => ({
      cat: c,
      ...(map.get(c.value) || {
        count: 0,
        sum: 0
      })
    })).filter(r => r.count).sort((a, b) => b.sum - a.sum);
  }
  function byAddOn(orders) {
    const map = new Map();
    for (const o of orders) for (const id of o.addOns) {
      const cur = map.get(id) || {
        count: 0,
        sum: 0
      };
      const a = D.addOns.find(x => x.id === id);
      cur.count += 1;
      cur.sum += a.price;
      map.set(id, cur);
    }
    return [...map.entries()].map(([id, v]) => ({
      addOn: D.addOns.find(a => a.id === id),
      ...v
    })).sort((a, b) => b.sum - a.sum);
  }
  function byChannel(orders) {
    return CHANNELS.map(([id, label]) => {
      const list = orders.filter(o => o.channel === id);
      return {
        id,
        label,
        count: list.length,
        sum: list.reduce((n, o) => n + o.total, 0)
      };
    }).filter(r => r.count).sort((a, b) => b.sum - a.sum);
  }
  function byLocation(orders) {
    const map = new Map();
    for (const o of orders) {
      const cur = map.get(o.loc) || {
        count: 0,
        sum: 0
      };
      cur.count += 1;
      cur.sum += o.total;
      map.set(o.loc, cur);
    }
    return [...map.entries()].map(([slug, v]) => ({
      loc: D.locations.find(l => l.slug === slug),
      ...v
    })).sort((a, b) => b.sum - a.sum);
  }

  /* Rapport for én periode, med sammenligning mot forrige tilsvarende periode. */
  function report(slug, period, anchor) {
    const r = range(period, anchor);
    const orders = ordersInRange(slug, r.from, r.to);
    const pa = previousAnchor(period, anchor);
    const pr = range(period, pa);
    const prev = ordersInRange(slug, pr.from, pr.to);
    return {
      range: r,
      prevRange: pr,
      orders,
      now: summarize(orders),
      before: summarize(prev),
      buckets: buckets(period, anchor, orders),
      services: byService(orders),
      categories: byCategory(orders),
      addOns: byAddOn(orders),
      channels: byChannel(orders),
      locations: byLocation(orders)
    };
  }
  const pct = (now, before) => before ? (now - before) / before : null;
  function csv(rep, slugLabel, periodLabel) {
    const rows = [["Handz On Auto Care — salgsrapport"], ["Avdeling", slugLabel], ["Periode", periodLabel], ["Omsetning inkl. mva", rep.now.sum], ["Herav mva (25 %)", rep.now.vat], ["Antall ordrer", rep.now.count], ["Snittordre", rep.now.avg], [], ["Dato", "Tid", "Avdeling", "Tjeneste", "Tillegg", "Kanal", "Medlem", "Rabatt", "Sum inkl. mva"]];
    for (const o of rep.orders) {
      const svc = D.services.find(s => s.id === o.serviceId);
      rows.push([o.date, `${String(o.hour).padStart(2, "0")}:00`, D.locations.find(l => l.slug === o.loc).name, svc.name, o.addOns.map(id => D.addOns.find(a => a.id === id).name).join(" + "), o.channel, o.member ? "ja" : "nei", o.discount, o.total]);
    }
    return rows.map(r => r.map(c => typeof c === "string" && /[;"\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(";")).join("\n");
  }
  return {
    ordersForDay,
    ordersInRange,
    range,
    shift,
    buckets,
    summarize,
    report,
    pct,
    csv,
    byService,
    byCategory,
    byAddOn,
    byChannel,
    byLocation,
    iso,
    parse,
    addDays,
    isoWeek,
    WEIGHT,
    CHANNELS
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/sales-data.js", error: String((e && e.message) || e) }); }

// ui_kits/data.js
try { (() => {
/* Delt demodata for UI-kittene. Ekte avdelinger, ekte tjenestenavn og ekte
   «fra»-priser fra kjedens katalog (kilde: handzon-1/docs/HANDZON-AUDIT-OG-
   DESIGNBRIEF.md kap. 3 og handzon-1/lib/mock-data.ts). Priser i hele kroner
   inkl. mva. */
window.HZ_DATA = function () {
  const P = window.HZ_ASSET_BASE || "../../assets/photos/";
  const categories = [{
    value: "bilvask",
    label: "Bilvask"
  }, {
    value: "polering",
    label: "Polering"
  }, {
    value: "lakkforsegling",
    label: "Lakkforsegling"
  }, {
    value: "full-shine",
    label: "Full Shine"
  }, {
    value: "interior",
    label: "Interiør"
  }, {
    value: "hjul",
    label: "Dekk & Felg"
  }];
  const services = [{
    id: "vask-utvendig-basic",
    name: "Vask utvendig – Basic",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 540,
    min: 30,
    level: "Basic",
    img: P + "utvendig-handvask-thumb.webp",
    hero: P + "utvendig-handvask.webp",
    desc: "Rask, skånsom utvendig håndvask med felgvask, skum og tørk. Perfekt til jevnt vedlikehold."
  }, {
    id: "vask-utvendig-premium",
    name: "Vask utvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 790,
    min: 50,
    level: "Premium",
    img: P + "utvendig-handvask-thumb.webp",
    hero: P + "utvendig-handvask.webp",
    desc: "Grundig håndvask med to-bøtte-metode, felgvask og skånsom tørk – uten svirvelmerker."
  }, {
    id: "vask-innvendig-premium",
    name: "Vask innvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 790,
    min: 50,
    level: "Premium",
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Støvsuging, rens av alle flater, vinduer innvendig og avtørking av dashbord og konsoll."
  }, {
    id: "vask-ut-innvendig-premium",
    name: "Vask ut-/innvendig – Premium",
    cat: "bilvask",
    catLabel: "Bilvask",
    price: 1490,
    min: 75,
    level: "Premium",
    popular: true,
    img: P + "utvendig-vask-og-voks-thumb.webp",
    hero: P + "utvendig-vask-og-voks.webp",
    desc: "Komplett vask ute og inne: håndvask utvendig, støvsuging og avtørking av alle flater innvendig."
  }, {
    id: "polering-basic",
    name: "Polering – Basic",
    cat: "polering",
    catLabel: "Polering",
    price: 1990,
    min: 180,
    level: "Basic",
    popular: true,
    img: P + "polering-thumb.webp",
    hero: P + "polering.webp",
    desc: "Maskinpolering som fjerner lette riper og matthet, og gir lakken dybde og glans."
  }, {
    id: "polering-pro",
    name: "Polering – Pro",
    cat: "polering",
    catLabel: "Polering",
    price: 2990,
    min: 240,
    level: "Pro",
    popular: true,
    img: P + "polering-thumb.webp",
    hero: P + "polering.webp",
    desc: "Flertrinns polering som fjerner dypere riper, svirvelmerker og oksidering."
  }, {
    id: "lakkrens-polering-pro",
    name: "Lakkrens + Polering – Pro",
    cat: "polering",
    catLabel: "Polering",
    price: 4490,
    min: 390,
    level: "Pro",
    guarantee: "NANO ~12 mnd",
    img: P + "detaljering.webp",
    hero: P + "detaljering.webp",
    desc: "Full lakkrens med leire og avfetting, deretter flertrinns polering – lakken føles som ny."
  }, {
    id: "keramisk-lakkforsegling",
    name: "Keramisk lakkforsegling",
    cat: "lakkforsegling",
    catLabel: "Lakkforsegling",
    price: 9990,
    min: 480,
    guarantee: "6 års garanti",
    popular: true,
    img: P + "keramisk-coating-thumb.webp",
    hero: P + "keramisk-coating.webp",
    desc: "Graphene-basert forsegling som beskytter lakken i årevis – selvrensende, med dyp glans."
  }, {
    id: "kontrollvask-rebehandling",
    name: "Kontrollvask & rebehandling",
    cat: "lakkforsegling",
    catLabel: "Lakkforsegling",
    price: 1690,
    min: 150,
    img: P + "keramisk-coating-thumb.webp",
    hero: P + "keramisk-coating.webp",
    desc: "Vedlikeholdsvask og oppfrisking av eksisterende forsegling for varig beskyttelse."
  }, {
    id: "full-shine-basic",
    name: "Full Shine – Basic",
    cat: "full-shine",
    catLabel: "Full Shine",
    price: 6490,
    min: 480,
    level: "Basic",
    img: P + "komplett-bilpleie-thumb.webp",
    hero: P + "komplett-bilpleie.webp",
    desc: "Total renovering ute og inne: vask, lakkrens, polering og innvendig dyprens i én behandling."
  }, {
    id: "full-shine-pro",
    name: "Full Shine – Pro",
    cat: "full-shine",
    catLabel: "Full Shine",
    price: 7490,
    min: 570,
    level: "Pro",
    guarantee: "NANO ~12 mnd",
    popular: true,
    img: P + "komplett-bilpleie-thumb.webp",
    hero: P + "komplett-bilpleie.webp",
    desc: "Vår mest komplette pakke: renovering ute og inne, klimadesinfisering og NANO-beskyttelse."
  }, {
    id: "rens-innvendig",
    name: "Rens innvendig (dyprens)",
    cat: "interior",
    catLabel: "Interiør",
    price: 3990,
    min: 330,
    popular: true,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Grundig dyprens: støvsuging, rens av alle flater, tekstil- og skinnrens av seter."
  }, {
    id: "skinn-rens",
    name: "Skinn rens og behandling",
    cat: "interior",
    catLabel: "Interiør",
    price: 1990,
    min: 120,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Rens og næring av skinnseter som hindrer sprekker og holder skinnet mykt."
  }, {
    id: "rens-enkelt-sete",
    name: "Rens av enkelt sete",
    cat: "interior",
    catLabel: "Interiør",
    price: 590,
    min: 45,
    popular: true,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Flekkfjerning og dyprens av ett enkelt sete – for uhellet som skjedde."
  }, {
    id: "ozon-desinfisering",
    name: "Ozon / desinfisering",
    cat: "interior",
    catLabel: "Interiør",
    price: 1690,
    min: 60,
    img: P + "innvendig-rens-thumb.webp",
    hero: P + "innvendig-rens.webp",
    desc: "Ozonbehandling som fjerner lukt og desinfiserer kupeen – røyk, dyr og mat."
  }, {
    id: "omlegg-balansering",
    name: "Omlegg og balansering",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 1300,
    min: 75,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Omlegging og balansering av hjulene for jevn slitasje og rolig kjøring."
  }, {
    id: "skift-av-hjul",
    name: "Skift av hjul",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 500,
    min: 30,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Rask og trygg omskodding mellom sommer- og vinterhjul mens du er på senteret."
  }, {
    id: "vask-av-hjul",
    name: "Vask av hjul (løse)",
    cat: "hjul",
    catLabel: "Dekk & Felg",
    price: 250,
    min: 20,
    img: P + "hero-hjulskift.webp",
    hero: P + "hero-hjulskift.webp",
    desc: "Vask av løse hjul – rene felger og dekk, klare til lagring eller ny montering."
  }];
  const addOns = [{
    id: "asfalt",
    name: "Asfaltfjerning",
    price: 450,
    min: 30,
    desc: "Løser opp asfaltsprut og tjæreflekker på lakk og terskler."
  }, {
    id: "seterens",
    name: "Seterens (ett sete)",
    price: 500,
    min: 45,
    desc: "Dyprens og flekkfjerning av ett sete i tekstil eller skinn."
  }, {
    id: "rute",
    name: "Ruteforsegling",
    price: 349,
    min: 20,
    desc: "Regnavvisende behandling av frontrute og sideruter."
  }, {
    id: "dekkrens",
    name: "Dekkrensing og felgforsegling",
    price: 299,
    min: 20,
    desc: "Syrefri felgrens med beskyttende forsegling og dekkglans."
  }, {
    id: "ozon",
    name: "Luktfjerning (ozon)",
    price: 599,
    min: 45,
    desc: "Fjerner røyk-, dyre- og matlukt permanent."
  }, {
    id: "dyrehaar",
    name: "Fjerning av dyrehår",
    price: 399,
    min: 30,
    desc: "Spesialrens for hundeeiere — fjerner hår fra seter og tepper."
  }];
  const affinity = {
    "vask-ut-innvendig-premium": ["dekkrens", "seterens", "rute"],
    "polering-basic": ["asfalt", "dekkrens", "rute"],
    "polering-pro": ["asfalt", "dekkrens", "rute"],
    "keramisk-lakkforsegling": ["rute", "dekkrens", "asfalt"],
    "rens-innvendig": ["ozon", "seterens", "dyrehaar"],
    "full-shine-pro": ["dekkrens", "ozon", "seterens"]
  };
  const locations = [{
    slug: "lambertseter",
    name: "Lambertseter",
    center: "Lambertseter senter",
    address: "Cecilie Thoresens vei 17–21",
    zip: "1153",
    city: "Oslo",
    region: "Østlandet",
    phone: "479 20 609",
    lat: 59.876,
    lng: 10.806,
    dist: "3,4 km",
    open: true
  }, {
    slug: "sandvika",
    name: "Sandvika",
    center: "Sandvika Storsenter",
    address: "Brodtkorbs gate 7",
    zip: "1338",
    city: "Sandvika",
    region: "Østlandet",
    phone: "479 27 724",
    lat: 59.8883,
    lng: 10.521,
    dist: "11,2 km",
    open: true
  }, {
    slug: "metro",
    name: "Metro",
    center: "Metro Senter",
    address: "Bibliotekgata 30",
    zip: "1473",
    city: "Lørenskog",
    region: "Østlandet",
    phone: "980 53 599",
    lat: 59.9281,
    lng: 10.962,
    dist: "12,8 km",
    open: true
  }, {
    slug: "ski",
    name: "Ski",
    center: "Ski Storsenter",
    address: "Jernbanesvingen 6",
    zip: "1401",
    city: "Ski",
    region: "Østlandet",
    phone: "479 27 723",
    lat: 59.7195,
    lng: 10.836,
    dist: "18,0 km",
    open: false
  }, {
    slug: "triaden",
    name: "Triaden",
    center: "Triaden Lørenskog",
    address: "Gamleveien 88",
    zip: "1461",
    city: "Lørenskog",
    region: "Østlandet",
    phone: "467 09 966",
    lat: 59.95,
    lng: 11.001,
    dist: "19,4 km",
    open: true
  }, {
    slug: "strommen",
    name: "Strømmen",
    center: "Strømmen Storsenter",
    address: "Stasjonsveien 6",
    zip: "2010",
    city: "Strømmen",
    region: "Østlandet",
    phone: "941 77 814",
    lat: 59.9457,
    lng: 11.006,
    dist: "20,1 km",
    open: true
  }, {
    slug: "asker",
    name: "Asker",
    center: "Trekanten",
    address: "Knud Askers vei 26",
    zip: "1383",
    city: "Asker",
    region: "Østlandet",
    phone: "488 43 795",
    lat: 59.8337,
    lng: 10.4352,
    dist: "22,6 km",
    open: true,
    campaign: "Ny avdeling: 15 % på første bestilling"
  }, {
    slug: "skedsmo",
    name: "Skedsmo",
    center: "Skedsmokorset",
    address: "Furuholtet 1",
    zip: "2020",
    city: "Skedsmokorset",
    region: "Østlandet",
    phone: "484 34 321",
    lat: 59.9772,
    lng: 11.033,
    dist: "26,3 km",
    open: true
  }, {
    slug: "jessheim",
    name: "Jessheim",
    center: "Jessheim Storsenter",
    address: "Ringenveien 4",
    zip: "2050",
    city: "Jessheim",
    region: "Østlandet",
    phone: "456 52 461",
    lat: 60.1533,
    lng: 11.173,
    dist: "44,9 km",
    open: true
  }, {
    slug: "lagunen",
    name: "Lagunen",
    center: "Lagunen Storsenter",
    address: "Laguneveien 1",
    zip: "5239",
    city: "Rådal",
    region: "Vestlandet",
    phone: "479 27 731",
    lat: 60.2966,
    lng: 5.3299,
    dist: "304 km",
    open: true,
    campaign: "Sommerkampanje: 20 % på keramisk coating"
  }, {
    slug: "asane",
    name: "Åsane",
    center: "Åsane Storsenter",
    address: "Åsane Storsenter 42, bygg A",
    zip: "5116",
    city: "Ulset",
    region: "Vestlandet",
    phone: "916 74 554",
    lat: 60.469,
    lng: 5.3235,
    dist: "312 km",
    open: true
  }, {
    slug: "forus",
    name: "Forus",
    center: "Forus Handelspark",
    address: "Fabrikkveien 2",
    zip: "4033",
    city: "Stavanger",
    region: "Vestlandet",
    phone: "457 39 525",
    lat: 58.8918,
    lng: 5.7195,
    dist: "298 km",
    open: true
  }, {
    slug: "sorlandssenteret",
    name: "Sørlandssenteret",
    center: "Sørlandssenteret",
    address: "Barstølveien 35",
    zip: "4636",
    city: "Kristiansand",
    region: "Sørlandet",
    phone: "469 86 698",
    lat: 58.1868,
    lng: 8.0793,
    dist: "246 km",
    open: true,
    campaign: "Gratis felgrens ved Full Shine i august"
  }, {
    slug: "moa",
    name: "Moa",
    center: "Moa Syd",
    address: "Moaveien 1",
    zip: "6018",
    city: "Ålesund",
    region: "Vestlandet",
    phone: "920 72 829",
    lat: 62.4665,
    lng: 6.243,
    dist: "441 km",
    open: true
  }];
  const overrides = {
    "lambertseter:full-shine-pro": 7990,
    "lambertseter:vask-utvendig-premium": 849,
    "forus:full-shine-pro": 6990,
    "sandvika:keramisk-lakkforsegling": 9490,
    "moa:keramisk-lakkforsegling": null,
    "ski:polering-pro": null
  };
  const nok = n => new Intl.NumberFormat("nb-NO").format(n).replace(/\u00A0/g, " ");
  const kr = n => nok(n) + ",-";
  const dur = m => m < 60 ? m + " min" : m % 60 === 0 ? Math.floor(m / 60) + " t" : Math.floor(m / 60) + " t " + m % 60 + " min";
  const priceAt = (slug, id) => {
    const key = slug + ":" + id;
    return key in overrides ? overrides[key] : services.find(s => s.id === id).price;
  };
  const availableAt = (slug, id) => priceAt(slug, id) !== null;
  const vehicles = {
    EB12345: {
      make: "Tesla",
      model: "Model Y",
      year: 2023,
      fuel: "Elektrisk",
      color: "Hvit"
    },
    DR34567: {
      make: "Volkswagen",
      model: "Golf",
      year: 2019,
      fuel: "Bensin",
      color: "Grå"
    },
    SU98765: {
      make: "Volvo",
      model: "XC60",
      year: 2021,
      fuel: "Diesel",
      color: "Svart"
    },
    EK55443: {
      make: "Hyundai",
      model: "Kona Electric",
      year: 2024,
      fuel: "Elektrisk",
      color: "Blå"
    }
  };

  /* Kart. Sett window.HZ_GOOGLE_MAPS_KEY = "din-nøkkel" før data.js lastes, så
     brukes Google Maps Embed API — ellers faller vi tilbake til OpenStreetMap. */
  const mapUrl = (loc, zoom = 14) => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) {
      const q = encodeURIComponent(`Handz On ${loc.name}, ${loc.address}, ${loc.zip} ${loc.city}`);
      return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=${zoom}&language=no&region=NO`;
    }
    const dx = 0.06,
      dy = 0.03;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - dx}%2C${loc.lat - dy}%2C${loc.lng + dx}%2C${loc.lat + dy}&layer=mapnik&marker=${loc.lat}%2C${loc.lng}`;
  };
  const mapUrlAll = () => {
    const key = window.HZ_GOOGLE_MAPS_KEY;
    if (key) return `https://www.google.com/maps/embed/v1/search?key=${key}&q=${encodeURIComponent("Handz On Auto Care Norge")}&zoom=5&language=no&region=NO`;
    return "https://www.openstreetmap.org/export/embed.html?bbox=4.2%2C57.8%2C13.2%2C63.4&layer=mapnik&marker=59.876%2C10.806";
  };
  return {
    categories,
    services,
    addOns,
    affinity,
    locations,
    overrides,
    nok,
    kr,
    dur,
    priceAt,
    availableAt,
    vehicles,
    mapUrl,
    mapUrlAll,
    PHOTOS: P
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tick = __ds_scope.Tick;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.PriceTag = __ds_scope.PriceTag;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.StatStrip = __ds_scope.StatStrip;

__ds_ns.VippsButton = __ds_scope.VippsButton;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RegNrInput = __ds_scope.RegNrInput;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.CategoryFilter = __ds_scope.CategoryFilter;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.BOOKING_STEPS = __ds_scope.BOOKING_STEPS;

__ds_ns.StepProgress = __ds_scope.StepProgress;

__ds_ns.BranchCard = __ds_scope.BranchCard;

__ds_ns.Carousel = __ds_scope.Carousel;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.StampCard = __ds_scope.StampCard;

})();
