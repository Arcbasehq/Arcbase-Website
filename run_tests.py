import subprocess
import requests
import time
import sys
from urllib.parse import urljoin
from bs4 import BeautifulSoup

BASE_URL = "http://localhost:4321"
ROUTES = [
    "/",
    "/about",
    "/projects",
    "/blog",
    "/contact",
]


TIMEOUT = 10

def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr


def test_build():
    print("Running Astro build...")
    success, output = run_command("npm run build")
    if not success:
        print("Build failed:\n", output)
        return False
    print("Build succeeded.")
    return True


def start_dev_server():
    print("Starting Astro dev server...")
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait for server to boot
    for _ in range(20):
        try:
            res = requests.get(BASE_URL, timeout=2)
            if res.status_code == 200:
                print("Dev server is up.")
                return process
        except:
            pass
        time.sleep(1)

    print("Dev server failed to start.")
    process.terminate()
    return None


def test_routes():
    print("\nTesting routes...")
    all_passed = True

    for route in ROUTES:
        url = urljoin(BASE_URL, route)
        try:
            res = requests.get(url, timeout=TIMEOUT)
            if res.status_code == 200:
                print(f"[OK] {route}")
            else:
                print(f"[FAIL] {route} -> Status {res.status_code}")
                all_passed = False
        except Exception as e:
            print(f"[ERROR] {route} -> {e}")
            all_passed = False

    return all_passed


def test_seo():
    print("\nTesting SEO/meta tags...")
    try:
        res = requests.get(BASE_URL, timeout=TIMEOUT)
        soup = BeautifulSoup(res.text, "html.parser")

        checks = {
            "title": soup.title is not None,
            "description": soup.find("meta", attrs={"name": "description"}) is not None,
            "og:title": soup.find("meta", property="og:title") is not None,
            "canonical": soup.find("link", rel="canonical") is not None,
        }

        all_passed = True
        for key, passed in checks.items():
            if passed:
                print(f"[OK] {key}")
            else:
                print(f"[MISSING] {key}")
                all_passed = False

        return all_passed

    except Exception as e:
        print("SEO test failed:", e)
        return False


def test_links():
    print("\nTesting internal links...")
    try:
        res = requests.get(BASE_URL, timeout=TIMEOUT)
        soup = BeautifulSoup(res.text, "html.parser")

        links = [a.get("href") for a in soup.find_all("a", href=True)]
        internal_links = [l for l in links if l.startswith("/")]

        all_passed = True

        for link in internal_links:
            url = urljoin(BASE_URL, link)
            try:
                r = requests.get(url, timeout=TIMEOUT)
                if r.status_code != 200:
                    print(f"[BROKEN] {link}")
                    all_passed = False
            except:
                print(f"[ERROR] {link}")
                all_passed = False

        print(f"Checked {len(internal_links)} links.")
        return all_passed

    except Exception as e:
        print("Link test failed:", e)
        return False


def run_lighthouse():
    print("\nRunning Lighthouse audit...")
    success, output = run_command(
        "npx lighthouse http://localhost:4321 --quiet --chrome-flags='--headless' --output=json --output-path=./lighthouse-report.json"
    )

    if success:
        print("Lighthouse report saved to lighthouse-report.json")
    else:
        print("Lighthouse failed (is it installed?):")
        print(output)


def main():
    if not test_build():
        sys.exit(1)

    server = start_dev_server()
    if not server:
        sys.exit(1)

    try:
        results = [
            test_routes(),
            test_seo(),
            test_links(),
        ]

        run_lighthouse()

        if all(results):
            print("\nAll tests passed.")
        else:
            print("\nSome tests failed.")

    finally:
        print("\nStopping dev server...")
        server.terminate()


if __name__ == "__main__":
    main()
