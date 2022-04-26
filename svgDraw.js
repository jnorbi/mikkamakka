// 20220426

svgDraw = {

    /**
     * SVG element létrehozása
     * @param tagName
     * @param attributes
     * @param parentId
     * @returns {*}
     */
    createElement: function(tagName, attributes, parentId) {
        let element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
        for (let k in attributes) {
            help(element).attr(k, attributes[k]);
        }
        if (typeof parentId != 'undefined') {
            help("#" + parentId).appendChild(element);
        }
        return element;
    },

    /**
     * Két koordinátapár euklideszi távolságának négyzete
     * @param a
     * @param b
     * @returns {number}
     */
    distancePow: function(a, b) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    },

    /**
     * Két koordinátapár euklideszi távolsága
     * @param a
     * @param b
     * @returns {number}
     */
    distance: function(a, b) {
        return Math.sqrt(this.distancePow(a, b));
    },

    /**
     * Két objektum azonos-e
     * @param a
     * @param b
     * @returns {boolean}
     */
    isSame: function(a, b = null) {
        if (!b) {
            return a === b;
        }
        let same = true;
        for (let property in a) {
            if (a[property] !== b[property]) {
                same = false;
                break;
            }
        }
        return same;
    },

    /**
     * Két ponton átmenő egyenes egyenlete
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {{A: number, B: number}|{A: string, B}}
     */
    calculateEquation: function(x0, y0, x1, y1) {
        if (x1 === x0) {
            // x koordináta azonos: függőleges egyenes
            return {
                A:  'v',
                B:  x0
            };
        } else if (y1 === y0) {
            // y koordináta azonos: vízszintes egyenes
            return {
                A:  'h',
                B:  y0
            };
        } else {
            let m = (y1 - y0) / (x1 - x0);
            return {
                A:  m,
                B:  y1 - m * x1
            };
        }
    },

    /**
     * Adott ponton átmenő. adott egyenesre merőleges egyenes egyenlete
     * @param equation
     * @param x1
     * @param y1
     * @returns {{A: number, B: number}|{A: string, B}}
     */
    calculatePerpendicularEquation: function(equation, x1, y1) {
        if (typeof(equation.A) == 'string') {
            if (equation.A === 'h') {
                return {
                    A:  'v',
                    B:  x1
                };
            } else if (equation.A === 'v') {
                return {
                    A:  'h',
                    B:  y1
                };
            }
        } else {
            // két egyenes akkor és csak akkor merőleges, ha m1 * m2 = -1
            let m = -1 / equation.A;
            return {
                A:  m,
                B:  y1 - m * x1,
            };
        }
    },

    /**
     * Két egyenes metszéspontja
     * @param equation1
     * @param equation2
     * @returns {{x, y: *}|{x, y}|{x: number, y}|boolean|{x: number, y: *}}
     */
    calculateIntersection: function(equation1, equation2) {
        if (equation1.A === equation2.A) {
            // Párhuzamos egyenesek
            return false;
        }
        if (equation1.A === 'v' && equation2.A === 'h') {
            // Függőleges és vízszintes
            return {
                x: equation1.B,
                y: equation2.B
            };
        }
        if (equation1.A === 'h' && equation2.A === 'v') {
            // Vízszintes és függőleges
            return {
                x: equation2.B,
                y: equation1.B
            };
        }
        // Innentől az egyik legalább általános
        if (equation1.A === 'v') {
            // Függőleges és általános
            return {
                x: equation1.B,
                y: (equation2.A * equation1.B) + equation2.B
            };
        }
        if (equation1.A === 'h') {
            // Vízszintes és általános
            return {
                x: (equation1.B - equation2.B) / equation2.A,
                y: equation1.B
            };
        }
        if (equation2.A === 'v') {
            // Függőleges és általános
            return {
                x: equation2.B,
                y: (equation1.A * equation2.B) + equation1.B
            };
        }
        if (equation2.A === 'h') {
            // Vízszintes és általános
            return {
                x: (equation2.B - equation1.B) / equation1.A,
                y: equation2.B
            };
        }

        // Teljesen általános eset
        let x = (equation2.B - equation1.B) / (equation1.A - equation2.A);
        return {
            x: x,
            y: (equation1.A * x) + equation1.B
        };
    },

    /**
     * Point in polygon
     * https://en.wikipedia.org/wiki/Point_in_polygon
     * @param point
     * @param polygon
     * @returns {boolean}
     */
    pointInsidePolygon: function(point, polygon) {
        let insidePolygon = false;
        /**
         pl. négyszög, polygon.length == 4
         i: 0, 1, 2, 3
         j: 3, 0, 1, 2
         */
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let inx = (point.x - polygon[i].x) > (polygon[j].x - polygon[i].x) / (polygon[j].y - polygon[i].y) * (point.y - polygon[i].y)
            let iny = (polygon[i].y > point.y) !== (polygon[j].y > point.y);
            if (iny && inx) {
                insidePolygon = !insidePolygon;
            }
        }
        return insidePolygon;
    },

    /**
     * Két másik szám között van-e az adott szám (mindegy, melyik a nagyobb)
     * @param x
     * @param number1
     * @param number2
     * @returns {boolean}
     */
    between: function(x, number1, number2) {
        if ((x >= Math.min(number1, number2)) && (x <= Math.max(number1, number2))) {
            return true;
        }
        return false;
    },

    /**
     * Két koordinátát összekötő szakasz felezőpontja
     * @param coordinatesFrom
     * @param coordinatesTo
     * @returns {{x: number, y: number}}
     */
    middle: function(coordinatesFrom, coordinatesTo) {
        return {
            x: Math.abs(coordinatesFrom.x + coordinatesTo.x) / 2,
            y: Math.abs(coordinatesFrom.y + coordinatesTo.y) / 2
        };
    },

    /**
     * Szakasz végpontjainak koordinátái
     * @param equation megdott egyenlettel definiált egyenesen
     * @param length megadott hosszúságban
     * @param coordinates a megadott koordináta körül felmérve
     * @returns {[{x: number, y}, {x: *, y}]|[{x, y: number}, {x, y: *}]|[{x: number, y: *}, {x: number, y: *}]}
     */
    sectionOnCoordinates: function (equation, length, coordinates) {
        if (equation.A === 'v') {
            // Speciális eset: függőleges egyenes
            return [
                {
                    x: coordinates.x,
                    y: coordinates.y - length / 2
                },
                {
                    x: coordinates.x,
                    y: coordinates.y + length / 2
                }
            ];
        } else if (equation.A === 'h') {
            // Speciális eset: vízszintes egyenes
            return [
                {
                    x: coordinates.x - length / 2,
                    y: coordinates.y
                },
                {
                    x: coordinates.x + length / 2,
                    y: coordinates.y
                }
            ];
        } else {
            // Általános eset

            // A `coordinates` középpontú kör egyenlete:
            // (x - coordinates.x) * 2 + (y - coordinates.y) * 2 = (length / 2) ^ 2.
            // Kör egyenlete metszi az egyenes egyenletét, 2 pontban metszi

            // Másodfokú egyenlet megoldása
            let a = 1 + Math.pow(equation.A, 2);
            let b = -2 * coordinates.x + 2 * equation.A * equation.B - 2 * coordinates.y * equation.A;
            let c = Math.pow(coordinates.x, 2) + Math.pow(equation.B, 2) - 2 * coordinates.y * equation.B + Math.pow(coordinates.y, 2) - Math.pow(length / 2, 2);

            let determinant = Math.pow(b,2) - (4 * a * c);
            let solution1 = (-b - Math.sqrt(determinant)) / (2 * a);
            let solution2 = (-b + Math.sqrt(determinant)) / (2 * a);

            return [
                {
                    x: solution1,
                    y: solution1 * equation.A + equation.B
                },
                {
                    x: solution2,
                    y: solution2 * equation.A + equation.B
                }
            ];
        }
    },

    /**
     * Falak összes metszéspontjának kigyűjtése
     * - Szöget zárnak be és végpontokban metszik egymást
     * - Szöget zárnak be és általános helyen metszik egymást
     * - Párhuzamosak és egy egyenesbe esve egymást folytatják
     * Egy pont többször is szerepelhet, ahány fal végpontja vagy metszéspontja esetében szerepet játszik
     * (Minden fal oda-vissza benne van)
     * @param walls
     * @returns {*[]}
     */
    intersectionList: function(walls) {

        let intersectionList = [];

        for (let i in walls) {
            for (let j in walls) {
                if (j !== i) {

                    let intersection = this.calculateIntersection(walls[i].equations.base, walls[j].equations.base);

                    if (intersection) {
                        // végpontokban metszik egymást
                        if (this.isSame(walls[i].end, walls[j].start)) {
                            // i. végpont és j. kezdőpont
                            intersectionList.push({
                                wallIndex: i,
                                coordinates: {
                                    x: walls[j].start.x,
                                    y: walls[j].start.y
                                },
                            });
                        } else if (this.isSame(walls[j].end, walls[i].start)) {
                            // j. végpont és i. kezdőpont
                            intersectionList.push({
                                wallIndex: i,
                                coordinates: {
                                    x: walls[i].start.x,
                                    y: walls[i].start.y
                                },
                            });
                        } else {
                            // a metszéspont a falak egyenletein a falszakaszokba esnek
                            if (
                                this.between(Math.round(intersection.x), Math.round(walls[i].start.x), Math.round(walls[i].end.x)) &&
                                this.between(Math.round(intersection.y), Math.round(walls[i].start.y), Math.round(walls[i].end.y)) &&
                                this.between(Math.round(intersection.x), Math.round(walls[j].start.x), Math.round(walls[j].end.x)) &&
                                this.between(Math.round(intersection.y), Math.round(walls[j].start.y), Math.round(walls[j].end.y))
                            ) {
                                intersectionList.push({
                                    wallIndex: i,
                                    coordinates: {
                                        x: Math.round(intersection.x),
                                        y: Math.round(intersection.y),
                                    },
                                });
                            }
                        }
                    }

                    // egy egyenesbe esnek
                    if (this.isSame(walls[i].equations.base, walls[j].equations.base)) {
                        if (this.isSame(walls[i].end, walls[j].start)) {
                            // i. végpontból j. kezdőpont
                            intersectionList.push({
                                wallIndex: i,
                                coordinates: {
                                    x: walls[j].start.x,
                                    y: walls[j].start.y
                                },
                            });
                        } else  if (this.isSame(walls[i].start, walls[j].end)) {
                            // j. végpontból i. kezdőpont
                            intersectionList.push({
                                wallIndex: i,
                                coordinates: {
                                    x: walls[i].start.x,
                                    y: walls[i].start.y
                                },
                            });
                        }
                    }
                }
            }
        }

        /*
        help('.intersectiondebug').remove();
        for (let i in intersectionList) {
            this.debugPoint(intersectionList[i].coordinates, '#ff4500', 'intersectiondebug');
        }
        */

        return intersectionList;
    },

    /**
     * Csomópontok és szomszédos csomópontjaik kigyűjtése a falak összes metszéspontjának felhasználásával
     * @param walls
     * @returns {*[]}
     */
    vertexList: function(walls) {

        // Összes metszéspont
        let intersectionList = this.intersectionList(walls);

        // Csomópontok tömbje lesz belőle
        let vertexList = [];

        // Csomópontok kigyűjtése, a csomópontot befoglaló falak tömbjének egyidejű feltöltésével
        for (let i in intersectionList) {

            let needNewVertex = true;

            for (let j in vertexList) {
                if (this.isSame(intersectionList[i].coordinates, vertexList[j].coordinates)) {
                    // Már létező pont
                    needNewVertex = false;
                    if (!vertexList[j].wallList.includes(intersectionList[i].wallIndex)) {
                        // Új fal kapcsán jutottunk el ugyanoda, felvesszük a falak listájába
                        vertexList[j].wallList.push(intersectionList[i].wallIndex);
                    }
                    break;
                }
            }

            if (needNewVertex) {
                // Teljesen új csomópont
                vertexList.push({
                    coordinates: {
                        x: intersectionList[i].coordinates.x,
                        y: intersectionList[i].coordinates.y,
                    },
                    wallList: [
                        intersectionList[i].wallIndex
                    ],
                });
            }
        }

        // Minden egyes csomópontban legyen id
        for (let i in vertexList) {
            vertexList[i].id = i;
        }

        // Csomópont szomszédjainak meghatározása

        // 1. lépés:
        // A csomóponthoz minden olyan másik csomópontot felveszünk szomszédként, ahova el lehet jutni közös falon keresztül
        // Ez még nem jelenti, hogy valóban szomszédok, csak, hogy van olyan fal, amelyen mindketten rajta vannak
        for (let i in vertexList) {
            vertexList[i].neighbors = [];
            for (let iw in vertexList[i].wallList) {
                for (let j in vertexList) {
                    if (j !== i) {
                        for (let jw in vertexList[j].wallList) {
                            if (vertexList[j].wallList[jw] === vertexList[i].wallList[iw]) {
                                // Minden egyes szomszédhoz rögzítjük:
                                // - melyik falon juthatunk el hozzá
                                // - milyen messze van a fal kezdőpontjától
                                vertexList[i].neighbors.push({
                                    id: j,
                                    wallIndex: vertexList[j].wallList[jw],
                                    distancePowFromWallStart: this.distancePow(vertexList[j].coordinates, walls[vertexList[j].wallList[jw]].start),
                                });
                            }
                        }
                    }
                }
            }
        }

        // 2. lépés:
        // Minden csomóponthoz rögzített szomszédos pontot összehasonlítunk a többi szomszéddal

        for (let i in vertexList) {

            // Eltávolítandó szomszédok, amelyek valójában mint itt kiderül, nem is közvetlen szomszédok
            let neighborsToRemove = [];

            // Szomszédos pontok összehasonlítása a többi szomszéddal
            for (let j in vertexList[i].neighbors) {
                for (let k in vertexList[i].neighbors) {
                    if (k !== j) {
                        // Önmagával nem kell összehasonlítani
                        if (vertexList[i].neighbors[j].wallIndex === vertexList[i].neighbors[k].wallIndex) {

                            // A két szomszédos csúcs (`j` és `k`) egyazon falon van
                            // a) a távolság alapján megállapítjuk, a falon az `i csomópont által felosztott két oldal közül egyazon oldalon vannak-e
                            // b) a távolabbit felvesszük törlésre, ha egy oldalra esnek

                            // Az `i` csúcs távolsága a fal kezdőpontjától
                            let iDistancePowFromWallStart = this.distancePow(vertexList[i].coordinates, walls[vertexList[i].neighbors[j].wallIndex].start);

                            // Az `i`-hez képest ugyanarra oldalra esnek-e (`j` és `k`)
                            if (
                                (vertexList[i].neighbors[j].distancePowFromWallStart <= iDistancePowFromWallStart && vertexList[i].neighbors[k].distancePowFromWallStart <= iDistancePowFromWallStart) ||
                                (vertexList[i].neighbors[j].distancePowFromWallStart > iDistancePowFromWallStart && vertexList[i].neighbors[k].distancePowFromWallStart > iDistancePowFromWallStart)
                            ) {

                                // Megnézzük, milyen messze vannak az i. csúcstól
                                let jDistancePow = this.distancePow(vertexList[i].coordinates, vertexList[vertexList[i].neighbors[j].id].coordinates);
                                let kDistancePow = this.distancePow(vertexList[i].coordinates, vertexList[vertexList[i].neighbors[k].id].coordinates);

                                // Távolabbitt felvesszük törlésre
                                if (jDistancePow < kDistancePow && !neighborsToRemove.includes(vertexList[i].neighbors[k].id)) {
                                    neighborsToRemove.push(vertexList[i].neighbors[k].id);
                                }
                                if (jDistancePow > kDistancePow && !neighborsToRemove.includes(vertexList[i].neighbors[j].id)) {
                                    neighborsToRemove.push(vertexList[i].neighbors[j].id);
                                }
                            }
                        }
                    }
                }
            }

            // Ténylegesen töröljük a nem valódi szomszédokat
            vertexList[i].neighbors = vertexList[i].neighbors.filter(function(value, index, arr){
                return !neighborsToRemove.includes(value.id)
            });

        }

        /*
        help('.vertexdebug').remove();
        for (let i in vertexList) {
            this.debugPoint(vertexList[i].coordinates, '#336699', 'vertexdebug');
            svgDraw.debugText(vertexList[i].coordinates, i, 'vertexdebug');
        }
        */

        return vertexList;

    },

    /**
     * Két adott pontba mutató helyvektor bezárt szöve
     * @param coordinates1
     * @param coordinates2
     * @returns {{rad: number, deg: number}}
     */
    getAngle: function(coordinates1, coordinates2) {
        let radians = Math.atan2(coordinates2.y - coordinates1.y, coordinates2.x - coordinates1.x)
        return ({
            rad: radians,
            deg: this.radToDeg(radians)
        });
    },

    /**
     * Vonal vastagságának x irányú komponense
     * @param thickness
     * @param angle
     * @returns {number}
     */
    getLineThicknessX: function(thickness, angle) {
        return (thickness / 2) * Math.sin(angle);
    },

    /**
     * Vonal vastagságának y irányú komponense
     * @param thickness
     * @param angle
     * @returns {number}
     */
    getLineThicknessY: function(thickness, angle) {
        return (thickness / 2) * Math.cos(angle);
    },

    /**
     * Vonal egyenletei a vastagságának figyelemve vételével
     * @param from
     * @param to
     * @param thicknessX
     * @param thicknessY
     * @returns {{up: ({A: number, B: number}|{A: string, B}), down: ({A: number, B: number}|{A: string, B}), base: ({A: number, B: number}|{A: string, B})}}
     */
    getLineEquations: function(from, to, thicknessX, thicknessY) {
        return {
            base: svgDraw.calculateEquation(from.x, from.y, to.x, to.y),
            up: svgDraw.calculateEquation(from.x + thicknessX, from.y - thicknessY, to.x + thicknessX, to.y - thicknessY),
            down: svgDraw.calculateEquation(from.x - thicknessX, from.y + thicknessY, to.x - thicknessX, to.y + thicknessY)
        };
    },

    /**
     * Radiánból fok
     * @param rad
     * @returns {number}
     */
    radToDeg: function(rad) {
        return rad * (180 / Math.PI);
    },

    /**
     * Radiánból fok
     * @param rad
     * @returns {number}
     */
    degToRad: function(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Helyvektor szöge, 0-359
     * @param vector
     * @returns {*|number}
     */
    vectorAngle: function (vector) {

        // Speciális esetekben nem számolgatunk atan()-t
        if (vector.x === 0) {
            return (vector.y > 0) ? 90 : (vector.y === 0) ? 0 : 270;
        } else if (vector.y === 0) {
            return (vector.x >= 0) ? 0 : 180;
        }

        let ret = this.radToDeg(Math.atan(vector.y / vector.x));

        if (vector.x < 0 && vector.y < 0) {
            // 3. síknegyed
            ret = 180 + ret;
        } else if (vector.x < 0) {
            // 2. síknegyed
            ret = 180 + ret; // tulajdonképpen kivonás
        } else if (vector.y < 0) {
            // 4. síknegyed
            ret = 270 + (90 + ret); // tulajdonképpen kivonás
        }

        return ret;
    },

    /**
     * Adott csomópontból kiindulva 1 db legkisebb kör keresése a gráfban, szög szerinti sorrendben
     * (Szoba legyen, ne több szobát magában foglaló kör)
     * @param originalVertexId a megadott eredeti csomópont
     * @param vertexList csomópontok tömbje
     * @returns {null}
     */
    wallTree: function(originalVertexId, vertexList) {

        originalVertexId = originalVertexId.toString();

        let bestWay = null;

        let self = this;

        let tree = [
            originalVertexId
        ];

        /**
         * Rekurzív fabejáró függvény
         * @param currentWay az eddig bejárt csomópontok tömbje
         * @param iterationsAvailable
         * @returns {boolean|boolean|*|null}
         */
        let walkTreeRecursive = function (currentWay, iterationsAvailable) {

            if (!currentWay.length) {
                return null;
            }

            // Már elfogyott az iterálási lehetőségek száma, 1 csomópontba biztosan nem megyünk többször
            if (iterationsAvailable < 1) {
                return false;
            }

            iterationsAvailable--;

            let lastIndexOfCurrentWay = currentWay.length - 1;

            // Aktuális csomópont
            let workingVertexId = currentWay[lastIndexOfCurrentWay];
            let workingVertex = vertexList[workingVertexId];

            // Előző csomópont
            let previousVertexId = lastIndexOfCurrentWay > 0 ? currentWay[lastIndexOfCurrentWay - 1] : null;
            let previousVertex = previousVertexId ? vertexList[previousVertexId] : null;

            // Referencia vektor
            let referenceVector = null;

            if (!previousVertex) {
                // A kiindulópontban állunk, nincs megelőző csomópont

                if (!workingVertex.neighbors.length) {
                    // Ha nincs szomszédja, akkor hagyjuk az egészet, hisz egy él eltávolítása kapcsán ez egy
                    // logikailag különálló ponttá vált
                } else if (workingVertex.neighbors.length === 1) {
                    // Az aktuális csomópontnak pontosan egy szomszédja van, ugyanakkor a kiindulópontban állunk,
                    // Tehát nincs előző csomópont, azaz egyetlen irányba mehetünk tovább

                    let nextVertexId = workingVertex.neighbors[0].id;

                    return walkTreeRecursive(currentWay.concat([nextVertexId]), iterationsAvailable);

                } else {
                    // A kiindulópontban állunk és több szomszédja is van
                    // Dönteni kell, melyik élen menjünk tovább

                    // Az aktuális csomópont fölötti fiktív pont, mintha ott is lenne egy csomópont, ahonnan érkeztünk
                    // Ez lesz segítségünkre a szögek számításánál
                    referenceVector = {
                        x: workingVertex.coordinates.x,
                        y: workingVertex.coordinates.y - 1
                    };

                    // A lehetséges szomszédos csomópontokat felvesszük aszerint, hogy milyen szögben elfordulva érhetők el
                    // az óramutató járásával megegyezően keresve, a `referenceVector`-ból az aktuális csomópontba mutató vektorhoz képest
                    let candidateNeighbors = [];

                    for (let n in workingVertex.neighbors) {

                        // Lehetséges következő csomópont
                        let possibleNextVertexId = workingVertex.neighbors[n].id;
                        let possibleNextVertex = vertexList[possibleNextVertexId];

                        // Az aktuális csomópontból a referenciába visszamutató vektor
                        // Tehát az iránya az aktuális csomópontból mutat kifelé
                        let vectorFromWorkingBackToReference = {
                            x: referenceVector.x - workingVertex.coordinates.x,
                            y: referenceVector.y - workingVertex.coordinates.y,
                        };

                        // Az aktuális csomópontból a lehetséges következőbe mutató vektor
                        let vectorFromWorkingToPossible = {
                            x: possibleNextVertex.coordinates.x - workingVertex.coordinates.x,
                            y: possibleNextVertex.coordinates.y - workingVertex.coordinates.y
                        };

                        // A szög számításához tehát a két egyazon pontból kiinduló vektor helyvektornak tekinthető (eltolás)
                        // Ezek szöge így egymásból kivonható és megkapjuk az aktuális csomópontnál lévő fiktív él és
                        // jelölt új él bezárt szögét
                        let angleDiff = self.vectorAngle(vectorFromWorkingBackToReference) - self.vectorAngle(vectorFromWorkingToPossible);

                        // A kapott szöget az óramutató járásával megegyezően értelmezzük
                        angleDiff = 360 - angleDiff; // fölfelé mutató képzeletbeli élből óramutatóval megegyezően

                        // Ne legyen negatív szög, 0-359 között mozogjunk
                        if (angleDiff < 0) {
                            angleDiff += 360;
                        }
                        angleDiff = angleDiff % 360;

                        // Szomszédjelölt rögzítése
                        candidateNeighbors.push({
                            id: possibleNextVertexId,
                            angleDiff: angleDiff
                        });
                    }

                    // Rendezés növekvő sorrendben a szög szerint
                    candidateNeighbors.sort(function (a, b) {
                        return a.angleDiff - b.angleDiff;
                    });

                    for (let n in candidateNeighbors) {
                        // Végignézzük a szomszédokat, és amelyik a legjobb szögben áll és még körbe is érünk egyszer
                        // valamikor rajta továbblépve, ott hagyjuk abba a keresést
                        if (walkTreeRecursive(currentWay.concat([candidateNeighbors[n].id]), iterationsAvailable)) {
                            return true;
                        }
                    }
                }

            } else {
                // Nem a kiindulópontban, hanem általános pontban állunk

                if (!workingVertex.neighbors.length) {
                    // Nincs szomszédja, akkor hagyjuk az egészet, hisz egy él eltávolítása kapcsán ez egy
                    // logikailag különálló ponttá vált
                } else if (workingVertex.neighbors.length === 1) {
                    // Egy szomszédja van, az pedig csak az előző pont lehet
                    // Tehát ez egy falevél csomópont, nem megyünk tovább
                    // console.log('falevél a ' + workingVertexId)
                } else {
                    // Nem a kiindulópontban állunk és több szomszédja van
                    // Dönteni kell, melyik élen menjünk tovább

                    // A referencia most az előző csomópont, ahonnan az aktuálisba jutottunk
                    referenceVector = previousVertex.coordinates;

                    // A lehetséges szomszédos csomópontokat felvesszük aszerint, hogy milyen szögben elfordulva érhetők el
                    // az óramutató járásával ellentétesen (az kiindulópontnál nem így volt!) keresve,
                    // az előző csomópontból az aktuális csomópontba mutató vektorhoz képest
                    let candidateNeighbors = [];

                    for (let n in workingVertex.neighbors) {

                        let possibleNextVertexId = workingVertex.neighbors[n].id;

                        if (possibleNextVertexId === previousVertexId) {
                            // Visszafelé nem léphetünk, haladjunk tovább
                            continue;
                        }

                        if (possibleNextVertexId === originalVertexId) {
                            // Sikeresen körbeértünk, felvesszük az út végére a kiinduló csomópontot újra
                            bestWay = currentWay.concat([originalVertexId]);
                            return true;
                        }

                        if (currentWay.includes(possibleNextVertexId)) {
                            // Már jártunk ebben a csomópontban, többször nem járhatunk
                            continue;
                        }

                        let possibleNextVertex = vertexList[workingVertex.neighbors[n].id];

                        // Az aktuális csomópontból az előző csomópontba visszamutató vektor
                        // Tehát az iránya az aktuális csomópontból mutat kifelé
                        let vectorFromWorkingBackToReference = {
                            x:  referenceVector.x - workingVertex.coordinates.x,
                            y:  referenceVector.y - workingVertex.coordinates.y
                        };

                        // Az aktuális csomópontból a lehetséges következőbe mutató vektor
                        let vectorFromWorkingToPossible = {
                            x: possibleNextVertex.coordinates.x - workingVertex.coordinates.x,
                            y: possibleNextVertex.coordinates.y - workingVertex.coordinates.y
                        };

                        // A szög számításához tehát a két egyazon pontból kiinduló vektor helyvektornak tekinthető (eltolás)
                        // Ezek szöge így egymásból kivonható és megkapjuk az aktuális csomópontnál lévő két él szögét
                        let angleDiff = self.vectorAngle(vectorFromWorkingBackToReference) - self.vectorAngle(vectorFromWorkingToPossible);

                        // A kapott szöget itt NEM vonjuk ki 360-ból, mert most az óramutatóval ellentétesen mérjük fel a szögeket

                        // Ne legyen negatív szög, 0-359 között mozogjunk
                        if (angleDiff < 0) {
                            angleDiff += 360;
                        }
                        angleDiff = angleDiff % 360;

                        // Szomszédjelölt rögzítése
                        candidateNeighbors.push({
                            id: possibleNextVertexId,
                            angleDiff: angleDiff
                        });

                    }

                    // Rendezés növekvő sorrendben a szög szerint
                    candidateNeighbors.sort(function (a, b) {
                        return a.angleDiff - b.angleDiff;
                    });

                    for (let n in candidateNeighbors) {
                        if (walkTreeRecursive(currentWay.concat([candidateNeighbors[n].id]), iterationsAvailable)) {
                            // Végignézzük a szomszédokat, és amelyik a legjobb szögben áll és még körbe is érünk egyszer
                            // valamikor rajta továbblépve, ott hagyjuk abba a keresést
                            return true;
                        }
                    }

                }
            }

        };

        let iterationsAvailable = vertexList.length;

        walkTreeRecursive(tree, iterationsAvailable);

        return bestWay;

    },

    /**
     * Debug szöveg
     * @param coordinates
     * @param text
     * @param className
     */
    debugText: function(coordinates, text, className) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        element.setAttributeNS(null, 'x', coordinates.x);
        element.setAttributeNS(null, 'y', coordinates.y);
        element.setAttributeNS(null, 'class', className);
        element.setAttribute('style','fill: red; font-weight: normal; font-size: 20px');
        element.setAttributeNS(null, 'text-anchor', 'middle');
        element.textContent = text;
        help('#debug-container').appendChild(element);
    },

    /**
     * Debug pont
     * @param coordinates
     * @param fill
     * @param className
     */
    debugPoint: function(coordinates, fill = '#336699', className = null) {
        this.createElement( 'circle', {
            class: className,
            cx: coordinates.x,
            cy: coordinates.y,
            r: 3,
            fill: fill,
        }, 'debug-container');
    },

};
