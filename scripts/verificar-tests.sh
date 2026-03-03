#!/bin/bash
/* eslint-disable */

# Script para verificar el estado del sistema de pruebas

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       🧪 VERIFICACIÓN DEL SISTEMA DE PRUEBAS                ║"
echo "║           TrazAmbiental - Sistema REP                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# 1. Verificar Node.js
echo -e "${BLUE}📦 Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js no encontrado${NC}"
    exit 1
fi

# 2. Verificar PostgreSQL
echo -e "\n${BLUE}🐘 Verificando PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo -e "${GREEN}✅ PostgreSQL instalado: $PG_VERSION${NC}"
else
    echo -e "${RED}❌ PostgreSQL no encontrado${NC}"
    exit 1
fi

# 3. Verificar conexión a PostgreSQL
echo -e "\n${BLUE}🔌 Verificando conexión a PostgreSQL...${NC}"
if pg_isready &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL está corriendo${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL no está corriendo o no es accesible${NC}"
fi

# 4. Verificar base de datos de pruebas
echo -e "\n${BLUE}🗄️  Verificando base de datos de pruebas...${NC}"
if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw trazambiental_test; then
    echo -e "${GREEN}✅ Base de datos 'trazambiental_test' existe${NC}"
else
    echo -e "${YELLOW}⚠️  Base de datos 'trazambiental_test' no existe${NC}"
    echo -e "   ${YELLOW}Crear con: createdb trazambiental_test${NC}"
fi

# 5. Verificar base de datos normal
echo -e "\n${BLUE}🗄️  Verificando base de datos normal...${NC}"
if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw trazambiental; then
    echo -e "${GREEN}✅ Base de datos 'trazambiental' existe${NC}"
else
    echo -e "${YELLOW}⚠️  Base de datos 'trazambiental' no existe${NC}"
fi

# 6. Verificar archivos de configuración
echo -e "\n${BLUE}📄 Verificando archivos de configuración...${NC}"
files=(
    "jest.config.js"
    "jest.setup.js"
    "scripts/setup-test-db.js"
    "scripts/seed-test-data.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file no encontrado${NC}"
    fi
done

# 7. Verificar dependencias
echo -e "\n${BLUE}📚 Verificando dependencias...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules instalado${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules no encontrado${NC}"
    echo -e "   ${YELLOW}Instalar con: npm install${NC}"
fi

# 8. Resumen de comandos
echo -e "\n╔══════════════════════════════════════════════════════════════╗"
echo -e "║               📋 COMANDOS DISPONIBLES                        ║"
echo -e "╚══════════════════════════════════════════════════════════════╝"
echo -e ""
echo -e "${BLUE}Ejecutar todos los tests:${NC}"
echo -e "  npm run test"
echo -e ""
echo -e "${BLUE}Ejecutar tests sin resetear BD:${NC}"
echo -e "  npm run test:only"
echo -e ""
echo -e "${BLUE}Ejecutar tests en modo watch:${NC}"
echo -e "  npm run test:watch"
echo -e ""
echo -e "${BLUE}Ejecutar tests con cobertura:${NC}"
echo -e "  npm run test:coverage"
echo -e ""
echo -e "${BLUE}Crear/resetear BD de pruebas:${NC}"
echo -e "  node scripts/setup-test-db.js"
echo -e ""

# 9. Mostrar estadísticas si jest está disponible
echo -e "╔══════════════════════════════════════════════════════════════╗"
echo -e "║               📊 ESTADÍSTICAS DE TESTS                       ║"
echo -e "╚══════════════════════════════════════════════════════════════╝"
echo -e ""
echo -e "${BLUE}Ejecutando tests para obtener estadísticas...${NC}"
echo -e "${YELLOW}(Esto puede tomar unos segundos)${NC}\n"

# Ejecutar tests y capturar resultado
TEST_OUTPUT=$(npm run test:only 2>&1)
TEST_EXIT_CODE=$?

# Extraer estadísticas
TESTS_TOTAL=$(echo "$TEST_OUTPUT" | grep "Tests:" | tail -1 | grep -oP '\d+ total' | grep -oP '\d+')
TESTS_PASSED=$(echo "$TEST_OUTPUT" | grep "Tests:" | tail -1 | grep -oP '\d+ passed' | grep -oP '\d+')
TESTS_FAILED=$(echo "$TEST_OUTPUT" | grep "Tests:" | tail -1 | grep -oP '\d+ failed' | grep -oP '\d+')
SUITES_TOTAL=$(echo "$TEST_OUTPUT" | grep "Test Suites:" | tail -1 | grep -oP '\d+ total' | grep -oP '\d+')
SUITES_PASSED=$(echo "$TEST_OUTPUT" | grep "Test Suites:" | tail -1 | grep -oP '\d+ passed' | grep -oP '\d+')
SUITES_FAILED=$(echo "$TEST_OUTPUT" | grep "Test Suites:" | tail -1 | grep -oP '\d+ failed' | grep -oP '\d+')

if [ -n "$TESTS_TOTAL" ]; then
    SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($TESTS_PASSED/$TESTS_TOTAL)*100}")
    
    echo -e "${GREEN}✅ Tests Pasando:${NC} $TESTS_PASSED de $TESTS_TOTAL (${SUCCESS_RATE}%)"
    
    if [ -n "$TESTS_FAILED" ] && [ "$TESTS_FAILED" != "0" ]; then
        echo -e "${RED}❌ Tests Fallando:${NC} $TESTS_FAILED"
    fi
    
    echo -e "${GREEN}✅ Suites Pasando:${NC} $SUITES_PASSED de $SUITES_TOTAL"
    
    if [ -n "$SUITES_FAILED" ] && [ "$SUITES_FAILED" != "0" ]; then
        echo -e "${RED}❌ Suites Fallando:${NC} $SUITES_FAILED"
    fi
    
    echo -e ""
    
    if (( $(echo "$SUCCESS_RATE > 80" | bc -l) )); then
        echo -e "${GREEN}🎉 ¡Excelente! El sistema de pruebas está en buen estado.${NC}"
    elif (( $(echo "$SUCCESS_RATE > 60" | bc -l) )); then
        echo -e "${YELLOW}⚠️  El sistema de pruebas necesita algunas mejoras.${NC}"
    else
        echo -e "${RED}❌ El sistema de pruebas requiere atención urgente.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No se pudieron obtener estadísticas${NC}"
fi

echo -e ""
echo -e "╔══════════════════════════════════════════════════════════════╗"
echo -e "║       📖 Ver informe completo: INFORME-TESTS-FINAL.md       ║"
echo -e "║       📖 Ver guía de tests: README-TESTS.md                  ║"
echo -e "╚══════════════════════════════════════════════════════════════╝"
echo -e ""

