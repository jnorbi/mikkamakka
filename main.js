var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

window.addEventListener("load", function() {
    let defaultModalOptions = {
        keyboard: false,
        backdrop: 'static'
    };

    let udvozloModalElement = help('#udvozloModal');
    let bemutatoModalElement = help('#bemutatoModal');
    let ujAlaprajzModalElement = help('#ujAlaprajzModal');
    let ujAlaprajzLetrehozasModalElement = help('#ujAlaprajzLetrehozasModal');
    let ujAlaprajzLetrehozasModal = new bootstrap.Modal(ujAlaprajzLetrehozasModalElement[0], defaultModalOptions);

    if (getCookie('udvozloModal') !== 'hidden') {
        new bootstrap.Modal(udvozloModalElement[0], defaultModalOptions).show();
    } else if (!getCookie('alaprajzNeve')) {
        ujAlaprajzLetrehozasModal.show();
    }

    udvozloModalElement.on('shown.bs.modal', function() {
        help('.reset-floorplan').on('click', function() {
            floorPlanner.reset(true);
        })
    });

    udvozloModalElement.on('hidden.bs.modal', function() {
        setCookie('udvozloModal', 'hidden', '365');
    });

    bemutatoModalElement.on('hidden.bs.modal', function() {
        if (!getCookie('alaprajzNeve')) {
            ujAlaprajzLetrehozasModal.show();
        }
    });

    help('#udvozloModal button.btn-primary').on('click', function() {
        ujAlaprajzLetrehozasModal.show();
    });

    help('#udvozloModal button.btn-outline-primary').on('click', function() {

        new bootstrap.Modal(bemutatoModalElement[0], defaultModalOptions).show();
    });

    ujAlaprajzLetrehozasModalElement.on('hidden.bs.modal', function() {
        if (help('#inputAlaprajzNeve').val().length) {
            setCookie('alaprajzNeve', help('#inputAlaprajzNeve').val());
            help('#floorplan-name').html(help('#inputAlaprajzNeve').val());
        }
    });

    ujAlaprajzLetrehozasModalElement.on('shown.bs.modal', function() {
        help('#inputAlaprajzNeve').val('');
        help('#floorplan-name').html('');
        eraseCookie('alaprajzNeve');
    });

    ujAlaprajzModalElement.on('shown.bs.modal', function() {
        help('.reset-floorplan').on('click', function() {
            floorPlanner.reset(true);
        })
    });

    help('#ujAlaprajzModal button.btn-primary').on('click', function() {
        ujAlaprajzLetrehozasModal.show();
    });

    help('#ujAlaprajzLetrehozasModal button.btn-primary').on('click', function() {
        if (help('#inputAlaprajzNeve').hasClass('is-invalid')) {
            help('#inputAlaprajzNeve').removeClass('is-invalid');
        }

        if (help('#inputAlaprajzNeve').val().length) {
            ujAlaprajzLetrehozasModal.hide();
        } else {
            help('#inputAlaprajzNeve').addClass('is-invalid');
        }
    });

    help('#inputAlaprajzNeve').on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (help('#inputAlaprajzNeve').val().length) {
                ujAlaprajzLetrehozasModal.hide();
            }
        }
    });

    if (getCookie('alaprajzNeve')) {
        help('#floorplan-name').html(getCookie('alaprajzNeve'));
    }

    /**
     * Input spinner +
     */
    help(".spinner .bi.bi-plus-square").on("click", function() {
        help(this.closest('.spinner').querySelectorAll('input')).val(
            parseInt(help(this.closest('.spinner').querySelectorAll('input')).val(), 10) + 1
        );
        this.closest('.spinner').querySelectorAll('input')[0].focus();
        this.closest('.spinner').querySelectorAll('input')[0].blur();
    });

    /**
     * Input spinner -
     */
    help(".spinner .bi.bi-dash-square").on("click", function() {
        help(this.closest('.spinner').querySelectorAll('input')).val(
            parseInt(help(this.closest('.spinner').querySelectorAll('input')).val(), 10) - 1
        );
        this.closest('.spinner').querySelectorAll('input')[0].focus();
        this.closest('.spinner').querySelectorAll('input')[0].blur();
    });

    /**
     * Accordion menü fejlécre kattintáskor kattintsa le az első gombot a menüben
     */
    help('#accordion-menu .accordion-button').on('click', function() {
        let accordionButtons = this.closest('.accordion-item').querySelectorAll('.accordion-collapse button');
        if (!help(this).hasClass('collapsed') && accordionButtons.length) {
            accordionButtons[0].click();
        }
    });

    /**
     * Accordion menü ID selector
     * @param string
     * @returns {string}
     */
    let accordionModeIdSelector = function(string) {
        return (string.charAt(0).toUpperCase() + string.slice(1)).replace('Mode', '');
    };

    /**
     * Accordion menü beállítás módnak megfelelően
     * @param mode
     */
    let setAccordionRegardingMode = function(mode) {
        let accordionContainerElement = '#accordion-menu';
        help(accordionContainerElement + ' .accordion-button').addClass('collapsed');
        help(accordionContainerElement + ' .accordion-collapse').removeClass('show');
        help(accordionContainerElement + ' #accordion-heading' + accordionModeIdSelector(mode) + ' .accordion-button').removeClass('collapsed');
        help(accordionContainerElement + ' #accordion-collapse' + accordionModeIdSelector(mode)).addClass('show');
    }

    /**
     * Lehetséges szoba-feliratok
     * @type {string[]}
     */
    let szobaFeliratok = [
        'egyéb helyiség',
        'előtér',
        'étkező',
        'folyosó',
        'fürdőszoba',
        'garázs',
        'gardrób',
        'hall',
        'hálószoba',
        'szoba',
        'kamra',
        'konyha',
        'lépcsőház',
        'nappali',
        'padlás',
        'pince',
        'tároló',
        'tetőtér',
        'wc',
    ];

    /**
     * Entitásból popover target id
     * @param entity
     * @returns {string}
     */
    let getEntityPopoverHandleId = function(entity) {
        return 'popover-entity-' + entity.index + '-handle'
    };

    /**
     * Falból popover target id
     * @param wall
     * @returns {string}
     */
    let getWallPopoverHandleId = function(wall) {
        return 'popover-wall-' + wall.index + '-handle'
    };

    /**
     * Popoverek gyűjteménye
     * @type {*[]}
     */
    let popovers = [];

    /**
     * Popoverek és triggerek törlése
     */
    let disposeAllPopovers = function(obj) {

        let excludeId = null;

        if (obj) {
            if (obj.entity) {
                excludeId = getEntityPopoverHandleId(obj.entity);
            } else if (obj.wall) {
                excludeId = getWallPopoverHandleId(obj.wall);
            }
        }

        // Popoverek törlése
        if (popovers) {
            for (let i in popovers) {
                if (!obj || (obj.entity && popovers[i].entity.index !== obj.entity.index) || (obj.wall && popovers[i].wall.index !== obj.wall.index)) {
                    popovers[i].dispose();
                } else {
                    popovers[i].update();
                }
            }
        }

        // Triggerek törlése a DOM-ból
        let popoverTriggers = [].slice.call(document.querySelectorAll('.popover'))
        for (let i in popoverTriggers) {
            if (!excludeId || excludeId !== popoverTriggers[i].id) {
                popoverTriggers[i].remove();
            }
        }

        // Gyűjtemény ürítése
        popovers = [];

    };

    /**
     * FloorPlanner objektum
     * @type {FloorPlanner}
     */
    floorPlanner = new FloorPlanner({
        callbacks: {
            entitySelect: function(entity) {

                let self = this;

                disposeAllPopovers({entity: entity});

                try {

                    let handleId = getEntityPopoverHandleId(entity);

                    let centerHandleElement = help('#' + handleId);

                    let popover = null;
                    if (centerHandleElement.length) {
                        popover = bootstrap.Popover.getInstance(centerHandleElement[0]);
                    }

                    if (popover !== null) {
                        popover.update();
                    } else {

                        if (centerHandleElement) {
                            centerHandleElement.remove();
                        }

                        let entityBoundingBoxPolygon = entity.boundingBoxPolygon;
                        let centerCoords = svgDraw.middle(entityBoundingBoxPolygon[2], entityBoundingBoxPolygon[3]);

                        let deleteButtonTitle = 'Törlés';
                        if (entity.kind === 'door') {
                            deleteButtonTitle = 'Ajtó törlése';
                        } else if (entity.kind === 'window') {
                            deleteButtonTitle = 'Ablak törlése';
                        } else if (entity.kind === 'caption') {
                            deleteButtonTitle = 'Felirat törlése';
                        }

                        let bsContent = '<div class="text-nowrap">';

                        if (entity.params.canChangeSide) {
                            bsContent +=
                                "<button class=\"btn btn-link text-decoration-none text-reset p-0 pt-1 me-1 rounded-0 change-side\" title=\"Másik oldal\">" +
                                "<svg width=\"24\" height=\"25\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 25\">" +
                                "<path stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m7.72 18.0309-4.94 4.94c-.21462.2143-.53721.2783-.81739.1621-.28017-.1162-.46275-.3898-.46261-.6931v-9.878c-.00014-.3033.18244-.5769.46261-.6931.28018-.1162.60277-.0523.81739.1621l4.94 4.94c.1407.1405.21975.3312.21975.53 0 .1988-.07905.3895-.21975.53ZM16.2801 18.0309l4.94 4.94c.2146.2143.5372.2783.8173.1621.2802-.1162.4628-.3898.4627-.6931v-9.878c.0001-.3033-.1825-.5769-.4627-.6931-.2801-.1162-.6027-.0523-.8173.1621l-4.94 4.94c-.1407.1405-.2198.3312-.2198.53 0 .1988.0791.3895.2198.53Z\" clip-rule=\"evenodd\"/>" +
                                "<path stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M12 24.25v-13.5M3 2.5l.697 5.257 5.257-.697\"/>" +
                                "<path stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M19.349 7.75046c-.7072-3.47013-3.7453-5.9727-7.2866-6.00215-3.54132-.02945-6.62064 2.42226-7.3854 5.88015\"/>" +
                                "</svg>" +
                                "<span>Másik oldal</span>" +
                                "</button>";
                        }

                        if (entity.params.canChangeHinge) {
                            bsContent += "<button class=\"btn btn-link text-decoration-none text-reset p-0 pt-1 rounded-0 change-hinge\" title=\"Nyitásirány\">" +
                                "<svg width=\"24\" height=\"25\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 25\">" +
                                "<path stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m6.751 9.77734-.527 4.22786 4.446.6384M14.25 1.71973h7.5c.8284 0 1.5.64471 1.5 1.44V21.8797c0 .7953-.6716 1.44-1.5 1.44h-7.5M11.25 1.71973v4.32M11.25 17.5596v5.76M6.75 1.71973h1.5M6.75 23.3193h1.5M.75 6.04004v1.44M.75 11.7998v1.44M.75 17.5596v1.44M.75 3.15973c0-.79529.67157-1.44 1.5-1.44M2.25 23.3199c-.82843 0-1.5-.6447-1.5-1.44\"/>" +
                                "<path stroke=\"#000\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M18.365 15.3993c-.8567-2.3255-3.0142-3.9826-5.5656-4.2745-2.5514-.292-5.05428.8318-6.45638 2.8989\"/>" +
                                "</svg>" +
                                "<span class=\"text-nowrap\">Nyitásirány</span>" +
                                "</button>";
                        }

                        if (entity.kind === 'caption') {
                            // bsContent += "<input class=\"change-text-content\" title=\"Felirat\" value=\"" + entity.params.textContent + "\" />";
                            bsContent += "<select class=\"change-text-content form-select form-select-lg d-inline-block align-middle ms-1 me-2\" style='max-width: 180px'>";
                            bsContent += "<option>" + entity.entityParameters.textContent + "</option>";
                            szobaFeliratok.forEach(function(element) {
                                bsContent += "<option>" + element + "</option>";
                            });
                            bsContent += "</select>";
                        }

                        bsContent += "<button class=\"btn btn-link text-decoration-none text-reset p-0 pt-1 rounded-0 delete-entity\" title=\"" + deleteButtonTitle + "\">" +
                            "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
                            "<path d=\"M1.5 4.5H22.5\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                            "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M14.25 1.5H9.75C8.92157 1.5 8.25 2.17157 8.25 3V4.5H15.75V3C15.75 2.17157 15.0784 1.5 14.25 1.5Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                            "<path d=\"M9.75 17.25V9.75\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                            "<path d=\"M14.25 17.25V9.75\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                            "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.865 21.124C18.8005 21.9017 18.1504 22.5001 17.37 22.5H6.631C5.8506 22.5001 5.20051 21.9017 5.136 21.124L3.75 4.5H20.25L18.865 21.124Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                            "</svg>" +
                            "<span>Törlés</span>" +
                            "</button>";

                        bsContent += "</div>";

                        centerHandleElement = svgDraw.createElement(
                            'rect',
                            {
                                id: getEntityPopoverHandleId(entity),
                                class: 'popover-handle',
                                x: centerCoords.x,
                                y: centerCoords.y,
                                width: 1,
                                height: 1,
                                fill: '#0000ff',
                                'style': 'fill-opacity: 0',
                                'data-bs-toggle': 'popover',
                                'title': '',
                                'data-bs-content': bsContent,
                                'data-bs-placement': 'bottom',
                                'data-bs-trigger': 'focus',
                                'data-bs-container': 'div.floorplan-container',
                                'data-bs-custom-class': 'popover-entity rounded border-0'
                            }
                        );

                        help(this.options.config.entity.tmpEntityContainerElement).appendChild(centerHandleElement);

                        let centerHandleElementPopoverTrigger = help(centerHandleElement);

                        let popoverShownHiddenHandler = function (event) {

                            let popover = bootstrap.Popover.getOrCreateInstance(event.target)

                            help('#entityBox').removeClass("d-none");

                            let changeSideButton = help('#' +  popover.tip.id + ' button.change-side');

                            if (popover.entity.params.canChangeSide) {
                                let handler = function() {
                                    popover.entity.entityParameters.changeSide = !popover.entity.entityParameters.changeSide;
                                    popover.entity.update();
                                };
                                if (event.type === 'hidden.bs.popover') {
                                    changeSideButton.off('click', handler);
                                } else {
                                    changeSideButton.on('click', handler);
                                }
                            }

                            let changeHingeButton = help('#' +  popover.tip.id + ' button.change-hinge');
                            if (popover.entity.params.canChangeHinge) {
                                let handler = function () {
                                    popover.entity.entityParameters.changeHinge = !popover.entity.entityParameters.changeHinge;
                                    popover.entity.update();
                                };
                                if (event.type === 'hidden.bs.popover') {
                                    changeHingeButton.off('click', handler);
                                } else {
                                    changeHingeButton.on('click', handler);
                                }
                            }

                            let deleteEntityButton = help('.delete-entity');

                            let deleteEntityHandler = function () {
                                try {
                                    popover.entity.deleteEntity();
                                    disposeAllPopovers();
                                } catch (e) {
                                    console.log(e);
                                    // Revoked Proxy
                                }
                            };

                            if (event.type === 'hidden.bs.popover') {
                                deleteEntityButton.off('click', deleteEntityHandler);
                            } else {
                                deleteEntityButton.on('click', deleteEntityHandler);
                            }

                            if (popover.entity.kind === 'caption') {
                                let changeTextContent = help('#' +  popover.tip.id + ' .change-text-content');

                                let handler = function () {
                                    popover.entity.entityParameters.textContent = this.value;
                                    popover.entity.update();
                                };
                                if (event.type === 'hidden.bs.popover') {
                                    changeTextContent.off('input', handler);
                                } else {
                                    changeTextContent.on('input', handler);
                                }
                            }

                            centerHandleElementPopoverTrigger.off(event.type, popoverShownHiddenHandler);

                            self.initChangeModeElements();

                        };

                        centerHandleElementPopoverTrigger.on('shown.bs.popover', popoverShownHiddenHandler);
                        centerHandleElementPopoverTrigger.on('hidden.bs.popover', popoverShownHiddenHandler);

                        setTimeout(function() {
                            let centerHandleElementPopover = bootstrap.Popover.getOrCreateInstance(centerHandleElement, {
                                sanitize: false,
                                html: true,
                                trigger: 'manual',
                            });

                            centerHandleElementPopover.entity = entity;
                            centerHandleElementPopover.show();
                            popovers.push(centerHandleElementPopover);

                        }, 250);
                    }

                } catch (e) {
                    console.log(e);
                    // Revoked Proxy
                }
            },
            wallSelect: function(wall) {

                let self = this;

                disposeAllPopovers({wall: wall});

                try {

                    let centerCoords = svgDraw.middle(wall.end, wall.start);

                    let handleId = getWallPopoverHandleId(wall);

                    let centerHandleElement = help('#' + handleId);

                    let popover = null;
                    if (centerHandleElement.length) {
                        popover = bootstrap.Popover.getInstance(centerHandleElement[0]);
                    }

                    if (popover !== null) {
                        popover.update();
                    } else {

                        if (centerHandleElement) {
                            centerHandleElement.remove();
                        }

                        centerHandleElement = svgDraw.createElement(
                            'rect',
                            {
                                id: handleId,
                                class: 'popover-handle',
                                x: centerCoords.x,
                                y: centerCoords.y,
                                width: 1,
                                height: 1,
                                fill: '#ff0000',
                                'style': 'fill-opacity: 0',
                                'data-bs-toggle': 'popover',
                                'title': '',
                                'data-bs-content': "<button class=\"change-mode btn btn-link text-decoration-none text-reset p-0 pt-1 me-1 rounded-0\" data-mode=\"doorWindowMode\" data-kind=\"window\" title=\"Ablak elhelyezése\">" +
                                    "<svg width=\"24\" height=\"25\" viewBox=\"0 0 24 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
                                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.5 1.71997H18.5C19.0523 1.71997 19.5 2.14978 19.5 2.67997V23.32H4.5V2.67997C4.5 2.14978 4.94772 1.71997 5.5 1.71997Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M12 2V23\" stroke=\"black\"/>" +
                                    "<path d=\"M20 13L4 13\" stroke=\"black\"/>" +
                                    "</svg>" +
                                    "<span>Ablak</span>" +
                                    "</button>" +
                                    "<button class=\"change-mode btn btn-link text-decoration-none text-reset p-0 pt-1 rounded-0\" data-mode=\"doorWindowMode\" data-kind=\"door\" title=\"Ajtó elhelyezése\">" +
                                    "<svg width=\"24\" height=\"25\" viewBox=\"0 0 24 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.5 1.71997H18.5C19.0523 1.71997 19.5 2.14978 19.5 2.67997V23.32H4.5V2.67997C4.5 2.14978 4.94772 1.71997 5.5 1.71997Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M15.75 12.1599C15.9571 12.1599 16.125 12.3211 16.125 12.5199\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M15.375 12.5199C15.375 12.3211 15.5429 12.1599 15.75 12.1599\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M15.75 12.88C15.5429 12.88 15.375 12.7188 15.375 12.52\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M16.125 12.52C16.125 12.7188 15.9571 12.88 15.75 12.88\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M1.5 23.3199H22.5\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "</svg>" +
                                    "<span>Ajtó</span>" +
                                    "</button>" +
                                    "<button class=\"btn btn-link text-decoration-none text-reset p-0 pt-1 rounded-0 ms-1 border-start delete-wall\" title=\"Fal törlése\">" +
                                    "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">" +
                                    "<path d=\"M1.5 4.5H22.5\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M14.25 1.5H9.75C8.92157 1.5 8.25 2.17157 8.25 3V4.5H15.75V3C15.75 2.17157 15.0784 1.5 14.25 1.5Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M9.75 17.25V9.75\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path d=\"M14.25 17.25V9.75\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.865 21.124C18.8005 21.9017 18.1504 22.5001 17.37 22.5H6.631C5.8506 22.5001 5.20051 21.9017 5.136 21.124L3.75 4.5H20.25L18.865 21.124Z\" stroke=\"black\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" +
                                    "</svg>" +
                                    "<span>Törlés</span>" +
                                    "</button>",
                                'data-bs-placement': 'bottom',
                                'data-bs-trigger': 'focus',
                                'data-bs-container': 'div.floorplan-container',
                                'data-bs-custom-class': 'popover-wall rounded border-0'
                            }
                        );

                        help(this.options.config.wall.tmpWallContainerElement + ' > g').appendChild(centerHandleElement);

                        let centerHandleElementPopoverTrigger = help(centerHandleElement);

                        let popoverShownHiddenHandler = function (event) {

                            let popover = bootstrap.Popover.getOrCreateInstance(event.target)

                            let meter = self.options.config.meter;

                            //setAccordionRegardingMode('wallDrawingMode');

                            help('#wallThickness').val(popover.wall.thickness / meter * 100);
                            help('#wallBox').removeClass("d-none");

                            let wallThicknessSet = function() {
                                try {
                                    popover.wall.thickness = this.value / 100 * meter;
                                } catch (e) {
                                    // Revoked Proxy
                                }
                            };

                            if (event.type === 'hidden.bs.popover') {
                                help('#wallThickness').off("blur", wallThicknessSet);
                                help('#wallThickness').off("change", wallThicknessSet);
                            } else {
                                help('#wallThickness').on("blur", wallThicknessSet);
                                help('#wallThickness').on("change", wallThicknessSet);
                            }

                            let wallDelete = function() {
                                try {
                                    popover.wall.deleteWall();
                                    disposeAllPopovers();
                                } catch (e) {
                                    // Revoked Proxy
                                }
                            };

                            if (event.type === 'hidden.bs.popover') {
                                help('.delete-wall').off('click', wallDelete);
                            } else {
                                help('.delete-wall').on('click', wallDelete);
                            }

                            centerHandleElementPopoverTrigger.off(event.type, popoverShownHiddenHandler);

                            self.initChangeModeElements();

                        };


                        centerHandleElementPopoverTrigger.on('shown.bs.popover', popoverShownHiddenHandler);
                        centerHandleElementPopoverTrigger.on('hidden.bs.popover', popoverShownHiddenHandler);

                        setTimeout(function() {

                            let centerHandleElementPopover = bootstrap.Popover.getOrCreateInstance(centerHandleElement, {
                                sanitize: false,
                                html: true,
                            });

                            centerHandleElementPopover.wall = wall;

                            popovers.push(centerHandleElementPopover);

                            centerHandleElementPopover.show();

                        }, 250);
                    }



                } catch (e) {
                    // Revoked Proxy
                    return;
                }
            },
            entityMove: function(entity) {
                setTimeout(function() {
                    try {
                        let popoverHandle = help('#' + getEntityPopoverHandleId(entity));
                        if (popoverHandle.length) {
                            let popover = bootstrap.Popover.getInstance(popoverHandle[0]);
                            if (popover !== null) {
                                popover.hide();
                            }
                        }
                    } catch (e) {
                        // Revoked Proxy
                        return;
                    }
                }, 100);
            },
            entityMoveEnd: function(entity) {
                setTimeout(function() {
                    try {
                        let popoverHandle = help('#' + getEntityPopoverHandleId(entity));

                        if (popoverHandle.length) {
                            let entityBoundingBoxPolygon = entity.boundingBoxPolygon;
                            let centerCoords = svgDraw.middle(entityBoundingBoxPolygon[2], entityBoundingBoxPolygon[3]);

                            popoverHandle.attr('x', centerCoords.x);
                            popoverHandle.attr('y', centerCoords.y);

                            let popover = bootstrap.Popover.getInstance(popoverHandle[0]);
                            if (popover !== null) {
                                popover.show();
                            }
                        }
                    } catch (e) {
                        // Revoked Proxy
                        return;
                    }
                }, 100);
            },
            wallMove: function (wall) {
                setTimeout(function() {
                    try {
                        let popoverHandle = help('#' + getWallPopoverHandleId(wall));

                        if (popoverHandle.length) {
                            let popover = bootstrap.Popover.getInstance(popoverHandle[0]);
                            if (popover !== null) {
                                popover.hide();
                            }
                        }
                    } catch (e) {
                        // Revoked Proxy
                        return;
                    }
                }, 100);

            },
            wallMoveEnd: function(wall) {
                setTimeout(function() {
                    try {
                        let centerCoords = svgDraw.middle(wall.start, wall.end);

                        let popoverHandle = help('#' + getWallPopoverHandleId(wall));

                        popoverHandle.attr('x', centerCoords.x);
                        popoverHandle.attr('y', centerCoords.y);

                        if (popoverHandle.length) {
                            let popover = bootstrap.Popover.getInstance(popoverHandle[0]);
                            if (popover !== null) {
                                popover.show();
                            }
                        }
                    } catch (e) {
                        // Revoked Proxy
                    }
                }, 100);
            },
            zoom: function () {
                setTimeout(function() {
                    let popoverTriggerList = [].slice.call(help('[data-bs-toggle="popover"]'));
                    for (let i in popoverTriggerList) {
                        let popover = bootstrap.Popover.getOrCreateInstance(popoverTriggerList[i]);
                        if (popover !== null) {
                            popover.update();
                        }
                    }
                }, 100);
            },
            deselect: function() {

                help('#wallThickness').off('blur');
                help('#wallThickness').off('change');
                help('#wallBox').addClass("d-none");
                help('#entityBox').addClass("d-none");

                disposeAllPopovers();
                setAccordionRegardingMode(this.mode);
            },
            modeChanged: function() {
                disposeAllPopovers();
                setAccordionRegardingMode(this.mode);
            },
            historyChanged: function(undoOrRedo) {
                if (undoOrRedo) {
                    disposeAllPopovers();
                }

                let undo = help('.undo');
                let redo = help('.redo');

                if (this.canUndo()) {
                    undo.removeClass('disabled');
                } else {
                    undo.addClass('disabled');
                }

                if (this.canRedo()) {
                    redo.removeClass('disabled');
                } else {
                    redo.addClass('disabled');
                }
            },
            afterInit: function() {

                let self = this;

                help('.undo').on("click", function() {
                    self.undo();
                });

                help('.redo').on("click", function() {
                    self.redo();
                });

            }
        }
    });
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}