// Variáveis Globais de Estado
let furosOmitidos = new Set();
let ultimoN = 0;
let ultimoDP = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Setup Theme Switcher
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    const inputs = document.querySelectorAll('.calc-input');
    
    // Desenha canvas vazio ao carregar
    desenharGrafico(0, 0, 0, 0, 0, []);

    function calcularFuracao() {
        const n = parseInt(document.getElementById('input-furos').value);
        const dp = parseFloat(document.getElementById('input-diametro').value);
        
        // Variáveis secundárias
        let de = parseFloat(document.getElementById('input-ext').value) || 0;
        let angIni = parseFloat(document.getElementById('input-angulo-inicial').value) || 0;
        let angTot = parseFloat(document.getElementById('input-angulo-total').value) || 360;
        let dfuro = parseFloat(document.getElementById('input-dfuro').value) || 0;
        let dbore = parseFloat(document.getElementById('input-furo-central').value) || 0;

        // Validação Básica
        if (isNaN(n) || isNaN(dp) || n < 2 || dp <= 0) {
            resetarResultados();
            desenharGrafico(0, 0, 0, 0, 0, []);
            document.getElementById('alertas-container').style.display = 'none';
            return;
        }

        // Limpa os omitidos se a base principal (N ou DP) for alterada
        if (n !== ultimoN || dp !== ultimoDP) {
            furosOmitidos.clear();
            ultimoN = n;
            ultimoDP = dp;
        }

        if(angTot > 360) angTot = 360;

        // 1. Passo Angular e Corda
        const passoAngularDeg = (angTot === 360) ? (360 / n) : (angTot / (n - 1));
        const passoAngularRad = passoAngularDeg * (Math.PI / 180);
        const corda = dp * Math.sin(passoAngularRad / 2);

        document.getElementById('res-corda').innerHTML = `${corda.toFixed(3).replace('.', ',')} <span style="font-size: 1rem; font-weight: 500; color: var(--text-secondary);">mm</span>`;
        document.getElementById('res-angulo').textContent = `${passoAngularDeg.toFixed(2).replace('.', ',')}°`;

        // 2. Análise de Parede (Alertas)
        let alertasHTML = '';
        if (dfuro > 0) {
            // Entre Furos
            let distFuros = corda - dfuro;
            if (distFuros <= 0) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-triangle-exclamation"></i> ${i18n.t('casillas.alert_overlap')}</div>`;
            else if (distFuros <= 2) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-circle-exclamation"></i> ${i18n.t('casillas.alert_thin_wall')} ${distFuros.toFixed(1)}mm</div>`;

            // Peça Externa
            if (de > 0) {
                let paredeExt = (de - dp - dfuro) / 2;
                if (paredeExt < 0) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-triangle-exclamation"></i> ${i18n.t('casillas.alert_break_outer')}</div>`;
                else if (paredeExt <= 2) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-circle-exclamation"></i> ${i18n.t('casillas.alert_thin_outer')} ${paredeExt.toFixed(1)}mm</div>`;
            }

            // Furo Central
            if (dbore > 0) {
                let paredeInt = (dp - dbore - dfuro) / 2;
                if (paredeInt < 0) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-triangle-exclamation"></i> ${i18n.t('casillas.alert_cross_center')}</div>`;
                else if (paredeInt <= 2) alertasHTML += `<div class="alerta-item"><i class="fa-solid fa-circle-exclamation"></i> ${i18n.t('casillas.alert_thin_inner')} ${paredeInt.toFixed(1)}mm</div>`;
            }
        }
        const alertContainer = document.getElementById('alertas-container');
        alertContainer.innerHTML = alertasHTML;
        alertContainer.style.display = alertasHTML !== '' ? 'flex' : 'none';

        // 3. Tabela de Coordenadas (X, Y)
        const raio = dp / 2;
        let linhasTabela = '';
        let pontosGrafico = [];

        for (let i = 0; i < n; i++) {
            const anguloAtualDeg = angIni + (i * passoAngularDeg);
            const anguloAtualRad = anguloAtualDeg * (Math.PI / 180);
            
            let x = raio * Math.sin(anguloAtualRad);
            let y = raio * Math.cos(anguloAtualRad);

            if (Math.abs(x) < 0.0001) x = 0;
            if (Math.abs(y) < 0.0001) y = 0;

            let anguloExibicao = anguloAtualDeg % 360; 
            if (anguloExibicao < 0) anguloExibicao += 360;

            const isOmitido = furosOmitidos.has(i);
            pontosGrafico.push({ x: x, y: y, num: i + 1, ang: anguloExibicao, omitido: isOmitido });

            linhasTabela += `
                <tr class="${isOmitido ? 'linha-omitida' : ''}">
                    <td><input type="checkbox" class="check-omitir" ${isOmitido ? '' : 'checked'} onchange="window.toggleFuro(${i})" title="${i18n.t('casillas.omit_hole')}"></td>
                    <td><strong>${i + 1}</strong></td>
                    <td>${anguloExibicao.toFixed(2).replace('.', ',')}°</td>
                    <td>${x.toFixed(3).replace('.', ',')}</td>
                    <td>${y.toFixed(3).replace('.', ',')}</td>
                </tr>
            `;
        }

        document.getElementById('tabela-coordenadas-body').innerHTML = linhasTabela;

        // 4. Gráfico
        if(de < dp) de = dp * 1.3; // Escala visual se DE não fornecido
        desenharGrafico(dp, de, dbore, dfuro, raio, pontosGrafico);
    }

    // Ativa o cálculo instantâneo
    inputs.forEach(input => input.addEventListener('input', calcularFuracao));
    
    // Expor função manual para o recálculo via checkbox
    window.forcarRecalculo = calcularFuracao;
});

