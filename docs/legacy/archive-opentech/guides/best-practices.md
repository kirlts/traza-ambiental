# 🎯 Mejores Prácticas - Sistema REP Chile

## 📋 Principios Generales

### 1. Calidad de Código

- **TypeScript**: Usar tipos explícitos en lugar de `any`
- **ESLint**: Resolver todos los warnings antes de commits
- **Prettier**: Formateo consistente del código
- **Commits**: Mensajes descriptivos y convenciones de commit

### 2. Arquitectura

- **Separación de responsabilidades**: UI, lógica de negocio, datos
- **Componentes reutilizables**: Evitar código duplicado
- **Single Responsibility**: Un componente/hook por función
- **DRY Principle**: Don't Repeat Yourself

### 3. Performance

- **Lazy loading**: Componentes pesados con `React.lazy()`
- **Memoización**: `React.memo()`, `useMemo()`, `useCallback()`
- **Code splitting**: Imports dinámicos para rutas
- **Image optimization**: Next.js Image component

## 🧩 Desarrollo de Componentes

### Estructura de Componentes

```typescript
// ✅ Buena estructura
interface ComponentProps {
  data: DataType
  onAction: (item: ItemType) => void
  loading?: boolean
}

export function MyComponent({ data, onAction, loading = false }: ComponentProps) {
  // Hooks al inicio
  const [state, setState] = useState(initialState)

  // Funciones memoizadas
  const handleAction = useCallback(() => {
    onAction(data)
  }, [onAction, data])

  // Efectos después
  useEffect(() => {
    // Lógica de efectos
  }, [dependencies])

  // Loading states
  if (loading) {
    return <SkeletonComponent />
  }

  // Render principal
  return (
    <div>
      {/* JSX aquí */}
    </div>
  )
}
```

### Evitar Anti-Patrones

```typescript
// ❌ Mal: Props any
function BadComponent({ data }: { data: any }) { ... }

// ✅ Bien: Props tipados
interface GoodComponentProps {
  data: SpecificDataType
}
function GoodComponent({ data }: GoodComponentProps) { ... }
```

```typescript
// ❌ Mal: Lógica compleja en JSX
return (
  <div>
    {data.items.map(item =>
      item.status === 'active' && item.type === 'special'
        ? <ComplexComponent key={item.id} {...item} />
        : null
    )}
  </div>
)

// ✅ Bien: Extraer lógica
const activeSpecialItems = useMemo(() =>
  data.items.filter(item =>
    item.status === 'active' && item.type === 'special'
  ), [data.items]
)

return (
  <div>
    {activeSpecialItems.map(item => (
      <ComplexComponent key={item.id} {...item} />
    ))}
  </div>
)
```

## 🔄 Manejo de Estado

### useState vs useReducer

```typescript
// ✅ Para estado simple
const [count, setCount] = useState(0);

// ✅ Para estado complejo con lógica relacionada
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

### Context vs Props Drilling

```typescript
// ✅ Context para datos globales (usuario, tema)
const UserContext = createContext<User | null>(null);

// ❌ No usar Context para todo
// ✅ Props para datos específicos del componente
```

## 🚀 Optimización de Performance

### Memoización Estratégica

```typescript
// ✅ Memoizar cálculos caros
const expensiveValue = useMemo(() => {
  return data.items.reduce((sum, item) => sum + item.value, 0)
}, [data.items])

// ✅ Memoizar callbacks que pasan a hijos
const handleClick = useCallback(() => {
  doSomething(dependency)
}, [dependency])

// ✅ Memoizar componentes que re-renderizan frecuentemente
const MemoizedComponent = memo(function Component({ data }) {
  return <div>{data.value}</div>
})
```

### Lazy Loading

```typescript
// ✅ Componentes pesados
const HeavyChart = lazy(() => import("@/components/HeavyChart"));

// ✅ Páginas
const AdminPage = lazy(() => import("@/pages/admin"));
```

### Code Splitting

```typescript
// ✅ Import dinámico para rutas
const routes = {
  dashboard: () => import("@/pages/dashboard"),
  reports: () => import("@/pages/reports"),
};

// ✅ Import condicional
const IconComponent = dynamic(() => import(`@/icons/${iconName}`));
```

## 🗄️ Base de Datos y APIs

### Queries Optimizadas

```typescript
// ✅ Incluir solo campos necesarios
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    // No incluir password o datos sensibles
  },
});

