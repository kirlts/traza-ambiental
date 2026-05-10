#!/usr/bin/env python3
"""
Inyecta humor seco británico irónico oscuro en el reporte de brechas conceptual.
Opera sobre el markdown completo, identificando subsecciones y agregando
comentarios sardónicos sin alterar el contenido factual.
"""

import re
import sys

# Banco de inyecciones por zona temática
# Cada inyección es una línea que se inserta DESPUÉS del párrafo indicado
# Formato: (patrón_de_contexto, inyección)

INJECTIONS = {
    # PARTE I - MARCO LEGAL
    "### 1. La Ley 20.920": [
        (
            "La definición es más precisa de lo que el código de TrazaAmbiental parece asumir.",
            "\nUno habría esperado que un sistema diseñado para cumplir una ley se tomara la molestia de leerla. Expectativa quizás excesiva.\n"
        ),
        (
            "No hay operación legal fuera de este registro.",
            " Un detalle que, por alguna razón insondable, nadie trasladó al modelo de datos.\n"
        ),
        (
            "Si la plataforma no puede demostrar el cumplimiento de estas cuatro obligaciones para cada actor regulado, no cumple su propósito fundacional.",
            "\nUno podría argumentar que un sistema de trazabilidad ambiental que no traza nada ambientalmente relevante es, como mínimo, un caso fascinante de nominación aspiracional. Como llamar «Ferrari» a una carretilla.\n"
        ),
    ],
    "### 2. El Decreto Supremo": [
        (
            "una invención sin sustento legal",
            ". Una invención que, con la confianza serena de quien nunca ha abierto un Diario Oficial, se codificó como si fuera jurisprudencia constitucional",
        ),
        (
            "difiere radicalmente de un neumático de automóvil que cabe en el maletero.",
            " Aunque es reconfortante saber que el código los trata exactamente igual, con la imparcialidad ciega de quien confunde un ratón con un elefante porque ambos tienen cuatro patas.",
        ),
        (
            "Este sub-umbral cualitativo no tiene representación alguna en la lógica de negocio del código.",
            " Uno no puede evitar preguntarse si la lógica de negocio del código tiene representación alguna de algo que no sea su propia existencia. Es un sistema plenamente autoconsciente de sí mismo y espectacularmente ignorante de todo lo demás.",
        ),
    ],
    "### 3. El Ecosistema Institucional": [
        (
            "un error de nomenclatura en un documento legal invalida la referencia.",
            " Es el equivalente regulatorio de un error tipográfico en un contrato matrimonial: técnicamente menor, prácticamente catastrófico.",
        ),
        (
            "El MMA no solo regula; vigila y denuncia.",
            " Piensa en él como un vecino particularmente entrometido pero con capacidad legal de embargarte la casa.",
        ),
        (
            "la maquinaria punitiva ya arrancó.",
            " Para Huawei, una empresa que factura más que el PIB de varios países, operar sin Sistema de Gestión durante dos años tiene la elegancia estratégica de cruzar la frontera suiza sin pasaporte y quejarse después de que la guardia fue «excesiva».",
        ),
    ],
    "### 4. Las Tres Plataformas": [
        (
            "Ninguna ofrece lo que el código asume que existe.",
            " El código, en un ejercicio de fe comparable al del marinero que zarpa sin brújula, asume la existencia de APIs que nadie construyó, endpoints que nadie documentó, y un ecosistema digital que el Estado chileno aún no ha tenido la gentileza de crear.",
        ),
        (
            "la carga masiva completa se rechaza.",
            " El sistema estatal no envía un mensaje de error amigable. Simplemente devuelve el archivo con la serenidad impasible de un funcionario que ha visto todo, juzga todo, y no perdona nada.",
        ),
        (
            "Es como construir un avión con cabina de piloto, alas y motores, pero sin sistema de navegación",
            "",  # Ya tiene humor - skip
        ),
    ],
    "### 5. La Ley 21.719": [
        (
            "No es un requisito futuro; es un requisito presente.",
            " Decir que «ya llegaremos a eso» cuando la fecha de entrada en vigencia es diciembre de 2026 tiene la credibilidad de dejar de fumar «mañana» — un mañana que, convenientemente, nunca llega.",
        ),
        (
            "un checkbox de consentimiento que cree un vector de ataque jurídico.",
            " Es el único caso documentado en que un checkbox de HTML puede precipitar un litigio constitucional. La ironía no se escribe sola, pero en este sector se acerca peligrosamente.",
        ),
        (
            "El dato no se borra. Se vuelve invisible",
            ". Es el equivalente digital del Testigo Protegido: sigue existiendo, pero con un nombre falso y un peinado diferente",
        ),
    ],
    "### 6. El Mercado": [
        (
            "quemado al aire libre, o acumulado en sitios eriazos",
            " — una solución con la elegancia técnica de tapar una inundación con más agua",
        ),
        (
            "un Google Forms cifrado operado por la SMA",
            ". Sí, un Google Forms. La Superintendencia del Medio Ambiente, la entidad que puede multar hasta con 10.000 UTA, recibe datos regulatorios a través de la misma herramienta que un profesor de secundaria usa para encuestas de satisfacción",
        ),
        (
            "Categoría A es el problema atomizado",
            ". Categoría A es lo que sucede cuando la termodinámica se encuentra con la burocracia: miles de puntos de entropía dispersos en un país de 4.300 kilómetros de largo, cada uno generando exactamente la cantidad de residuo suficiente para ser individualmente irrelevante y colectivamente apocalíptico",
        ),
    ],

    # PARTE II - DICTAMEN CENTRAL
    "## PARTE II: DICTAMEN CENTRAL": [
        (
            "un scaffolding cosmético de extrema sofisticación visual",
            ". Es el equivalente arquitectónico de una fachada renacentista clavada contra un muro de contenedores marítimos: impresionante desde la acera de enfrente, inhabitable desde cualquier ángulo funcional",
        ),
        (
            "se ve impresionante en el hangar, pero no puede ir a ningún lugar.",
            " El sistema actual es un monumento al triunfo de la estética sobre la función — un logro improbable en un sector donde la función es, literalmente, lo único que importa.",
        ),
        (
            "un motor de equivalencia metrológica inmutable",
            ". Suena a ciencia ficción industrial, pero en realidad es aritmética de cuarto básico aplicada con rigor — exactamente el tipo de exigencia que el código actual esquiva con la agilidad de un gato al que le ofrecen un baño",
        ),
    ],

    # PARTE III - ACTORES (estructuralmente repetitivos — humor por sección tipo)
    "### 1.1 Contexto Normativo": [
        (
            "Es una definición que se muerde la cola",
            " — con la tenacidad circular de una serpiente ouroboros redactada por un abogado que cobraba por palabra",
        ),
        (
            "TrazaAmbiental agrupa ambas entidades en una sola tabla sin la granularidad que el Estado exige.",
            " Un enfoque que tiene la simplicidad eficiente de usar un solo cajón para calcetines y documentos notariales: funciona hasta que necesitas encontrar algo específico ante un juez.",
        ),
        (
            "carecen de sustento en el D.S. 8",
            ". De hecho, la arqueología del código no revela ningún commit que referencie el D.S. 8 como fuente. Los umbrales parecen haber nacido por generación espontánea — la biogénesis aplicada a la ingeniería de software",
        ),
    ],
    "### 1.2 Estado Real del Código": [
        (
            "visualmente pulida con gradientes emerald y micro-animaciones de hover, es funcionalmente superficial",
            ". Es el dashboard de un sistema que ha confundido la decoración interior con la ingeniería estructural — como contratar a un paisajista para construir los cimientos de un rascacielos",
        ),
        (
            "La plataforma que prometía eliminar la doble digitación la perpetúa.",
            " El nivel de ironía aquí merece su propia categoría taxonómica. Un sistema que existe para eliminar la doble digitación obliga al usuario a hacer triple digitación: una en TrazaAmbiental (que no sirve para nada legal), otra en Excel (que sí sirve), y una tercera en la Ventanilla Única (que es donde realmente ocurre el cumplimiento).",
        ),
        (
            "Es como tener todos los ingredientes de una receta y obligar al chef a cocinar en la cocina del vecino.",
            "",  # Already has humor
        ),
    ],
    "### 1.3 La Máquina de Estados": [
        (
            "un problema de diseño esquizofrénico: dos vocabularios incompatibles conviviendo en la misma enumeración",
            ". Es como descubrir que un hospital usa dos sistemas de numeración de habitaciones — uno para los médicos y otro para las enfermeras — y que nadie consideró que esta divergencia podría, eventualmente, resultar en que alguien reciba una amputación en lugar de un chequeo",
        ),
        (
            "Los tres contadores son el equivalente informativo de mirar el océano a través de una cerradura.",
            " Se podría argumentar que la cerradura al menos apunta en la dirección correcta, lo cual ya sería una mejora sobre el estado actual.",
        ),
    ],
    "### 1.4 Impacto Regulatorio": [
        (
            "la reduce a un registro pasivo de solicitudes que el Estado no reconoce.",
            " Es una base de datos que documenta, con precisión milimétrica, hechos que nadie relevante consultará jamás. Un diario íntimo disfrazado de infraestructura regulatoria.",
        ),
    ],
    "### 1.5 La Dimensión Territorial": [
        (
            "la brecha digital de acceso fijo alcanza el 32,20% a nivel país",
            ". Lo cual significa que uno de cada tres operarios legalmente obligados a usar TrazaAmbiental no tiene forma de acceder a TrazaAmbiental. Es el tipo de contradicción que un diseñador de UX preferiría no confrontar antes del café de la mañana",
        ),
        (
            "la asimetría de escala es de 350:1",
            ". Diseñar un sistema que sirva simultáneamente para una vulcanización urbana y para una faena minera es como diseñar un vehículo que funcione igualmente bien como bicicleta y como portaaviones. Requiere, como mínimo, una conversación arquitectónica que nadie tuvo",
        ),
    ],
    "### 1.6 Veredicto del Actor": [
        (
            "la vista existe, pero la capacidad de llegar a algún lugar no.",
            " El Generador tiene, en resumen, un dashboard con la utilidad práctica de un GPS que solo muestra la posición actual sin capacidad de calcular rutas. Sabes dónde estás. No sabes a dónde ir. Y el destino, para efectos regulatorios, tiene fecha límite.",
        ),
    ],

    # ACTOR 2: TRANSPORTISTA
    "### 2.1 Contexto Normativo y Promesa Documental": [
        (
            "Si el Transportista miente sobre el peso, la mentira se cristaliza en un certificado.",
            " La mentira, una vez certificada, adquiere la permanencia jurídica de una inscripción en piedra — con el detalle adicional de que la piedra está custodiada por la SMA, que tiene afición por desenterrar inscripciones.",
        ),
        (
            "el Transportista de NFU **no necesita** la Autorización Sanitaria de Transporte de Residuos Peligrosos del D.S. 148",
            ". Un requisito que el sistema legacy trataba como inalienable y que la realidad normativa trata como inexistente — la diferencia entre lo que el código cree y lo que la ley dice tiene, a estas alturas, la consistencia de una brecha geológica",
        ),
    ],
}


def inject_humor(content: str) -> str:
    """Inyecta humor en el contenido markdown basado en patrones de contexto."""
    lines = content.split('\n')
    result = content
    
    injection_count = 0
    
    for section_key, injections in INJECTIONS.items():
        for pattern, humor in injections:
            if not humor:  # Skip empty (already has humor)
                continue
            if pattern in result:
                # Find the pattern and append/replace
                if humor.startswith('\n'):
                    # Insert as new paragraph after the sentence containing the pattern
                    result = result.replace(pattern, pattern + humor, 1)
                else:
                    # Inline injection - append directly
                    result = result.replace(pattern, pattern + humor, 1)
                injection_count += 1
    
    return result, injection_count


def main():
    filepath = sys.argv[1] if len(sys.argv) > 1 else '/home/kirlts/traza-ambiental/docs/research/reporte-brecha-conceptual.md'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_lines = len(content.split('\n'))
    result, count = inject_humor(content)
    new_lines = len(result.split('\n'))
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)
    
    print(f"Inyecciones realizadas: {count}")
    print(f"Líneas originales: {original_lines}")
    print(f"Líneas nuevas: {new_lines}")
    print(f"Delta: +{new_lines - original_lines}")


if __name__ == '__main__':
    main()
