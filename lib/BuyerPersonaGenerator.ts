import Papa, { ParseResult } from 'papaparse'
import clustering from 'density-clustering'

export interface dataRow {
    [header: string]: string | number
}

export interface attributeNumber {
    mean: number
    sdev: number
    min: number
    max: number
}

export type attributeType = [string, number]

export interface attributeBuyerPersonaData {
    [attribute: string]: attributeNumber | attributeType[] | number
}

export interface BuyerPersonaGeneratorOptions {
    separator?: string
    limitValuesPerHeader: number
    neighborhoodRadius: number
    minPointsPerCluster: number
    independizeFieldOptions?: boolean
}

/**
 * Representa un archivo CSV y proporciona métodos para leer y reformatear los datos.
 */
class BuyerPersonaGenerator {
    readonly separator: string
    _data: dataRow[]
    _parsedData: number[][]
    clusterizedData: dataRow[]
    _headers: { [header: string]: [string] }
    limitValuesPerHeader: number
    _maximumValuePerHeader: { [header: string]: number }
    _minimumValuePerHeader: { [header: string]: number }
    neighborhoodRadius: number
    minPointsPerCluster: number
    optics: any
    _clusters: number[][]
    buyerPersonaData: attributeBuyerPersonaData[] | []
    independizeFieldOptions: boolean

    /**
     * Crea una instancia de CSVFile.
     * @param {BuyerPersonaGeneratorOptions} options - Objeto que contiene las opciones para configurar el generador de Buyer Persona.
     */
    constructor(options: BuyerPersonaGeneratorOptions) {
        this.separator = options.separator ?? ','
        this._data = []
        this._parsedData = []
        this._clusters = []
        this._headers = {}
        this._maximumValuePerHeader = {}
        this._minimumValuePerHeader = {}
        this.limitValuesPerHeader = options.limitValuesPerHeader
        this.neighborhoodRadius = options.neighborhoodRadius
        this.minPointsPerCluster = options.minPointsPerCluster
        this.clusterizedData = []
        this.buyerPersonaData = []
        this.independizeFieldOptions = options.independizeFieldOptions ?? false
    }

    /**
     * Reformatea los datos del archivo CSV para que se puedan utilizar en análisis numérico.
     * @returns {Promise<BuyerPersonaGenerator>} - Una promesa que resuelve con la instancia actual de CSVFile después de reformatear los datos.
     */
    async _normalizeData(): Promise<this> {
        this._data.forEach((row) => {
            const arrayRow: number[] = []
            Object.keys(row).forEach((header) => {
                //Si es un valor numérico el header no se encuentra en el objeto this.headers
                if (this._headers[header] === undefined) {
                    //Normalizo los valores numéricos para que se encuentren de 0 a 1
                    const value: number =
                        (parseFloat(row[header].toString()) - this._minimumValuePerHeader[header]) /
                        (this._maximumValuePerHeader[header] - this._minimumValuePerHeader[header])
                    arrayRow.push(value)
                    return
                }

                //El valor no es numérico pero se debe verificar que la cantidad de variables unicos de esa columna son menores la maixmo permitido
                if (this._headers[header].length > this.limitValuesPerHeader) return

                // Creo n dimensiones para n posibles opciones de un campo donde cada valor puede ser 0 o 1 (Ej: es o no hombre o mujer)
                if (this.independizeFieldOptions) {
                    this._headers[header].forEach((uniqueHeaderValue) => {
                        arrayRow.push(row[header] === uniqueHeaderValue ? 1 : 0)
                    })
                    return
                }

                //Si no está activada la opción de independizar variables utilizo una sola dimensión y almaceno el id de ese header
                else {
                    let idHeaderValue: number = this._headers[header].indexOf(row[header].toString())

                    //Mapeo los valores del 0 al 1
                    if (this._headers[header].length > 1) {
                        arrayRow.push(idHeaderValue / (this._headers[header].length - 1))
                    } else {
                        //Si hay una sola opción directamente guardo 1
                        arrayRow.push(1)
                    }
                }
            })

            //Guardo en parsedData el array de la nueva fila
            this._parsedData.push(arrayRow)
        })
        return this
    }

