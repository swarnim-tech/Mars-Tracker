import json
import os
from astroquery.jplhorizons import Horizons

def fetch_mars_trajectories():
    # Expanded target list with JPL IDs and Metadata
    targets = [
        {"name": "Mars Reconnaissance Orbiter", "id": "-74", "country": "USA", "type": "Orbiter"},
        {"name": "MAVEN", "id": "-202", "country": "USA", "type": "Orbiter"},
        {"name": "Mars Express", "id": "-41", "country": "ESA", "type": "Orbiter"},
        {"name": "Trace Gas Orbiter", "id": "-142", "country": "ESA", "type": "Orbiter"},
        {"name": "Hope (EMM)", "id": "-165", "country": "UAE", "type": "Orbiter"},
        {"name": "Tianwen-1", "id": "-153", "country": "China", "type": "Orbiter"},
        {"name": "Mangalyaan (MOM)", "id": "-143", "country": "India", "type": "Orbiter"},
        {"name": "Phobos", "id": "401", "country": "Natural", "type": "Moon"},
        {"name": "Deimos", "id": "402", "country": "Natural", "type": "Moon"}
    ]

    mars_id = '499'
    trajectories = []

    # Higher point density (200 points) for smoother curves
    time_spec = {'start': '2026-02-01', 'stop': '2026-02-02', 'step': '200'}

    print("Connecting to NASA JPL Horizons...")

    for target in targets:
        print(f"Fetching {target['name']}...")
        try:
            obj = Horizons(id=target['id'], location='@' + mars_id, epochs=time_spec)
            vec = obj.vectors()
            
            points = []
            for i in range(len(vec)):
                points.append([
                    float(vec['x'][i]),
                    float(vec['y'][i]),
                    float(vec['z'][i])
                ])
            
            trajectories.append({
                "metadata": target,
                "points": points
            })
        except Exception as e:
            print(f"Warning: Failed to fetch {target['name']}: {e}")

    output_file = "public/trajectories.json"
    with open(output_file, "w") as f:
        json.dump(trajectories, f, indent=4)
    print(f"Success: {len(trajectories)} trajectories saved.")

if __name__ == "__main__":
    fetch_mars_trajectories()