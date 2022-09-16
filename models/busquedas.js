const axios = require('axios')
const fs = require('fs')

class Busqueda{

    historial = []
    dbPath = './db/database.json'

    constructor(){
        this.leerDB()
    }

    get paramsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'access_token':process.env.OPENWEATHER_KEY,
            'appid':'f46ebf8af10665407105843aa90ed2cb',
            'units':'metric',
            'lang':'es',
        }
    }

    get historialCapitalizado(){
        return this.historial.map(hist=>{
            let palabras = hist.split(' ')
            palabras = palabras.map(p=>p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })
    }

    async ciudad( lugar = ''){
        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            const resp = await instance.get()
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        }catch(error){
            return []
        }
    }

    async climaLugar(lat, lon){
        try{
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            })
            const resp = await instance.get()
            const {weather, main} = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            }
        }catch(error){
            return []
        }
    }

    agregarHistorial = ( lugar = '' ) => {
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return
        }
        this.historial = this.historial.splice(0,4)
        this.historial.unshift(lugar.toLocaleLowerCase())
        this.guardarDB()
    }

    guardarDB = () => {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB = () => {
        if(fs.existsSync(this.dbPath)){
            const info = JSON.parse(fs.readFileSync(this.dbPath,{encoding: 'utf-8'}))
            this.historial = [...info.historial]
        }
    }
}

module.exports = Busqueda