/**
 * Alaprajz-tervező konstruktor
 * @param options
 * @constructor
 */
FloorPlanner = function (options) {
    /**
     * 1 méter hány pixel
     * @type {number}
     */
    let meter = 60;

    /**
     * Default options
     */
    this.options = {

        config: {

            /**
             * Rajzvászon HTML elem
             */
            floorplanElementSelector: '#floorplan',

            /**
             * Méterskála HTML elem
             */
            meterScaleElement: '#meter-scale',

            /**
             * Fal rajzolás mód HTML container elem
             */
            wallDrawingContainerElement: '#wall-drawing-close',

            /**
             * Fal rajzolás mód gomb HTML elem
             */
            wallDrawingButtonElement: '#wall-drawing-close > button',

            /**
             * Állapotsor kiírás HTML elem
             */
            statusBarTextElement: '#status-bar > span',

            /**
             * Üzemmódváltó gombok HTML selector
             */
            changeModeElementsSelector: '.change-mode',

            /**
             * Üzemmód kijelző HTML selector
             */
            dataModeElementsSelector: 'button[data-mode]',

            /**
             * 1 méter hány pixel
             */
            meter: meter,

            /**
             * Rácsosztás hány pixel
             */
            gridSize: 60,

            /**
             * Snap rácsosztás hány pixel
             */
            snapGridSize: 5,

            /**
             * Képek elérési útja
             */
            imagesPath: 'images',

            /**
             * Automatikus mentés local storage-ba
             */
            autosave: true,

            /**
             * Grid zoom beállításai
             */
            zoom: {

                /**
                 * Zoom gombokkal
                 */
                zoomElementsSelector: '.zoom',

                /**
                 * Zoom csúszka HTML elem
                 */
                zoomSliderRangeInputSelector: '#zoom-range',

                /**
                 * Legtávolabbi zoom
                 */
                minZoom: 0,

                /**
                 * Legközelebbi zoom
                 */
                maxZoom: 12,

                /**
                 * Alap zoom
                 */
                defaultZoom: 9,

                /**
                 * Zoom 1 lépcső pixelben
                 */
                zoomStep: 180,
            },

            /**
             * Rajzvászon mozgatásának beállításai
             */
            move: {

                /**
                 * Mozgatás gombbal (ha nem húzva van)
                 */
                moveElementSelector: '.move',

                /**
                 * Mozgatás egysége gombbal (ha nem húzva van), pixelben
                 * (Ha a rácsállandó többszöröse, nem látszik a mozgatás)
                 */
                moveStep: 30,
            },

            /**
             * Fal beállításai
             */
            wall: {

                /**
                 * Fal színe
                 */
                color: "#333333",

                /**
                 * Folyamatban lévő rajzoláskor a még nem lerakott fal id-ja
                 */
                tmpWallElementId: "tmp-wall",

                /**
                 * Folyamatban lévő rajzoláskor a még nem lerakott fal színe
                 */
                pendingColor: "#666666",

                /**
                 * Folyamatban lévő rajzoláskor a még nem lerakott fal áttetszősége
                 */
                pendingOpacity: 0.6,

                /**
                 * Fal-fogantyú színe
                 */
                handleColor: "#e2e5ff",

                /**
                 * Sarok-fogantyú körvonalának színe
                 */
                nodeHandleFillColor: '#5864e6',

                /**
                 * Sarok-foganytú szélessége
                 */
                nodeHandleWidth: 14,

                /**
                 * Sarok-foganytú magassága
                 */
                nodeHandleHeight: 14,

                /**
                 * Főfal: 30 cm vastag
                 */
                defaultThickness: meter * 0.3,

                /**
                 * Válaszfal: 15 cm vastag
                 */
                defaultSlimThickness: meter * 0.15,

                /**
                 * Minimum vastagság: 5 cm
                 */
                minimumThickness: 5,

                /**
                 * Maximális falvastagság: 60 cm
                 */
                maximumThickness: 60,

                /**
                 * Minimálisan rajzolható fal hossza: 30 cm
                 */
                minimumWallLength: meter * 0.3,

                /**
                 * Ideiglenes fal konténer HTML element ID (nem! selector)
                 */
                tmpWallContainerElementId: 'tmp-container-wall',

                /**
                 * Fal konténer HTML element ID (nem! selector)
                 */
                wallContainerElementId: 'wall-container',

            },

            /**
             * Szoba beállításai
             */
            room: {

                /**
                 * Szoba konténer HTML element ID (nem! selector)
                 */
                roomContainerElementId: 'room-container',

                /**
                 * Szoba kitöltő színe
                 */
                fillColor: "#ffffff",
            },

            /**
             * Entitás beállításai
             */
            entity: {

                /**
                 * Ideiglenes fal konténer HTML element ID (nem! selector)
                 */
                tmpEntityContainerElementId: 'tmp-container-entity',

                /**
                 * Entitás konténer HTML element ID (nem! selector)
                 */
                entityContainerElementId: 'entity-container',

                /**
                 * Fogantyú körvonalának színe
                 */
                handleStrokeColor: "#5864e6",

                /**
                 * Fogantyú kitöltő színe
                 */
                handleFillColor: '#e2e5ff',

                /**
                 * Szöveg színe
                 */
                textColor: '#333333',

            },

            /**
             * Debug lehetőségek
             */
            debugMode: {

                /**
                 * Debug bekapcsolva
                 */
                enabled: true,

                /**
                 * Debug rajzelemek konténere HTML element ID (nem! selector)
                 */
                debugContainerElementId: 'debug-container',

                /**
                 * Debug pont színe
                 */
                pointColor: 'red',

                /**
                 * Debug síkidom színe
                 */
                polygonColor: 'blue',

            }
        },

        /**
         * Kiírt üzenetek
         */
        messages: {
            selectMode: 'Elem kijelölése',
            wallDrawingMode: 'Fal rajzolása',
            doorWindowMode: 'Nyílászáró elhelyezése',
        },

        /**
         * Eseménykezelő függvények
         */
        callbacks: {

            /**
             * Inicializálás vége
             */
            afterInit: null,

            /**
             * Általános üzemmódáltás
             */
            modeChanged: null,

            /**
             * Entitás kijelölése
             */
            entitySelect: null,

            /**
             * Entitás mozgatása
             */
            entityMove: null,

            /**
             * Entitás mozgatásának vége
             */
            entityMoveEnd: null,

            /**
             * Fal kijelölése
             */
            wallSelect: null,

            /**
             * Fal mozgatása
             */
            wallMove: null,

            /**
             * Fal mozgatásának vége
             */
            wallMoveEnd: null,

            /**
             * Bármilyen elem kijelölésének megszüntetése
             */
            deselect: null,

            /**
             * Zoom-olás
             */
            zoom: null,

            /**
             * Művelet-előzmények változtak
             */
            historyChanged: null,

        }

    };

    // Initialization
    this._init(options);
};

/**
 * Alaprajz-tervező
 */
