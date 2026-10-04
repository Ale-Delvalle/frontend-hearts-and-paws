import { FormularioAdopcionData } from '@/types/formularioadopcion';

export const obtenerCasoAdopcionId = async (casoId: string): Promise<string> => {
  try {
    console.log('📦 ID de mascota recibido en obtenerCasoAdopcionId:', casoId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/casos/idAdopcion/${casoId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text}`);
    }

    const data = await res.json();

    return data.casoAdopcionId || data.id || '';
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('No se pudo obtener el ID de CasoAdopcion: ' + error.message);
    }
    throw new Error('No se pudo obtener el ID de CasoAdopcion: error desconocido');
  }
};


export interface RespuestaAdopcion {
  message: string;
}

export const enviarSolicitudAdopcion = async (
  formData: FormularioAdopcionData,
  casoAdopcionId: string,
  token: string | null
): Promise<RespuestaAdopcion> => {
  try {
    const {
      tipoVivienda,
      integrantesFlia,
      hijos,
      hayOtrasMascotas,
      descripcionOtrasMascotas,
      cubrirGastos,
      darAlimentoCuidados,
      darAmorTiempoEj,
      devolucionDeMascota,
      siNoPodesCuidarla,
      declaracionFinal,
    } = formData;

    const body = {
      casoAdopcionId,
      tipoVivienda,
      integrantesFlia,
      hijos,
      hayOtrasMascotas,
      descripcionOtrasMascotas,
      cubrirGastos,
      darAlimentoCuidados,
      darAmorTiempoEj,
      devolucionDeMascota,
      siNoPodesCuidarla,
      declaracionFinal,
    };

    // Validación simple de campos obligatorios (excluye descripcionOtrasMascotas)
    for (const [key, value] of Object.entries(body)) {
      if (
        key !== 'descripcionOtrasMascotas' &&
        (value === '' || value === null || value === undefined)
      ) {
        throw new Error(`Campo obligatorio "${key}" está vacío`);
      }
    }

    // Construcción dinámica de headers y configuración
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      fetchOptions.credentials = 'omit'; 
    } else {
      fetchOptions.credentials = 'include';
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar`, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      if (errorData?.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error al enviar la solicitud: ' + error.message);
    }
    throw new Error('Error desconocido al enviar la solicitud');
  }
};
export interface ResumenSolicitud {
  casoAdopcionId: string
  mascotaId: string
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
}

export const obtenerMisSolicitudesResumen = async (
  token?: string
): Promise<ResumenSolicitud[]> => {
  const headers: Record<string, string> = {}
  const fetchOptions: RequestInit = { method: 'GET', headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    fetchOptions.credentials = 'omit'
  } else {
    fetchOptions.credentials = 'include'
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar/mis-solicitudes/ids`,
    fetchOptions
  )
  if (!res.ok) throw new Error('No se pudieron cargar tus solicitudes')
  return res.json()
}
