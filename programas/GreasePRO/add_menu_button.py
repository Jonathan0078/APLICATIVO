
#!/usr/bin/env python3
import os
import re

def add_menu_button_to_calculators():
    """Adiciona o botão do menu a todas as calculadoras HTML"""
    
    # Diretório das calculadoras
    calc_dir = "."
    
    # CSS e JS para adicionar
    css_links = '''    <link rel="stylesheet" href="css/menu-button.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">'''
    
    js_script = '''    <script src="js/menu-button.js"></script>'''
    
    # Lista de arquivos HTML das calculadoras
    calc_files = [
        "Calculadora2v.html",
        "CalculadoraDFAACP.html", 
        "CalculadoraFM.html",
        "CalculadoraFRMT.html",
        "CalculadoraFT.html",
        "CalculadoraGq.html",
        "CalculadoraH.html",
        "CalculadoraIV.html",
        "CalculadoraVAE.html",
        "CalculadoraVGR.html",
        "CalculdoraFT.html"  # Incluindo arquivo com nome alternativo
    ]
    
    for filename in calc_files:
        filepath = os.path.join(calc_dir, filename)
        
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Verifica se já tem o botão do menu
            if 'menu-button.css' in content:
                print(f"✓ {filename} já possui o botão do menu")
                continue
            
            # Adiciona CSS após style.css
            css_pattern = r'(\s*<link rel="stylesheet" href="css/style\.css">)'
            if re.search(css_pattern, content):
                content = re.sub(css_pattern, r'\1' + '\n' + css_links, content)
            
            # Adiciona JS antes do fechamento do body
            js_pattern = r'(\s*</body>)'
            if re.search(js_pattern, content):
                content = re.sub(js_pattern, '\n' + js_script + r'\1', content)
            
            # Salva o arquivo modificado
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            
            print(f"✓ Botão do menu adicionado em {filename}")
        else:
            print(f"✗ Arquivo não encontrado: {filename}")

if __name__ == "__main__":
    add_menu_button_to_calculators()
    print("\n🎉 Processo concluído! Botão do menu adicionado a todas as calculadoras.")
