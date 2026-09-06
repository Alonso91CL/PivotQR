import { buildQRDataUrl } from "@/lib/qr";
import { LoginButton, LoginModal } from "@/components/landing/login";

const SHORT_MOCK = "https://qr.pivotit.cl/EJEMPLO";

const pasos = [
  {
    titulo: "Pega tu URL larga",
    texto:
      "Escribe la dirección de la campaña y PivotQR crea al instante un enlace corto y un código QR. El QR nunca apunta directo a tu URL final.",
  },
  {
    titulo: "Imprime o comparte el QR",
    texto:
      "Descárgalo en PNG o SVG para la imprenta, o compártelo por WhatsApp. Si cambia la URL, se edita en el panel: el QR impreso sigue funcionando.",
  },
  {
    titulo: "Mira el impacto y compártelo",
    texto:
      "Cada escaneo suma en vivo. Entrégale a tu cliente un reporte ejecutivo con código de acceso: el número grande, el mapa y las gráficas.",
  },
];

const features = [
  {
    titulo: "QR dinámico",
    texto:
      "Cambia la URL de destino cuando quieras sin reimprimir. El QR físico que ya repartiste sigue llevando a la nueva dirección.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    ),
  },
  {
    titulo: "Escaneos en vivo",
    texto:
      "Contador que se actualiza solo en pantalla mientras tu audiencia escanea, sin recargar ni esperar reportes.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ),
  },
  {
    titulo: "Reporte ejecutivo",
    texto:
      "Un dashboard ordenado por importancia para el dueño del negocio: número gordo, mapa de ciudades y gráfica de picos por día y hora.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    ),
  },
  {
    titulo: "Reporte con código de acceso",
    texto:
      "Comparte el reporte en público o en privado con un enlace y un código. Copia la invitación lista para pegar en WhatsApp.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    ),
  },
  {
    titulo: "Activa o pausa tu campaña",
    texto:
      "Frena el tráfico de un QR con un clic y muestra «Campaña pausada». Los escaneos siguen registrándose para cuando la reactives.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3.75L4.5 7.5l3.75 3.75M4.5 7.5h15M15.75 20.25L19.5 16.5l-3.75-3.75M19.5 16.5H4.5"
      />
    ),
  },
  {
    titulo: "Descarga lista para imprimir",
    texto:
      "Baja tu QR en PNG o SVG con la calidad que pide la imprenta, exactamente como lo dejaste configurado.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5M12 16.5L7.5 12M12 16.5V3"
        />
      </>
    ),
  },
];

const chats = ["Dueños de marca", "Restaurantes", "Agencias", "Eventos", "Peluquerías", "Notarías"];

const barras = [40, 65, 30, 80, 55, 70, 45, 90];

export default async function LandingPage() {
  const qrMock = await buildQRDataUrl(SHORT_MOCK);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-roboto text-gray-900">
      <div aria-hidden className="l-header-gradient absolute inset-x-0 top-0 h-[180px]" />

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between px-5 md:px-[5%]">
        <a href="#" className="text-xl font-bold text-gray-900">
          Pivot<span className="text-primary">QR</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#como-funciona" className="text-sm font-medium text-gray-700 hover:text-primary">
            Cómo funciona
          </a>
          <a href="#caracteristicas" className="text-sm font-medium text-gray-700 hover:text-primary">
            Características
          </a>
          <a href="#reporte" className="text-sm font-medium text-gray-700 hover:text-primary">
            El reporte
          </a>
        </nav>
        <LoginButton
          label="Iniciar sesión"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-x-0.5 hover:bg-brand-600"
        />
      </header>

      <main>
        <section className="relative flex flex-col items-center gap-10 px-4 pb-16 pt-14 md:pt-20">
          <div className="flex max-w-3xl flex-col items-center text-center">
            <p className="mb-6 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-theme-xs">
              Enlace corto · QR dinámico · métricas en una sola pantalla
            </p>
            <h1 className="text-4xl font-semibold uppercase leading-tight md:text-6xl md:leading-[70px]">
              Pega tu URL.
              <br />
              <span className="text-primary">Mide cada escaneo.</span>
            </h1>
            <p className="mt-6 max-w-xl text-center text-gray-600">
              Deja de saltar entre herramientas. PivotQR une el enlace corto, el
              código QR y las métricas de tu campaña, pensado para el dueño del
              negocio y no para el analista de datos.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <LoginButton
                label="Crear mi primer QR"
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              />
              <a
                href="#como-funciona"
                className="rounded-full border border-gray-300 bg-white/70 px-7 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          <div
            id="reporte"
            className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-xl md:p-6"
          >
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-gray-200" />
              <span className="h-3 w-3 rounded-full bg-gray-200" />
              <span className="h-3 w-3 rounded-full bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
              <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrMock}
                  alt="Ejemplo de código QR de PivotQR"
                  className="h-44 w-44"
                  width={176}
                  height={176}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-sm font-medium text-primary">{SHORT_MOCK}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
                    Activo · 1.284 escaneos
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-2xl font-bold text-gray-900">1.284</p>
                    <p className="text-xs text-gray-500">Escaneos totales</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-2xl font-bold text-success-600">+140</p>
                    <p className="text-xs text-gray-500">Hoy</p>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500">Escaneos por día</p>
                  <div className="flex h-16 items-end gap-1.5">
                    {barras.map((alto, i) => (
                      <div
                        key={i}
                        style={{ height: `${alto}%` }}
                        className={`flex-1 rounded-sm ${i === barras.length - 1 ? "bg-primary" : "bg-brand-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 px-6 py-10">
          <p className="text-sm text-gray-500">Hecho para</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {chats.map((c) => (
              <span
                key={c}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              De la URL al impacto en <span className="text-primary">3 pasos</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {pasos.map((paso, i) => (
              <div key={paso.titulo} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold">{paso.titulo}</h3>
                <p className="text-gray-600">{paso.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="caracteristicas" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <h3 className="text-lg font-medium text-primary">
              Pensado para quien reparte el QR
            </h3>
            <h2 className="text-3xl font-semibold md:text-4xl">Todo en un solo producto</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.titulo}
                className="flex flex-col items-start gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-sm transition hover:shadow-theme-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                  >
                    {f.icon}
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{f.titulo}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{f.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20 pt-6">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-brand-50 to-sky-50 px-8 py-12 text-center md:py-16">
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
              ¿Listo para saber si tu campaña funcionó?
            </h2>
            <p className="max-w-lg text-gray-600">
              Crea tu primer QR en menos de un minuto y mira el contador sumar en
              vivo con el primer escaneo.
            </p>
            <LoginButton
              label="Crear mi primer QR"
              className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            />
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center justify-between gap-8 border-t border-gray-200 px-6 py-10 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-xl font-bold text-gray-900">
            Pivot<span className="text-primary">QR</span>
          </p>
          <p className="max-w-xs text-center text-sm text-gray-500 md:text-left">
            Enlaces cortos y códigos QR dinámicos con métricas, para saber si tu
            campaña funcionó.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500 md:items-end">
          <a href="#como-funciona" className="transition hover:text-primary">
            Cómo funciona
          </a>
          <a href="#caracteristicas" className="transition hover:text-primary">
            Características
          </a>
          <LoginButton
            className="transition hover:text-primary"
            label="Iniciar sesión"
          />
        </div>
        <p className="text-xs text-gray-400">© 2026 PivotQR</p>
      </footer>

      <LoginModal />
    </div>
  );
}