# hpclab-ui-frontend

Paso 0: Instalar nodejs

    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

Paso 1: Clonar el repositorio en la carpeta raíz del servidor web

    git clone git@github.com:IngenieriaDeSistemasUTB/hpclabUIbackend.git gridui

Paso 2: instalar nodejs y npm

    sudo apt install npm

Si estás en Ubuntu, ejecuta el siguiente comando para seleccionar node como alias a nodejs en todo el sistema

    sudo update-alternatives --install /usr/bin/node nodejs /usr/bin/nodejs 100

Paso 3: se instalan los componentes Bower, Gulp y Stylus para manejo de dependencias

    sudo npm install -g bower
    sudo npm install -g gulp
    sudo npm install -g stylus

Paso 4: Se instalan los componentes y librerías desde bower a la carpeta gridui descargada.

    bower install
    npm install

Paso 6 (opcional): Visualización para desarrollo

    gulp
