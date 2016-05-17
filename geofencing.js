"use strict";

var DEG_2_RAD = Math.PI / 180,
    RAD_2_DEG = 180.0 / Math.PI,
    EQUATORIAL_RADIUS,
    ECC_SQUARED,
    ECC_PRIME_SQUARED,
    IS_NAD83_DATUM = true,
    EASTING_OFFSET = 500000.0,
    NORTHING_OFFSET = 10000000.0,
    GRIDSQUARE_SET_COL_SIZE = 8,  // column width of grid square set
    GRIDSQUARE_SET_ROW_SIZE = 20, // row height of grid square set
    BLOCK_SIZE  = 100000, // size of square identifier (within grid zone designation),
    E1,
    k0 = 0.9996; // scale factor of central meridian

    // check for NAD83
    if (IS_NAD83_DATUM) {
        EQUATORIAL_RADIUS = 6378137.0; // GRS80 ellipsoid (meters)
        ECC_SQUARED = 0.006694380023;
    } else {
        // else NAD27 datum is assumed
        EQUATORIAL_RADIUS = 6378206.4; // Clarke 1866 ellipsoid (meters)
        ECC_SQUARED = 0.006768658;
    }

    // variable used in inverse formulas (UTMtoLL function)
    E1 = (1 - Math.sqrt(1 - ECC_SQUARED)) / (1 + Math.sqrt(1 - ECC_SQUARED));

    ECC_PRIME_SQUARED = ECC_SQUARED / (1 - ECC_SQUARED);

//var homeLatitude = 49.261124;
//var homeLongitude = 7.359750;

//var homeUTM = latLongToUtm(homeLatitude, homeLongitude, 32);

//var testLatitude = 49.261224;
//var testLongitude = 7.358349;

//var testUTM = latLongToUtm(testLatitude, testLongitude,32);

//var distanceFromHome = Math.sqrt(Math.pow(homeUTM.northing - testUTM.northing,2) + Math.pow(homeUTM.easting-testUTM.easting,2));
//var direction = Math.atan((homeUTM.northing - testUTM.northing) /(homeUTM.easting-testUTM.easting));

//console.log("Distance:" + distanceFromHome);


/*
 * Converts latitude and longitude to UTM.
 *
 * Converts lat/long to UTM coords.  Equations from USGS Bulletin 1532
 * (or USGS Professional Paper 1395 "Map Projections - A Working Manual",
 * by John P. Snyder, U.S. Government Printing Office, 1987.)
 *
 * Note- UTM northings are negative in the southern hemisphere.
 *
 * @param lat- Latitude in decimal; north is positive, south is negative
 * @param lon- Longitude in decimal; east is positive, west is negative
 * @param zone- optional, result zone
 * @return Object with three properties, easting, northing, zone
 */
