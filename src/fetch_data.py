import json
import os
from astroquery.jplhorizons import Horizons

def fetch_mars_trajectories():
    """
    Fetches orbital position vectors for major Mars satellites and moons
    from the NASA JPL Horizons system and exports them to a JSON file.
    """
    targets = {
        "Mars Reconnaissance Orbiter": "-74",
        "MAVEN": "-202",
        "Mars Express": "-41",
        "Phobos": "401", 
        "Deimos": "402"
    }

    mars_id = '499'
    trajectories = {}

    print("Initiating connection to NASA JPL Horizons...")

    # Horizons requires a structured time dictionary to parse the TLIST properly
    time_spec = {'start': '2026-02-01', 'stop': '2026-02-02', 'step': '1d'}

    for name, obj_id in targets.items():
        print(f"Fetching coordinates for {name}...")
        
        try:
            # Query the Horizons API relative to the center of Mars (@499)
            obj = Horizons(id=obj_id, location='@' + mars_id, epochs=time_spec)
            vec = obj.vectors()
            
            # Extract the X, Y, and Z coordinates for the start date
            trajectories[name] = {
                "x": float(vec['x'][0]),
                "y": float(vec['y'][0]),
                "z": float(vec['z'][0])
            }
        except Exception as e:
            # Prevent the entire script from failing if one query fails
            print(f"Warning: Could not fetch data for {name}. Error: {e}")

    # Ensure the output directory exists before writing
    output_dir = "public"
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, "trajectories.json")

    try:
        with open(output_file, "w") as json_file:
            json.dump(trajectories, json_file, indent=4)
        print(f"\nSuccess! All coordinates saved to {output_file}")
    except IOError as e:
        print(f"\nError: Could not write to file. {e}")

if __name__ == "__main__":
    fetch_mars_trajectories()

    