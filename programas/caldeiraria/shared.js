function formatLength(v) {
    var unit = localStorage.getItem('trig-unit') || 'mm';
    var val = unit === 'in' ? v / 25.4 : v;
    return val.toFixed(2) + ' ' + (unit === 'in' ? 'in' : 'mm');
}

function formatAngle(v) {
    return v.toFixed(2) + '°';
}

function formatArea(v) {
    var unit = localStorage.getItem('trig-unit') || 'mm';
    var val = unit === 'in' ? v / (25.4 * 25.4) : v;
    return val.toFixed(2) + ' ' + (unit === 'in' ? 'in²' : 'mm²');
}

function initTheme() {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
    }
    var cb = document.getElementById('themeToggle') || document.getElementById('theme-toggle-checkbox') || document.getElementById('theme-toggle');
    if (cb) {
        cb.checked = saved === 'dark';
        cb.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

/* ==========================================================================
   GERADOR GLOBAL DE VETORES DXF (Módulo de Exportação CAD)
   ========================================================================== */
window.exportDXF = function(filename, lines, arcs, circles) {
    var l = ['0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC',
             '0','SECTION','2','TABLES','0','TABLE','2','LTYPE','0','LTYPE','2','CONTINUOUS',
             '70','64','3','','72','65','73','0','40','0.0','0','ENDTAB',
             '0','TABLE','2','LAYER','70','2','0','LAYER','2','0','70','64','62','7','6','CONTINUOUS',
             '0','ENDTAB','0','ENDSEC','0','SECTION','2','ENTITIES'];
    for (var i = 0; i < (lines||[]).length; i++) {
        var ln = lines[i];
        l.push('0','LINE','8','0','10',ln.x1.toFixed(4),'20',ln.y1.toFixed(4),'11',ln.x2.toFixed(4),'21',ln.y2.toFixed(4));
    }
    for (var i = 0; i < (arcs||[]).length; i++) {
        var a = arcs[i];
        l.push('0','ARC','8','0','10',a.cx.toFixed(4),'20',a.cy.toFixed(4),'40',a.r.toFixed(4),'50',a.startAngle || a.sa,'51',a.endAngle || a.ea);
    }
    for (var i = 0; i < (circles||[]).length; i++) {
        var c = circles[i];
        l.push('0','CIRCLE','8','0','10',c.cx.toFixed(4),'20',c.cy.toFixed(4),'40',c.r.toFixed(4));
    }
    l.push('0','ENDSEC','0','EOF');
    var content = l.join('\r\n');
    var blob = new Blob([content], {type:'application/dxf'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