function latLongToUtm(lat, lon, zone) {
    var zoneNumber,
        latRad,
        lonRad,
        lonOrigin,
        lonOriginRad,
        utmEasting,
        utmNorthing,
        N,
        T,
        C,
        A,
        M,
        utmcoords = {};

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    // Constrain reporting USNG coords to the latitude range [80S .. 84N]
    if (lat > 84.0 || lat < -80.0) {
        return "undefined";
    }

    // sanity check on input - remove for production
    // Make sure the longitude is between -180.00 .. 179.99..
    if (lon > 180 || lon < -180 || lat > 90 || lat < -90) {
        throw "Bad input. lat: " + lat + " lon: " + lon;
    }

    // convert lat/lon to radians
    latRad = lat * DEG_2_RAD;
    lonRad = lon * DEG_2_RAD;

    // User-supplied zone number will force coordinates to be computed in a particular zone
    zoneNumber = zone || getZoneNumber(lat, lon);

    // +3 puts origin in middle of zone
    lonOrigin = (zoneNumber - 1) * 6 - 180 + 3;
    lonOriginRad = lonOrigin * DEG_2_RAD;

    N = EQUATORIAL_RADIUS / Math.sqrt(1 - ECC_SQUARED * Math.pow(Math.sin(latRad), 2));
    T = Math.pow(Math.tan(latRad), 2);
    C = ECC_PRIME_SQUARED * Math.pow(Math.cos(latRad), 2);
    A = Math.cos(latRad) * (lonRad - lonOriginRad);

    // Note that the term Mo drops out of the "M" equation, because phi
    // (latitude crossing the central meridian, lambda0, at the origin of the
    //  x,y coordinates), is equal to zero for UTM.
    M = EQUATORIAL_RADIUS * (
        (1 - ECC_SQUARED / 4 - 3 * (ECC_SQUARED * ECC_SQUARED) / 64 - 5 * (ECC_SQUARED * ECC_SQUARED * ECC_SQUARED) / 256) * latRad -
        (3 * ECC_SQUARED / 8 + 3 * ECC_SQUARED * ECC_SQUARED / 32 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(2 * latRad) +
        (15 * ECC_SQUARED * ECC_SQUARED / 256 + 45 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 1024) * Math.sin(4 * latRad) -
        (35 * ECC_SQUARED * ECC_SQUARED * ECC_SQUARED / 3072) * Math.sin(6 * latRad));

    utmEasting = (k0 * N *
        (A + (1 - T + C) * (A * A * A) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ECC_PRIME_SQUARED ) * (A * A * A * A * A) / 120) + EASTING_OFFSET);

    utmNorthing = (k0 * ( M + N * Math.tan(latRad) * (
          (A * A) / 2 + (5 - T + 9 * C + 4 * C * C ) * (A * A * A * A) / 2 +
          (61 - 58 * T + T * T + 600 * C - 330 * ECC_PRIME_SQUARED ) *
          (A * A * A * A * A * A) / 720)
      ) );

    if (utmNorthing < 0) {
        utmNorthing += 10000000;
    }

    utmcoords.easting = Math.round(utmEasting);
    utmcoords.northing = Math.round(utmNorthing);
    utmcoords.zoneNumber = zoneNumber;
    utmcoords.zoneLetter = utmLetterDesignator(lat);
    utmcoords.hemisphere = lat < 0 ? 'S' : 'N';

    return utmcoords;
}

/*
 * Retrieves zone number from latitude and longitude.
 *
 * Zone numbers range from 1 - 60 over the range [-180 to +180]. Each
 * range is 6 degrees wide. Special cases for points outside normal
 * [-80 to +84] latitude zone.
 */
function getZoneNumber(lat, lon) {
    var zoneNumber;

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    // sanity check on input, remove for production
    if (lon > 360 || lon < -180 || lat > 90 || lat < -90) {
        throw "Bad input. lat: " + lat + " lon: " + lon;
    }

    zoneNumber = parseInt((lon + 180) / 6, 10) + 1;

    // Handle special case of west coast of Norway
    if (lat >= 56.0 && lat < 64.0 && lon >= 3.0 && lon < 12.0) {
        zoneNumber = 32;
    }

    // Special zones for Svalbard
    if (lat >= 72.0 && lat < 84.0) {
        if (lon >= 0.0  && lon <  9.0) {
            zoneNumber = 31;
        } else if (lon >= 9.0  && lon < 21.0) {
            zoneNumber = 33;
        } else if (lon >= 21.0 && lon < 33.0) {
            zoneNumber = 35;
        } else if (lon >= 33.0 && lon < 42.0) {
            zoneNumber = 37;
        }
    }

    return zoneNumber;
};

