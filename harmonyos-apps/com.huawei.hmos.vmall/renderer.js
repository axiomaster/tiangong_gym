/*
 * renderSpec(spec, mountEl) -> stage element
 *
 * spec: App Generation Spec (schema.input_spec.InputSpec as JSON)
 *   root/id/type/rect/content/asset_path/style/actions/children
 *   rect: [x1, y1, x2, y2] corners in physical px; fontSize values are fp (vp)
 *   and are scaled by spec.resolution into physical px.
 */
(function () {
  "use strict";

  var HIDDEN_VISIBILITY = { "Visibility.Hidden": 1, "Visibility.None": 1 };
  var SCROLLABLE = { Scroll: 1, List: 1 };

  function px(n) {
    return n + "px";
  }

  /* HarmonyOS colors are #AARRGGBB (alpha first); CSS wants #RRGGBBAA. */
  function argbToCss(value) {
    if (typeof value !== "string" || value.charAt(0) !== "#") return undefined;
    var hex = value.slice(1);
    if (hex.length === 6) return "#" + hex;
    if (hex.length === 8) return "#" + hex.slice(2) + hex.slice(0, 2);
    return undefined;
  }

  /* "TextAlign.Center" -> "center", "HorizontalAlign.Start" -> "start" */
  function enumSuffix(value) {
    if (typeof value !== "string" || value.indexOf(".") < 0) return undefined;
    var suffix = value.slice(value.indexOf(".") + 1).toLowerCase();
    return suffix === "start" ? "left" : suffix === "end" ? "right" : suffix;
  }

  function styleToCss(node, parentRect, resolution) {
    var s = node.style || {};
    var css = {};
    var rect = node.rect || [0, 0, 0, 0];
    var pRect = parentRect || [0, 0, 0, 0];
    css.left = px(rect[0] - pRect[0]);
    css.top = px(rect[1] - pRect[1]);
    css.width = px(rect[2] - rect[0]);
    css.height = px(rect[3] - rect[1]);
    if (s.backgroundColor) css.backgroundColor = argbToCss(s.backgroundColor);
    if (s.backgroundImage && s.backgroundImage.indexOf("url(") === 0) {
      css.backgroundImage = s.backgroundImage;
      css.backgroundSize = "100% 100%"; // crop matches the node rect exactly
    }
    if (s.fontColor) css.color = argbToCss(s.fontColor);
    if (s.fontSize) css.fontSize = px(s.fontSize * resolution); // fp -> physical px
    if (s.fontWeight != null) css.fontWeight = String(s.fontWeight);
    if (s.opacity != null) css.opacity = String(s.opacity);
    if (s.textAlign) {
      var align = enumSuffix(s.textAlign);
      if (align) css.textAlign = align;
    }
    return css;
  }

  function applyCss(el, css) {
    for (var key in css) {
      if (css[key] !== undefined) el.style[key] = css[key];
    }
  }

  function renderNode(node, parent, parentRect, resolution) {
    if (!node || !node.type) return null;
    var style = node.style || {};
    var el = document.createElement(node.type === "Image" ? "img" : "div");
    el.className = "ark-node" + (node.type === "Text" ? " ark-text" : "");
    el.dataset.componentId = String(node.id);
    el.dataset.nodeType = node.type;
    if (node.actions && node.actions.length) {
      el.dataset.actions = node.actions.join(",");
    }

    var isHidden = HIDDEN_VISIBILITY[style.visibility];
    // Inactive/empty TabContent nodes should not overlay the active tab
    if (node.type === "TabContent" && (!node.children || node.children.length === 0)) {
      isHidden = true;
    }
    if (isHidden) {
      el.style.display = "none";
    }
    if (node.type === "Image") {
      if (node.asset_path) el.src = node.asset_path;
      el.alt = node.content || "";
      el.draggable = false;
    } else if (node.content) {
      el.textContent = node.content;
    }
    if (SCROLLABLE[node.type]) {
      el.style.overflowY = "auto"; // scroll containers keep their recorded viewport box
    }
    applyCss(el, styleToCss(node, parentRect, resolution));
    parent.appendChild(el);
    var children = node.children || [];
    for (var i = 0; i < children.length; i++) {
      renderNode(children[i], el, node.rect, resolution);
    }
    return el;
  }

  function renderSpec(spec, mountEl) {
    if (!spec || !spec.root) throw new Error("renderSpec: invalid spec (missing root)");
    mountEl.innerHTML = "";
    var stage = document.createElement("div");
    stage.className = "ark-stage";
    stage.style.width = px(spec.viewport.width);
    stage.style.height = px(spec.viewport.height);
    var rootBg = argbToCss(spec.root.style && spec.root.style.backgroundColor);
    stage.style.backgroundColor = rootBg || "#FFFFFF";
    mountEl.appendChild(stage);

    var stageRect = [0, 0, spec.viewport.width, spec.viewport.height];
    var root = renderNode(spec.root, stage, stageRect, spec.resolution);
    if (root) {
      root.style.left = "0px";
      root.style.top = "0px";
      root.style.position = "relative"; // root defines the flow, children stay absolute
    }
    window.__SPEC_RENDERED__ = true;
    return stage;
  }

  window.renderSpec = renderSpec;
})();
