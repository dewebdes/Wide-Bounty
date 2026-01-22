import requests
import time

def get_asn_prefixes_ripestat(asn):
    """Get ALL prefixes from RIPE Stat API - most reliable method"""
    url = f"https://stat.ripe.net/data/announced-prefixes/data.json?resource={asn}"
    
    try:
        response = requests.get(url, timeout=30)
        data = response.json()
        
        prefixes = []
        if 'data' in data and 'prefixes' in data['data']:
            for item in data['data']['prefixes']:
                prefix = item.get('prefix', '')
                if prefix and '.' in prefix and '/' in prefix:
                    prefixes.append(prefix)
        
        return sorted(set(prefixes))
    
    except Exception as e:
        print(f"RIPE Stat Error: {e}")
        return []

# Get Hetzner prefixes
hetzner_prefixes = get_asn_prefixes_ripestat("AS24940")
print(f"Hetzner (AS24940) has {len(hetzner_prefixes)} prefixes")

# Save to file
with open("hetzner_ip_ranges.txt", "w") as f:
    for prefix in hetzner_prefixes:
        f.write(f"{prefix}\n")

print(f"Saved to hetzner_ip_ranges.txt")