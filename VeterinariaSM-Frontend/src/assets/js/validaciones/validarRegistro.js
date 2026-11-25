const CLAVE_CLINICA_CORRECTA = "SANMARCOS2026"; 

document.addEventListener('DOMContentLoaded', () => {
    const selectorRol = document.getElementById('tipo-usuario');
    const campoClave = document.getElementById('campo-clave-clinica');
    const inputClave = document.getElementById('clave-institucional');
    const formulario = document.getElementById('form-registro-tutor');

    if (selectorRol && campoClave) {
        campoClave.style.display = 'none';

        selectorRol.addEventListener('change', (e) => {
            if (e.target.value === 'veterinario') {
                campoClave.style.display = 'block';
                inputClave.setAttribute('required', 'true');
            } else {
                campoClave.style.display = 'none';
                inputClave.removeAttribute('required');
                inputClave.value = '';
            }
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            if (selectorRol.value === 'veterinario') {
                if (inputClave.value !== CLAVE_CLINICA_CORRECTA) {
                    e.preventDefault();
                    alert('La clave de activación clínica es incorrecta.');
                    return;
                }
            }
            localStorage.setItem('usuarioRol', selectorRol.value);
        });
    }
});