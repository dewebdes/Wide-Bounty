import requests
from collections import defaultdict

# Target domains
domains = ["domain1.com", "sub.domain2.com","domain3.com"]

# IPs to probe
ip_list = [
    "ip1", ..., "ipN"
]

# Results containers
matched_ips_by_domain = defaultdict(list)
unmatched_ips = []

print("🔍 Starting virtual host probing...\n")

for domain in domains:
    print(f"🧭 Probing for domain: {domain}")
    for ip in ip_list:
        try:
            url = f"http://{ip}"
            headers = {"Host": domain}
            response = requests.get(url, headers=headers, timeout=3)
            status = response.status_code
            print(f"🔹 IP {ip} responded with {status} for Host: {domain}")
            if status == 200:
                print(f"🎯 Potential match: {ip} may serve {domain}\n")
                matched_ips_by_domain[domain].append(ip)
            else:
                unmatched_ips.append(ip)
        except requests.exceptions.RequestException as e:
            print(f"⚠️ IP {ip} failed for {domain}: {e}")
            unmatched_ips.append(ip)

print("\n🏁 Probing complete.")

# Write matched IPs grouped by domain
with open("matched_ips.txt", "w") as f:
    for domain, ips in matched_ips_by_domain.items():
        f.write(f"{domain}:\n")
        for ip in ips:
            f.write(f"  {ip}\n")
        f.write("\n")

# Write unmatched IPs
with open("unmatched_ips.txt", "w") as f:
    for ip in unmatched_ips:
        f.write(f"{ip}\n")
