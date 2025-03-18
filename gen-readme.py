import os
import re
import datetime

POSTS_DIR = "./_posts"
OUTPUT_FILE = "README.md"
HEADER = """## [WEB VERSION](https://diy-synths.snnkv.com/)  /  [SUBMIT DESIGN](https://github.com/Atarity/diy-synths/discussions)  /  [DISCUSSION](https://github.com/Atarity/diy-synths/discussions)\n
This is a list of synthesizers and related hardware you can build
on your own. All designs are open-source including firmware.
[Submit designs](https://github.com/Atarity/diy-synths/discussions) which is not
in list and [discuss](https://github.com/Atarity/diy-synths/discussions)
your building experience.\n
![DIY-synths-title](/pics/meta/repo-title.jpg)\n\n"""

# Regex patterns for extracting YAML front matter fields
YAML_PATTERN = re.compile(r"---\n(.*?)\n---", re.DOTALL)
FIELD_PATTERN = re.compile(r"(name|link|description):\s*(.+)")

def extract_front_matter(content):
    """Extracts name, link, and description from the YAML front matter."""
    match = YAML_PATTERN.search(content)
    if not match:
        return None

    yaml_content = match.group(1)
    fields = {}
    for field, value in FIELD_PATTERN.findall(yaml_content):
        fields[field] = value.strip('"')

    # Ensure required fields are present
    if not all(k in fields for k in ("name", "link", "description")):
        return None

    return fields

def generate_readme():
    """Generates README.MD from markdown files."""
    entries = []

    for filename in os.listdir(POSTS_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(POSTS_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                data = extract_front_matter(content)

                if data:
                    entries.append(f"1. [{data['name']}]({data['link']}) — {data['description']}")
                else:
                    print(f"Warning: Missing required fields in {filename}")

    # Sort entries alphabetically by name
    entries.sort()

    # Generate final content
    today = datetime.date.today().strftime("%Y-%m-%d")
    readme_content = HEADER + "\n".join(entries) + f"\n\n> upd: {today}\n"

    # Write to README.md
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(readme_content)

    print("README.md successfully generated!")

if __name__ == "__main__":
    generate_readme()
