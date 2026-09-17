// src/services/ongLogin.ts

export const ongLoginService = async (email: string, contrasena: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/organizaciones/ingreso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, contrasena }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        mensaje:
          data?.message ||
          "Credenciales incorrectas. Verifique que el email ingresado corresponde al tipo de cuenta de ONG.",
      };
    }

    if (data && data.organizacion) {
      return { ok: true, ong: data.organizacion };
    } else {
      return { ok: false, mensaje: "Datos inválidos" };
    }
  } catch {
    return { ok: false, mensaje: "Error de red o servidor" };
  }
};
