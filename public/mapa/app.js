/**
 * ORIENTESV - LÓGICA DE APLICACIÓN
 * Mapa interactivo regional de la zona oriental de El Salvador usando Leaflet.js,
 * geocodificación libre, visualización de GeoJSON y recortes de máscara invertida.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // 1. ESTADO DE LA APLICACIÓN
    // ==========================================================================
    const state = {
        activeStyle: 'streets',
        orienteGeoJson: null, // Guardará la data GeoJSON original
        selectedDepartment: null // Guardará el nombre del departamento seleccionado
    };

    // Coordenadas por defecto (Zona Oriental, El Salvador)
    const defaultCoords = [13.6, -88.2];
    const defaultZoom = 9;

    // ==========================================================================
    // 2. INICIALIZACIÓN DEL MAPA LEAFLET
    // ==========================================================================
    const map = L.map('map', {
        zoomControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false // Ocultar créditos para un look 100% minimalista
    }).setView(defaultCoords, defaultZoom);

    // Definición de Capas de Mapa (Cargamos la estándar para ver las calles y caminos de los departamentos)
    const mapLayers = {
        streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: ''
        })
    };

    mapLayers.streets.addTo(map);

    // ==========================================================================
    // 3. CAMBIO DE ESTILOS DE MAPA
    // ==========================================================================
    const styleButtons = document.querySelectorAll('.style-btn');
    if (styleButtons.length > 0) {
        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Selector inactivo ya que no usamos capas de calles
            });
        });
    }

    // ==========================================================================
    // 4. BÚSQUEDA DE CIUDADES (SEGURO CONTRA ELEMENTOS NULOS)
    // ==========================================================================
    const mapSearchInput = document.getElementById('map-search-input');
    const mapSearchBtn = document.getElementById('map-search-btn');

    const searchLocation = async () => {
        if (!mapSearchInput) return;
        const query = mapSearchInput.value.trim();
        if (!query) return;

        try {
            const searchQuery = query.toLowerCase().includes('el salvador') ? query : `${query}, El Salvador`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const result = data[0];
                    map.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 12);
                }
            }
        } catch (error) {
            console.error('Error de geocodificación:', error);
        }
    };

    if (mapSearchBtn && mapSearchInput) {
        mapSearchBtn.addEventListener('click', searchLocation);
        mapSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });
    }

    // ==========================================================================
    // 5. CAPA GEOGRÁFICA INTERACTIVA - ORIENTE DE EL SALVADOR (GEOJSON)
    // ==========================================================================
    


    let geojsonLayer;
    let maskLayer = null;

    // Función para dar estilo a las características geográficas
    function styleFeature(feature) {
        if (state.selectedDepartment) {
            // El departamento seleccionado se muestra transparente
            // pero con un borde blanco nítido y brillante
            return {
                className: 'interactive-svg-path',
                fillColor: '#ffffff',
                fillOpacity: 0.0001, // Prácticamente invisible, pero interactivo en conjunto con CSS
                weight: 3,
                opacity: 1,
                color: '#ffffff',
                dashArray: ''
            };
        }

        // Todos los departamentos transparentes por defecto, distinguidos por el color de sus contornos
        return {
            className: 'interactive-svg-path',
            fillColor: '#ffffff',
            fillOpacity: 0.0001, // Prácticamente invisible, pero interactivo en conjunto con CSS
            weight: 2,
            opacity: 1,
            color: feature.properties.COLOR || '#6b7280', // Color de contorno representativo
            dashArray: ''
        };
    }

    // Resaltar al pasar el mouse por encima
    function highlightFeature(e) {
        // Si hay un departamento seleccionado, no cambiar estilo al pasar el mouse
        if (state.selectedDepartment) return;

        const layer = e.target;

        // Evitar volver a aplicar el resaltado si ya está activo
        if (layer._isHighlighted) return;
        layer._isHighlighted = true;

        layer.setStyle({
            weight: 3.5,
            color: '#ffffff', // Contorno blanco brillante al pasar el cursor
            dashArray: '',
            fillOpacity: 0.0001
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // Quitar el resaltado al sacar el mouse
    function resetHighlight(e) {
        // Si hay un departamento seleccionado, no hacer nada
        if (state.selectedDepartment) return;

        const layer = e.target;
        const originalEvent = e.originalEvent;

        // Si el evento fue disparado por bringToFront(), el cursor sigue estando sobre el elemento.
        // Verificamos si el elemento bajo las coordenadas del mouse sigue siendo el path.
        if (originalEvent) {
            const elementUnderCursor = document.elementFromPoint(originalEvent.clientX, originalEvent.clientY);
            if (elementUnderCursor === layer._path) {
                return; // Ignorar el evento "fake" de mouseout
            }
        }

        // Marcar como no resaltado y restablecer el estilo llamando a styleFeature
        layer._isHighlighted = false;
        layer.setStyle(styleFeature(layer.feature));
    }

    // Genera una máscara invertida para tapar el resto del mapa del mundo excepto la/s zona/s indicada/s
    function applyMask(features) {
        if (maskLayer) {
            map.removeLayer(maskLayer);
            maskLayer = null;
        }

        // Coordenadas que engloban el mundo entero
        const worldCoords = [
            [-90, -180],
            [90, -180],
            [90, 180],
            [-90, 180],
            [-90, -180]
        ];

        let latlngs = [worldCoords];

        // Normalizar features a un array (puede ser una sola feature u Oriente completo)
        const featuresArray = Array.isArray(features) ? features : [features];

        featuresArray.forEach(feature => {
            const geom = feature.geometry;
            if (geom.type === 'Polygon') {
                const ring = geom.coordinates[0].map(coord => [coord[1], coord[0]]);
                latlngs.push(ring);
            } else if (geom.type === 'MultiPolygon') {
                geom.coordinates.forEach(polyCoords => {
                    const ring = polyCoords[0].map(coord => [coord[1], coord[0]]);
                    latlngs.push(ring);
                });
            }
        });

        // Crear la capa de máscara
        maskLayer = L.polygon(latlngs, {
            fillColor: '#ffffff', // Coincide con el fondo blanco de la web
            fillOpacity: 1.0,     // Totalmente sólido para ocultar el resto del mundo y dejar solo los departamentos visibles
            color: 'transparent',
            weight: 0,
            interactive: false // Hace que los clics pasen al mapa de fondo
        }).addTo(map);
    }

    // Zoom y aislamiento al hacer clic en un departamento
    function zoomToFeature(e) {
        const layer = e.target;
        const props = layer.feature.properties;
        
        // Detener propagación para evitar disparar el evento click general del mapa
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
        }

        // Establecer departamento seleccionado
        state.selectedDepartment = props.NAM;

        // Notificar a la aplicación Next.js padre
        window.parent.postMessage({ type: 'SELECT_DEPARTMENT', department: props.NAM }, '*');

        // Filtrar features del GeoJSON original
        const filteredFeatures = state.orienteGeoJson.features.filter(
            f => f.properties.NAM === props.NAM
        );
        const filteredData = {
            type: "FeatureCollection",
            features: filteredFeatures
        };

        // Aplicar recorte (máscara invertida) para solo este departamento
        applyMask(layer.feature);

        // Cargar solo el seleccionado
        cargarGeoJSON(filteredData);

        // Mostrar botón Regresar
        const backBtn = document.getElementById('btn-back-map');
        if (backBtn) {
            backBtn.style.display = 'flex';
        }
    }

    // Asignar eventos a cada departamento
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    // Cargar el GeoJSON
    const cargarGeoJSON = (data) => {
        if (geojsonLayer) {
            map.removeLayer(geojsonLayer);
        }

        geojsonLayer = L.geoJson(data, {
            style: styleFeature,
            onEachFeature: onEachFeature
        }).addTo(map);

        // Ajustar vista del mapa
        if (state.selectedDepartment) {
            map.fitBounds(geojsonLayer.getBounds(), { padding: [40, 40] });
        } else {
            map.fitBounds(geojsonLayer.getBounds());
        }
    };

    // Cargar datos GeoJSON desde la variable global local
    if (typeof orienteGeoJsonData !== 'undefined') {
        state.orienteGeoJson = orienteGeoJsonData;
        
        // Recortar toda la zona oriental al inicio
        applyMask(orienteGeoJsonData.features);

        cargarGeoJSON(orienteGeoJsonData);
    } else {
        console.error('Error: La variable orienteGeoJsonData no está definida.');
    }

    // Controlar click en botón Regresar
    const backBtn = document.getElementById('btn-back-map');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            state.selectedDepartment = null;

            // Notificar a la aplicación Next.js padre
            window.parent.postMessage({ type: 'CLEAR_DEPARTMENT' }, '*');

            // Volver a recortar toda la zona oriental
            applyMask(state.orienteGeoJson.features);

            // Cargar de nuevo todo el mapa de Oriente
            cargarGeoJSON(state.orienteGeoJson);

            // Ocultar botón de regresar
            backBtn.style.display = 'none';
        });
    }

    // Agregar Leyenda de Departamentos
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const departments = ['La Unión', 'San Miguel', 'Usulután', 'Morazán'];
        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ec4899'];
        
        div.innerHTML = `<h4 style="margin: 0 0 6px 0; font-size: 0.85rem; font-family: var(--font-heading); color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 4px;">Departamentos</h4>`;
        
        const labels = [];
        for (let i = 0; i < departments.length; i++) {
            labels.push(`<i style="background:${colors[i]}"></i> ${departments[i]}`);
        }
        
        div.innerHTML += labels.join('<br>');
        return div;
    };

    // Escuchar mensajes del padre Next.js para sincronizar clicks desde la lista de sucursales
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'HIGHLIGHT_DEPARTMENT') {
            const deptName = event.data.department;
            if (state.selectedDepartment === deptName) return; // Evitar ciclos de eventos
            
            geojsonLayer.eachLayer(layer => {
                if (layer.feature && layer.feature.properties && layer.feature.properties.NAM === deptName) {
                    // Disparar zoom y selección simulando evento click
                    zoomToFeature({ target: layer });
                }
            });
        } else if (event.data && event.data.type === 'CLEAR_HIGHLIGHT') {
            const backBtn = document.getElementById('btn-back-map');
            if (backBtn && state.selectedDepartment) {
                backBtn.click();
            }
        }
    });

    // legend.addTo(map);
});