/*
* Retrieves grid zone designator letter.
*
* This routine determines the correct UTM letter designator for the given
* latitude returns 'Z' if latitude is outside the UTM limits of 84N to 80S
*
* Returns letter designator for a given latitude.
* Letters range from C (-80 lat) to X (+84 lat), with each zone spanning
* 8 degrees of latitude.
*/
function utmLetterDesignator(lat) {
   var letterDesignator;

   lat = parseFloat(lat);

   if ((84 >= lat) && (lat >= 72)) {
       letterDesignator = 'X';
   } else if ((72 > lat) && (lat >= 64)) {
       letterDesignator = 'W';
   } else if ((64 > lat) && (lat >= 56)) {
       letterDesignator = 'V';
   } else if ((56 > lat) && (lat >= 48)) {
       letterDesignator = 'U';
   } else if ((48 > lat) && (lat >= 40)) {
       letterDesignator = 'T';
   } else if ((40 > lat) && (lat >= 32)) {
       letterDesignator = 'S';
   } else if ((32 > lat) && (lat >= 24)) {
       letterDesignator = 'R';
   } else if ((24 > lat) && (lat >= 16)) {
       letterDesignator = 'Q';
   } else if ((16 > lat) && (lat >= 8)) {
       letterDesignator = 'P';
   } else if (( 8 > lat) && (lat >= 0)) {
       letterDesignator = 'N';
   } else if (( 0 > lat) && (lat >= -8)) {
       letterDesignator = 'M';
   } else if ((-8> lat) && (lat >= -16)) {
       letterDesignator = 'L';
   } else if ((-16 > lat) && (lat >= -24)) {
       letterDesignator = 'K';
   } else if ((-24 > lat) && (lat >= -32)) {
       letterDesignator = 'J';
   } else if ((-32 > lat) && (lat >= -40)) {
       letterDesignator = 'H';
   } else if ((-40 > lat) && (lat >= -48)) {
       letterDesignator = 'G';
   } else if ((-48 > lat) && (lat >= -56)) {
       letterDesignator = 'F';
   } else if ((-56 > lat) && (lat >= -64)) {
       letterDesignator = 'E';
   } else if ((-64 > lat) && (lat >= -72)) {
       letterDesignator = 'D';
   } else if ((-72 > lat) && (lat >= -80)) {
       letterDesignator = 'C';
   } else {
       letterDesignator = 'Z'; // This is here as an error flag to show
                             // that the latitude is outside the UTM limits
   }

   return letterDesignator;
}

// Export-Methoden des Moduls.
module.exports = {
  convertLatLongToUtm: function(lat, lon, zone) {
    return latLongToUtm(lat,lon,zone);
  }
};


/*
var bebop = require('node-bebop');

var drone = bebop.createClient();

var converter = require('coordinator'),
    fn = converter('latlong', 'UTM'),

var firstGPSMeasure = true;
var gpsRecording = false;

var homeLatitude = 0;
var homeLongitude = 0;

var homeUTM_North = 0;
var homeUTM_East = 0;

drone.connect(function() {
  drone.GPSSettings.resetHome();
  drone.WifiSettings.outdoorSetting(1);
  console.log('Connected')
});

drone.on("PositionChanged", function (data) {
  //update view with current GPS console.log(data)

  if(gpsRecording) {

    var latitude = data.latitude,
        longitude = data.longitude,
        utm = fn(latitude, longitude, 32)

    if(firstGPSMeasure) {
      if(latitude!=500 && longitude!=500) {

      homeLatitude = data.latitude;
      homeLongitude = data.longitude;

      homeUTM_North = utm.northing;
      homeUTM_East = utm.easting;
      firstGPSMeasure = false;
      }
    } else {

      /*Now consider the point 51_30 latitude and 2_20 longitude. Is that point
      within 5500 meters of the radius point ? Convert to UTM North and East
      coordinates of 5705639.9 , 453725.1 . The direction from the radius to the
      point is the InvTan((453725.1 - 447845.9) / (5705639.9 - 5696428.3)) or
      N32.5476E degrees. (The result is N because (5705639.9 - 5696428.3) is
      positive and the result is E because (453725.1 - 447845.9) is positive.) Now
      the distance from the radius to the point is the Sqrt of ((453725.1 -
      447845.9)^2 + (5705639.9 - 5696428.3)^2) or 10927.9 meters. The considered
      point is beyond the radius of the curve based solely on the distance
      calculation...*/


      //var direction = Math.InvTan((homeUTM_North - utm.northing) /(homeUTM_East-utm.easting));


//}

  //}
  //console.log('alt:' + data.altitude)
//})

/*drone.on("PositionChanged", function (data) {
  //update view with current GPS console.log(data)

    console.log('lat: ' + data.latitude)
    console.log('lon:' +  data.longitude)
  }
  //console.log('alt:' + data.altitude)
})*/
