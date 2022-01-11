import { merge } from 'd3-array'
import { geoStitch } from 'd3-geo-projection'
import { path } from 'd3-path'
import { geoPath } from 'd3-geo'
import { curveBasisClosed } from 'd3-shape'


// D'après Mike Bostock, https://observablehq.com/@d3/geotiff-contours-ii
export function invert(d, n, m) {
  const shared = {};

  let p = {
    type: "Polygon",
    coordinates: merge(d.coordinates.map(polygon => {
      return polygon.map(ring => {
        return ring.map(point => {
          return [point[0] / n * 360 - 180, 90 - point[1] / m * 180];
        }).reverse();
      });
    }))
  };

  // Record the y-intersections with the antimeridian.
  p.coordinates.forEach(ring => {
    ring.forEach(p => {
      if (p[0] === -180) shared[p[1]] |= 1;
      else if (p[0] === 180) shared[p[1]] |= 2;
    });
  });

  // Offset any unshared antimeridian points to prevent their stitching.
  p.coordinates.forEach(ring => {
    ring.forEach(p => {
      if ((p[0] === -180 || p[0] === 180) && shared[p[1]] !== 3) {
        p[0] = p[0] === -180 ? -179.9995 : 179.9995;
      }
    });
  });

  p = geoStitch(p);

  // If the MultiPolygon is empty, treat it as the Sphere.
  return p.coordinates.length
      ? {type: "Polygon", coordinates: p.coordinates}
      : {type: "Sphere"};
}



// NON UTILISÉ ---------------
// D'après Mike Bostock, https://observablehq.com/@d3/context-to-curve
function curveContext(curve) {
  return {
    moveTo(x, y) {
      curve.lineStart();
      curve.point(x, y);
    },
    lineTo(x, y) {
      curve.point(x, y);
    },
    closePath() {
      curve.lineEnd();
    }
  };
}

// Pose problème car le clipExtent lié à la projection génère des bords arrondi visible (le clip devient alors visible)
// Et la zone clipé du relief n'est pas mise à jour avec le zoom
export function geoCurvePath(projection) {
  return object => {
    const pathContext = path()
    geoPath(projection, curveContext(curveBasisClosed(pathContext)))(object);
    return pathContext + ""
  }
}