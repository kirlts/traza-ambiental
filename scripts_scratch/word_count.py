import re

with open("/home/kirlts/traza-ambiental/docs/research/reporte-brecha-conceptual.md", "r") as f:
    content = f.read()

# Buscamos todas las secciones que empiezan con "## ACTOR"
sections = re.split(r'\n## ACTOR \d+:', content)

if len(sections) > 1:
    print("Reporte de palabras por actor:")
    for i, sec in enumerate(sections[1:], start=1):
        # Tomamos la primera línea como título
        lines = sec.split('\n')
        title = lines[0].strip()
        body = '\n'.join(lines[1:])
        
        # Hay que detener el parseo si entra la siguiente PARTE
        # Las partes empiezan con "## PARTE" o "---"
        break_idx = body.find('\n## PARTE')
        if break_idx == -1:
            break_idx = body.find('\n---')
            
        if break_idx != -1:
             body = body[:break_idx]
             
        word_count = len(body.split())
        print(f"Actor {i}: {title} - {word_count} palabras")
else:
    print("No se encontraron actores.")
