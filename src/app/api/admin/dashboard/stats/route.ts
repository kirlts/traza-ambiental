import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-helpers";

export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos de administrador
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener estadísticas generales de usuarios usando query raw
    const userStats = await prisma.$queryRaw<
      Array<{ total: bigint; active: bigint; inactive: bigint }>
    >`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN active = true THEN 1 END) as active,
        COUNT(CASE WHEN active = false THEN 1 END) as inactive
      FROM users
    `;

    const {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
    } = {
      total: Number(userStats[0].total),
      active: Number(userStats[0].active),
      inactive: Number(userStats[0].inactive),
    };

    // Obtener estadísticas de roles usando query raw
    const roleStats = await prisma.$queryRaw<Array<{ total: bigint; active: bigint }>>`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN active = true THEN 1 END) as active
      FROM roles
    `;

    const { total: totalRoles, active: activeRoles } = {
      total: Number(roleStats[0].total),
      active: Number(roleStats[0].active),
    };

    // Obtener información de roles con conteo de usuarios usando query raw
    const roles = await prisma.$queryRaw<
      Array<{ id: string; name: string; description: string; active: boolean; userCount: bigint }>
    >`
      SELECT 
        r.id,
        r.name,
        r.description,
        r.active,
        COUNT(ur."userId") AS "userCount"
      FROM roles r
      LEFT JOIN user_roles ur ON ur."roleId" = r.id
      WHERE r.active = true
      GROUP BY r.id, r.name, r.description, r.active
      ORDER BY "userCount" DESC
    `;

    // Obtener estadísticas de usuarios por rol usando query raw para evitar problemas de tipos
    const usersByRoleRaw = await prisma.$queryRaw<
      Array<{ roleId: string; roleName: string; count: bigint }>
    >`
      SELECT 
        r.id AS "roleId",
        r.name AS "roleName",
        COUNT(ur."userId") AS count
      FROM roles r
      LEFT JOIN user_roles ur ON ur."roleId" = r.id
      LEFT JOIN users u ON u.id = ur."userId" AND u.active = true
      WHERE r.active = true
      GROUP BY r.id, r.name
      ORDER BY count DESC
    `;

    // Convertir BigInt a Number en roles
    const rolesWithNumbers = roles.map((role) => ({
      ...role,
      userCount: Number(role.userCount),
    }));

    const allUsersByRole = usersByRoleRaw.map((item: ReturnType<typeof JSON.parse>) => ({
      ...item,
      count: Number(item.count),
    }));

    // Estadísticas de neumáticos (placeholder - se implementará cuando exista el modelo)
    const neumaticosStats = {
      total: 0,
      enTransito: 0,
      reciclados: 0,
      pendientes: 0,
    };

    // Obtener actividad reciente desde AuditLog
    const recentActivityRaw = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const recentActivity = recentActivityRaw.map((log) => ({
      id: log.id,
      action: log.action,
      description: log.description,
      user: log.user ? log.user.name || log.user.email || "Usuario" : "Usuario desconocido",
      timestamp: log.createdAt.toISOString(),
      type: log.entityType.toLowerCase() as "user" | "role" | "system" | "neumatico",
    }));

    // Si no hay actividad real, agregar algunos logs de ejemplo
    if (recentActivity.length === 0) {
      recentActivity.push({
        id: "1",
        action: "Sistema iniciado",
        description: "Dashboard de administrador cargado",
        user: session.user?.name || "Administrador",
        timestamp: new Date().toISOString(),
        type: "system",
      });
    }

    // Datos históricos para gráficos (últimos 7 días)
    const historicalData = {
      usuariosRegistrados: generateHistoricalUserData(),
      actividadSistema: generateHistoricalActivityData(),
    };

    // Respuesta con todas las estadísticas
    const stats = {
      usuarios: {
        total: totalUsers,
        activos: activeUsers,
        inactivos: inactiveUsers,
        porRol: allUsersByRole,
      },
      roles: {
        total: totalRoles,
        activos: activeRoles,
        conUsuarios: rolesWithNumbers.filter((role) => role.userCount > 0).length,
      },
      neumaticos: neumaticosStats,
      actividad: recentActivity,
      historico: historicalData,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("Error al obtener estadísticas del dashboard:", error);

    // Proporcionar información más detallada del error en desarrollo
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)
        : "Error interno del servidor";

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

// Funciones helper para generar datos históricos simulados
function generateHistoricalUserData() {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simular datos realistas con variación
    const baseCount = Math.floor(Math.random() * 5) + 1;
    data.push({
      fecha: date.toISOString().split("T")[0],
      usuarios: baseCount,
      activos: Math.floor(baseCount * 0.8),
    });
  }

  return data;
}

function generateHistoricalActivityData() {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simular actividad del sistema
    const activityCount = Math.floor(Math.random() * 20) + 5;
    data.push({
      fecha: date.toISOString().split("T")[0],
      actividades: activityCount,
      logins: Math.floor(activityCount * 0.3),
      acciones: Math.floor(activityCount * 0.7),
    });
  }

  return data;
}