    /**
     * Lee el archivo CSV y guarda los datos en la propiedad 'data'.
     * @returns {Promise<BuyerPersonaGenerator>} - Una promesa que resuelve con la instancia actual de CSVFile después de leer el archivo CSV.
     */
    async loadCSVFromFile(file: File): Promise<this> {
        const processRow = (value: string, header: string) => {
            const number = parseFloat(value)
            if (!isNaN(number)) {
                //Al ser un número entro al objeto maximumValuePerHeader y veo si es mayor que el maximo, si lo es cambio el maximo
                //Como no existe esa columna la creo con su respectivo primer maximo
                if (!this._maximumValuePerHeader[header]) {
                    this._maximumValuePerHeader[header] = number
                }

                //Si existe la columna comparo los valores y si el valor nuevo es mayor se lo asigno al key del objeto maximumValuePerHeader
                else if (this._maximumValuePerHeader[header] < Math.abs(number)) {
                    this._maximumValuePerHeader[header] = Math.abs(number)
                }

                if (!this._minimumValuePerHeader[header]) {
                    this._minimumValuePerHeader[header] = number
                }

                //Si existe la columna comparo los valores y si el valor nuevo es mayor se lo asigno al key del objeto maximumValuePerHeader
                else if (this._minimumValuePerHeader[header] > Math.abs(number)) {
                    this._minimumValuePerHeader[header] = Math.abs(number)
                }

                return number
            }
            if (!this._headers[header]) {
                this._headers[header] = [value]
            } else if (this._headers[header].indexOf(value) === -1) {
                this._headers[header].push(value)
            }
            return value
        }

        Papa.parse(file, {
            delimiter: this.separator,
            transform: processRow,
            header: true,
            complete: (results: ParseResult<dataRow>) => {
                if (typeof results.data === typeof this._data) {
                    this._data = results.data
                }
            },
        })

        //Verifico si hay alguna columna que contenga tanto numeros como texto
        const columnsWithNumbersAndText: string[] = []
        Object.keys(this._headers).forEach((header) => {
            if (header in this._maximumValuePerHeader) {
                columnsWithNumbersAndText.push(header)
            }
        })

        //Si esto es el caso agrego los valores faltantes a headers y elimino el key de maximum value
        columnsWithNumbersAndText.forEach((columnWithNumbersAndText) => {
            //Elimino el key de maximum value
            delete this._maximumValuePerHeader[columnWithNumbersAndText]
            delete this._minimumValuePerHeader[columnWithNumbersAndText]

            //Agrego los valores faltantes al headers
            this._data.forEach((entry) => {
                const value = entry[columnWithNumbersAndText].toString()

                //transformo en string el dato
                entry[columnWithNumbersAndText] = value

                if (this._headers[columnWithNumbersAndText].indexOf(value) === -1) {
                    this._headers[columnWithNumbersAndText].push(value)
                }
            })
        })

        return this
    }

    /**
     * Lee el archivo CSV y guarda los datos en la propiedad 'data'.
     * @returns {Promise<BuyerPersonaGenerator>} - Una promesa que resuelve con la instancia actual de CSVFile después de leer el archivo CSV.
     */
    async loadCSVFromJSON(jsonFile: dataRow[]): Promise<this> {
        const processRow = (value: string | number, header: string) => {
            if (typeof value === 'number') {
                //Al ser un número entro al objeto maximumValuePerHeader y veo si es mayor que el maximo, si lo es cambio el maximo
                //Como no existe esa columna la creo con su respectivo primer maximo
                if (!this._maximumValuePerHeader[header]) {
                    this._maximumValuePerHeader[header] = value
                }

                //Si existe la columna comparo los valores y si el valor nuevo es mayor se lo asigno al key del objeto maximumValuePerHeader
                else if (this._maximumValuePerHeader[header] < Math.abs(value)) {
                    this._maximumValuePerHeader[header] = Math.abs(value)
                }

                if (!this._minimumValuePerHeader[header]) {
                    this._minimumValuePerHeader[header] = value
                }

                //Si existe la columna comparo los valores y si el valor nuevo es mayor se lo asigno al key del objeto maximumValuePerHeader
                else if (this._minimumValuePerHeader[header] > Math.abs(value)) {
                    this._minimumValuePerHeader[header] = Math.abs(value)
                }

                return value
            }
            if (!this._headers[header]) {
                this._headers[header] = [value]
            } else if (this._headers[header].indexOf(value) === -1) {
                this._headers[header].push(value)
            }
            return value
        }

        this._data = jsonFile

        jsonFile.forEach((entry) => {
            Object.keys(entry).forEach((key) => {
                processRow(entry[key], key)
            })
        })

        //Verifico si hay alguna columna que contenga tanto numeros como texto
        const columnsWithNumbersAndText: string[] = []
        Object.keys(this._headers).forEach((header) => {
            if (header in this._maximumValuePerHeader) {
                columnsWithNumbersAndText.push(header)
            }
        })

        //Si esto es el caso agrego los valores faltantes a headers y elimino el key de maximum value
        columnsWithNumbersAndText.forEach((columnWithNumbersAndText) => {
            //Elimino el key de maximum value
            delete this._maximumValuePerHeader[columnWithNumbersAndText]
            delete this._minimumValuePerHeader[columnWithNumbersAndText]

            //Agrego los valores faltantes al headers
            this._data.forEach((entry) => {
                const value = entry[columnWithNumbersAndText].toString()

                //transformo en string el dato
                entry[columnWithNumbersAndText] = value

                if (this._headers[columnWithNumbersAndText].indexOf(value) === -1) {
                    this._headers[columnWithNumbersAndText].push(value)
                }
            })
        })

        return this
    }