// Função Global para Checkbox de Omitir
window.toggleFuro = function(index) {
    if (furosOmitidos.has(index)) {
        furosOmitidos.delete(index);
    } else {
        furosOmitidos.add(index);
    }
    window.forcarRecalculo(); // Atualiza tabela e gráfico
}

function desenharGrafico(dp, de, dbore, dfuro, raioPrimitivo, pontos) {
    const canvas = document.getElementById('flange-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const center = w / 2;

    ctx.clearRect(0, 0, w, h);
    if (dp <= 0) return;

    const maxD = de > dp ? de : dp;
    const scale = (w * 0.80) / maxD; // Deixa 20% de margem para os textos de grau

    const isDark = document.body.classList.contains('dark-theme');
    const colorAxis = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const colorFlange = isDark ? '#8696a7' : '#6c757d';
    const colorPitch = isDark ? '#3b82f6' : '#2563eb'; 
    const colorHole = isDark ? '#ffc107' : '#dc3545';
    const colorOmitted = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    const colorText = isDark ? '#e9ecef' : '#212529';
    const colorAngleLine = isDark ? 'rgba(255, 193, 7, 0.4)' : 'rgba(220, 53, 69, 0.4)';

    ctx.save();
    ctx.translate(center, center);

    // 1. Eixos X e Y Universais
    ctx.strokeStyle = colorAxis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-center, 0); ctx.lineTo(center, 0);
    ctx.moveTo(0, -center); ctx.lineTo(0, center);
    ctx.stroke();

    // 2. Círculo Externo (Flange)
    if (de > 0) {
        ctx.strokeStyle = colorFlange;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, (de / 2) * scale, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // 3. Furo Central (Bore)
    if (dbore > 0) {
        ctx.strokeStyle = colorFlange;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, (dbore / 2) * scale, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Preenchimento leve para o furo central
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)';
        ctx.fill();
    }

    // 4. Círculo Primitivo
    ctx.strokeStyle = colorPitch;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, (dp / 2) * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); 

    // Raio de desenho do furo
    const holeDrawRadius = (dfuro > 0) ? (dfuro / 2) * scale : 6;

    // 5. Linhas de Ângulo e Furos
    pontos.forEach(p => {
        const px = p.x * scale;
        const py = -p.y * scale; // Inverte Y no canvas
        const angleRad = Math.atan2(py, px);

        if (p.omitido) {
            // Desenha um "X" e ignora a linha de cota
            ctx.strokeStyle = colorOmitted;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px - 6, py - 6); ctx.lineTo(px + 6, py + 6);
            ctx.moveTo(px + 6, py - 6); ctx.lineTo(px - 6, py + 6);
            ctx.stroke();
            return; 
        }

        // Desenha linha indicadora de ângulo (do centro até pouco além do furo)
        ctx.strokeStyle = colorAngleLine;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0); 
        // Linha vai 20px além do primitivo
        ctx.lineTo(px + Math.cos(angleRad)*20, py + Math.sin(angleRad)*20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Desenha o Furo
        ctx.fillStyle = colorHole;
        ctx.beginPath();
        ctx.arc(px, py, holeDrawRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = isDark ? '#112233' : '#ffffff'; // Contorno
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Desenha os Textos (Nº do furo e Graus)
        ctx.fillStyle = colorText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Posição do texto mais afastada para não embolar
        const distOffset = holeDrawRadius + 20; 
        const tx = px + Math.cos(angleRad) * distOffset;
        const ty = py + Math.sin(angleRad) * distOffset;

        // Círculo de fundo para o número ficar legível se sobrepor algo
        ctx.fillStyle = isDark ? '#0a1929' : '#ffffff';
        ctx.beginPath();
        ctx.arc(tx, ty, 12, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = colorText;
        ctx.font = 'bold 14px "Segoe UI", sans-serif';
        ctx.fillText(p.num, tx, ty - 8);
        
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.fillStyle = isDark ? '#8696a7' : '#6c757d';
        ctx.fillText(`${p.ang.toFixed(1)}°`, tx, ty + 8);
    });

    ctx.restore();
}

function resetarResultados() {
    document.getElementById('res-corda').innerHTML = `0,000 <span style="font-size: 1rem; font-weight: 500; color: var(--text-secondary);">mm</span>`;
    document.getElementById('res-angulo').textContent = "0,00°";
    document.getElementById('tabela-coordenadas-body').innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 2rem;">${i18n.t('casillas.insert_data')}</td></tr>`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    window.forcarRecalculo(); // Redesenha gráfico
}

function copiarTabela() {
    const tabela = document.getElementById('tabela-coord');
    let textoArea = '';
    
    for(let i = 0; i < tabela.rows.length; i++) {
        let row = tabela.rows[i];
        // Pula a linha se for a de instrução vazia
        if(row.cells.length < 5) continue;
        
        // Ignora a coluna do checkbox na cópia (index 0)
        let rowData = [];
        for(let j = 1; j < row.cells.length; j++) {
            rowData.push(row.cells[j].innerText);
        }
        textoArea += rowData.join('\t') + '\n';
    }

    navigator.clipboard.writeText(textoArea).then(() => {
        const btn = document.querySelector('.btn-outline');
        const htmlOriginal = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${i18n.t('casillas.copied')}`;
        btn.style.color = 'var(--cor-sucesso)';
        btn.style.borderColor = 'var(--cor-sucesso)';
        setTimeout(() => {
            btn.innerHTML = htmlOriginal;
            btn.style = '';
        }, 2000);
    }).catch(err => {
        alert(i18n.t('casillas.copy_error'));
    });
}
