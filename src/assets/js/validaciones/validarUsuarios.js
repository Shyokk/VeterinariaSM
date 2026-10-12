document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener la sesión activa de localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    // 2. Si no hay usuario en sesión, redirigir al login
    if (!usuarioActivo) {
        alert('Debe iniciar sesión para ver sus datos.');
        window.location.href = 'login.html';
        return;
    }

    // 3. Mapeo de nombres descriptivos para cada rol
    const rolesMap = {
        'tutor': 'Tutor / Dueño de Mascota',
        'recepcionista': 'Recepcionista',
        'veterinario': 'Veterinario / Personal Médico',
        'administrador': 'Administrador del Sistema'
    };

    // 4. Renderizar datos en pantalla
    document.getElementById('user-rut').textContent = usuarioActivo.rut || 'No especificado';
    document.getElementById('user-nombre').textContent = usuarioActivo.nombre || `${usuarioActivo.nombres || ''} ${usuarioActivo.apellidos || ''}`.trim() || 'Sin Nombre';
    document.getElementById('user-correo').textContent = usuarioActivo.correo || 'No especificado';
    document.getElementById('user-telefono').textContent = usuarioActivo.telefono || 'No especificado';
    
    const rolClave = (usuarioActivo.rol || 'tutor').toLowerCase();
    document.getElementById('user-rol').textContent = rolesMap[rolClave] || usuarioActivo.rol;

    // 5. Botón para cerrar sesión
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            // Eliminar la sesión activa pero conservar la lista de usuarios guardados
            localStorage.removeItem('usuarioActivo');
            alert('Sesión cerrada correctamente.');
            window.location.href = 'login.html';
        });
    }
});