FloorPlanner.prototype = {

    constructor: FloorPlanner,

    /**
     * Merge two or more objects together.
     * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
     * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param   {Object}   objects  The objects to merge together
     * @returns {Object}            Merged values of defaults and options
     */
    extend: function () {
        let self = this;
        let extended = {};
        let deep = false;
        let i = 0;
        // Check if a deep merge
        if (Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }
        // Merge the object into the extended object
        let merge = function (obj) {
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    // If property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = self.extend(deep, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        // Loop through each object and conduct a merge
        for (; i < arguments.length; i++) {
            merge(arguments[i]);
        }
        return extended;
    },

    _init: function (options) {
        this.initOptions(options);
        this.initVariables();
        this.initDimensions();
        this.initEventHandlers();

        // Félbehagyott alaprajt betöltése, ha van
        this.load();

        if (this.options.callbacks.afterInit && this.options.callbacks.afterInit instanceof Function) {
            this.options.callbacks.afterInit.call(this);
        }
    }
};

/**
 * Konfiguráció betöltése
 * @param options
 */
FloorPlanner.prototype.initOptions = function (options) {
    this.options = this.extend(true, this.options, options);
};

/**
 * Event handlers
 */
FloorPlanner.prototype.initEventHandlers = function() {

    let self = this;

    /**
     * Window átméretezésének kezelése
     */
    help(window).on('resize', this.resizeFloorplan.bind(self));

    /**
     * Egér-eventek
     */
    help(this.options.config.floorplanElementSelector).on("mouseup", self.mouseUp.bind(self));
    help(this.options.config.floorplanElementSelector).on("mousedown", self.mouseDown.bind(self));
    help(self.options.config.floorplanElementSelector).on('mousemove',
        self.throttle(
            function(event) {
                self.mouseMove(event);
            },30
        ).bind(self)
    );
    let scrollFunction = function(event) {
        event.preventDefault();
        self.adjustZoom((event.detail < 0) ? 'zoomIn' : (event.wheelDelta > 0) ? 'zoomIn' : 'zoomOut', event);
    };
    help(self.options.config.floorplanElementSelector).on('mousewheel', scrollFunction);
    help(self.options.config.floorplanElementSelector).on('DOMMouseScroll', scrollFunction);

    /**
     * ZoomIn, ZoomOut
     */
    help(self.options.config.zoom.zoomElementsSelector).on('click', function() {
        let zoomAction = help(this).data('zoom');
        self.adjustZoom(zoomAction);
    });

    /**
     * Fal rajzolás befejezés
     */
    help(self.options.config.wallDrawingButtonElement).on('click', function() {
        self.endCurrentWallDrawing(true);
    });

    /**
     * Zoom csúszka
     * @type {*[]}
     */
    let rangeInput = help(self.options.config.zoom.zoomSliderRangeInputSelector);
    if (rangeInput.length) {
        rangeInput.attr('min', this.options.config.zoom.minZoom);
        rangeInput.attr('max', this.options.config.zoom.maxZoom);
        rangeInput.val(this.options.config.zoom.defaultZoom);
        rangeInput.on('change', function() {
            self.setZoom(help(this).val());
        });
        rangeInput.on('input', function() {
            self.setZoom(help(this).val());
        });
        rangeInput[0].removeAttribute('disabled');
    }

    /**
     * Billentyűk
     */
    help(document).on('keydown', this.keyDown.bind(self));

    /**
     * Rajzvászon mozgatása
     */
    help(self.options.config.move.moveElementsSelector).on('click', function() {
        let moveDirection = help(this).data('move');
        self.moveCanvas(moveDirection, self.options.config.move.moveStep);
    });

    this.initChangeModeElements();
};

/**
 * Üzemmódváltás
 */
FloorPlanner.prototype.initChangeModeElements = function() {
    let self = this;

    let initClickFunction = function() {
        let newMode = help(this).data('mode');
        let newModeOptions;

        switch (newMode) {
            case 'selectMode':
                self.removeHandle();
                newModeOptions = {};
                break;
            // Fal rajzolása
            case 'wallDrawingMode':
                newModeOptions = {
                    wall: {
                        thickness: help(this).data('thickness') === "normal" ? self.options.config.wall.defaultThickness : (help(this).data('thickness') === "slim" ? self.options.config.wall.defaultSlimThickness : self.options.config.wall.defaultThickness)
                    }
                };
                break;
            // Nyílászáró elhelyezése
            case 'doorWindowMode':
                newModeOptions = {
                    elementSelected: true, // ki van ugyanis jelölve a fal, ahol a helyi menüben megnyomtuk az ajtó, ablak... gombot
                    entity: {
                        group: 'entityOnWall',
                        kind: help(this).data('kind'), // door, window
                        look: 'single', // TODO majd lehet többféle ajtó, ablak...
                        width: 60,
                    }
                };
                break;
        }

        self.setMode(newMode, newModeOptions);
    };

    help(self.options.config.changeModeElementsSelector).off('click', initClickFunction);
    help(self.options.config.changeModeElementsSelector).on('click', initClickFunction);
};

/**
 * Általánosan használt objektumszintű változók inicializálása
 */
FloorPlanner.prototype.initVariables = function() {

    let floorplanDimensions = this.getFloorplanDimensions();

    /**
     * Teljes rajzvászonhoz szélessége
     * @type {number}
     */
    this.floorplanWidth = floorplanDimensions.width;

    /**
     * Teljes rajzvászonhoz magassága
     * @type {number}
     */
    this.floorplanHeight = floorplanDimensions.height;

    /**
     * Viewport szélessége
     * @type {number}
     */
    this.viewportWidth = this.floorplanWidth;

    /**
     * Viewport magassága
     * @type {number}
     */
    this.viewportHeight = this.floorplanHeight;

    /**
     * Viewport eltolása
     * @type {{x: number, y: number}}
     */
    this.viewportOrigin = {
        x: 0,
        y: 0
    };

    /**
     * Rögzített pozíció
     * @type {{x: number, y: number}}
     */
    this.pinnedPosition = {
        x: 0,
        y: 0
    };

    /**
     * Aktuális pozíció
     * @type {{x: number, y: number}}
     */
    this.currentPosition = {
        x: 0,
        y: 0
    };

    /**
     * Zoom értéke
     * @type {number}
     */
    this.zoom = this.options.config.zoom.defaultZoom;

    /**
     * Üzemmód
     * @type {string}
     */
    this.mode = 'selectMode';

    /**
     * Üzemmód plusz paraméterei
     * @type {{}}
     */
    this.modeOptions = {};

    /**
     * Rácsra tartás
     * @type {boolean}
     */
    this.snapToGrid = true;

    // Default cursor: rajzvászon mozgatása
    this.cursor('move');

    /**
     * Metaadatok (pl. cím)
     * @type {{}}
     */
    this.meta = {};

    /**
     * Falak
     * @type {*[]}
     */
    this.walls = [];

    /**
     * Szobák
     * @type {*[]}
     */
    this.rooms = [];

    /**
     * Entitások
     * @type {*[]}
     */
    this.entities = [];

    /**
     * Művelet-előzmények
     * @type {*[]}
     */
    this.history = [];

    /**
     * Visszavonás szintje
     * @type {number}
     */
    this.historyBackOffset = 0;

    /**
     * Ideiglenes fal HTML element selector
     * @type {string}
     */
    this.options.config.wall.tmpWallElement = '#' + this.options.config.wall.tmpWallElementId;

    /**
     * Ideiglenes fal konténer HTML element selector
     * @type {string}
     */
    this.options.config.wall.tmpWallContainerElement = '#' + this.options.config.wall.tmpWallContainerElementId;

    /**
     * Fal konténer HTML element selector
     * @type {string}
     */
    this.options.config.wall.wallContainerElement = '#' + this.options.config.wall.wallContainerElementId;

    /**
     * Szoba konténer HTML element selector
     * @type {string}
     */
    this.options.config.room.roomContainerElement = '#' + this.options.config.room.roomContainerElementId;

    /**
     * Ideiglenes entitás konténer HTML element selector
     * @type {string}
     */
    this.options.config.entity.tmpEntityContainerElement = '#' + this.options.config.entity.tmpEntityContainerElementId;

    /**
     * Entitás konténer HTML element selector
     * @type {string}
     */
    this.options.config.entity.entityContainerElement = '#' + this.options.config.entity.entityContainerElementId;

    /**
     * Viewport aránya a teljes rajzvászonhoz
     * @type {number}
     */
    Object.defineProperty(this, 'factor', {
        get: function() {
            return this.viewportWidth / this.floorplanWidth;
        }
    });

    /**
     * Teljes rajzvászonhoz szélesség/magasság aránya
     * @type {number}
     */
    Object.defineProperty(this, 'floorplanWidthHeightRatio', {
        get: function() {
            return this.floorplanWidth / this.floorplanHeight;
        }
    });

    /**
     * Rajzvászon befoglalójának ofszetje
     * @type {{top: *, left: *}}
     */
    Object.defineProperty(this, 'offset', {
        get: function() {
            let floorplanElementBoundingClientRect = help(this.options.config.floorplanElementSelector)[0].getBoundingClientRect();
            return {
                top: floorplanElementBoundingClientRect.top + document.body.scrollTop,
                left: floorplanElementBoundingClientRect.left + document.body.scrollLeft
            }
        }
    });

    this.initDimensions();

};

/**
 * Alaprajz exportálása JSON-be
 * @returns {string}
 */
FloorPlanner.prototype.toJSON = function() {

    let self = this;

    let copy = {
        meta: this.meta,
        walls: function() {
            let walls = [];
            for (let i in self.walls) {
                walls.push({
                    type: self.walls[i].type,
                    start: self.walls[i].start,
                    end: self.walls[i].end,
                    thickness: self.walls[i].thickness,
                    former: self.walls[i].former !== null ? self.walls.indexOf(self.walls[i].former) : null,
                    latter: self.walls[i].latter !== null ? self.walls.indexOf(self.walls[i].latter) : null,
                    coordinates: [],
                });
            }
            return walls;
        }(),
        entities: function() {
            let entities = [];
            for (let i in self.entities) {
                entities.push({
                    group: self.entities[i].group,
                    kind: self.entities[i].kind,
                    look: self.entities[i].look,
                    coordinates: self.entities[i].coordinates,
                    angleDeg: self.entities[i].angleDeg,
                    entityWidth: self.entities[i].entityWidth,
                    entityHeight: self.entities[i].entityHeight,
                    entityParameters: self.entities[i].entityParameters,
                });
            }
            return entities;
        }(),
    };

    return JSON.stringify(copy);
};

/**
 * Alaprajz ürítése
 * @param withHistory művelet-előzmények törlésével
 */
FloorPlanner.prototype.reset = function (withHistory = false) {

    this.meta = {};
    this.walls = [];
    this.rooms = [];
    this.entities = [];

    help(this.options.config.wall.wallContainerElement).empty();
    help(this.options.config.wall.tmpWallContainerElement).empty();
    help(this.options.config.room.roomContainerElement).empty();
    help(this.options.config.entity.tmpEntityContainerElement).empty();
    help(this.options.config.entity.entityContainerElement).empty();

    help(this.options.config.wallDrawingContainerElement)[0].classList.add('d-none');

    if (withHistory) {
        this.history = [];
    }

};

/**
 * Alaprajz betöltése JSON-ből
 * @param json
 */
FloorPlanner.prototype.fromJSON = function(json) {

    // szoba
    // json = "{\"walls\":[{\"type\":null,\"start\":{\"x\":600,\"y\":180},\"end\":{\"x\":900,\"y\":180},\"thickness\":18,\"former\":3,\"latter\":1,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":900,\"y\":180},\"end\":{\"x\":900,\"y\":420},\"thickness\":18,\"former\":0,\"latter\":2,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":900,\"y\":420},\"end\":{\"x\":600,\"y\":420},\"thickness\":18,\"former\":1,\"latter\":3,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":600,\"y\":420},\"end\":{\"x\":600,\"y\":180},\"thickness\":18,\"former\":2,\"latter\":0,\"coordinates\":[]}]}";

    // szoba 2 ablakkal
    // json = "{\"walls\":[{\"type\":null,\"start\":{\"x\":600,\"y\":175},\"end\":{\"x\":905,\"y\":175},\"thickness\":18,\"former\":3,\"latter\":1,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":905,\"y\":175},\"end\":{\"x\":905,\"y\":420},\"thickness\":18,\"former\":0,\"latter\":2,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":905,\"y\":420},\"end\":{\"x\":600,\"y\":420},\"thickness\":18,\"former\":1,\"latter\":3,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":600,\"y\":420},\"end\":{\"x\":600,\"y\":175},\"thickness\":18,\"former\":2,\"latter\":0,\"coordinates\":[]}],\"entities\":[{\"group\":\"entityOnWall\",\"kind\":\"window\",\"look\":\"single\",\"coordinates\":{\"x\":750,\"y\":175},\"angleDeg\":0,\"entityWidth\":60,\"entityHeight\":18,\"entityParameters\":{\"wallIndex\":\"0\"}},{\"group\":\"entityOnWall\",\"kind\":\"window\",\"look\":\"single\",\"coordinates\":{\"x\":905,\"y\":297.5},\"angleDeg\":90,\"entityWidth\":60,\"entityHeight\":18,\"entityParameters\":{\"wallIndex\":\"1\"}}]}";

    // háromszög
    // json = "{\"walls\":[{\"type\":null,\"start\":{\"x\":390,\"y\":520},\"end\":{\"x\":1055,\"y\":285},\"thickness\":18,\"former\":2,\"latter\":1,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1055,\"y\":285},\"end\":{\"x\":1015,\"y\":730},\"thickness\":18,\"former\":0,\"latter\":2,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1015,\"y\":730},\"end\":{\"x\":390,\"y\":520},\"thickness\":18,\"former\":1,\"latter\":0,\"coordinates\":[]}]}";

    // bonyolult
    // json = "{\"walls\":[{\"type\":null,\"start\":{\"x\":305,\"y\":440},\"end\":{\"x\":1705,\"y\":290},\"thickness\":18,\"former\":7,\"latter\":1,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1705,\"y\":290},\"end\":{\"x\":1475,\"y\":490},\"thickness\":18,\"former\":0,\"latter\":2,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1475,\"y\":490},\"end\":{\"x\":1090,\"y\":160},\"thickness\":18,\"former\":1,\"latter\":3,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1090,\"y\":160},\"end\":{\"x\":1005,\"y\":655},\"thickness\":18,\"former\":2,\"latter\":4,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1005,\"y\":655},\"end\":{\"x\":735,\"y\":200},\"thickness\":18,\"former\":3,\"latter\":5,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":735,\"y\":200},\"end\":{\"x\":600,\"y\":690},\"thickness\":18,\"former\":4,\"latter\":6,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":600,\"y\":690},\"end\":{\"x\":390,\"y\":210},\"thickness\":18,\"former\":5,\"latter\":7,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":390,\"y\":210},\"end\":{\"x\":305,\"y\":440},\"thickness\":18,\"former\":6,\"latter\":0,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":275,\"y\":725},\"end\":{\"x\":1325,\"y\":105},\"thickness\":18,\"former\":11,\"latter\":9,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1325,\"y\":105},\"end\":{\"x\":1210,\"y\":820},\"thickness\":18,\"former\":8,\"latter\":10,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1210,\"y\":820},\"end\":{\"x\":330,\"y\":495},\"thickness\":18,\"former\":9,\"latter\":11,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":330,\"y\":495},\"end\":{\"x\":275,\"y\":725},\"thickness\":18,\"former\":10,\"latter\":8,\"coordinates\":[]}]}";

    // másik bonyolult
    // json = "{\"walls\":[{\"type\":null,\"start\":{\"x\":320,\"y\":590},\"end\":{\"x\":1195,\"y\":180},\"thickness\":18,\"former\":2,\"latter\":1,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1195,\"y\":180},\"end\":{\"x\":0,\"y\":360},\"thickness\":18,\"former\":0,\"latter\":2,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":0,\"y\":360},\"end\":{\"x\":320,\"y\":590},\"thickness\":18,\"former\":1,\"latter\":0,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":750,\"y\":825},\"end\":{\"x\":830,\"y\":60},\"thickness\":18,\"former\":6,\"latter\":4,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":830,\"y\":60},\"end\":{\"x\":1210.0555144337527,\"y\":822.1511843079061},\"thickness\":18,\"former\":3,\"latter\":5,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":1210.0555144337527,\"y\":822.1511843079061},\"end\":{\"x\":305,\"y\":380},\"thickness\":18,\"former\":4,\"latter\":6,\"coordinates\":[]},{\"type\":null,\"start\":{\"x\":305,\"y\":380},\"end\":{\"x\":750,\"y\":825},\"thickness\":18,\"former\":5,\"latter\":3,\"coordinates\":[]}]}";

    // console.log(json);

    if (json) {

        // Alaprajz ürítése
        this.reset();

        let copy = JSON.parse(json);

        // Metaadatok betöltése
        if (copy.meta) {
            this.meta = copy.meta;
        } else {
            this.meta = {};
        }

        // Falak betöltése
        for (let i in copy.walls) {
            if (copy.walls[i].former != null) {
                copy.walls[i].former = copy.walls[copy.walls[i].former];
            }
            if (copy.walls[i].latter != null) {
                copy.walls[i].latter = copy.walls[copy.walls[i].latter];
            }
            let newWall = this.newWall(copy.walls[i].start, copy.walls[i].end, copy.walls[i].thickness);
            this.addWall(newWall);
        }

        // Entitások betöltése
        for (let i in copy.entities) {
            let entity = this.makeEntity(copy.entities[i]);
            this.addEntity(entity);
        }

        this.renderFloorplan();

    }

};

/**
 * Állapotsor üzenet
 * @param key
 */
FloorPlanner.prototype.setStatusBar = function(key) {
    let messageString = this.options.messages[key];
    if (typeof messageString != 'undefined') {
        help(this.options.config.statusBarTextElement).html(this.options.messages[key]);
    } else {
        help(this.options.config.statusBarTextElement).html('');
    }
};

/**
 * Üzemmódváltás
 * @param mode
 * @param modeOptions
 */
FloorPlanner.prototype.setMode = function(mode, modeOptions) {

    this.setStatusBar(mode);

    this.mode = mode;

    if (modeOptions !== null) {
        this.setModeOptions(modeOptions, false);
    }

    if (this.options.callbacks.modeChanged && this.options.callbacks.modeChanged instanceof Function) {
        this.options.callbacks.modeChanged.call(this);
    }
};

/**
 * Üzemmód paraméterváltás
 * @param modeOptions
 * @param extend
 */
FloorPlanner.prototype.setModeOptions = function(modeOptions, extend = true)
{

    let self = this;

    // Állapot mentése mindenekelőtt
    this.save();

    if (!modeOptions) {
        modeOptions = {};
    }

    if (extend) {
        this.modeOptions = this.extend(true, this.modeOptions, modeOptions);
    } else {
        this.modeOptions = modeOptions;
    }

    // Kurzorcsere
    switch (this.mode) {
        case 'wallDrawingMode':
            // Kijelölt elem csak selectMode-ban lehet
            this.removeHandle();
            if (this.modeOptions.needToFinishDrawingModeOnClick) {
                this.cursor('drawingClose');
            } else {
                this.cursor('drawing');
            }
            break;
        default:
            this.cursor('move');
    }

    if (!this.modeOptions.elementSelected) {
        this.modeOptions.lastHandle = null;
    }

    // Fal rajzolása közben sárga felső sor
    if (this.modeOptions.drawingActionInProgress && !this.modeOptions.elementSelected) {
        help(this.options.config.wallDrawingContainerElement)[0].classList.remove('d-none');
    } else {
        help(this.options.config.wallDrawingContainerElement)[0].classList.add('d-none');
    }

    // Nyílászáró elhelyezése
    if (this.mode === 'doorWindowMode' && this.modeOptions.elementSelected) {

        if (this.handle.type === 'wall') {

            // Először még a fal van kijelölve
            let entity = this.placeEntityOnWall(this.handle.wall, this.modeOptions.entity);

            this.selectEntity(entity);

        }
    }

    if (this.modeOptions.drawingActionInProgress && this.modeOptions.elementSelected) {
        // console.log(this.handle.type);

        if (this.handle.type === 'wall') {
            // Kijelölt falra Revocable Proxy, amit kezelhet a wallSelect handler

            let wallChanged = (!this.modeOptions.lastHandle || this.modeOptions.lastHandle.type !== 'wall' || this.handle.index !== this.modeOptions.lastHandle.wall.index);
            if (wallChanged) {
                this.modeOptions.lastHandle = {
                    type: this.handle.type,
                    wall: {
                        index: this.handle.wall.index
                    },
                };
            }

            // Kijelölt falra Revocable Proxy, amit kezelhet az wallSelect handler
            if (wallChanged && this.options.callbacks.wallSelect && this.options.callbacks.wallSelect instanceof Function) {
                let self = this;
                this.revocableProxyWallSelect = Proxy.revocable(this.handle.wall, {
                    set: function (target, key, value) {
                        target[key] = value;
                        self.renderFloorplan();
                        return true;
                    }
                });
                this.options.callbacks.wallSelect.call(this, this.revocableProxyWallSelect.proxy);
            }

        } else if (this.handle.type === 'entity') {

            let entityChanged = (!this.modeOptions.lastHandle || this.modeOptions.lastHandle.type !== 'entity' || this.handle.entity.index !== this.modeOptions.lastHandle.entity.index);
            if (entityChanged) {
                this.modeOptions.lastHandle = {
                    type: this.handle.type,
                    entity: {
                        index: this.handle.entity.index
                    },
                };
            }

            // Kijelölt entitásra Revocable Proxy, amit kezelhet az entitySelect handler
            if (entityChanged && this.options.callbacks.entitySelect && this.options.callbacks.entitySelect instanceof Function) {
                let self = this;
                this.revocableProxyEntitySelect = Proxy.revocable(this.handle.entity, {
                    set: function (target, key, value) {
                        target[key] = value;
                        self.renderFloorplan();
                        return true;
                    }
                });
                this.options.callbacks.entitySelect.call(this, this.revocableProxyEntitySelect.proxy);
            }
        }
    }

    // Elem mozgatásának vége, még ki van jelölve valami
    if (!this.modeOptions.drawingActionInProgress && this.modeOptions.elementSelected) {
        if (this.handle.type === 'wall') {
            // Fal mozgatásának vége
            if (this.options.callbacks.wallMoveEnd && this.options.callbacks.wallMoveEnd instanceof Function) {
                let self = this;
                this.revocableProxyWallMoveEnd = Proxy.revocable(this.handle.wall, {
                    set: function (target, key, value) {
                        target[key] = value;
                        self.renderFloorplan();
                        return true;
                    }
                });
                this.options.callbacks.wallMoveEnd.call(this, this.revocableProxyWallMoveEnd.proxy);
            }
        } else if (this.handle.type === 'entity') {
            // Entitás mozgatásának vége
            if (this.options.callbacks.entityMoveEnd && this.options.callbacks.entityMoveEnd instanceof Function) {
                let self = this;
                this.revocableProxyEntityMoveEnd = Proxy.revocable(this.handle.entity, {
                    set: function (target, key, value) {
                        target[key] = value;
                        self.renderFloorplan();
                        return true;
                    }
                });
                this.options.callbacks.entityMoveEnd.call(this, this.revocableProxyEntityMoveEnd.proxy);
            }
        }
    }

    let dataAttrCheck = '';
    let dataAttrCheckValue = '';

    switch (this.mode) {
        // Fal rajzolása
        case 'wallDrawingMode':
            dataAttrCheck = 'thickness';
            dataAttrCheckValue = this.modeOptions.wall.thickness;
            break;
    }

    help(this.options.config.dataModeElementsSelector).forEach(function (item, index, arr) {
        item.classList.remove('active');
        if (help(item).data('mode') === self.mode && (dataAttrCheck === '' || (dataAttrCheck !== '' && help(item).data(dataAttrCheck) === dataAttrCheckValue))) {
            item.classList.add('active');
        }
    });

};

/**
 * Entitás kijelölése gépi úton, nem egérrel
 * @param entity
 */
FloorPlanner.prototype.selectEntity = function (entity) {

    let modeOptions = {
        elementSelected: true,
        drawingActionInProgress: false
    };

    this.setEntityHandle(entity);

    // Visszatérünk a kijelölés üzemmódba
    this.setMode('selectMode', modeOptions);

    entity.update();

    this.drawEntities();

    // Kijelölt entitásra Revocable Proxy, amit kezelhet az entitySelect handler
    if (this.options.callbacks.entitySelect && this.options.callbacks.entitySelect instanceof Function) {
        let self = this;
        this.revocableProxyEntitySelect = Proxy.revocable(this.handle.entity, {
            set: function (target, key, value) {
                target[key] = value;
                self.renderFloorplan();
                return true;
            }
        });
        this.options.callbacks.entitySelect.call(this, this.revocableProxyEntitySelect.proxy);
    }

};

/**
 * Entitás falra helyezése
 * @param wall
 * @param entityOptions
 * @returns {*}
 */
FloorPlanner.prototype.placeEntityOnWall = function (wall, entityOptions) {

    let options = {
        group: entityOptions.group,
        kind: entityOptions.kind,
        look:  entityOptions.look,

        coordinates: svgDraw.middle(wall.start, wall.end),
        angleDeg: wall.angleDeg,

        entityWidth: entityOptions.width,
        entityHeight: wall.thickness,

        entityParameters: {
            wallIndex: wall.index, // innen tudja, hogy melyik falon van rajta
            changeHinge: entityOptions.changeHinge ?? false, // nyitásirány csere
            changeSide: entityOptions.changeSide ?? false, // fal másik oldalára
        },
    };

    let entity = this.makeEntity(options);
    this.addEntity(entity);

    // this.selectEntity(entity);

    return entity;
};

/**
 * Szövegdoboz elhelyezése
 * @param entityOptions
 */
FloorPlanner.prototype.placeTextEntity = function(entityOptions) {

    let coordinates = {
        x: this.viewportOrigin.x + this.viewportWidth / 2,
        y: this.viewportOrigin.y + this.viewportHeight / 2,
    };

    // this.debugPoint(coordinates);

    let options = {
        group: 'freeEntity',
        kind: 'caption', // entityOptions.kind,
        look: 'roomText', // entityOptions.look,

        coordinates: coordinates,
        angleDeg: 0,

        // A méretei utólag, a szöveg ismeretében kerülnek meghatározásra
        entityWidth: 0,
        entityHeight: 0,

        entityParameters: {
            textContent: '[................]'
        },
    };

    let entity = this.makeEntity(options);

    this.addEntity(entity);

    this.selectEntity(entity);

    return true;
};

/**
 * Mozgatás, görgetés lefojtása
 * @param callback
 * @param delay
 * @returns {(function(): void)|*}
 */
FloorPlanner.prototype.throttle = function(callback, delay) {
    let last;
    let timer;
    return function () {
        let context = this;
        let now = +new Date();
        let args = arguments;
        if (last && now < last + delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        } else {
            last = now;
            callback.apply(context, args);
        }
    };
};

/**
 * Billentyűk figyelése
 * @param event
 */
FloorPlanner.prototype.keyDown = function(event) {
    switch (this.mode) {
        case 'selectMode':
            // TODO
            break;
        case 'wallDrawingMode':
            // ESC gomb
            if (event.keyCode === 27) {
                // Folyamatban lévő ideiglenes fal discard
                this.endCurrentWallDrawing(true);
            }
            break;
        case 'doorWindowMode':
            // TODO
            break;
        default:
        // TODO más üzemmódok
    }
};

/**
 * Alaprajz SVG méretei
 * @returns {{width: number, height: number}}
 */
FloorPlanner.prototype.getFloorplanDimensions = function() {
    let computedStyle = getComputedStyle(help(this.options.config.floorplanElementSelector)[0], null);
    return {
        width: parseFloat(computedStyle.width.replace("px", '')),
        height: parseFloat(computedStyle.height.replace("px", ''))
    };
};

/**
 * Rajzvászon átméretezése
 * @param event
 */
FloorPlanner.prototype.resizeFloorplan = function() {
    let floorplanDimensions = this.getFloorplanDimensions();
    this.viewportWidth = floorplanDimensions.width;
    this.viewportHeight = floorplanDimensions.height;
    help(this.options.config.floorplanElementSelector).attr('viewBox', this.viewportOrigin.x + ' ' + this.viewportOrigin.y + ' ' + this.viewportWidth + ' ' + this.viewportHeight)
};

/**
 * Rajzvászon alap méretezése
 */
FloorPlanner.prototype.initDimensions = function() {
    help('svg#floorplan').attr('viewBox', this.viewportOrigin.x + ' ' + this.viewportOrigin.y + ' ' + this.viewportWidth + ' ' + this.viewportHeight);
    help(this.options.config.meterScaleElement).css('width', 60 * this.floorplanWidth / this.viewportWidth + 'px');
};

/**
 * Aktuális állapot mentése
 * @param toLocalStorageToo
 */
FloorPlanner.prototype.save = function(toLocalStorageToo = false) {

    if (!toLocalStorageToo && this.options.config.autosave) {
        toLocalStorageToo = true;
    }

    let lastItem = this.history.length ? this.history[this.history.length - 1] : null;

    let currentJson = this.toJSON();

    if (!lastItem || lastItem !== currentJson) {

        // Ha valami művelet történt, nincs többé redo
        this.history.splice(this.history.length  - this.historyBackOffset,  this.historyBackOffset);
        this.historyBackOffset = 0;

        this.history.push(currentJson);

        // 30 elemnél több ne lehessen benne (tömb végén 30 elem meghagyása)
        this.history.splice(0,  this.history.length - 30);

        if (this.options.callbacks.historyChanged && this.options.callbacks.historyChanged instanceof Function) {
            this.options.callbacks.historyChanged.call(this);
        }
    }

    if (toLocalStorageToo) {
        localStorage.setItem('history', JSON.stringify(this.history));
    }
};

/**
 * Van-e mentett alaprajz a local storage-ban
 * @returns {any}
 */
FloorPlanner.prototype.canLoad = function() {
    return JSON.parse(localStorage.getItem('history'));
};

/**
 * Korábbi rajzvászon betöltése a local storage-ból
 */
FloorPlanner.prototype.load = function() {

    this.history = this.canLoad() ?? [];

    let lastItem = this.history.length ? this.history[this.history.length - 1] : null;

    if (lastItem) {
        this.fromJSON(lastItem);
        if (this.options.callbacks.historyChanged && this.options.callbacks.historyChanged instanceof Function) {
            this.options.callbacks.historyChanged.call(this);
        }
    }
};

/**
 * Van-e visszavonható művelet
 * @returns {boolean}
 */
FloorPlanner.prototype.canUndo = function() {
    return this.historyBackOffset < this.history.length - 1 ;
};

/**
 * Van-e újra végrehajtható művelet
 * @returns {boolean}
 */
FloorPlanner.prototype.canRedo = function() {
    return this.historyBackOffset > 0;
};

/**
 * Visszavonás
 */
FloorPlanner.prototype.undo = function() {

    if (this.canUndo()) {

        this.historyBackOffset++;

        let item = this.history.length ? this.history[this.history.length - 1 - this.historyBackOffset] : null;

        if (item) {
            this.fromJSON(item);
            if (this.options.callbacks.historyChanged && this.options.callbacks.historyChanged instanceof Function) {
                this.options.callbacks.historyChanged.call(this, true);
            }
        }
    }
};

/**
 * Újra
 */
FloorPlanner.prototype.redo = function() {

    if (this.canRedo()) {

        this.historyBackOffset--;

        let item = this.history.length ? this.history[this.history.length - 1 - this.historyBackOffset] : null;

        if (item) {
            this.fromJSON(item);
            if (this.options.callbacks.historyChanged && this.options.callbacks.historyChanged instanceof Function) {
                this.options.callbacks.historyChanged.call(this, true);
            }
        }
    }
};

/**
 * Rajzvászon zoom
 * @param zoom
 */
FloorPlanner.prototype.setZoom = function(zoom, event) {

    // Ha a HTML-ből string jönne, nem éppen összeadást csinálna a + amikor növelni kell az értékét :)
    zoom = parseInt(zoom);

    if (zoom < this.options.config.zoom.minZoom) {
        zoom = this.options.config.zoom.minZoom;
    }
    if (zoom > this.options.config.zoom.maxZoom) {
        zoom = this.options.config.zoom.maxZoom;
    }

    let zoomDiff = zoom - this.zoom;
    let step = this.options.config.zoom.zoomStep * zoomDiff;

    if (step) {

        let oldViewportWidth = this.viewportWidth;
        let oldViewportHeight = this.viewportHeight;

        let newViewportWidth = this.viewportWidth - step;
        let newViewportHeight = this.viewportHeight - step / this.floorplanWidthHeightRatio;

        if (event) {

            let mousePosition = this.getEventCoordinates(event);

            this.viewportOrigin = {
                x: mousePosition.x - newViewportWidth * (mousePosition.x - this.viewportOrigin.x)  / oldViewportWidth,
                y: mousePosition.y - newViewportHeight * (mousePosition.y - this.viewportOrigin.y)  / oldViewportHeight,
            };

        }

        this.viewportWidth = newViewportWidth;
        this.viewportHeight = newViewportHeight;

        this.zoom = zoom;

    }

    /*
    // RESET erőszakkal
    this.zoom = this.options.config.zoom.defaultZoom;
    this.viewportOrigin = {
        x: 0,
        y: 0,
    };
    this.viewportWidth = this.floorplanWidth;
    this.viewportHeight = this.floorplanHeight;
    */

    // Léptékjelző méretezése
    help(this.options.config.meterScaleElement).css('width', this.options.config.meter * this.floorplanWidth / this.viewportWidth + 'px');

    let rangeInput = help(this.options.config.zoom.zoomSliderRangeInputSelector);
    if (rangeInput.length) {
        rangeInput.val(zoom.toString());
    }

    // Rajzvászon alap méretezése
    this.initDimensions();

    this.renderFloorplan();

    if (this.options.callbacks.zoom && this.options.callbacks.zoom instanceof Function) {
        this.options.callbacks.zoom.call(this);
    }
}

/**
 * Egérkurzor csere rajzvásznon
 * @param tool
 */
FloorPlanner.prototype.cursor = function(tool) {
    // console.log('Change cursor: ' + tool);
    switch (tool) {
        case 'drawing':
            tool = "url('" + this.options.config.imagesPath + "/cursors/pencil.svg') 0 24, auto";
            break;
        case 'drawingClose':
            tool = "url('" + this.options.config.imagesPath + "/cursors/pencil-room.svg') 0 24, auto";
            break;
    }
    help(this.options.config.floorplanElementSelector)[0].style.cursor = tool;
};

/**
 * Rajzvászon zoom ki/be/reset
 * @param mode
 */
FloorPlanner.prototype.adjustZoom = function(mode, event) {
    switch (mode) {
        case 'zoomOut':
            this.setZoom(this.zoom - 1, event);
            break;
        case 'zoomIn':
            this.setZoom(this.zoom + 1, event);
            break;
        case 'resetZoom':
            this.setZoom(this.options.config.zoom.defaultZoom, event)
            break;
    }
};

/**
 * Rajzvászon mozgatása bármilyen mértékben
 * @param moveStepX
 * @param moveStepY
 */
FloorPlanner.prototype.dragCanvas = function(moveStepX, moveStepY) {
    this.viewportOrigin.x -= moveStepX;
    this.viewportOrigin.y -= moveStepY;
    this.initDimensions();
}

/**
 * Rajzvászon mozgatása egyszerre egy irányba gombokkal
 * @param moveDirection
 * @param moveStep
 */
FloorPlanner.prototype.moveCanvas = function(moveDirection, moveStep) {
    switch (moveDirection) {
        case 'moveRight':
            this.dragCanvas(moveStep, 0);
            break;
        case 'moveLeft':
            this.dragCanvas(-moveStep, 0);
            break;
        case 'moveUp':
            this.dragCanvas(0, moveStep);
            break;
        case 'moveDown':
            this.dragCanvas(0, -moveStep);
            break;
    }
};

/**
 * Event koordinátái
 * @param event
 * @returns {{mouseX: number, mouseY: number, x: (number|number), y: (number|number)}}
 */
FloorPlanner.prototype.getEventCoordinates = function(event) {

    let eventX, eventY;

    if (event.touches) {
        let touches = event.changedTouches;
        eventX = touches[0].pageX;
        eventY = touches[0].pageY;
    } else {
        eventX = event.pageX;
        eventY = event.pageY;
    }

    let mouseCoordinates = this.offsetCoordinates({
        x: eventX,
        y: eventY,
    });

    return {
        x: this.snapToGrid ? Math.round(mouseCoordinates.x / this.options.config.snapGridSize) * this.options.config.snapGridSize : mouseCoordinates.x,
        y: this.snapToGrid ? Math.round(mouseCoordinates.y / this.options.config.snapGridSize) * this.options.config.snapGridSize : mouseCoordinates.y,
        mouseX: mouseCoordinates.x,
        mouseY: mouseCoordinates.y
    };
};

/**
 * Rajzvászon mozgatása event alapján
 * @param event
 */
FloorPlanner.prototype.moveCanvasTo = function(event) {
    this.setModeOptions({
        dragActionInProgress: true
    });
    let coordinates = this.getEventCoordinates(event);
    this.pinnedPosition = {
        x: coordinates.mouseX,
        y: coordinates.mouseY,
    }
}

/**
 * Kapott koordináták euklideszi távolsága a pinnedPosition-tól
 * @param coordinates
 * @returns {number}
 */
FloorPlanner.prototype.distanceFromPinnedPosition = function(coordinates) {
    return Math.round(svgDraw.distance(this.pinnedPosition, coordinates));
};

/**
 * Fal objektum factory
 * @param start
 * @param end
 * @param thickness
 * @returns {{thickness, start, end}}
 */
FloorPlanner.prototype.newWall = function(start, end, thickness) {

    let self = this;

    let wall = {

        /**
         * Fal típusa, ebben lesz majd a start/end
         */
        type: null,

        /**
         * Fal kezdőpontja, minden más elemet eldobunk
         */
        start: {
            x: start.x,
            y: start.y
        },

        /**
         * Fal végpontja, minden más elemet eldobunk
         */
        end: {
            x: end.x,
            y: end.y
        },

        /**
         * Előző fal (láncolt lista)
         */
        former: null,

        /**
         * Következő fal (láncolt lista)
         */
        latter: null,

        /**
         * Sarokpontok koordinátái (vastag fal mint síkidom)
         */
        coordinates: [],

    };

    /**
     * Fal vastagsága
     * @private
     */
    wall._thickness = thickness;

    Object.defineProperty(wall, 'thickness', {
        get: function() {
            return this._thickness;
        },
        set: function(thickness) {
            this._thickness = thickness;
            this.updateWallEntities();
        }
    });

    /**
     * Fal törlése
     */
    wall.deleteWall = function() {
        self.deleteWalls([
            this.index
        ]);
    };

    /**
     * Fal megváltozott helyzetét, méreteit figyelembe véve ráférnek-e továbbra is az entitások vagy sem.
     * - a kezelendő tömböt adja vissza, ha van áthelyezendő entitás (számítási eredmény újrahasznosítás miatt nem az update számolja újra)
     * - null-t ad vissza, ha nem fér el valamilyen entitás, ami korábban a falon volt
     * @returns {null|*[]}
     */
    wall.checkWallEntities = function() {

        let entitiesToUpdate = [];

        let entitiesOfWall = self.entitiesOfWall(wall);

        for (let i in entitiesOfWall) {

            let entity = entitiesOfWall[i];

            // Entitás középpontján átmenő, falra merőleges egyenes
            let perpendicularEquationOnWall = svgDraw.calculatePerpendicularEquation(wall.equations.base, entitiesOfWall[i].coordinates.x, entitiesOfWall[i].coordinates.y);

            // Entitás középpontján átmenő, az entitás korábbi helyzetére merőleges egyenes
            let perpendicularEquationOnEntity = svgDraw.calculatePerpendicularEquation(entity.baseEquation, entitiesOfWall[i].coordinates.x, entitiesOfWall[i].coordinates.y);

            let intersectionOnWall1 = svgDraw.calculateIntersection(perpendicularEquationOnWall, wall.equations.base);
            let intersectionOnWall2 = svgDraw.calculateIntersection(perpendicularEquationOnEntity, wall.equations.base);

            let newCoordinates = svgDraw.middle(intersectionOnWall1, intersectionOnWall2);

            // self.debugPoint(newCoordinates);

            // Ráfér-e a megváltozott falra
            if (entity.insideWallLimits(entity.entityWidth, newCoordinates)) {
                entitiesToUpdate.push({
                    entity: entity,
                    newCoordinates: newCoordinates,
                });
            } else {
                entitiesToUpdate = null;
                break;
            }
        }

        return entitiesToUpdate;
    };

    /**
     * Fal entitásainak gondozása
     * ha a fal változik, hívni kell
     */
    wall.updateWallEntities = function() {
        let entitiesOfWall = self.entitiesOfWall(wall);
        for (let i in entitiesOfWall) {
            let entity = entitiesOfWall[i];
            entity.entityHeight = wall.thickness;
            entity.angleDeg = wall.angleDeg;
            entity.update();
        }
    };

    /**
     * Fal szöge (meredeksége) radiánban
     */
    Object.defineProperty(wall, 'angle', {
        get: function() {
            return svgDraw.getAngle(this.end, this.start).rad;
        }
    });

    /**
     * Fal pontos szöge 0-359 fok
     */
    Object.defineProperty(wall, 'angleDeg', {
        get: function() {
            return svgDraw.vectorAngle({
                x: this.end.x - this.start.x,
                y: this.end.y - this.start.y,
            });
        }
    });

    /**
     * Fal vastagságának vízszintes irányú vetülete
     */
    Object.defineProperty(wall, 'thicknessX', {
        get: function() {
            return svgDraw.getLineThicknessX(this.thickness, this.angle);
        }
    });

    /**
     * Fal vastagságának függőleges irányú vetülete
     */
    Object.defineProperty(wall, 'thicknessY', {
        get: function() {
            return svgDraw.getLineThicknessY(this.thickness, this.angle);
        }
    });

    /**
     * Falat alkotó középvonal és vele párhuzamosan eltolt határolóvonalak egyenletei
     */
    Object.defineProperty(wall, 'equations', {
        get: function() {
            return svgDraw.getLineEquations(this.start, this.end, this.thicknessX, this.thicknessY);
        }
    });

    return wall;

};

/**
 * Falak átindexelése
 */
FloorPlanner.prototype.housekeepWalls = function() {

    for (let wallIndex in this.walls) {

        let wall = this.walls[wallIndex];

        if (wall.index !== wallIndex) {

            // Entitások frissítése
            for (let entityIndex in this.entities) {
                let entity = this.entities[entityIndex];
                if (entity.entityParameters.wallIndex === wall.index) {
                    entity.entityParameters.wallIndex = wallIndex;
                }
            }

            // Ha átindexelés történt (pl. fal törlése miatt), frissíteni kell a HTML element ID-ját is
            if (wall.graph) {
                wall.graph.id = 'wall-' + wallIndex;
            }

            wall.index = wallIndex;
        }

    }
}

/**
 * Entitások átindexelése
 */
FloorPlanner.prototype.housekeepEntities = function() {
    for (let entityIndex in this.entities) {
        let entity = this.entities[entityIndex];
        if (entity.index !== entityIndex) {
            entity.index = entityIndex;
        }
    }
}

/**
 * Falak renderelése
 */
FloorPlanner.prototype.renderWalls = function() {

    /**
     * Maximálisan kirajzolt hegyes sarok mérete
     * Nincs értelme configba tenni, mert ez ízlés dolga
     * @type {number}
     */
    let cornerSizeLimit = 20000;

    for (let wallIndex in this.walls) {

        let wall = this.walls[wallIndex];

        wall.coordinates = [];

        /**
         * Adott fal SVG path definition-je kompletten
         */
        let pathDefinition;

        /**
         * Fal kezdetének és végének sarokpontjai
         */
        let upperCorner, lowerCorner;

        /**
         * Fal előző fallal bezárt szögéből fakadó sarok mérete
         * @type {number}
         */
        let formerCornerSize = 0;

        /**
         * Fal következő fallal bezárt szögéből fakadó sarok mérete
         * @type {number}
         */
        let latterCornerSize = 0;

        /**
         * Fal kezdetére képzelt merőleges záróegyenes egyenlete
         * @type {{A: number, B: number}|{A: string, B}}
         */
        let wallStartCapEquation = svgDraw.calculatePerpendicularEquation(wall.equations.base, wall.start.x, wall.start.y);

        upperCorner = null;
        lowerCorner = null;

        if (wall.former) {
            // Van előző fal

            upperCorner = svgDraw.calculateIntersection(wall.equations.up, wall.former.equations.up);
            lowerCorner = svgDraw.calculateIntersection(wall.equations.down, wall.former.equations.down);

            formerCornerSize = svgDraw.distancePow(upperCorner, {
                x: wall.former.end.x,
                y: wall.former.end.y
            });
        }

        if (!upperCorner || !lowerCorner || formerCornerSize >= cornerSizeLimit) {
            // Vagy nincs előző fal, vagy túl hegyes a szöge
            upperCorner = svgDraw.calculateIntersection(wall.equations.up, wallStartCapEquation);
            lowerCorner = svgDraw.calculateIntersection(wall.equations.down, wallStartCapEquation);
        }

        wall.coordinates.push(upperCorner, lowerCorner);

        pathDefinition = 'M' + upperCorner.x + ',' + upperCorner.y + ' L' + lowerCorner.x + ',' + lowerCorner.y + ' ';

        /**
         * Fal végére képzelt merőleges záróegyenes egyenlete
         * @type {{A: number, B: number}|{A: string, B}}
         */
        let wallEndCapEquation = svgDraw.calculatePerpendicularEquation(wall.equations.base, wall.end.x, wall.end.y);

        upperCorner = null;
        lowerCorner = null;

        if (wall.latter) {
            // Van következő fal

            upperCorner = svgDraw.calculateIntersection(wall.equations.up, wall.latter.equations.up);
            lowerCorner = svgDraw.calculateIntersection(wall.equations.down, wall.latter.equations.down);

            latterCornerSize = svgDraw.distancePow(upperCorner, {
                x: wall.latter.start.x,
                y: wall.latter.start.y
            });
        }

        if (!upperCorner  || !lowerCorner || latterCornerSize >= cornerSizeLimit) {
            // Vagy nincs következő fal, vagy túl hegyes a szöge
            upperCorner = svgDraw.calculateIntersection(wall.equations.up, wallEndCapEquation);
            lowerCorner = svgDraw.calculateIntersection(wall.equations.down, wallEndCapEquation);
        }

        wall.coordinates.push(upperCorner, lowerCorner);

        pathDefinition += 'L' + lowerCorner.x + ',' + lowerCorner.y + ' L' + upperCorner.x + ',' + upperCorner.y + ' Z';

        // SVG element létrehozása vagy frissítése
        this.makeOrUpdateWallElement(wall, pathDefinition);

    }
};

/**
 * Teljes alaprajz renderelése
 */
FloorPlanner.prototype.renderFloorplan = function() {
    this.drawWalls();
    this.drawRooms();
    this.drawEntities();
};

/**
 * Fal SVG element létrehozása vagy frissítése
 * @param wall
 * @param pathDefinition
 */
FloorPlanner.prototype.makeOrUpdateWallElement = function(wall, pathDefinition) {
    let id = wall.index;
    if (wall.graph && wall.graph.tagName) {
        help(wall.graph).attr('d', pathDefinition);
    } else {
        wall.graph = svgDraw.createElement( 'path', {
            id: 'wall-' + id,
            d: pathDefinition,
            stroke: 'none',
            fill: this.options.config.wall.color,
            'stroke-width': 0,
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'miter',
            'stroke-miterlimit': 10,
            'fill-rule': 'nonzero'
        });
        help(this.options.config.wall.wallContainerElement).appendChild(wall.graph);
    }
};

/**
 * Meagdott indexű entitások törlése
 * @param entityIndexArray
 */
FloorPlanner.prototype.deleteEntities = function(entityIndexArray) {

    for (let i in entityIndexArray) {
        let entity = this.entities[entityIndexArray[i]];
        let index = entityIndexArray[i];
        entity.graph.remove();
        this.entities[index] = null;
    }

    // Üres elemek törlése a tömbből
    this.entities = this.entities.filter(function (value) {
        return value;
    });

    // Entitásokat tároló tömb átindexelése
    this.housekeepEntities();

};

/**
 * Megadott indexű falak törlése
 * @param wallIndexArray
 */
FloorPlanner.prototype.deleteWalls = function(wallIndexArray) {

    let entitiesToDelete = [];

    for (let i in wallIndexArray) {

        let wall = this.walls[wallIndexArray[i]];
        let entitiesOfWall = this.entitiesOfWall(wall);

        let index = wallIndexArray[i];

        // Ha van a falnak kapcsolata, megszüntetjük a másik fal(ak) kapcsolatát ezzel
        if (this.walls[index].former) {
            this.walls[index].former.latter = null;
        }
        if (this.walls[index].latter) {
            this.walls[index].latter.former = null;
        }

        // Törlendő entitások kigyűjtése, amelyek a falon voltak
        for (let i in entitiesOfWall) {
            entitiesToDelete.push(entitiesOfWall[i].index);
        }

        // Fal grafikájának törlése
        wall.graph.remove();

        /*
        // Ha már van a wall-nak index-e, akkor ki lett renderelve, akkor van neki graph-ja is, amit törölhetünk
        // A biztonság kedvéért nem az 'index' van itt használva, hanem a 'wall.index'
        if (wall.index) {
            help('#wall-' + wall.index).remove();
        }
        */

        this.walls[index] = null;

    }

    // Üres elemek törlése a tömbből
    this.walls = this.walls.filter(function (value) {
        return value;
    });

    // Falakat tároló tömb átindexelése
    this.housekeepWalls();

    // Entitások törlése a falról
    this.deleteEntities(entitiesToDelete);

    // Fogantyút muszáj eltüntetni, mert lehet, hogy az éppen törölt valamelyik falon vagy végpontjain álltt
    this.removeHandle();

    // Újra kell rajzolni, mert a kapcsolatok megszűnése miatt bizonyos falak végei máshogy fognak kinézni
    this.renderFloorplan();

};

/**
 * Falak rajzolása
 */
FloorPlanner.prototype.drawWalls = function() {
    this.processWalls();
    this.renderWalls();
};

/**
 * Szobák rajzolása
 */
FloorPlanner.prototype.drawRooms = function() {

    this.rooms = [];

    let polygons = this.identifyPolygons();

    help(this.options.config.room.roomContainerElement).empty();

    for (let i in polygons) {
        this.rooms.push({
            coordinates: polygons[i].coordinates,
            coordinatesOutside : polygons[i].coordinatesOutside,
            coordinatesInside : polygons[i].coordinatesInside,
            inside: polygons[i].inside,
            way: polygons[i].way,
        });
    }

    for (let i in this.rooms) {

        let path;
        let coordinates;

        if (this.rooms[i].inside.length) {
            coordinates = this.rooms[i].inside;
        } else {
            coordinates = this.rooms[i].coordinates;
        }

        path = 'M' + coordinates[0].x + ',' + coordinates[0].y;
        for (let p = 1; p < coordinates.length; p++) {
            path += ' L' + coordinates[p].x + ',' + coordinates[p].y;
        }

        svgDraw.createElement( 'path', {
            d: path,
            fill: this.options.config.room.fillColor,
            'fill-opacity': 1,
            stroke: 'none',
            class: 'room-fill'
        }, this.options.config.room.roomContainerElementId);

    }
};

/**
 * Entitások rajzolása a vászonra
 */
FloorPlanner.prototype.drawEntities = function() {
    help(this.options.config.entity.entityContainerElement).empty();
    for (let i in this.entities) {
        this.entities[i].index = i;
        if (this.entities[i].graph) {
            this.entities[i].graph.id = 'entity-' + i;
        }
        help(this.options.config.entity.entityContainerElement).appendChild(this.entities[i].graph);
    }
};

/**
 * Megadott koordinátájú pontból kiinduló vagy oda érkező falak tömbjét adja vissza
 * @param point Adott pont koordinátái {x,y}
 * @param wallToExclude Az a fal, ami nem érdekel
 * @returns {*[]}
 */
FloorPlanner.prototype.getWallNodes = function(point, wallToExclude = null) {
    let nodes = [];
    for (let i in this.walls) {
        if (!svgDraw.isSame(this.walls[i], wallToExclude)) {
            if (svgDraw.isSame(this.walls[i].start, point)) {
                // type: 'start' jelentése: fal kezdőpontja ez a pont
                nodes.push({
                    wall: this.walls[i],
                    type: 'start'
                });
            }
            if (svgDraw.isSame(this.walls[i].end, point)) {
                // type: 'end' jelentése: fal végpontja ez a pont
                nodes.push({
                    wall: this.walls[i],
                    type: 'end'
                });
            }
        }
    }
    return nodes;
};

/**
 * Megadott koordinátájú pontból kiinduló vagy oda beérkező első fal
 * @param point
 * @param wallToExclude
 * @returns {boolean|*}
 */
FloorPlanner.prototype.getWallNode = function(point, wallToExclude = null) {
    let wallsFromSamePoint = this.getWallNodes(point, wallToExclude);
    for (let i in wallsFromSamePoint) {
        return wallsFromSamePoint[i].wall;
    }
    return false;
}

/**
 * Fal-adatok előfeldolgozása
 */
FloorPlanner.prototype.processWalls = function() {

    let wallToRemoveIndexArray = [];

    // Van-e bármilyen okból törlendő (garbage) fal
    for (let i in this.walls) {
        let wall = this.walls[i];

        if (svgDraw.isSame(wall.start, wall.end)) {
            // A fal két végpontja egyazon pontba került, innentől ez a fal nincs többé
            wallToRemoveIndexArray.push(wall.index);
        }

        // az egyiket töröljük, másik marad
        for (let j = i; j < this.walls.length; j++) {
            if (i !== j) {
                let wall2 = this.walls[j];
                if (
                    // Két azonos fal van, végpontjaik rendre megegyeznek
                    (svgDraw.isSame(wall.start, wall2.start) && svgDraw.isSame(wall.end, wall2.end))
                    ||
                    // Két azonos fal van, de fordított irányítottsággal
                    (svgDraw.isSame(wall.start, wall2.end) && svgDraw.isSame(wall.end, wall2.start))
                ) {
                    // Bármilyen azonos végpontok közti falak közül
                    wallToRemoveIndexArray.push(wall2.index);
                }
            }
        }
    }

    // Ha van törlendő fal, egy menetben töröljük és elvégezzük a karbantartásokat
    if (wallToRemoveIndexArray.length) {
        this.deleteWalls(wallToRemoveIndexArray);
    }

    // Átindexelés
    this.housekeepWalls();

    // Ha van a falhoz rendelve előző vagy következő fal, hogy nincs közös végpontjuk, megszüntetjük a kapcsolatot
    for (let wallIndex in this.walls) {
        let wall = this.walls[wallIndex];
        if (wall.former) {
            if (!svgDraw.isSame(wall.former.end, wall.start)) {
                wall.former.latter = null;
                wall.former = null;
            }
        }
        if (wall.latter) {
            if (!svgDraw.isSame(wall.latter.start, wall.end)) {
                wall.latter.former = null;
                wall.latter = null;
            }
        }
    }

    // Láncolt lista automatikus felépítése
    for (let wallIndex in this.walls) {

        let wall = this.walls[wallIndex];

        if (!wall.latter) {

            // Nincs őt követő fal, keressünk egyet, hátha van

            let wallsFromSamePoint = this.getWallNodes(wall.end, wall);

            for (let k in wallsFromSamePoint) {

                // Végpontba csatlakozó többi fal (akár innen indulnak, akár ide érkeznek)

                if (wallsFromSamePoint[k].type === 'end' && !wallsFromSamePoint[k].wall.latter && !wallsFromSamePoint[k].wall.former) {

                    // Van olyan fal, ami ugyanebbe a végpontba érkezik be és nincs láncolva
                    // Megfordítjuk és láncba fűzzük

                    wall.latter = wallsFromSamePoint[k].wall;
                    wall.latter.former = wall;

                    // megfordítjuk
                    let tmpStart = wall.latter.end;
                    let tmpEnd = wall.latter.start;

                    wall.latter.start = tmpStart;
                    wall.latter.end = tmpEnd;

                    // Már ki lett javítva, már úgy tudja, hogy innen indul, és nem azt, hogy itt végződik

                }

                if (wallsFromSamePoint[k].type === 'start' && !wallsFromSamePoint[k].wall.former) {

                    // Van olyan fal, ami ugyanebbe a végpontba érkezik be és nincs láncolva
                    // Megfordítjuk és láncba fűzzük

                    wall.latter = wallsFromSamePoint[k].wall;
                    wall.latter.former = wall;

                    // Már ki lett javítva, már úgy tudja, hogy innen indul, és nem azt, hogy itt végződik

                }
            }
        }

        if (!wall.former) {

            // Nincs előző fal, keressünk egyet, hátha van

            let wallsFromSamePoint = this.getWallNodes(wall.start, wall);

            for (let k in wallsFromSamePoint) {

                // Kezdőpontba csatlakozó többi fal (akár innen indulnak, akár ide érkeznek)

                if (wallsFromSamePoint[k].type === 'start' &&  !wallsFromSamePoint[k].wall.former && !wallsFromSamePoint[k].wall.latter) {

                    // Van olyan fal, ami ugyanebből a kezdőpontból indul ki és nincs láncolva
                    // Megfordítjuk és láncba fűzzük

                    wall.former = wallsFromSamePoint[k].wall;
                    wall.former.latter = wall;

                    // megfordítás
                    let tmpStart = wall.former.end;
                    let tmpEnd = wall.former.start;
                    wall.former.start = tmpStart;
                    wall.former.end = tmpEnd;

                    // Már ki lett javítva, már úgy tudja, hogy ide csatlakozik be, és nem azt, hogy innen indul
                }

                // Van olyan fal, ami itt végződik be de nincs gyermeke
                if (wallsFromSamePoint[k].type === 'end' && !wallsFromSamePoint[k].wall.latter) {
                    wall.former = wallsFromSamePoint[k].wall;
                    wall.former.latter = wall;
                }
            }
        }
    }

};

/**
 * Fal objektum hozzáadása
 * @param wall
 * @returns {number}
 */
FloorPlanner.prototype.addWall = function(wall) {
    this.walls.push(wall);
    let lastIndex = this.walls.length - 1;
    this.walls[lastIndex].index = lastIndex;
    return lastIndex;
};

/**
 * Entitás objektum hozzáadása
 * @param entity
 * @returns {number}
 */
FloorPlanner.prototype.addEntity = function(entity) {
    this.entities.push(entity);
    let lastIndex = this.entities.length - 1;
    this.entities[lastIndex].index = lastIndex;
    return lastIndex;
}

/**
 * Fal középvonal-szakasza alapján egyenes egyenlete
 * @param wall
 * @returns {{A: number, B: number}|{A: string, B}}
 */
FloorPlanner.prototype.calculateWallEquation = function(wall) {
    return svgDraw.calculateEquation(wall.start.x, wall.start.y, wall.end.x, wall.end.y);
};

/**
 * Adott koordináta melyik fal határain esik belül
 * (Ha több is van, az első találatot adja vissza)
 * @param coordinates
 * @returns {*}
 */
FloorPlanner.prototype.pointInWallPolygon = function(coordinates) {
    // this.debugPoint(coordinates);
    for (let i = 0; i < this.walls.length; i++) {
        // this.debugPolygon(this.walls[i].coordinates);
        if (svgDraw.pointInsidePolygon(coordinates, this.walls[i].coordinates)) {
            return this.walls[i];
        }
    }
};

/**
 * Fal-megfogó foganytú készítése
 * @param wall
 */
FloorPlanner.prototype.setWallHandle = function(wall) {

    this.removeHandle();

    this.handle = {
        type: 'wall',
        wall: wall,
        graph: svgDraw.createElement( 'g')
    };

    this.handle.graph.appendChild(
        svgDraw.createElement(
            'line',
            {
                id: 'wall-' + wall.index + '-handle',
                class: 'wall-handle pulse',
                x1: this.handle.wall.start.x,
                y1: this.handle.wall.start.y,
                x2: this.handle.wall.end.x,
                y2: this.handle.wall.end.y,
                "stroke-width": this.handle.wall.thickness,
                stroke: this.options.config.wall.handleColor,
            }
        )
    );

    this.handle.graph.appendChild(this.createWallNodeHandleElement(this.handle.wall.start));
    this.handle.graph.appendChild(this.createWallNodeHandleElement(this.handle.wall.end));

    help(this.options.config.wall.tmpWallContainerElement).appendChild(this.handle.graph);

};

/**
 * Entitás-megfogó fogantyú készítése
 * @param entity
 */
FloorPlanner.prototype.setEntityHandle = function(entity) {

    this.removeHandle();

    this.handle = {
        type: 'entity',
        look: entity.look,
        group: entity.group,
        kind: entity.kind,
        graph: entity.handleGraph,
        entity: entity
    };

    this.handle.graph.id = 'entity-' + entity.index + '-handle';
    help(this.handle.graph).addClass('entity-' + entity.index + '-handle pulse');

    help(this.options.config.entity.tmpEntityContainerElement).appendChild(this.handle.graph);

};

/**
 * Sarokpont-fogantyú SVG element
 * @param wallCornerCoordinates
 * @returns {*}
 */
FloorPlanner.prototype.createWallNodeHandleElement = function(wallCornerCoordinates) {
    return svgDraw.createElement(
        'rect',
        {
            id: 'wallnode-' + (wallCornerCoordinates.x + '_' + wallCornerCoordinates.y).hashCode() + '-handle',
            class: 'wallnode-handle pulse',
            x: wallCornerCoordinates.x - this.options.config.wall.nodeHandleWidth / 2,
            y: wallCornerCoordinates.y - this.options.config.wall.nodeHandleHeight / 2,
            width: this.options.config.wall.nodeHandleWidth,
            height: this.options.config.wall.nodeHandleHeight,
            fill: this.options.config.wall.nodeHandleFillColor,
        }
    );
};

/**
 * Sarok-megfogó fogantyú készítése
 * @param wallCornerCoordinates
 */
FloorPlanner.prototype.setWallNodeHandle = function (wallCornerCoordinates) {

    this.removeHandle();

    this.handle = {
        type: 'node',
        coordinates: {
            x: wallCornerCoordinates.x,
            y: wallCornerCoordinates.y,
        },
        graph: svgDraw.createElement( 'g')
    };

    this.handle.graph.appendChild(this.createWallNodeHandleElement(wallCornerCoordinates));

    help(this.options.config.wall.tmpWallContainerElement).appendChild(this.handle.graph);

};

/**
 * Adott koordináta kért sugarú környezetébe érkező vagy onnan induló falak és csomópontok kigyűjtése
 * Távolság szerinti növekvő sorrendbe rendezve
 * @param coordinates
 * @param range
 * @param excludeWallIndices
 * @returns {boolean|*[]}
 */
FloorPlanner.prototype.getWallsByEndpoints = function(coordinates, range = 30, excludeWallIndices = []) {

    let found = [];

    for (let i in this.walls) {

        if (!excludeWallIndices.includes(this.walls[i].index)) {
            // Nem kihagyandó fal

            let distance;

            distance = svgDraw.distance(this.walls[i].start, coordinates);
            if (distance <= range) {
                found.push({
                    distance: distance,
                    wall: this.walls[i],
                    endpoint: this.walls[i].start,
                    endpointName: 'start',
                });
            }

            distance = svgDraw.distance(this.walls[i].end, coordinates);
            if (distance <= range) {
                found.push({
                    distance: distance,
                    wall: this.walls[i],
                    endpoint: this.walls[i].end,
                    endpointName: 'end',
                });
            }

        }
    }

    if (found.length) {
        found.sort(function(a, b) {
            return a.distance > b.distance;
        });
        return found;
    }

    return false;

};

/**
 * Event alapján eldönti, kijelölhető-e valami
 * Beállítja vagy törli a handle-t (fogantyút)
 * @param event
 */
FloorPlanner.prototype.setHandleOnHover = function(event) {

    let wall;
    let entity;

    // Fal és entitás meghatározása
    if (event.target.tagName && ['path', 'line', 'rect', 'text'].includes(event.target.tagName)) {

        let idElements;

        if (event.target.id) {
            // A target-en rögtön van feldolgozható id
            idElements = event.target.id.split('-');
        } else {
            // A target egy SVG path, rect, stb, a szülőjén van feldolgozható id
            let parentElement = help(event.target)[0].parentElement;
            if (parentElement) {
                idElements = parentElement.id.split('-');
            }
        }

        if (idElements) {
            if (idElements[0] === 'wall') {
                wall = this.walls[idElements[1]];
            } else if (idElements[0] === 'entity') {
                entity = this.entities[idElements[1]];
            }
        }
    }

    // Koordináta számítása
    let coordinates = this.getEventCoordinates(event);

    // Koordinátához közeli kezdő- vagy végponttal rendelkező falak
    let nearWalls = this.getWallsByEndpoints(coordinates);

    if (entity) {

        if (this.handle && this.handle.type === 'entity' && this.handle.entity === entity) {
            // Tökéletes a meglévő handle, nem vizsgálódunk tovább
            return;
        }

        // Valami máson állt a handle, átállítjuk
        this.setEntityHandle(entity);
        return;
    }

    if (nearWalls) {
        // Vannak olyan sarokpontok, amelyek a koordinátához közeliek

        let nearestWallArray = nearWalls[0];

        if (this.handle && this.handle.type === 'node' && this.handle.coordinates === nearestWallArray.endpoint) {
            // Tökéletes a meglévő handle, nem vizsgálódunk tovább
            return;
        }

        // Valami máson állt a handle, átállítjuk
        this.setWallNodeHandle(nearestWallArray.endpoint);
        return;
    }

    if (wall) {
        // Falra mutatunk

        if (this.handle && this.handle.type === 'wall' && this.handle.wall === wall) {
            // Tökéletes a meglévő handle, nem vizsgálódunk tovább
            return;
        }

        // Valami máson állt a handle, átállítjuk
        this.setWallHandle(wall);
        return;

    }

    // Valami teljesen más van kijelölve, megszüntetjük
    if (this.handle) {
        if (this.handle.type === 'wall' || this.handle.type === 'node' || this.handle.type === 'entity') {
            this.removeHandle();
        }
    }

};

/**
 * MouseDown event handler
 * @param event
 */
FloorPlanner.prototype.mouseDown = function(event) {
    //console.log('mouseDown');
    switch (this.mode) {
        case 'selectMode':
            this.mouseDownSelectMode(event);
            break;
        case 'wallDrawingMode':
            this.mouseDownWallDrawingMode(event);
            break;
        default:
        // TODO más üzemmódok
    }
};

/**
 * MouseMove event handler
 * @param event
 */
FloorPlanner.prototype.mouseMove = function(event) {
    event.preventDefault();
    switch (this.mode) {
        case 'selectMode':
            this.mouseMoveSelectMode(event);
            break;
        case 'wallDrawingMode':
            this.mouseMoveWallDrawingMode(event);
            break;
        default:
        // TODO más üzemmódok
    }
};

/**
 * MouseUp event handler
 * @param event
 */
FloorPlanner.prototype.mouseUp = function(event) {
    //console.log('mouseUp');
    switch (this.mode) {
        case 'selectMode':
            this.mouseUpSelectMode(event);
            break;
        case 'wallDrawingMode':
            this.mouseUpWallDrawingMode(event);
            break;
        default:
        // TODO más üzemmódok
    }
};

/**
 * MouseDown event handler: selectMode
 * @param event
 */
FloorPlanner.prototype.mouseDownSelectMode = function(event) {
    this.setHandleOnHover(event);
    if (this.handle && (this.handle.type === 'wall' || this.handle.type === 'node' || this.handle.type === 'entity')) {
        this.setModeOptions({
            elementSelected: true,
            drawingActionInProgress: true
        });
    } else {
        this.moveCanvasTo(event);
    }
};

/**
 * MouseDown event handler: wallDrawingMode
 * @param event
 */
FloorPlanner.prototype.mouseDownWallDrawingMode = function(event) {
    let coordinates = this.getEventCoordinates(event);
    if (!this.modeOptions.drawingActionInProgress) {
        this.pinnedPosition = {
            x: coordinates.x,
            y: coordinates.y
        };
        //console.log(this.pinnedPosition);
        this.setModeOptions({
            drawingActionInProgress: true
        });
    } else {
        // Újra kattintott úgy, hogy folyamatban van a rajzolás
        // TODO befejezni a vonalat
    }
};

/**
 * MouseMove event handler: selectMode
 * @param event
 */
FloorPlanner.prototype.mouseMoveSelectMode = function(event) {
    let coordinates = this.getEventCoordinates(event);

    if (this.modeOptions.dragActionInProgress) {
        let distX = (coordinates.mouseX - this.pinnedPosition.x) * this.factor;
        let distY = (coordinates.mouseY - this.pinnedPosition.y) * this.factor;
        this.dragCanvas(distX, distY);
    } else if (this.modeOptions.elementSelected) {

        if (this.handle.type === 'node' && this.modeOptions.drawingActionInProgress) {

            // Fal végén lévő fogantyú mozgatása

            // Fogantyú régi koordinátái eltesszük arra az esetre, ha vissza kell csinálni a műveletet
            let oldCoordinates = this.handle.coordinates;

            // csak az x és y menjen bele, más elemei nem
            let rawCoordinates = {
                x: coordinates.x,
                y: coordinates.y
            };

            let entitiesToUpdate = [];

            // Sarokpontok mozgatása
            let toDragArray = this.getWallsByEndpoints(oldCoordinates, 0);

            for (let i in toDragArray) {

                // Fal valamelyik végpontjának elmozgatása
                toDragArray[i].wall[toDragArray[i].endpointName] = rawCoordinates;

                let checkResult = toDragArray[i].wall.checkWallEntities();
                if (checkResult !== null) {
                    // Üres tömb is lehet, ha nincs a falon entitás
                    for (let j in checkResult) {
                        entitiesToUpdate.push(checkResult[j]);
                    }
                } else {
                    // Van olyan entitás, amely nem fért fel a falra
                    entitiesToUpdate = null;
                    break;
                }
            }

            if (entitiesToUpdate === null) {
                // Üres tömb is lehet, ha nincs a falon entitás, ezért nézzük, null-e
                // Van olyan entitás, amely nem fért fel a falra, visszacsináljuk a falakat
                for (let i in toDragArray) {
                    toDragArray[i].wall[toDragArray[i].endpointName] = oldCoordinates;
                }
            } else {

                // Entitások mozgatása
                for (let i in entitiesToUpdate) {
                    entitiesToUpdate[i].entity.coordinates = entitiesToUpdate[i].newCoordinates;
                }

                for (let i in toDragArray) {
                    toDragArray[i].wall.updateWallEntities();
                }

                // Fogantyú koordinátájának frissítése
                this.handle.coordinates = rawCoordinates;

                // Fogantyú mozgatása
                help(this.handle.graph.children[0]).attr('x', coordinates.x - this.options.config.wall.nodeHandleWidth / 2);
                help(this.handle.graph.children[0]).attr('y', coordinates.y - this.options.config.wall.nodeHandleHeight / 2);

                this.renderFloorplan();

            }

        } else if (this.handle.type === 'wall' && this.modeOptions.drawingActionInProgress) {

            // Fal párhuzamos mozgatása

            // Induljunk ki a mozgatott fal közepének egyenletéből
            let movedWallBaseEquation = this.handle.wall.equations.base;

            if (movedWallBaseEquation.A === 'v') {
                movedWallBaseEquation.B = coordinates.x;
            } else if (movedWallBaseEquation.A === 'h') {
                movedWallBaseEquation.B = coordinates.y;
            } else {
                movedWallBaseEquation.B = coordinates.y - (coordinates.x * movedWallBaseEquation.A);
            }

            // Kezdő- és végpontokon átmenő egyenesek, amelyek mindig elmetszik az elhúzott egyenest, így lesz belőle szakasz
            // - Ha van az adott végponton átmenő szomszédos fal, akkor az határozza meg a határoló egyenest
            // - Ha nincs az adott végponton átmenő szomszédos fal, a húzott falra merőlegest állítunk a végpontjában
            let startBoundaryEquation = this.handle.wall.former ? this.handle.wall.former.equations.base : svgDraw.calculatePerpendicularEquation(this.handle.wall.equations.base, this.handle.wall.start.x, this.handle.wall.start.y);
            let endBoundaryEquation = this.handle.wall.latter ? this.handle.wall.latter.equations.base : svgDraw.calculatePerpendicularEquation(this.handle.wall.equations.base, this.handle.wall.end.x, this.handle.wall.end.y);

            // Régi koordinátákat eltesszük arra az esetre, ha vissza kell csinálni a műveletet
            let oldStart = this.handle.wall.start;
            let oldEnd = this.handle.wall.end;

            // Fal mozgatása
            let newStart = svgDraw.calculateIntersection(startBoundaryEquation, movedWallBaseEquation);
            let newEnd = svgDraw.calculateIntersection(movedWallBaseEquation, endBoundaryEquation);

            // Kerekítés
            newStart = {
                x: Math.round(newStart.x),
                y: Math.round(newStart.y)
            };

            newEnd = {
                x: Math.round(newEnd.x),
                y: Math.round(newEnd.y),
            };

            let allEntitiesOk = true;
            let entitiesToUpdate = [];

            // Fogantyú falának mozgatása
            this.handle.wall.start = newStart;
            this.handle.wall.end = newEnd;

            let checkResult = this.handle.wall.checkWallEntities();
            if (checkResult !== null) {
                for (let j in checkResult) {
                    entitiesToUpdate.push(checkResult[j]);
                }
            } else {
                allEntitiesOk = false;
            }

            // Előző fal végpontjának mozgatása
            if (this.handle.wall.former != null) {
                this.handle.wall.former.end = newStart;
                let formerCheckResult = this.handle.wall.former.checkWallEntities();
                if (formerCheckResult !== null) {
                    for (let j in formerCheckResult) {
                        entitiesToUpdate.push(formerCheckResult[j]);
                    }
                } else {
                    allEntitiesOk = false;
                }
            }

            // Következő fal kezdőpontjának mozgatása
            if (this.handle.wall.latter != null) {
                this.handle.wall.latter.start = newEnd;
                let latterCheckResult = this.handle.wall.latter.checkWallEntities();
                if (latterCheckResult !== null) {
                    for (let j in latterCheckResult) {
                        entitiesToUpdate.push(latterCheckResult[j]);
                    }
                } else {
                    allEntitiesOk = false;
                }
            }

            if (!allEntitiesOk) {
                // Vissza az egész

                this.handle.wall.start = oldStart;
                this.handle.wall.end = oldEnd;

                if (this.handle.wall.former != null) {
                    this.handle.wall.former.end = oldStart;
                }
                if (this.handle.wall.latter != null) {
                    this.handle.wall.latter.start = oldEnd;
                }

            } else {

                // Egyenes fogantyú mozgatása
                help(this.handle.graph.children[0]).attr('x1', this.handle.wall.start.x);
                help(this.handle.graph.children[0]).attr('x2', this.handle.wall.end.x);
                help(this.handle.graph.children[0]).attr('y1', this.handle.wall.start.y);
                help(this.handle.graph.children[0]).attr('y2', this.handle.wall.end.y);

                // Végpont fogantyú mozgatása
                help(this.handle.graph.children[1]).attr('x', this.handle.wall.start.x - this.options.config.wall.nodeHandleWidth / 2);
                help(this.handle.graph.children[1]).attr('y', this.handle.wall.start.y - this.options.config.wall.nodeHandleHeight / 2);
                help(this.handle.graph.children[2]).attr('x', this.handle.wall.end.x - this.options.config.wall.nodeHandleWidth / 2);
                help(this.handle.graph.children[2]).attr('y', this.handle.wall.end.y - this.options.config.wall.nodeHandleHeight / 2);

                // Entitások mozgatása
                for (let i in entitiesToUpdate) {
                    entitiesToUpdate[i].entity.coordinates = entitiesToUpdate[i].newCoordinates;
                }

                this.handle.wall.updateWallEntities();

                if (this.handle.wall.former != null) {
                    this.handle.wall.former.updateWallEntities();
                }
                if (this.handle.wall.latter != null) {
                    this.handle.wall.latter.updateWallEntities();
                }

                // Fal mozgatása event
                if (this.options.callbacks.wallMove && this.options.callbacks.wallMove instanceof Function) {
                    let self = this;
                    this.revocableProxyWallMove = Proxy.revocable(this.handle.wall, {
                        set: function (target, key, value) {
                            target[key] = value;
                            self.renderFloorplan();
                            return true;
                        }
                    });
                    this.options.callbacks.wallMove.call(this, this.revocableProxyWallMove.proxy);
                }

                this.renderFloorplan();

            }

        } else if (this.handle.type === 'entity' && this.modeOptions.drawingActionInProgress) {

            // Entitás mozgatása

            if (this.handle.entity.group === 'entityOnWall') {
                // Falon belüli entitás mozgatása

                let wall = this.handle.entity.wall;

                let perpendicularEquation = svgDraw.calculatePerpendicularEquation(wall.equations.base, coordinates.x, coordinates.y);
                let intersection = svgDraw.calculateIntersection(wall.equations.base, perpendicularEquation);

                // this.debugPoint(intersection);

                if (this.handle.entity.insideWallLimits(this.handle.entity.entityWidth, intersection)) {
                    this.handle.entity.coordinates = intersection;
                    this.handle.entity.update();
                }
            } else {
                // Általános entitás mozgatása (nem fali)

                this.handle.entity.coordinates = coordinates;
                this.handle.entity.update();
            }

            // Entitás mozgatása event
            if (this.options.callbacks.entityMove && this.options.callbacks.entityMove instanceof Function) {
                let self = this;
                this.revocableProxyEntityMove = Proxy.revocable(this.handle.entity, {
                    set: function (target, key, value) {
                        target[key] = value;
                        self.renderFloorplan();
                        return true;
                    }
                });
                this.options.callbacks.entityMove.call(this, this.revocableProxyEntityMove.proxy);
            }
        }

    } else {
        this.setHandleOnHover(event);
    }
};

/**
 * MouseMove event handler: wallDrawingMode
 * @param event
 */
FloorPlanner.prototype.mouseMoveWallDrawingMode = function(event) {

    let coordinates = this.getEventCoordinates(event);

    if (this.modeOptions.drawingActionInProgress) {

        this.currentPosition = {
            x: coordinates.x,
            y: coordinates.y
        };

        let distanceFromPinnedPosition = this.distanceFromPinnedPosition(coordinates);

        // Csak akkor kezdjük mutatni a falat, ha eléggé eltávolodott a kezdőponttól (30cm)
        if (distanceFromPinnedPosition > this.options.config.wall.minimumWallLength) {
            if (!help(this.options.config.wall.tmpWallElement).length) {
                svgDraw.createElement('line', {
                    id: this.options.config.wall.tmpWallElementId,
                    x1: this.pinnedPosition.x,
                    y1: this.pinnedPosition.y,
                    x2: this.currentPosition.x,
                    y2: this.currentPosition.y,
                    'stroke-width': this.modeOptions.wall.thickness,
                    'stroke-linecap': 'butt',
                    'stroke-opacity': this.options.config.wall.pendingOpacity,
                    stroke: this.options.config.wall.pendingColor,
                },  this.options.config.wall.tmpWallContainerElementId);
            } else {
                // Már csak a végpontot mozgatjuk
                help(this.options.config.wall.tmpWallElement).attr('x2', this.currentPosition.x);
                help(this.options.config.wall.tmpWallElement).attr('y2', this.currentPosition.y);
            }

            // Megnézzük, ezen a pozíción van-e már létező fal végpontja
            let wallNode = this.getWallNode(this.currentPosition);
            this.setModeOptions({
                needToFinishDrawingModeOnClick: !!wallNode
            });

        }

    } else {
        this.pinnedPosition = {
            x: coordinates.x,
            y: coordinates.y
        };
    }
};

/**
 * Fogantyú törlése
 */
FloorPlanner.prototype.removeHandle = function() {
    if (this.handle) {

        if (this.handle.graph) {
            this.handle.graph.remove();
        } else {
            this.handle.remove();
        }
        this.handle = null;

        let revocableProxies = [
            this.revocableProxyWallSelect,
            this.revocableProxyWallMove,
            this.revocableProxyWallMoveEnd,
            this.revocableProxyEntitySelect,
            this.revocableProxyEntityMove,
            this.revocableProxyEntityMoveEnd,
        ];

        for (let i in revocableProxies) {
            if (revocableProxies[i]) {
                revocableProxies[i].revoke();
                revocableProxies[i] = null;
            }
        }

        if (this.options.callbacks.deselect && this.options.callbacks.deselect instanceof Function) {
            this.options.callbacks.deselect.call(this);
        }

        this.setModeOptions({
            drawingActionInProgress: false,
            elementSelected: false,
        });
    }
}

/**
 * MouseUp event handler: selectMode
 * @param event
 */
FloorPlanner.prototype.mouseUpSelectMode = function(event) {
    if (this.handle) {
        this.setModeOptions({
            drawingActionInProgress: false
        });
    } else {
        this.setModeOptions({
            elementSelected: false,
            dragActionInProgress: false,
        });
    }
};

/**
 * Jelenlegi folyamatban lévő falrajzolás befejezése
 * @param forceDiscard
 */
FloorPlanner.prototype.endCurrentWallDrawing = function(forceDiscard = false)
{
    // Már le van rakva a fal, az ideiglenes falra nincs szükség
    help(this.options.config.wall.tmpWallElement).remove();

    // Ha oda kattintottunk, ahol már másik fal is kezdődik, akkor nem folytatjuk a falrajzolási folyamatot
    // Bezártuk a falakkal a területet
    // Ugyanakkor a fal-rajzoló üzemmódban maradunk
    if (forceDiscard || this.modeOptions.needToFinishDrawingModeOnClick) {
        this.setModeOptions({
            drawingActionInProgress: false,
            needToFinishDrawingModeOnClick: false
        });
    }

    this.renderFloorplan();
};

/**
 * MouseUp event handler: wallDrawingMode
 * @param event
 */
FloorPlanner.prototype.mouseUpWallDrawingMode = function(event) {

    if (help(this.options.config.wall.tmpWallElement).length) {

        // Van ideiglenes fal

        // Megnézzük, milyen messze vagyunk az 1. kattintás óta
        // Ha bizonyos távolságon belül van, ne tegyünk le értelmezhetetlenül pici falat
        let distanceFromPinnedPosition = this.distanceFromPinnedPosition(this.currentPosition);

        // console.log(distanceFromPinnedPosition);

        if (distanceFromPinnedPosition > this.options.config.wall.minimumWallLength) {

            // Új fal létrehozása és listához adása
            let newWall = this.newWall(this.pinnedPosition, this.currentPosition, this.modeOptions.wall.thickness);

            this.addWall(newWall);

            this.endCurrentWallDrawing();

            // Fal vége legyen az új rögzített pozíció, innen indul a következő fal
            this.pinnedPosition = this.currentPosition;

            return true;
        }
    }

    return false;

};

/**
 * Debug pont
 * @param coordinates
 * @param fill
 */
FloorPlanner.prototype.debugPoint = function(coordinates, fill = this.options.config.debugMode.pointColor) {
    if (this.options.config.debugMode.enabled) {
        svgDraw.createElement( 'circle', {
            cx: coordinates.x,
            cy: coordinates.y,
            r: 3,
            fill: fill,
        }, this.options.config.debugMode.debugContainerElementId);
    }
};

/**
 * Debug síkidom
 * @param polygon
 * @param fill
 */
FloorPlanner.prototype.debugPolygon = function(polygon, fill = this.options.config.debugMode.polygonColor) {
    if (this.options.config.debugMode.enabled) {
        for (let i = 0; i < polygon.length; i++) {
            this.debugPoint(polygon[i], fill);
        }
    }
};

/**
 * Zárt kör bejárása és a vonalvastagságok figyelembe vételével,
 * a belső ("szobán belül eső") és külső ("falak vastagságával együttes") síkidom sarokpontjainak számítása
 * @param vertexList
 * @param way zárt kör, tehát a kezdőpontja és végpontja azonos
 * @returns {{outside: *[], inside: *[]}}
 */
FloorPlanner.prototype.polygonRegardingLineThickness = function(vertexList, way) {

    // Az utat alkotó élek összegyűjtése
    let edges = [];

    // Kört alkotó koordináták tömbje
    let polygon = [];

    // Benne van a `way` tömbben a végén a kezdőpont (zárt kört ad meg), így minden él szerepelni fog ezáltal.
    // pl. [2, 5, 7, 2]
    for (let i = 0 ; i < way.length - 1; i++) {
        // Két csúcsot összekötő él befoglaló falának megállapítása
        // Az él két végén lévő csúcs fal-listája alapján a két csúcs közös falának megállapítása
        for (let j = 0; j < vertexList[way[i+1]].wallList.length; j++) {
            let wallIndex = vertexList[way[i+1]].wallList[j];
            if (vertexList[way[i]].wallList.includes(wallIndex)) {
                // Azért nem a fal (`this.ways[...]`) koordinátái vannak itt fel használva,
                // mert a fal sokkal hosszabb (is lehet) az élnél, ha a csúcs a fal általános pontjára esik
                edges.push({
                    from: vertexList[way[i]].coordinates,
                    to: vertexList[way[i+1]].coordinates,
                    wallIndex: wallIndex,
                });
            }
        }
        polygon.push(vertexList[way[i]].coordinates);
    }


    let inside = [];
    let outside = [];

    for (let i = 0 ; i < edges.length; i++) {

        let currentEdge = edges[i];
        let nextEdge = (i < edges.length - 1) ? edges[i+1] : edges[0];

        // Ki kell számolni az élek egyenleteit és azok metszéspontjait
        // Azért nem lehet a falakkal számolni, mert ott nem lehet tudni, hogy az adott polygonban az up vagy down van belül adott falat számba véve,
        // és akkor up-up, up-down, down-up, down-down metszéspontokat mind mind figyelembe kéne venni,
        // ami majdnem jó volna, csak több metszéspont is kijöhetne ahol túlnyúlik valamelyik egyenes
        // pl. síkidomba belógó negatív hegyes csúcson egyszerűen megfigyelhető
        // nem okozna nagy gondot, meg elég edge case, de így tökéletes

        let angleCurrentEdge = svgDraw.getAngle(currentEdge.to, currentEdge.from).rad;
        let angleNextEdge = svgDraw.getAngle(nextEdge.to, nextEdge.from).rad;

        let thicknessCurrentEdge = this.walls[currentEdge.wallIndex].thickness;
        let thicknessNextEdge = this.walls[nextEdge.wallIndex].thickness;

        let currentEdgeThicknessX = svgDraw.getLineThicknessX(thicknessCurrentEdge, angleCurrentEdge);
        let currentEdgeThicknessY = svgDraw.getLineThicknessY(thicknessCurrentEdge, angleCurrentEdge);

        let nextEdgeThicknessX = svgDraw.getLineThicknessX(thicknessNextEdge, angleNextEdge);
        let nextEdgeThicknessY = svgDraw.getLineThicknessY(thicknessNextEdge, angleNextEdge);

        let currentEdgeEquations = svgDraw.getLineEquations(currentEdge.from, currentEdge.to, currentEdgeThicknessX, currentEdgeThicknessY);
        let nextEdgeEquations = svgDraw.getLineEquations(nextEdge.from, nextEdge.to, nextEdgeThicknessX, nextEdgeThicknessY);

        let intersectionUp = svgDraw.calculateIntersection(currentEdgeEquations.up, nextEdgeEquations.up);
        let intersectionDown = svgDraw.calculateIntersection(currentEdgeEquations.down, nextEdgeEquations.down);

        if (svgDraw.pointInsidePolygon(intersectionUp, polygon)) {
            //this.debugPoint(intersectionUp);
            inside.push(intersectionUp);
        } else {
            //this.debugPoint(intersectionUp);
            outside.push(intersectionUp);
        }

        if (svgDraw.pointInsidePolygon(intersectionDown, polygon)) {
            //this.debugPoint(intersectionDown);
            inside.push(intersectionDown);
        } else {
            //this.debugPoint(intersectionDown);
            outside.push(intersectionDown);
        }

    }

    // A teljes kör legyen benne
    inside.push(inside[0]);
    outside.push(outside[0]);

    return {
        inside: inside,
        outside: outside
    };
};

/**
 * Falak által határolt síkidomok keresése, amelyekből majd a szobák lesznek
 * @returns {*[]}
 */
FloorPlanner.prototype.identifyPolygons = function() {
    let self = this;

    // Kiinduló csomópontok listája
    let vertexList = svgDraw.vertexList(this.walls);

    // Irányított élek kigyűjtése
    let edges = [];
    for (let i in vertexList) {
        for (let j in vertexList[i].neighbors) {
            let neighborId = vertexList[i].neighbors[j].id;
            if (neighborId > i) {
                edges.push([i, neighborId]);
            }
        }
    }

    // Síkidomok tömbje
    let polygons = [];

    let iterations = edges.length;
    // Ahány irányított él van, annyiszor futunk neki az egész gráfnak
    for (let i = 0; i < iterations; i++) {

        // Az első nem bejárt csúcshoz képest hasonlítsuk a többit
        let startingVertex;
        for (let j in vertexList) {
            if (!vertexList[j].visited) {
                startingVertex = j;
                break;
            }
        }

        if (!startingVertex) {
            // Minden csúcs be van járva
            break;
        }

        // Az aktuálisan megmaradt gráfból a bal felső csúcs
        for (let j in vertexList) {
            if (vertexList[j].coordinates.x <= vertexList[startingVertex].coordinates.x && vertexList[j].neighbors.length > 1 && !vertexList[j].visited) {
                if (vertexList[j].coordinates.x < vertexList[startingVertex].coordinates.x) {
                    startingVertex = j;
                } else {
                    if (vertexList[j].coordinates.x === vertexList[startingVertex].coordinates.x && vertexList[j].coordinates.y < vertexList[startingVertex].coordinates.y) {
                        startingVertex = j;
                    }
                }
            }
        }

        //console.log('A ' + startingVertex + ' csomópontból indítjuk a keresést');

        let way = [];
        if (!vertexList[startingVertex].visited) {
            way = svgDraw.wallTree(startingVertex, vertexList);
        }

        if (!way || !way.length) {
            vertexList[startingVertex].visited = true;
        } else  {

            let coordinates = [];
            for (let j = 0; j < way.length; j++) {
                coordinates.push({
                    x: vertexList[way[j]].coordinates.x,
                    y: vertexList[way[j]].coordinates.y
                });
            }

            let coordinatesRegardingLineThickness = self.polygonRegardingLineThickness(vertexList, way);

            polygons.push({
                way: way,
                coordinates: coordinates,
                coordinatesOutside: coordinatesRegardingLineThickness.outside,
                coordinatesInside: coordinatesRegardingLineThickness.inside,
                inside: [],
            });

            // A út első élének eltávolítása a kiinduló csomópont szemszögéből
            for (let j in vertexList[startingVertex].neighbors) {
                if (vertexList[startingVertex].neighbors[j].id === way[1]) {
                    vertexList[startingVertex].neighbors.splice(j, 1);
                }
            }

            // A út első élének eltávolítása a második csomópont szemszögéből
            for (let j in vertexList[way[1]].neighbors) {
                if (vertexList[way[1]].neighbors[j].id === startingVertex) {
                    vertexList[way[1]].neighbors.splice(j, 1);
                }
            }

            // Falevelek törlése
            let search;
            do {
                search = false;
                for (let j in vertexList) {
                    if (vertexList[j].neighbors.length === 1) {
                        vertexList[j].neighbors = [];
                        for (let k in vertexList) {
                            for (let l in vertexList[k].neighbors) {
                                if (vertexList[k].neighbors[l].id === j) {
                                    vertexList[k].neighbors.splice(l, 1);
                                }
                            }
                        }
                        search = true;
                    }
                }
            } while (search);
        }

    };

    return polygons;
};

/**
 * Entitások SVG grafikája
 * (és egyesével a paramétereik)
 * @param group
 * @param kind
 * @param look
 * @param entityWidth
 * @param entityHeight
 * @param entityParameters
 * @returns {{graphicsArray: *[], params: {changeHinge: (*|boolean), canChangeHinge: boolean, canChangeSide: boolean, changeSide: (*|boolean)}}}
 */
FloorPlanner.prototype.entityGraphics = function (group, kind, look, entityWidth, entityHeight, entityParameters = {}) {

    let entityObject = {
        params: {

            // Nyitásirány változtatható-e
            canChangeHinge: false,

            // Fal másik oldalára helyezhető-e
            canChangeSide: false,

            // Nyitásirány megváltoztatva
            changeHinge: entityParameters.changeHinge ?? false,

            // Fal másik oldalára helyezve
            changeSide: entityParameters.changeSide ?? false,

            // Szöveges tartalom
            textContent: entityParameters.textContent ?? null,

        },
        graphicsArray: [],
        calculated: {},
    };

    if (group === 'entityOnWall') {

        // fali entitások

        /**
         * Ajtó és ablak közös grafikai elemei
         * @returns {*[]}
         */
        let doorWindowGraphicsArrayCommon = function() {

            let graphicsArray = [];

            // szürke alap
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth / 2,
                    y: -entityHeight / 2,
                    width: entityWidth,
                    height: entityHeight,
                    fill: "#c4c4c4",
                }
            });

            // 3 középső téglalap
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth * 0.8 / 2,
                    y: -entityHeight / 2 + entityHeight * 0.2,
                    width: entityWidth * 0.8,
                    height: entityHeight * 0.2,
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 0.2
                }
            });
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth * 0.8 / 2,
                    y: -entityHeight / 2 + entityHeight * 0.4,
                    width: entityWidth * 0.8,
                    height: entityHeight * 0.2,
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 0.2
                }
            });
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth * 0.8 / 2,
                    y: -entityHeight / 2 + entityHeight * 0.6,
                    width: entityWidth * 0.8,
                    height: entityHeight * 0.2,
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 0.2
                }
            });

            // két vége
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth / 2,
                    y: -entityHeight / 2 + entityHeight * 0.2,
                    width: entityWidth * 0.1,
                    height: entityHeight * 0.6,
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 0.2
                }
            });
            graphicsArray.push({
                type: 'rect',
                attributes: {
                    x: -entityWidth / 2 + entityWidth * 0.9,
                    y: -entityHeight / 2 + entityHeight * 0.2,
                    width: entityWidth * 0.1,
                    height: entityHeight * 0.6,
                    fill: 'white',
                    stroke: 'black',
                    'stroke-width': 0.2
                }
            });

            return graphicsArray;
        };

        if (kind === 'door') {
            // ajtók

            if (look === 'single') {

                // egyszárnyú ajtó
                entityObject.graphicsArray = doorWindowGraphicsArrayCommon();

                // ajtó íve
                entityObject.graphicsArray.push({
                    type: 'path',
                    attributes: {
                        d: 'M ' + (-entityWidth * 0.4) + ',' + (-entityHeight * 0.3) + ' L ' + (-entityWidth * 0.4) + ',' + (-entityWidth * 0.8 - entityHeight * 0.5) + '  A' + entityWidth * 0.8 + "," + entityWidth * 0.8 + ' 0 0,1 ' + (entityWidth * 0.4) + ',' + (-entityHeight * 0.5 + entityHeight * 0.2),
                        fill: 'none',
                        stroke: 'black',
                        'stroke-width': 0.4
                    }
                });

                entityObject.params.canChangeHinge = true;
                entityObject.params.canChangeSide = true;

            } else {
                // TODO további ajtók
            }

        } else if (kind === 'window') {

            // ablakok

            if (look === 'single') {

                // egyszárnyú ablak

                entityObject.graphicsArray = doorWindowGraphicsArrayCommon();

            } else {
                // TODO további ablakok
            }
        } else {
            // TODO további nyílászárók, amik nem ajtók és ablakok
        }
    } else if (group === 'freeEntity') {

        if (kind === 'caption') {

            if (look === 'roomText') {

                let textAttributes = {
                    x: 0,
                    y: 0,
                    'font-size': '24',
                    'font-family': 'inherit',
                    'font-weight': 'normal',
                    stroke: 'none',
                    'text-anchor': 'middle',
                    fill: this.options.config.entity.textColor,
                };

                // Szövegdoboz méreteinek meghatározása
                let tmpText = svgDraw.createElement('text', textAttributes);
                tmpText.textContent = entityObject.params.textContent;

                help(this.options.config.wall.wallContainerElement).appendChild(tmpText);
                let tmpTextBoundingClientRect = tmpText.getBoundingClientRect();

                // Ideiglenes szövegdoboz már nem kell
                tmpText.remove();

                entityWidth = tmpTextBoundingClientRect.width + 10;
                entityHeight = tmpTextBoundingClientRect.height + 10;

                // Eltesszük az entityObject-be is, utólag is legyen meg a számítási eredmény
                entityObject.calculated.width = entityWidth;
                entityObject.calculated.height = entityHeight;

                // Befoglaló téglalap
                entityObject.graphicsArray.push({
                    type: 'rect',
                    attributes: {
                        x: -entityWidth / 2,
                        y: -entityHeight / 2 - 5,
                        width: entityWidth,
                        height: entityHeight,
                        fill: 'transparent',
                        stroke: 'none',
                        'stroke-width': 0.2
                    }
                });

                let textAttributesExtended = this.extend(true, textAttributes, {
                    // itt lehet bővíteni
                    fill: 'black',
                });

                entityObject.graphicsArray.push({
                    type: 'text',
                    attributes: textAttributesExtended
                });

            } else {
                // TODO egyéb feliratok
            }
        } else {
            // TODO további szabadon mozgatható entitások
        }

    } else {
        // TODO egyéb group-ok
    }

    return entityObject;
};

