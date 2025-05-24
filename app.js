document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarLinks = document.querySelectorAll('#sidebar a');

    // Lógica para el formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previene el envío por defecto del formulario

            formStatus.textContent = 'Enviando mensaje...';
            formStatus.classList.remove('text-green-500', 'text-red-500');
            formStatus.classList.add('text-blue-400'); // Color mientras se envía

            const formData = new FormData(contactForm);

            try {
                // Envía los datos del formulario a Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Importante para recibir una respuesta JSON
                    }
                });

                if (response.ok) {
                    formStatus.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
                    formStatus.classList.remove('text-blue-400');
                    formStatus.classList.add('text-green-500'); // Éxito
                    contactForm.reset(); // Limpia el formulario
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatus.textContent = 'Error al enviar el mensaje: ' + data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
                    }
                    formStatus.classList.remove('text-blue-400');
                    formStatus.classList.add('text-red-500'); // Error
                }
            } catch (error) {
                console.error('Error de red o al procesar la solicitud:', error);
                formStatus.textContent = 'Hubo un problema de conexión. Por favor, inténtalo más tarde.';
                formStatus.classList.remove('text-blue-400');
                formStatus.classList.add('text-red-500'); // Error de conexión
            }
        });
    }

    // Lógica para el menú lateral (sidebar)
    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Evita el scroll del cuerpo cuando el sidebar está abierto
    };

    // Asegurarse de que el sidebar esté oculto al cargar la página
    // Esto es crucial para evitar que se vea antes de que el CSS/JS actúe
    // y para resetear el estado si el navegador lo guarda.
    // Lo movemos aquí para que se ejecute una vez que el DOM esté listo.
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('overflow-hidden');


    openSidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar); // Cierra el sidebar al hacer clic en el overlay

    // Cierra el sidebar al hacer clic en un enlace de navegación
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });

    // Opcional: Implementar scroll suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajusta el scroll para que el elemento quede un poco más abajo del top
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80; // 80px de margen superior
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
