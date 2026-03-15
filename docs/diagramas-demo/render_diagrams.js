// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require("puppeteer");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const diagramDefinitions = [
  {
    name: "01-Navegacion-v3",
    title: "Portal de Demostración: Selección de Perfiles",
    html: `
      <div class="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto p-8">
        <div class="main-card w-96 text-center">
          <h1 class="text-2xl font-bold bg-blue-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-4">Traza Ambiental</h1>
          <p class="text-slate-700 font-medium text-lg">Página Principal</p>
          <div class="mt-4 px-4 py-2 bg-slate-100 rounded text-slate-600 border border-slate-200 text-sm">
            Clic en <span class="text-emerald-600 font-semibold">Modo Demo</span>
          </div>
        </div>

        <div class="w-1 bg-slate-300 h-8 -my-12 relative">
           <div class="absolute bottom-0 left-1/2 -ml-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-slate-300"></div>
        </div>

        <div class="main-card w-full max-w-5xl border-emerald-500/30">
          <h2 class="text-xl font-bold text-emerald-700 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Selección de Perfiles (Actores de la Ley REP)
          </h2>
          
          <div class="flex flex-wrap justify-between gap-6">
            <div class="role-col">
              <div class="role-btn border-l-4 border-l-emerald-500">
                <div class="text-emerald-700 font-bold mb-1">Generador</div>
                <div class="text-slate-600 text-sm">Empresa Minera</div>
              </div>
              <div class="arrow-down"></div>
              <div class="dash-card border-emerald-200 bg-emerald-50">
                <div class="font-bold text-slate-800">Crear Solicitudes</div>
                <div class="text-sm text-slate-600 mt-1">Declarar introducción de NFU Categoría A/B</div>
              </div>
            </div>

            <div class="role-col">
              <div class="role-btn border-l-4 border-l-blue-500">
                <div class="text-blue-700 font-bold mb-1">Transportista</div>
                <div class="text-slate-600 text-sm">Logística Inversa</div>
              </div>
              <div class="arrow-down"></div>
              <div class="dash-card border-blue-200 bg-blue-50">
                <div class="font-bold text-slate-800">Rutas / Pesaje</div>
                <div class="text-sm text-slate-600 mt-1">Crear Guías de Transporte, reportar Kilo Real</div>
              </div>
            </div>

            <div class="role-col">
              <div class="role-btn border-l-4 border-l-amber-500">
                <div class="text-amber-700 font-bold mb-1">Gestor (Planta)</div>
                <div class="text-slate-600 text-sm">Centro de Reciclaje</div>
              </div>
              <div class="arrow-down"></div>
              <div class="dash-card border-amber-200 bg-amber-50">
                <div class="font-bold text-slate-800">Recepción NFU</div>
                <div class="text-sm text-slate-600 mt-1">Pesaje de Romana, autogenerar Certificado QR</div>
              </div>
            </div>

            <div class="role-col">
              <div class="role-btn border-l-4 border-l-red-500">
                <div class="text-red-700 font-bold mb-1">Administrador</div>
                <div class="text-slate-600 text-sm">Gobernanza</div>
              </div>
              <div class="arrow-down"></div>
              <div class="dash-card border-red-200 bg-red-50">
                <div class="font-bold text-slate-800">Control Total</div>
                <div class="text-sm text-slate-600 mt-1">Definir Metas Anuales, Control de usuarios</div>
              </div>
            </div>

            <div class="role-col">
              <div class="role-btn border-l-4 border-l-purple-500">
                <div class="text-purple-700 font-bold mb-1">Auditor</div>
                <div class="text-slate-600 text-sm">Fiscalización State</div>
              </div>
              <div class="arrow-down"></div>
              <div class="dash-card border-purple-200 bg-purple-50">
                <div class="font-bold text-slate-800">Visualización</div>
                <div class="text-sm text-slate-600 mt-1">Reportes totales, Verificación pública y auditoría</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    name: "02-Generador-v3",
    title: "Flujo Principal: Perfil Generador",
    html: `
      <div class="flex items-center gap-6 justify-center w-full px-8 py-12">
        
        <div class="step-card border-slate-200 hover:border-emerald-500">
          <div class="step-number bg-emerald-600 text-white">1</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Panel de Métricas</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Acceso exclusivo tras validación del Administrador del sistema.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Ver el porcentaje de cumplimiento y métricas de reciclaje anual.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Ver historial de retiros pendientes, en ruta y completados.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-emerald-500">
          <div class="step-number bg-emerald-600 text-white">2</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Creación de Solicitud</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Declarar introducción de Neumáticos (NFU) Categoría A y/o B.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Indicar Cantidad y Peso Estimado para la logística.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> El sistema genera el identificador oficial (Folio SOL-[YYYY][MM][DD]-[seq]).</li>
            <li class="flex items-start"><span class="text-red-500 mr-2">!</span> Si la relación Peso/Cantidad declarada es anómala, se activa advertencia.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-emerald-500">
          <div class="step-number bg-emerald-600 text-white">3</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Asignación y Recolección</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> La solicitud se publica en la bolsa de trabajo para Transportistas.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Cuando un conductor acepta la ruta, el estado cambia a ACEPTADA.</li>
            <li class="flex items-start"><span class="text-emerald-500 mr-2">✓</span> Lanza alerta si nadie recoge el requerimiento en 48 horas.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-emerald-500 bg-emerald-50">
          <div class="step-number bg-emerald-600 text-white">4</div>
          <h3 class="font-bold text-lg text-emerald-800 mb-3 border-b border-emerald-200 pb-2">Certificación Legal</h3>
          <ul class="text-slate-700 text-sm space-y-2">
            <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Recibe Notificación Automática cuando los neumáticos son tratados por una Planta.</li>
            <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> Descarga Certificado PDF Inmutable, validado e inborrable con Código QR (CERT-YYYY-000N).</li>
            <li class="flex items-start"><span class="text-emerald-600 mr-2">✓</span> El tonelaje es sumado instantáneamente a la meta oficial de la Ley REP 20.920.</li>
          </ul>
        </div>
      </div>
    `,
  },
  {
    name: "03-Transportista-v3",
    title: "Flujo Principal: Perfil Transportista (Logística Inversa)",
    html: `
      <div class="flex items-center gap-6 justify-center w-full px-8 py-12">
        <div class="step-card border-slate-200 hover:border-blue-500">
          <div class="step-number bg-blue-600 text-white">1</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Acreditación Operativa</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-blue-500 mr-2">✓</span> Validación sistémica de Res. Sanitaria, Revisión Técnica y Permisos MINSAL vigentes.</li>
            <li class="flex items-start"><span class="text-red-500 mr-2">!</span> Cierre de cuentas automático pasados 3 días del vencimiento del papeleo.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-blue-500">
          <div class="step-number bg-blue-600 text-white">2</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Selección de Ruta</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-blue-500 mr-2">✓</span> Visualización de mapa nacional y mercado abierto de retiros pendientes.</li>
            <li class="flex items-start"><span class="text-blue-500 mr-2">✓</span> Aceptación formal de la ruta evaluando origen (Faena) y destino final de valorización.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-blue-500">
          <div class="step-number bg-blue-600 text-white">3</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Trazabilidad del Acopio</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-blue-500 mr-2">✓</span> El sistema emite la "Guía de Despacho" formalizando la custodia de los neumáticos.</li>
            <li class="flex items-start"><span class="text-blue-500 mr-2">✓</span> Actualiza el "Kilo Estimado" del generador con el total arrojado por su Báscula de Camión.</li>
            <li class="flex items-start"><span class="text-red-500 mr-2">!</span> Si excede un 20% respecto a la declaración, lanza Alertas de Discrepancia.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-blue-500 bg-blue-50">
          <div class="step-number bg-blue-600 text-white">4</div>
          <h3 class="font-bold text-lg text-blue-800 mb-3 border-b border-blue-200 pb-2">Descarga y Legalización</h3>
          <ul class="text-slate-700 text-sm space-y-2">
            <li class="flex items-start"><span class="text-blue-600 mr-2">✓</span> Arribo del convoy al Centro de Reciclaje oficial.</li>
            <li class="flex items-start"><span class="text-blue-600 mr-2">✓</span> El Transportista transfiere formalmente la custodia legal de la carga obteniendo firma digital confirmatoria.</li>
          </ul>
        </div>
      </div>
    `,
  },
  {
    name: "04-Gestor-v3",
    title: "Flujo Principal: Perfil Gestor (Centro de Reciclaje)",
    html: `
      <div class="flex items-center gap-6 justify-center w-full px-8 py-12">
        <div class="step-card border-slate-200 hover:border-amber-500">
          <div class="step-number bg-amber-500 text-white">1</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Validación Documental</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-amber-500 mr-2">✓</span> Requiere Autorización Sanitaria (detalla Capacidad Kg) e Inscripción en SINADER.</li>
            <li class="flex items-start"><span class="text-amber-500 mr-2">✓</span> Requisito base aprobado por Admin para listar la planta.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-amber-500">
          <div class="step-number bg-amber-500 text-white">2</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Recepción en Puertas</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-amber-500 mr-2">✓</span> Conductor valida llegada al Centro. Se inicia la transición de estado ENTREGADA -> RECIBIDA.</li>
            <li class="flex items-start"><span class="text-amber-500 mr-2">✓</span> El gestor asume a partir de aquí la custodia física y legal del neumático (NFU).</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-slate-200 hover:border-amber-500">
          <div class="step-number bg-amber-500 text-white">3</div>
          <h3 class="font-bold text-lg text-slate-800 mb-3 border-b border-slate-200 pb-2">Pesaje Fidedigno Legal</h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-start"><span class="text-amber-500 mr-2">✓</span> El Gestor recalcula el tonelaje real utilizando Calibración de Romana de piso (Dato Soberano).</li>
            <li class="flex items-start"><span class="text-red-500 mr-2">!</span> Una diferencia mayor al 5% respecto a lo declarado por el transportista abre un Registro de Discrepancia y paraliza el flujo.</li>
          </ul>
        </div>

        <svg class="w-12 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>

        <div class="step-card border-amber-500 bg-amber-50">
          <div class="step-number bg-amber-500 text-white">4</div>
          <h3 class="font-bold text-lg text-amber-800 mb-3 border-b border-amber-200 pb-2">Conversión y Sellado</h3>
          <ul class="text-slate-700 text-sm space-y-2">
            <li class="flex items-start"><span class="text-amber-600 mr-2">✓</span> Una vez finalizado el proceso de valorización, se marca la solicitud como "TRATADA".</li>
            <li class="flex items-start"><span class="text-amber-600 mr-2">✓</span> Se activa el autómata del servidor: Compila el historial y construye el PDF infalsificable final.</li>
            <li class="flex items-start"><span class="text-amber-600 mr-2">✓</span> Queda sellado legalmente su procesamiento ante el Estado.</li>
          </ul>
        </div>
      </div>
    `,
  },
  {
    name: "05-Admin-v3",
    title: "Perfiles Institucionales y de Auditoría",
    html: `
      <div class="flex items-stretch gap-12 justify-center w-full max-w-5xl mx-auto px-8 py-12">
        <div class="flex-1 main-card border-red-500/30 bg-white">
          <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Rol Administrador (Traza Ambiental)
          </h2>
          <ul class="text-slate-700 space-y-4">
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-red-500 mt-1">●</div>
              <div>
                <strong class="block text-slate-900 mb-1">Capacidad Funcional Íntegra</strong>
                <span class="text-sm">Asigna roles, aprueba la documentación de registro inaugural de cuentas, y funge como juez frente a trabas y conflictos por discrepancia en kilos de pesajes.</span>
              </div>
            </li>
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-red-500 mt-1">●</div>
              <div>
                <strong class="block text-slate-900 mb-1">Control del Gremio Operativo</strong>
                <span class="text-sm">Si vencen permisos de salud o circulación de Centros de reciclaje o Camiones sin una refrendación en el plazo establecido, el sistema revoca automáticamente sus credenciales de carga.</span>
              </div>
            </li>
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-red-500 mt-1">●</div>
              <div>
                <strong class="block text-slate-900 mb-1">Reportabilidad de Cierre Anual (31 Dic.)</strong>
                <span class="text-sm">Inspección de avance legal. Al concluir el ejercicio, agrupa e imprime los resultados en reportes CSV diseñados para adjuntar explícitamente al Sistema Nacional de Declaración de Residuos (SINADER).</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex-1 main-card border-purple-500/30 bg-white">
          <h2 class="text-xl font-bold text-purple-600 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Rol Analista y Fiscalización (Estatal)
          </h2>
          <ul class="text-slate-700 space-y-4">
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-purple-500 mt-1">✓</div>
              <div>
                <strong class="block text-slate-900 mb-1">Entorno Exclusivo de Visualización</strong>
                <span class="text-sm">La interfaz bloquea cualquier herramienta de edición. El fiscalizador no cuenta con derechos para registrar cargas ni alterar pesajes, asegurando la objetividad absoluta.</span>
              </div>
            </li>
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-purple-500 mt-1">✓</div>
              <div>
                <strong class="block text-slate-900 mb-1">Validación Pública Integral</strong>
                <span class="text-sm">Dispone de una sección o ruta expuesta al público mediante códigos de escanero que enseñan el certificado original refrendado, permitiendo corroboraciones inmediatas.</span>
              </div>
            </li>
            <li class="flex gap-4 p-3 bg-slate-50 rounded border border-slate-200">
              <div class="text-purple-500 mt-1">✓</div>
              <div>
                <strong class="block text-slate-900 mb-1">Depósito Histórico Analítico</strong>
                <span class="text-sm">Puede examinar toda transacción originada en el software, y posee potestad de exportación masiva total (Tablas tipo Excel/CSV) sin ser estorbado por filtros regionales.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `,
  },
];

const generateHTML = (diagram) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #ffffff; /* Light Background */
      color: #0f172a;
      margin: 0;
      padding: 0;
      display: inline-block;
    }
    .wrapper {
      padding: 40px 60px;
      position: relative;
    }
    .main-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .step-card {
      background: #ffffff;
      border-width: 1px;
      border-radius: 0.75rem;
      padding: 1.5rem;
      width: 280px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: relative;
      flex-shrink: 0;
    }
    .step-number {
      position: absolute;
      top: -16px;
      left: 1.5rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .role-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 190px;
    }
    .role-btn {
      background: #ffffff;
      border-width: 1px;
      border-color: #cbd5e1;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      text-align: center;
      z-index: 10;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .arrow-down {
      width: 2px;
      height: 24px;
      background-color: #94a3b8;
      position: relative;
    }
    .arrow-down::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: -4px;
      border-width: 5px 5px 0 5px;
      border-style: solid;
      border-color: #94a3b8 transparent transparent transparent;
    }
    .dash-card {
      border-width: 1px;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      text-align: center;
    }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            slate: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            },
            emerald: {
              50: '#ecfdf5',
              200: '#a7f3d0',
              500: '#10b981',
              600: '#059669',
              700: '#047857',
              800: '#065f46',
            },
            blue: {
              50: '#eff6ff',
              200: '#bfdbfe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
            },
            amber: {
              50: '#fffbeb',
              200: '#fde68a',
              500: '#f59e0b',
              600: '#d97706',
              700: '#b45309',
              800: '#92400e',
            },
            purple: {
              50: '#faf5ff',
              200: '#e9d5ff',
              500: '#a855f7',
              600: '#9333ea',
              700: '#7e22ce',
            },
            red: {
              50: '#fef2f2',
              200: '#fecaca',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
            }
          }
        }
      }
    }
  </script>
</head>
<body>
  <div class="wrapper" id="capture-zone">
    <h1 class="text-3xl font-extrabold text-slate-800 mb-2 truncate">${diagram.title}</h1>
    <div class="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-500 mb-8 rounded-full"></div>
    
    ${diagram.html}
  </div>
</body>
</html>
`;

(async () => {
  console.log("Iniciando Puppeteer...");
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // High density para retina display
  await page.setViewport({ width: 1500, height: 1000, deviceScaleFactor: 2 });

  for (const diagram of diagramDefinitions) {
    console.log("Generando " + diagram.name + "...");
    const htmlPath = path.join(__dirname, diagram.name + ".html");
    const pngPath = path.join(__dirname, diagram.name + ".png");

    fs.writeFileSync(htmlPath, generateHTML(diagram));

    await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });

    // Calcular altura y anchura del componente de renderizado
    const element = await page.$("#capture-zone");
    const boundingBox = await element.boundingBox();

    await page.screenshot({
      path: pngPath,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: Math.min(boundingBox.width, 1600),
        height: boundingBox.height,
      },
    });

    // Cleanup HTML to avoid polluting codebase
    fs.unlinkSync(htmlPath);
    console.log("Terminado " + diagram.name);
  }

  await browser.close();
  console.log("Renderizado completo.");
})();
