require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busqueda = require("./models/busquedas");
const main = async() => {
    
    const busquedas = new Busqueda()
    let opc;

    do{
        opc = await inquirerMenu()

        switch (opc) {
            case 1:
                const termino = await leerInput('Ciudad: ')
                const lugares = await busquedas.ciudad(termino)
                const idSelected = await listarLugares(lugares)
                if(idSelected === 0) continue
                const lugarSelected = lugares.find(lugar=>lugar.id === idSelected)
                busquedas.agregarHistorial(lugarSelected.nombre)
                const weather = await busquedas.climaLugar(lugarSelected.lat, lugarSelected.lng)
                console.log(weather);
                console.log('\nInformación de la ciudad\n');
                console.log('Ciudad: ', lugarSelected.nombre);
                console.log('Lat: ', lugarSelected.lat);
                console.log('Lng: ', lugarSelected.lng);
                console.log('Temperatura: ', weather.temp);
                console.log('Mínimo: ', weather.min);
                console.log('Máximo: ', weather.max);
                console.log('Como esta el clima: ', weather.desc);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, index)=>{
                    const idx = `${index+1}. `.green
                    console.log(`${idx}${lugar}`);
                })
                break;
            default:
                break;
        }

        if(opc !== 0) await pausa()
    }while(opc !== 0)
}
main()