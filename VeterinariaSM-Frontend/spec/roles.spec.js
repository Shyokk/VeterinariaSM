import { ACCESO, ROLES, esClinico, esPersonal, puedeAcceder } from '../src/utils/roles.js';

describe('Control de acceso por rol (frontend)', () => {
  it('el administrador accede a la administración; los demás no', () => {
    expect(puedeAcceder('/usuarios', ROLES.ADMIN)).toBeTrue();
    expect(puedeAcceder('/usuarios', ROLES.RECEPCION)).toBeFalse();
    expect(puedeAcceder('/usuarios', ROLES.VETERINARIO)).toBeFalse();
    expect(puedeAcceder('/usuarios', ROLES.DUENO)).toBeFalse();
  });

  it('el dueño solo ve sus mascotas, citas y perfil', () => {
    expect(puedeAcceder('/mis-mascotas', ROLES.DUENO)).toBeTrue();
    expect(puedeAcceder('/agendar', ROLES.DUENO)).toBeTrue();
    expect(puedeAcceder('/perfil', ROLES.DUENO)).toBeTrue();
    expect(puedeAcceder('/pacientes', ROLES.DUENO)).toBeFalse();
    expect(puedeAcceder('/historial', ROLES.DUENO)).toBeFalse();
    expect(puedeAcceder('/reportes', ROLES.DUENO)).toBeFalse();
  });

  it('la recepción gestiona pacientes y reportes pero no escribe en la ficha clínica', () => {
    expect(puedeAcceder('/pacientes', ROLES.RECEPCION)).toBeTrue();
    expect(puedeAcceder('/reportes', ROLES.RECEPCION)).toBeTrue();
    expect(puedeAcceder('/nueva-vacuna', ROLES.RECEPCION)).toBeFalse();
  });

  it('el veterinario escribe en la ficha clínica', () => {
    ['/nueva-vacuna', '/nueva-receta', '/nuevo-diagnostico', '/nuevo-examen'].forEach((ruta) => {
      expect(puedeAcceder(ruta, ROLES.VETERINARIO)).toBeTrue();
    });
    expect(puedeAcceder('/gestion', ROLES.VETERINARIO)).toBeFalse();
  });

  it('sin rol no se accede a rutas protegidas, pero sí a las públicas', () => {
    expect(puedeAcceder('/perfil', null)).toBeFalse();
    expect(puedeAcceder('/nosotros', null)).toBeTrue();
    expect(puedeAcceder('/login', undefined)).toBeTrue();
  });

  it('todas las rutas protegidas definen al menos un rol', () => {
    Object.entries(ACCESO).forEach(([, roles]) => expect(roles.length).toBeGreaterThan(0));
  });

  it('clasifica personal y personal clínico', () => {
    expect(esPersonal(ROLES.DUENO)).toBeFalse();
    expect(esPersonal(ROLES.RECEPCION)).toBeTrue();
    expect(esClinico(ROLES.RECEPCION)).toBeFalse();
    expect(esClinico(ROLES.VETERINARIO)).toBeTrue();
  });
});
