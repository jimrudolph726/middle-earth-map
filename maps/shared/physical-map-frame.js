const createPhysicalFrameCornerMarkup = ({ position, motif }) => {
  const ornamentByMotif = {
    'star-wave': `
      <path class="atlas-physical-frame__corner-rail" d="M5 31V5h26" />
      <path class="atlas-physical-frame__corner-highlight" d="M9 28V9h19" />
      <circle class="atlas-physical-frame__rail-stud" cx="5" cy="35" r="1.15" />
      <circle class="atlas-physical-frame__rail-stud" cx="35" cy="5" r="1.15" />
      <path class="atlas-physical-frame__wave atlas-physical-frame__wave--primary" d="M9 39c3.5-3.8 7-3.8 10.5 0s7 3.8 10.5 0 7-3.8 10.5 0" />
      <path class="atlas-physical-frame__wave atlas-physical-frame__wave--echo" d="M13 44c3-2.8 6-2.8 9 0s6 2.8 9 0 6-2.8 9 0" />
      <path class="atlas-physical-frame__star" d="M17 7.5 19.1 14.9 25 10.7 20.9 16.8 28.2 18.9 20.9 21 25 27.1 19.1 22.9 17 30.3 14.9 22.9 9 27.1 13.1 21 5.8 18.9 13.1 16.8 9 10.7 14.9 14.9Z" />
      <circle class="atlas-physical-frame__star-core" cx="17" cy="18.9" r="1.45" />
    `,
    'leaf-road': `
      <path class="atlas-physical-frame__corner-rail" d="M5 31V5h26" />
      <path class="atlas-physical-frame__corner-highlight" d="M9 28V9h19" />
      <circle class="atlas-physical-frame__rail-stud" cx="5" cy="35" r="1.15" />
      <circle class="atlas-physical-frame__rail-stud" cx="35" cy="5" r="1.15" />
      <path class="atlas-physical-frame__road" d="M10 46c4.8-9.9 10.9-8.9 15.1-15.8 3.6-5.9 5.1-11.6 4.8-17.2" />
      <path class="atlas-physical-frame__road atlas-physical-frame__road--echo" d="M14 47c4.1-8.1 9.8-8.4 13.7-15.3 3-5.3 4.1-10.7 3.8-16.2" />
      <path class="atlas-physical-frame__leaf atlas-physical-frame__leaf--lower" d="M15.1 38.2c-4.7-.5-7.4-3.2-7.9-7.8 4.5-.3 7.6 2.1 7.9 7.8Z" />
      <path class="atlas-physical-frame__leaf atlas-physical-frame__leaf--middle" d="M24.9 29.3c-4.9-1.1-7.1-4.3-6.8-8.8 4.8.3 7.3 3.6 6.8 8.8Z" />
      <path class="atlas-physical-frame__leaf atlas-physical-frame__leaf--upper" d="M30.1 19.9c3.4-3.6 7.2-4.2 11.2-1.7-2.8 3.8-6.7 4.6-11.2 1.7Z" />
      <circle class="atlas-physical-frame__road-pin" cx="12.1" cy="45.4" r="1.35" />
    `,
  };
  const ornament = ornamentByMotif[motif];

  if (!ornament) {
    return '';
  }

  return `
    <span class="atlas-physical-frame__ornament atlas-physical-frame__ornament--${position}" aria-hidden="true">
      <svg viewBox="0 0 56 56" focusable="false" aria-hidden="true">
        ${ornament}
      </svg>
    </span>
  `;
};

const createPhysicalFrameTexturePattern = ({
  renderer,
  textureLayer,
  textureUrl,
  patternId,
  patternSize,
  paintProperty = 'stroke',
}) => {
  const svg = renderer?._container;
  const path = textureLayer?.getElement?.();

  if (!svg || !path || !textureUrl) {
    return null;
  }

  const svgNamespace = 'http://www.w3.org/2000/svg';
  let defs = svg.querySelector('defs');

  if (!defs) {
    defs = document.createElementNS(svgNamespace, 'defs');
    svg.prepend(defs);
  }

  const pattern = document.createElementNS(svgNamespace, 'pattern');
  pattern.id = patternId;
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  pattern.setAttribute('width', patternSize);
  pattern.setAttribute('height', patternSize);

  const image = document.createElementNS(svgNamespace, 'image');
  image.setAttribute('href', textureUrl);
  image.setAttribute('width', patternSize);
  image.setAttribute('height', patternSize);
  image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  pattern.append(image);
  defs.append(pattern);

  path.style.setProperty(paintProperty, `url("#${patternId}")`);
  return pattern;
};

