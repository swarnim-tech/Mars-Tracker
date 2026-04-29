# Mars Orbit Tracker

A professional-grade, real-time 3D orbital visualization of artificial satellites and natural moons orbiting Mars. This application integrates high-fidelity astrophysical data from NASA's JPL Horizons system with a modern Three.js rendering engine.

## Core Features

- **Real-Time Orbital Dynamics**: Satellites move along their trajectories in synchronization with Earth's real-time clock.
- **High-Fidelity Trajectories**: Uses Catmull-Rom spline interpolation to render smooth, continuous orbital paths from discrete NASA vector data.
- **Interactive Sidebar**: A dedicated control interface for monitoring entity status and filtering objects by country of origin or mission type.
- **Contextual Visualization**: Hover-state synchronization between the 3D scene and the UI sidebar for immediate orbital identification.
- **Scientific Accuracy**: Implements planetocentric coordinate scaling to map Astronomical Units (AU) to 3D space relative to the Martian radius.

## Technical Stack

### Backend (Data Engine)
- **Language**: Python 3
- **Libraries**: `astroquery` (JPL Horizons interface), `json`, `os`
- **Function**: Retrieves 200-point ephemeris arrays for international missions (NASA, ESA, ISRO, UAE, China) and natural satellites (Phobos, Deimos).

### Frontend (Visualization)
- **Framework**: React 18
- **3D Engine**: Three.js / React Three Fiber (R3F)
- **Tooling**: Vite, @react-three/drei
- **Styling**: Standard CSS-in-JS for professional, minimal UI overlays.

## Project Structure

```text
Mars-Tracker/
├── docs/                   # Technical specifications and math logic
├── public/                 # Static assets and generated JSON data
│   ├── mars_texture.jpg    # 2K Mars surface map
│   └── trajectories.json   # Processed NASA vector data
├── src/
│   ├── App.jsx             # Main 3D scene and UI logic
│   ├── fetch_data.py       # Python engine for data retrieval
│   └── main.jsx            # React entry point
├── package.json            # Node.js dependencies
└── README.md               # Project documentation
```

## Setup and Installation

### 1. Data Engine Configuration
Ensure Python 3.8+ is installed. It is recommended to use a virtual environment.

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install astroquery

# Fetch latest trajectory data
python3 src/fetch_data.py
```

### 2. Frontend Development Server
Ensure Node.js is installed.

```bash
# Install dependencies
npm install

# Launch the development server
npx vite
```

### 3. Access and Verification
Once the development server is active, the application can be accessed via the local network.

```text
Local: http://localhost:5173/
```

## Mathematical Foundation
The project utilizes a custom scale factor to translate astrophysical vectors into 3D units. The conversion is based on the ratio of 1 AU to the Martian radius:

$$Scale\ Factor = \frac{149,597,870.7}{3,389.0} \approx 44,142.1867$$

Detailed derivations of the coordinate transformations are located in `docs/coordinate_transformation.md`.

## Future Roadmap
- **Automation**: Implementation of GitHub Actions for automated daily data synchronization.
- **Deployment**: Production build optimization for hosting on GitHub Pages.
- **Visual Enhancements**: Atmospheric scattering shaders for the Martian limb and starfield background integration.