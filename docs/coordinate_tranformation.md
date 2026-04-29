Coordinate Transformation and Scaling Logic
1. Overview

The NASA JPL Horizons API provides orbital position vectors in Astronomical Units (AU). However, the 3D environment in this project uses a coordinate system where the radius of Mars is defined as 1.0 unit. This document outlines the conversion process from astrophysical data to 3D engine units.

2. Constants

The following physical constants are used for all transformations:

1 Astronomical Unit (AU): 149,597,870.7 km

Mean Radius of Mars (R 
M
​	
 ): 3,389.0 km

3. Transformation Formula

To convert a raw coordinate (C 
AU
​	
 ) provided by NASA into a 3D scene coordinate (C 
3D
​	
 ), we apply a scale factor derived from the ratio of an AU to the Martian radius.

Scale Factor= 
3,389.0
149,597,870.7
​	
 ≈44,142.1867
The final 3D coordinate is calculated as:

C 
3D
​	
 =C 
AU
​	
 ×Scale Factor
4. Implementation in Code

In the frontend application (App.jsx), this is implemented as a constant to ensure consistency across all rendered orbital paths and satellite meshes.

JavaScript
const MARS_RADIUS_KM = 3389.0;
const AU_IN_KM = 149597870.7;
const SCALE_FACTOR = AU_IN_KM / MARS_RADIUS_KM;
5. Coordinate Frame

Origin (0,0,0): The center of Mars.

Reference Frame: Mars-centric (Planetocentric) coordinates.

X-Y Plane: Roughly aligns with the Martian equatorial plane (though specific orientations depend on the Horizons epoch).

Verification

If a satellite is reported by NASA to be at a distance of 2.436×10 
−5
  AU from the center of Mars:

Conversion to KM: 2.436×10 
−5
 ×149,597,870.7≈3,644 km.

Conversion to 3D Units: 3,644/3,389≈1.075.

Result: The satellite will appear just above the surface of the Mars sphere (which has a radius of 1.0).