const expandBoundsByPixels = ({ map, bounds, pixels }) => {
  const northWestPoint = map.latLngToLayerPoint(bounds.getNorthWest());
  const southEastPoint = map.latLngToLayerPoint(bounds.getSouthEast());
  const padding = L.point(pixels, pixels);

  return L.latLngBounds(
    map.layerPointToLatLng(northWestPoint.subtract(padding)),
    map.layerPointToLatLng(southEastPoint.add(padding))
  );
};

export const initializePhysicalMapFrame = ({ map, imageBounds, options }) => {
  if (!options || typeof L.rectangle !== 'function' || typeof L.divIcon !== 'function') {
    return null;
  }

  const {
    theme = 'default',
    motif = null,
    ornamentMaxZoom = Number.POSITIVE_INFINITY,
    frameTextureUrl = null,
    frameTextureSize = 240,
    mat = null,
  } = options;
  const normalizedTheme = String(theme).replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'default';
  const paneName = `atlasPhysicalFrame-${normalizedTheme}`;
  const pane = map.createPane(paneName);

  pane.classList.add(
    'atlas-physical-frame-pane',
    `atlas-physical-frame-pane--${normalizedTheme}`
  );
  pane.style.zIndex = '425';
  pane.style.pointerEvents = 'none';

  const bounds = L.latLngBounds(imageBounds);
  let matLayerGroup = null;
  let matPane = null;
  let matTexturePattern = null;
  let syncMatBounds = null;

  if (mat) {
    const {
      theme: matTheme = `${normalizedTheme}-mat`,
      paneZIndex = 390,
      width = 52,
      minWidth = 28,
      responsiveScale = 0.045,
      textureUrl = null,
      textureSize = 320,
      baseColor = '#44545a',
      tintColor = '#17272e',
      tintOpacity = 0.4,
      edgeColor = '#9ba7a7',
      edgeWeight = 2,
      shadowColor = '#080d10',
      shadowWeight = 16,
      shadowOpacity = 0.58,
    } = mat;
    const normalizedMatTheme = String(matTheme).replace(/[^a-z0-9_-]/gi, '').toLowerCase() || `${normalizedTheme}-mat`;
    const matPaneName = `atlasPhysicalMat-${normalizedTheme}`;
    const matRenderer = typeof L.svg === 'function'
      ? L.svg({ pane: matPaneName, padding: 0.24 })
      : null;
    const getMatWidth = () => Math.min(
      Math.max(1, Number(width) || 52),
      Math.max(
        Math.max(1, Number(minWidth) || 28),
        map.getSize().x * (Number(responsiveScale) || 0.045)
      )
    );

    matPane = map.createPane(matPaneName);
    matPane.classList.add(
      'atlas-physical-mat-pane',
      `atlas-physical-mat-pane--${normalizedTheme}`,
      `atlas-physical-mat-pane--${normalizedMatTheme}`
    );
    matPane.style.zIndex = String(Number(paneZIndex) || 390);
    matPane.style.pointerEvents = 'none';

    const initialMatBounds = expandBoundsByPixels({
      map,
      bounds,
      pixels: getMatWidth(),
    });
    const matLayerDefinitions = [
      {
        role: 'shadow',
        color: shadowColor,
        weight: shadowWeight,
        opacity: shadowOpacity,
        fill: false,
      },
      {
        role: 'surface',
        color: baseColor,
        weight: 1,
        opacity: 1,
        fill: true,
        fillColor: baseColor,
        fillOpacity: 1,
      },
      {
        role: 'tint',
        color: tintColor,
        weight: 0,
        opacity: 0,
        fill: true,
        fillColor: tintColor,
        fillOpacity: tintOpacity,
      },
      {
        role: 'edge',
        color: edgeColor,
        weight: edgeWeight,
        opacity: 0.88,
        fill: false,
      },
    ];
    const matLayers = matLayerDefinitions.map(({ role, ...style }) => L.rectangle(initialMatBounds, {
      ...style,
      pane: matPaneName,
      interactive: false,
      bubblingMouseEvents: false,
      lineCap: 'square',
      lineJoin: 'miter',
      className: `atlas-physical-mat__layer atlas-physical-mat__layer--${role}`,
      ...(matRenderer ? { renderer: matRenderer } : {}),
    }));

    matLayerGroup = L.layerGroup(matLayers).addTo(map);
    matTexturePattern = textureUrl && matRenderer
      ? createPhysicalFrameTexturePattern({
          renderer: matRenderer,
          textureLayer: matLayers.find(({ options: layerOptions }) => (
            layerOptions.className.includes('atlas-physical-mat__layer--surface')
          )),
          textureUrl,
          patternId: `atlas-physical-mat-texture-${normalizedTheme}`,
          patternSize: Math.max(64, Number(textureSize) || 320),
          paintProperty: 'fill',
        })
      : null;
    syncMatBounds = () => {
      const nextBounds = expandBoundsByPixels({
        map,
        bounds,
        pixels: getMatWidth(),
      });

      matLayers.forEach((layer) => layer.setBounds(nextBounds));
    };

    map.on('zoomend resize', syncMatBounds);
  }

  const frameRenderer = typeof L.svg === 'function'
    ? L.svg({ pane: paneName, padding: 0.2 })
    : null;
  const frameLineDefinitions = [
    { role: 'shadow', color: '#081014', weight: 30, opacity: 0.42 },
    { role: 'outer', color: '#344851', weight: 21, opacity: 1 },
    ...(frameTextureUrl
      ? [{ role: 'texture', color: '#71848b', weight: 17, opacity: 0.96 }]
      : []),
    { role: 'rail', color: '#87989b', weight: 11, opacity: 1 },
    { role: 'patina', color: '#4f7180', weight: 6, opacity: 1 },
    { role: 'highlight', color: '#c4cfcd', weight: 2, opacity: 0.92 },
  ];
  const frameLineLayers = frameLineDefinitions.map(({ role, ...style }) => L.rectangle(bounds, {
    ...style,
    pane: paneName,
    fill: false,
    interactive: false,
    bubblingMouseEvents: false,
    lineCap: 'square',
    lineJoin: 'miter',
    className: `atlas-physical-frame__line atlas-physical-frame__line--${role}`,
    ...(frameRenderer ? { renderer: frameRenderer } : {}),
  }));
  const layers = [...frameLineLayers];

  if (motif) {
    const cornerDefinitions = [
      { position: 'north-west', latLng: bounds.getNorthWest() },
      { position: 'north-east', latLng: bounds.getNorthEast() },
      { position: 'south-east', latLng: bounds.getSouthEast() },
      { position: 'south-west', latLng: bounds.getSouthWest() },
    ];

    cornerDefinitions.forEach(({ position, latLng }) => {
      const markup = createPhysicalFrameCornerMarkup({ position, motif });
      if (!markup) return;

      layers.push(L.marker(latLng, {
        pane: paneName,
        interactive: false,
        keyboard: false,
        bubblingMouseEvents: false,
        icon: L.divIcon({
          className: `atlas-physical-frame__corner atlas-physical-frame__corner--${position}`,
          html: markup,
          iconSize: [56, 56],
          iconAnchor: [28, 28],
        }),
      }));
    });
  }

  const layerGroup = L.layerGroup(layers).addTo(map);
  const texturePattern = frameTextureUrl && frameRenderer
    ? createPhysicalFrameTexturePattern({
        renderer: frameRenderer,
        textureLayer: frameLineLayers.find(({ options: layerOptions }) => (
          layerOptions.className.includes('atlas-physical-frame__line--texture')
        )),
        textureUrl: frameTextureUrl,
        patternId: `atlas-physical-frame-texture-${normalizedTheme}`,
        patternSize: Math.max(64, Number(frameTextureSize) || 240),
      })
    : null;
  const syncOrnamentVisibility = () => {
    pane.classList.toggle(
      'atlas-physical-frame-pane--detail',
      map.getZoom() > ornamentMaxZoom
    );
  };

  map.on('zoomend', syncOrnamentVisibility);
  syncOrnamentVisibility();

  return {
    layerGroup,
    matLayerGroup,
    matPane,
    pane,
    destroy() {
      map.off('zoomend', syncOrnamentVisibility);
      if (syncMatBounds) {
        map.off('zoomend resize', syncMatBounds);
      }
      map.removeLayer(layerGroup);
      if (matLayerGroup) {
        map.removeLayer(matLayerGroup);
      }
      texturePattern?.remove();
      matTexturePattern?.remove();
      matPane?.remove();
      pane.remove();
    },
  };
};
