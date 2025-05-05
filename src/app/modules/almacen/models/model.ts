import { CondIvaOperacion, UnidadMedida } from '../../global/models/model';

export class Familia {
    Id: string;
    Nombre: string;
    IdFamilia: string;
    CtaIngresoDefault: string;
    CtaEgresoDefault: string;
}
export class Deposito {
    Id: string;
    Nombre: string;
}
export class Marca {
    Id: string;
    Nombre: string;
}

export class Articulo {
    constructor();
    constructor(
        public _id?: string,
        public _nombre?: string
    ) {
        this.Id = _id;
        this.Nombre = _nombre;
    }
    Id: string;
    Nombre: string;
    IdFamilia?: string;
    IdMarca?: string;
    IdUnidad?: string;
    Estado?: string;
    CostoVenta: number = 0;
    ImpuestoVenta: number = 0;
    PrecioVenta: number = 0;
    AlicuotaIva: number = 0;
    CondIva?: string;
    PrecioVentaFinal: number = 0;
    MargenVenta: number = 0;
    StockMinimo: number = 0;
    StockActual: number = 0;
    StockReposicion: number = 0;
    StockMaximo: number = 0;
    Observacion?: string;
    Familia?: Familia;
    UnidadMedida?: UnidadMedida;
    EsServicio?:boolean;
}
export class ItemCarrito {
    Articulo: Articulo;
    Cantidad: number;
}
export class Stock {
    Id: number;
    IdArticulo: string;
    IdDeposito: string;
    IdLote: number;
    IdSerie: number;
    Cantidad: number;
    Articulo: Articulo;
    Deposito: Deposito;
}

export class FormAjusteStock {
    Stock: Stock;
    Fecha: string;
    Concepto: string;
    Cantidad: number;
}





