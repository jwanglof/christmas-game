import shutil
import subprocess

from css_html_js_minify import process_single_html_file, process_single_css_file

if __name__ == '__main__':
    shutil.rmtree('./public')
    shutil.copytree('./src', './public')

    process_single_html_file('./public/index.html', overwrite=True)
    process_single_css_file('./public/css/custom.css', overwrite=True)

    subprocess.run(['firebase', 'deploy'])
