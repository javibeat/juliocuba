#!/usr/bin/env node
/**
 * Build script para Julio Cuba website
 * Inyecta el navbar desde includes/navbar.html en todos los HTML
 * 
 * Uso: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const NAVBAR_FILE = path.join(ROOT_DIR, 'includes', 'navbar.html');
const HTML_FILES = ['index.html', 'press.html', 'redes.html', 'video.html'];

// Marcadores para identificar el navbar
const NAVBAR_START = '<!-- NAVBAR_START -->';
const NAVBAR_END = '<!-- NAVBAR_END -->';

// Leer el contenido del navbar
function readNavbar() {
    try {
        const content = fs.readFileSync(NAVBAR_FILE, 'utf8').trim();
        return `${NAVBAR_START}\n    ${content}\n    ${NAVBAR_END}`;
    } catch (error) {
        console.error('❌ Error leyendo navbar:', error.message);
        process.exit(1);
    }
}

// Procesar un archivo HTML
function processHtmlFile(filename, navbarTemplate) {
    const filepath = path.join(ROOT_DIR, filename);

    try {
        let html = fs.readFileSync(filepath, 'utf8');

        // Detectar la página actual para marcar el enlace activo
        const pageName = filename.replace('.html', '');
        let navbar = navbarTemplate;

        // Añadir clase active y aria-current al enlace correspondiente
        navbar = navbar.replace(
            new RegExp(`(data-page="${pageName}")`),
            `$1 class="active" aria-current="page"`
        );

        let replaced = false;

        // 1. Buscar navbar con marcadores (ejecuciones posteriores)
        const markerRegex = new RegExp(`${NAVBAR_START}[\\s\\S]*?${NAVBAR_END}`, 'g');
        if (markerRegex.test(html)) {
            html = html.replace(markerRegex, navbar);
            replaced = true;
        }

        // 2. Buscar placeholder simple
        if (!replaced && html.includes('<!-- NAVBAR -->')) {
            html = html.replace('<!-- NAVBAR -->', navbar);
            replaced = true;
        }

        // 3. Buscar navbar existente sin marcadores (primera migración)
        if (!replaced) {
            const navRegex = /<nav class="navbar"[\s\S]*?<\/nav>/g;
            if (navRegex.test(html)) {
                html = html.replace(navRegex, navbar);
                replaced = true;
            }
        }

        if (!replaced) {
            console.log(`⚠️  ${filename}: No contiene navbar ni placeholder`);
            return false;
        }

        fs.writeFileSync(filepath, html, 'utf8');
        console.log(`✅ ${filename}: Navbar inyectado correctamente`);
        return true;

    } catch (error) {
        console.error(`❌ ${filename}: Error - ${error.message}`);
        return false;
    }
}

// Main
function main() {
    console.log('\n🔧 Build: Inyectando navbar en archivos HTML...\n');

    const navbarContent = readNavbar();
    let successCount = 0;

    for (const file of HTML_FILES) {
        if (processHtmlFile(file, navbarContent)) {
            successCount++;
        }
    }

    console.log(`\n📦 Build completado: ${successCount}/${HTML_FILES.length} archivos procesados\n`);

    if (successCount !== HTML_FILES.length) {
        process.exit(1);
    }
}

main();
