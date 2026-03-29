import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarHashGuia } from '@/lib/crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folio: string }> }
) {
  try {
    const { folio } = await params

    const guia = await prisma.guiaDespacho.findUnique({
      where: { numeroGuia: folio },
      include: {
        generadoPorUsuario: {
          select: {
            name: true,
            rut: true,
            email: true
          }
        },
        solicitud: {
          include: {
            generador: { select: { name: true, rut: true } },
            transportista: { select: { name: true, rut: true } },
            gestor: { select: { name: true, rut: true } },
            vehiculo: { select: { patente: true } }
          }
        }
      }
    })

    if (!guia) {
      return NextResponse.json({ valido: false, mensaje: 'Documento no encontrado' }, { status: 404 })
    }

    // Verificar Integridad (HU-022)
    const esIntegro = verificarHashGuia({
      folio: guia.numeroGuia,
      fechaEmision: guia.fechaEmision,
      rutGenerador: guia.solicitud.generador?.rut || 'N/A',
      rutTransportista: guia.solicitud.transportista?.rut || 'N/A',
      rutGestor: guia.solicitud.gestor?.rut || 'N/A',
      patente: guia.solicitud.vehiculo?.patente || 'N/A',
      pesoKg: guia.pesoKg
    }, guia.hashIntegridad || '')

    if (!esIntegro) {
        return NextResponse.json({ 
            valido: false, 
            mensaje: 'El documento ha sido alterado o es inválido',
            motivo: 'Fallo de integridad hash'
        }, { status: 200 })
    }

    // Retornar datos públicos
    return NextResponse.json({
      valido: true,
      documento: {
        folio: guia.numeroGuia,
        fechaEmision: guia.fechaEmision,
        estado: 'VIGENTE', // Podría derivarse del estado de la solicitud
        origen: {
            razonSocial: guia.solicitud.generador?.name || 'N/A',
            rut: guia.solicitud.generador?.rut || 'N/A'
        },
        transporte: {
            empresa: guia.solicitud.transportista?.name,
            vehiculo: guia.vehiculoPatente,
            conductor: guia.conductorNombre
        },
        destino: {
            razonSocial: guia.solicitud.gestor?.name,
            rut: guia.solicitud.gestor?.rut
        },
        carga: {
            descripcion: guia.descripcionCarga,
            peso: guia.pesoKg,
            cantidad: guia.cantidadUnidades
        },
        seguridad: {
            hash: guia.hashIntegridad,
            firma: 'Firma Electrónica Simple'
        }
      }
    })

  } catch (error: unknown) {
    console.error('Error verificando guía:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