    async runClustering(): Promise<this> {
        let clustersWithEntries: dataRow[][] = []

        //Normalizo los datos primero en un array de dos dimensiones
        await this._normalizeData()

        //Corro el clusterizador OPTICS
        const optics = new clustering.OPTICS()
        this._clusters = optics.run(this._parsedData, this.neighborhoodRadius, this.minPointsPerCluster)

        //Obtengo el reachability
        const distanceToCenter: number[] = optics
            .getReachabilityPlot()
            .sort((a: number[], b: number[]) => a[0] - b[0])
            .map((x: number[]) => x[1])

        //Agrego el cluster a cada fila y creo el array clustersWithEntries
        this._clusters.forEach((entriesInCluster, clusterIndex) => {
            entriesInCluster.forEach((entryIndex) => {
                //Creo un objeto dentro de entriesInCluster por cada fila en data y le agrego el índice de cluster
                this.clusterizedData.push({
                    'Grupo': clusterIndex + 1,
                    'Distancia de Centro': distanceToCenter[entryIndex] ?? 0,
                    ...this._data[entryIndex],
                })
                clustersWithEntries[clusterIndex] = clustersWithEntries[clusterIndex] ?? []
                clustersWithEntries[clusterIndex] = [...clustersWithEntries[clusterIndex], this._data[entryIndex]]
            })
        })

        //Agrego los atributos tipo attributeNumber para cada header
        Object.keys(this._maximumValuePerHeader).forEach((numberHeader) => {
            clustersWithEntries.forEach((cluster, clusterIndex) => {
                const arrayOfValuesInsideCluster: any[] = cluster.map((entry) => entry[numberHeader])

                const sdev = (array: any[]) => {
                    const n = array.length
                    const mean = array.reduce((a, b) => a + b) / n
                    return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
                }

                this.buyerPersonaData[clusterIndex] = {
                    ...this.buyerPersonaData[clusterIndex],
                    [numberHeader]: {
                        mean: arrayOfValuesInsideCluster.reduce((a, b) => a + b, 0) / arrayOfValuesInsideCluster.length,
                        sdev: sdev(arrayOfValuesInsideCluster),
                        min: Math.min(...arrayOfValuesInsideCluster),
                        max: Math.max(...arrayOfValuesInsideCluster),
                    },
                }
            })
        })

        //Agrego los atributos tipo attributeType para cada header
        Object.keys(this._headers).forEach((header) => {
            if (this._headers[header].length > this.limitValuesPerHeader) {
                delete this._headers[header]
                return
            }

            //Hago el proceso por cada cluster
            clustersWithEntries.forEach((cluster, clusterIndex) => {
                //Creo un objeto por attributeType que contenga los diferentes valores y sus porcentajes
                const newAttributeArray: any[] = this._headers[header]
                    .map((value) => [value, cluster.filter((entry) => entry[header] === value).length / cluster.length])
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .filter((value) => value[1] !== 0)
                //Lo agrego al this.buyerPersonaData
                this.buyerPersonaData[clusterIndex] = {
                    ...this.buyerPersonaData[clusterIndex],
                    [header]: newAttributeArray,
                }
            })
        })

        //Agrego el tamaño de la segmentación en cada buyerPersonaData
        this.buyerPersonaData = this.buyerPersonaData.map((cluster, clusterIndex) => {
            return {
                '# Grupo': clusterIndex + 1,
                'Tamaño del Grupo': this._clusters[clusterIndex].length,
                ...cluster,
            }
        })

        return this
    }
}

export default BuyerPersonaGenerator
