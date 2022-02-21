# Vention Pendulum

First off I want to say this was a very in depth code challenge that tested a wide gamut of skill sets! Thank you for coming up with this original challenge.  Lets me thoroughly showcase my dev knowledge.

### Instructions
1) Ensure you are using NodeJS > 14.
2) Clone the repo locally.
3) Run `npm install`.
4) Run `npm run dev`.
5) Navigate to `http://localhost:9000`

### Notable Features
- UI supports a dynamic amount of pendulums.
- Wind and aerodynamic drag calculated.
- Cradle dom element memoized as class variable to avoid multiple queries and to not pollute global scope.
- ES6 private methods used.
- CSS transitions.
- Tight pendulum click boxes avoid pendulums being hidden by other pendulums.
- Text strings and settings are stored in JSON files.

## API

### The Cradle Object
The `Cradle` object can be updated through the main port (8080) by `put` requests. Each pendulum API exposes a cradle endpoint for internal use.

 **maxWind**:  *float*
 
 The upper bound of the random windspeed in m/s. The randomly chosen windspeed can not exceed this value.

**windSpeed**:  *float*

Randomly chosen value that represents the windspeed in m/s. This value can not be set by the user. It is only retrieved.

**dragCoefficient**: *float*

A value the represents the drag coefficient of the pendulum bob.

**airDensity**: *float*

A value that represents the density of the air the pendulum will be travelling through. Measured in 

### The Pendulum Object
The `Pendulum` object can be updated by `put` request, and retrieved by `get` request from each pendulum process.

**angle:** *float*

The angle of the pendulum in radiants relative to its angle at rest.

**sampleTime:** *float*

The time in milliseconds since the unix epoch of the last sample of the pendulum process. This value can only be retrieved.

**x:** *float*

The number of pixels from the left of the document to the centre of mass of the pendulum. This value can only be retrieved.

**y** *float* 

The number of pixels from the left bound of the document to the centre of mass of the pendulum. This value can only be retrieved.

**pivotX**: *float*

The number of pixels from the left bound of the document to the centre of the pendulum's pivot.

**length**:  *float*

The length of the rod of the pendulum in cm . 

**mass**: *float*

The mass of the pendulum. Measured in kg.

**bobRadius**: *float*
The radius of the pendulums bob measured in cm.

## Things to Improve
- Modularize CSS.
- Fix bob z-index so that they are always on top of rods.
- Better request failure handling.
- Creating parent Javascript classes sharable between client and server.
- Lint the code.
- Use module imports.
- Fix intermittent issue with collision detection.
