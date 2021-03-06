import {
    geo
} from '../../lib/pointToPixel';
export let LineStringOverlay = {
    transferCoordinate(_coordinates, nwMc, zoomUnit) {
        return _coordinates.map(function (item) {
            let x = (item[0] - nwMc.x) / zoomUnit;
            let y = (nwMc.y - item[1]) / zoomUnit;
            return [x, y];
        });
    },
    calculatePixel: function (webObj) {
        let data = webObj,
            points = data.request.data.points,
            zoomUnit = data.request.data.zoomUnit,
            nwMc = data.request.data.nwMc;
        for (let j = 0; j < points.length; j++) {
            let item = points[j];
            if (!item.geometry.medianCoordinates) {
                item.geometry['medianCoordinates'] = item.geometry.coordinates.map(function (item) {
                    let pixel = geo.projection.lngLatToPoint({
                        lng: item[0],
                        lat: item[1]
                    });
                    return [pixel.x, pixel.y];
                });
            }
            item.geometry['pixels'] = item.geometry['medianCoordinates'].map(function (item) {
                let x = (item[0] - nwMc.x) / zoomUnit;
                let y = (nwMc.y - item[1]) / zoomUnit;
                return [x, y];
            });
        }
        webObj.request.data = points;
        return webObj;
    }
};