import re
import os

repo_path = "/home/kirlts/traza-ambiental/"
id_pattern = re.compile(r'\[(PROP|NORM|ACTR|FUNC|MAQE|DATO|INTG|NOFN|SEGR|GLOS)-(PD|CE|EN|CI|RC)-(\d{3})\.LLM\]')

for root, dirs, files in os.walk(repo_path):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.md'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = id_pattern.sub(r'[\1-\2-\3]', content)
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Reverted IDs in {path}")
print("Undo completed.")
