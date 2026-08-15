/* ds-boot.js — laster designsystemets komponenter.
   Førstevalg: den kompilerte bunten (_ds_bundle.js). Finnes den ikke ennå
   (f.eks. rett etter at kildene er skrevet), transpileres komponentkildene
   i nettleseren med Babel Standalone slik at kortene og UI-kittene alltid
   rendrer. Kall HZ.boot(baseUrl).then(render).

   Krever at React, ReactDOM og @babel/standalone allerede er lastet. */
(function () {
  var NS = "HandzOnAutoCareDesignSystem_1e2dc9";
  var SOURCES = [
    "components/core/Button.jsx",
    "components/core/VippsButton.jsx",
    "components/core/Icon.jsx",
    "components/core/Badge.jsx",
    "components/core/Chip.jsx",
    "components/core/Card.jsx",
    "components/core/PriceTag.jsx",
    "components/core/StatTile.jsx",
    "components/core/SectionHeader.jsx",
    "components/forms/Input.jsx",
    "components/forms/Select.jsx",
    "components/forms/SearchField.jsx",
    "components/forms/RegNrInput.jsx",
    "components/feedback/Toast.jsx",
    "components/feedback/EmptyState.jsx",
    "components/navigation/Breadcrumb.jsx",
    "components/navigation/CategoryFilter.jsx",
    "components/navigation/StepProgress.jsx",
    "components/navigation/SiteHeader.jsx",
    "components/navigation/SiteFooter.jsx",
    "components/patterns/ServiceCard.jsx",
    "components/patterns/BranchCard.jsx",
    "components/patterns/StampCard.jsx",
    "components/patterns/Carousel.jsx"
  ];
  var EXPORTS = [
    "Button", "VippsButton", "Icon", "Badge", "Chip", "Card", "Tick", "PriceTag",
    "StatTile", "StatStrip", "SectionHeader", "Input", "Select", "SearchField",
    "RegNrInput", "isValidRegNr", "Toast", "EmptyState", "Breadcrumb",
    "CategoryFilter", "StepProgress", "BOOKING_STEPS", "SiteHeader", "SiteFooter",
    "ServiceCard", "BranchCard", "StampCard", "Carousel"
  ];

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
    return code
      .replace(/import\s+React[^;]*from\s*["']react["'];?/g, "")
      .replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']+["'];?/g, "")
      .replace(/^\s*export\s+/gm, "");
  }

  function boot(base) {
    base = base || "";
    if (window[NS]) return Promise.resolve(window[NS]);
    return loadScript(base + "_ds_bundle.js")
      .then(function () { return window[NS]; })
      .catch(function () {
        return Promise.all(
          SOURCES.map(function (p) {
            return fetch(base + p).then(function (r) { return r.text(); });
          })
        ).then(function (parts) {
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

  window.HZ = { boot: boot, NS: NS };
})();