/**
 * Falon helyet foglaló entitások tömbje
 * @param wall
 * @returns {*[]}
 */
FloorPlanner.prototype.entitiesOfWall = function(wall) {
    let entities = [];
    for (let i in this.entities) {
        if (this.entities[i].entityParameters.wallIndex) {
            if (wall.index === this.entities[i].entityParameters.wallIndex) {
                entities.push(this.entities[i]);
            }
        }
    }
    return entities;
};

/**
 * Tényleges tartalom befoglaló méretei
 * @param marginX
 * @param marginY
 * @returns {{coordinates: {x: number, y: number}, width: number, height: number}}
 */
FloorPlanner.prototype.getRealContentDimensions = function(marginX = 0, marginY = 0) {

    let xArray = [];
    let yArray = [];

    let calculateMinMax = function (coordinates) {
        xArray.push(coordinates.x);
        yArray.push(coordinates.y);
    };

    for (let i in this.walls) {
        for (let j in this.walls[i].coordinates) {
            calculateMinMax(this.walls[i].coordinates[j]);
        }
    }

    for (let i in this.entities) {
        for (let j in this.entities[i].edgesPolygon) {
            calculateMinMax(this.entities[i].edgesPolygon[j]);
        }
    }

    let minX = Math.min.apply(null, xArray);
    let maxX = Math.max.apply(null, xArray);

    let minY = Math.min.apply(null, yArray);
    let maxY = Math.max.apply(null, yArray);

    minX = minX - marginX;
    minY = minY - marginY;

    maxX += marginX;
    maxY += marginY;

    /*
    this.debugPolygon([
        {
            x: minX,
            y: minY
        },
        {
            x: maxX,
            y: minY
        },
        {
            x: maxX,
            y: maxY
        },
        {
            x: minX,
            y: maxY
        }
    ]);
    */

    return {
        coordinates: {
            x: minX,
            y: minY
        },
        width: maxX - minX,
        height: maxY - minY,
    };
};