// ✅ Usar includes estratégicos
const certificate = await prisma.certificado.findUnique({
  where: { id: certId },
  include: {
    solicitud: {
      select: {
        region: true,
        comuna: true,
      },
    },
  },
});
```

### Manejo de Errores

```typescript
// ✅ Try-catch comprehensivo
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error("API Error:", error);

  // Log para monitoreo
  await logError({
    error: error.message,
    userId: session?.user?.id,
    endpoint: "/api/example",
    timestamp: new Date(),
  });

  // Retornar estado de error consistente
  return {
    success: false,
    error: "Ocurrió un error inesperado",
    code: "INTERNAL_ERROR",
  };
}
```

## 🔒 Seguridad

### Validación de Entrada

```typescript
// ✅ Validación con Zod
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user", "moderator"]),
});

export async function createUser(data: unknown) {
  const validatedData = userSchema.parse(data);
  // Proceder con datos validados
}
```

### Autenticación y Autorización

```typescript
// ✅ Verificar permisos en API routes
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verificar roles específicos
  const hasPermission = session.user.roles?.includes("admin");

  if (!hasPermission) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Proceder con lógica autorizada
}
```

## 🧪 Testing

### Cobertura de Tests

```typescript
// ✅ Test unitario
describe('Button', () => {
  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn()
    render(<Button onClick={mockOnClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})

// ✅ Test de integración
describe('UserForm', () => {
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn()
    render(<UserForm onSubmit={mockSubmit} />)

    await userEvent.type(screen.getByLabelText('Name'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
    await userEvent.click(screen.getByText('Submit'))

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
})
```

### Mocks Efectivos

```typescript
// ✅ Mock de APIs
jest.mock("@/lib/api", () => ({
  getUsers: jest.fn(() => Promise.resolve(mockUsers)),
  createUser: jest.fn(() => Promise.resolve(mockUser)),
}));

// ✅ Mock de hooks
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}));
```

## 🎨 UI/UX

### Alertas y Confirmaciones

Preferir el uso de **SweetAlert2** sobre `confirm()` o `alert()` nativos del navegador para mantener una estética consistente y atractiva.

```typescript
import Swal from "sweetalert2";

// ✅ Confirmación atractiva
const handleAction = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, confirmar",
  });

  if (result.isConfirmed) {
    // Ejecutar acción
  }
};
```

### Consistencia Visual

```typescript
// ✅ Sistema de design tokens
const colors = {
  primary: '#059669',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// ✅ Componentes base reutilizables
function Button({ variant = 'primary', children, ...props }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Accesibilidad

```typescript
// ✅ Labels descriptivos
<label htmlFor="email" className="sr-only">
  Correo electrónico
</label>
<input
  id="email"
  type="email"
  placeholder="tu@email.com"
  aria-describedby="email-help"
/>

// ✅ Navegación por teclado
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  tabIndex={0}
>
  Acción
</button>

// ✅ ARIA attributes
<div role="status" aria-live="polite">
  {loading ? 'Cargando...' : 'Datos cargados'}
</div>
```

## 📱 PWA y Performance

### Service Worker

```typescript
// ✅ Cache strategy
self.addEventListener("fetch", (event) => {
  // Network first para APIs
  if (event.request.url.includes("/api/")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache first para assets
  event.respondWith(cacheFirst(event.request));
});
```

### Optimización de Imágenes

```typescript
// ✅ Next.js Image component
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // Para above the fold
  placeholder="blur" // Blur placeholder
  quality={85} // Compresión
/>
```

## 🚀 Deployment

### Variables de Entorno

```bash
# ✅ Variables por entorno
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/prod-db
NEXTAUTH_SECRET=prod-secret-key
VAPID_PUBLIC_KEY=prod-vapid-public
VAPID_PRIVATE_KEY=prod-vapid-private
```

### Health Checks

```typescript
// ✅ Endpoint de health check
export async function GET() {
  try {
    // Verificar base de datos
    await prisma.$queryRaw`SELECT 1`;

    // Verificar servicios externos
    await checkExternalServices();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

## 📊 Monitoreo y Logging

### Logging Estructurado

```typescript
// ✅ Logs con contexto
logger.info("User login successful", {
  userId: user.id,
  email: user.email,
  ip: request.ip,
  userAgent: request.headers.get("user-agent"),
  timestamp: new Date().toISOString(),
});
```

### Métricas de Performance

```typescript
// ✅ Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔄 Mantenimiento

### Actualizaciones de Dependencias

```bash
# ✅ Verificar vulnerabilidades
npm audit

# ✅ Actualizar dependencias
npm update

# ✅ Verificar compatibilidad
npm run build
npm test
```

### Code Reviews

```markdown
## ✅ Checklist de Code Review

- [ ] Código sigue las convenciones del proyecto
- [ ] Tests incluidos para nueva funcionalidad
- [ ] Documentación actualizada
- [ ] Performance no degradada
- [ ] Seguridad considerada
- [ ] Accesibilidad mantenida
- [ ] Tipos TypeScript correctos
```

Siguiendo estas mejores prácticas, mantendremos un código de alta calidad, mantenible y escalable en el Sistema REP Chile. 🎉