/**
 * Relatív koordináták ofszetelése
 * @param coordinates
 * @returns {{x: number, y: number}}
 */
FloorPlanner.prototype.offsetCoordinates = function(coordinates) {
    return {
        x: (coordinates.x * this.factor) - (this.offset.left * this.factor) + this.viewportOrigin.x,
        y: (coordinates.y * this.factor) - (this.offset.top * this.factor) + this.viewportOrigin.y,
    };
};

/**
 * Entitás lérehozása
 * @param entityOptions
 * @returns {*}
 */
FloorPlanner.prototype.makeEntity = function(entityOptions) {

    let self = this;

    let entity = entityOptions;

    entity.graph = null;
    entity.handleGraph = null;

    /**
     * Entitás frissításe
     * @returns {boolean}
     */
    entity.update = function() {

        // Grafikai elemek tömbje
        let entityGraphics = self.entityGraphics(entity.group, entity.kind, entity.look, entity.entityWidth, entity.entityHeight, entity.entityParameters);

        let updateGraph = true;

        if (!entity.graph) {
            // Újonnan kerül létrehozásra

            updateGraph = false;

            entity.graph = svgDraw.createElement( 'g');
            entity.handleGraph = svgDraw.createElement( 'g');
        }

        for (let i in entityGraphics.graphicsArray) {

            // Grafikai elemek frissítése a megváltozott paraméterek alapján

            // Kész grafikai elem HTML attribútumai
            let graphAttributes = self.extend(true, entityGraphics.graphicsArray[i].attributes, {
                // itt lehet bővíteni
            });

            // Fogantyú grafikai elem HTML attribútumai
            let handleGraphAttributes = self.extend(true, entityGraphics.graphicsArray[i].attributes, {
                fill: self.options.config.entity.handleFillColor,
                stroke: self.options.config.entity.handleStrokeColor,
            });

            if (updateGraph) {

                for (let attribute in graphAttributes) {
                    help(help(entity.graph).children()[i]).attr(attribute, graphAttributes[attribute]);
                }

                for (let attribute in handleGraphAttributes) {
                    help(help(entity.handleGraph).children()[i]).attr(attribute, handleGraphAttributes[attribute]);
                }

                if (entityGraphics.graphicsArray[i].type === 'text') {
                    help(entity.graph).children()[i][0].textContent = entityGraphics.params.textContent;
                    help(entity.handleGraph).children()[i][0].textContent = entityGraphics.params.textContent;
                }

            } else {

                let graph;
                let handleGraph;

                if (entityGraphics.graphicsArray[i].type === 'path') {
                    graph = svgDraw.createElement('path', graphAttributes);
                    handleGraph = svgDraw.createElement('path', handleGraphAttributes);
                } else if (entityGraphics.graphicsArray[i].type === 'rect') {
                    graph = svgDraw.createElement('rect', graphAttributes);
                    handleGraph = svgDraw.createElement('rect', handleGraphAttributes);
                } else if (entityGraphics.graphicsArray[i].type === 'text') {
                    graph = svgDraw.createElement('text', graphAttributes);
                    graph.textContent = entityGraphics.params.textContent;
                    handleGraph = svgDraw.createElement('text', handleGraphAttributes);
                    handleGraph.textContent = entityGraphics.params.textContent;
                }

                entity.graph.appendChild(graph);
                entity.handleGraph.appendChild(handleGraph);
            }
        }

        // Az entitásnak a fal szögében kell állnia, de ha a fal oldala cserélve van, 180 fokkal fordul
        let transformAngle = entity.angleDeg;
        if (entityGraphics.params.canChangeSide && entityGraphics.params.changeSide) {
            transformAngle -= 180;
            if (transformAngle < 0) {
                transformAngle += 360;
            }
            transformAngle = transformAngle % 360;
        }

        // Nyitásirány
        let hinge = 1;
        if (entityGraphics.params.canChangeHinge && entityGraphics.params.changeHinge) {
            hinge = -1;
        }

        let transformAttribute =
            "translate(" + entity.coordinates.x + "," + entity.coordinates.y + ")" +
            "rotate(" + transformAngle + ",0,0)" +
            "scale(" + hinge + ", 1)";

        entity.params = entityGraphics.params;

        help(entity.graph).attr('transform', transformAttribute);
        help(entity.handleGraph).attr('transform',transformAttribute);

        //entity.width  = (entity.entityWidth / self.options.config.meter).toFixed(2);
        //entity.height = (entity.entityHeight / self.options.config.meter).toFixed(2);

        return true;
    };

    /**
     * Entitás törlése
     */
    entity.deleteEntity = function() {
        self.deleteEntities([
            this.index
        ]);

        // Fogantyút muszáj eltüntetni, mert lehet, hogy az éppen törölt valamelyik falon vagy végpontjain álltt
        self.removeHandle();

        // Újra kell rajzolni, mert a kapcsolatok megszűnése miatt bizonyos falak végei máshogy fognak kinézni
        self.renderFloorplan();

    };

    /**
     * Bounding Box
     */
    Object.defineProperty(entity, 'boundingBox', {
        get: function() {
            this.update();
            let boundingBox = entity.graph.getBoundingClientRect();
            let offsetCoordinates = self.offsetCoordinates(boundingBox);
            boundingBox.x = offsetCoordinates.x;
            boundingBox.y = offsetCoordinates.y;
            boundingBox.origin = entity.coordinates;
            return boundingBox;
        }
    });

    /**
     * Befoglaló poligon
     */
    Object.defineProperty(entity, 'boundingBoxPolygon', {
        get: function() {

            let xArray = [];
            let yArray = [];

            let calculateMinMax = function (coordinates) {
                xArray.push(coordinates.x);
                yArray.push(coordinates.y);
            };

            for (let i in this.edgesPolygon) {
                calculateMinMax(this.edgesPolygon[i]);
            }

            let minX = Math.min.apply(null, xArray);
            let maxX = Math.max.apply(null, xArray);

            let minY = Math.min.apply(null, yArray);
            let maxY = Math.max.apply(null, yArray);

            return [
                {
                    x: minX,
                    y: minY
                },
                {
                    x: maxX,
                    y: minY
                },
                {
                    x: maxX,
                    y: maxY
                },
                {
                    x: minX,
                    y: maxY
                }
            ];
        }
    });

    /**
     * Tényleges sarokpontok poligonja
     */
    Object.defineProperty(entity, 'edgesPolygon', {
        get: function() {

            let bBox = entity.graph.getBBox();

            bBox.x += entity.coordinates.x;
            bBox.y += entity.coordinates.y;

            let bBoxPolygon = [
                {
                    x: bBox.x,
                    y: bBox.y
                },
                {
                    x: bBox.x + bBox.width,
                    y: bBox.y
                },
                {
                    x: bBox.x + bBox.width,
                    y: bBox.y + bBox.height
                },
                {
                    x: bBox.x,
                    y: bBox.y + bBox.height
                }
            ];

            let angleRad = svgDraw.degToRad(entity.angleDeg);

            let rotatedPolygon = [];

            for (let i in bBoxPolygon) {
                rotatedPolygon[i] = svgDraw.rotatePointAroundCoordinates(entity.coordinates, angleRad, bBoxPolygon[i]);
            }

            return rotatedPolygon;

        }
    });

    /**
     * Kezdpőpont
     */
    Object.defineProperty(entity, 'start', {
        get: function() {
            let angleRad = svgDraw.degToRad(entity.angleDeg);
            return {
                x: entity.coordinates.x - entity.entityWidth/2 * Math.cos(angleRad) ,
                y: entity.coordinates.y - entity.entityWidth/2 * Math.sin(angleRad),
            }
        }
    });

    /**
     * Végpont
     */
    Object.defineProperty(entity, 'end', {
        get: function() {
            let angleRad = svgDraw.degToRad(entity.angleDeg);
            return {
                x: entity.coordinates.x + entity.entityWidth/2 * Math.cos(angleRad) ,
                y: entity.coordinates.y + entity.entityWidth/2 * Math.sin(angleRad),
            }
        }
    });

    /**
     * Középvonal egyenlete
     */
    Object.defineProperty(entity, 'baseEquation', {
        get: function() {
            let start = entity.start;
            let end = entity.end;
            return svgDraw.calculateEquation(start.x, start.y, end.x, end.y);
        }
    });

    /**
     * Entitás fala
     * (ha fali entitás)
     */
    Object.defineProperty(entity, 'wall', {
        get: function() {
            return entity.entityParameters.wallIndex ? self.walls[entity.entityParameters.wallIndex] : null;
        }
    });

    /**
     * Ráfér-e az entitás a falra
     * TODO: improvement: szomszédos falak vastagságainak figyelembe vétele
     * TODO: improvement: többi entitás figyelembe vétele a falon
     * @param newWidth
     * @param newCoordinates
     * @returns {boolean}
     */
    entity.insideWallLimits = function(newWidth, newCoordinates) {
        let limits;
        if (this.wall) {
            limits = svgDraw.sectionOnCoordinates(this.wall.equations.base, newWidth, newCoordinates);
            if (svgDraw.between(limits[0].x, this.wall.start.x, this.wall.end.x) &&
                svgDraw.between(limits[0].y, this.wall.start.y, this.wall.end.y) &&
                svgDraw.between(limits[1].x, this.wall.start.x, this.wall.end.x) &&
                svgDraw.between(limits[1].y, this.wall.start.y, this.wall.end.y)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    entity.update();

    return entity;
};

/**
 * String hash
 * @returns {number}
 */
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length === 0) {
        return hash;
    }
    for (let i = 0; i < this.length; i++) {
        let chr = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
