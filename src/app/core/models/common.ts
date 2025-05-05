export class ParamBase {
  private _Fecha: string;
  private _FechaHasta: string;
  private cacheName: string;

  constructor(cacheName: string = 'defaultCache') {
      this.cacheName = cacheName;
      this.loadDatesFromCache();
      if (!this.isValidDate(this._Fecha) || !this.isValidDate(this._FechaHasta)) {
          this.WholeMonth();
          this.saveDatesToCache();
      }
  }

  get Fecha(): string {
      return this._Fecha;
  }

  set Fecha(value: string) {
      this._Fecha = value;
      this.saveDatesToCache();
  }

  get FechaHasta(): string {
      return this._FechaHasta;      
  }

  set FechaHasta(value: string) {
      this._FechaHasta = value;
      this.saveDatesToCache();
  }

  public WholeMonth() {
      const today: Date = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const Fecha = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const FechaHasta = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
      this.Fecha = Fecha;
      this.FechaHasta = FechaHasta;
  }

  public saveDatesToCache() {
      const ttl = 10 * 60 * 1000; // 5 minutos en milisegundos
      //localStorage.setItem(`${this.cacheName}_Fecha`, this.Fecha);
      //localStorage.setItem(`${this.cacheName}_FechaHasta`, this.FechaHasta);
      this.setItemWithExpiry(`${this.cacheName}_Fecha`,this.Fecha,ttl);
      this.setItemWithExpiry(`${this.cacheName}_FechaHasta`,this.FechaHasta,ttl);
  }

  private loadDatesFromCache() {
      //const cachedFecha = localStorage.getItem(`${this.cacheName}_Fecha`);
      //const cachedFechaHasta = localStorage.getItem(`${this.cacheName}_FechaHasta`);
      const cachedFecha = this.getItemWithExpiry(`${this.cacheName}_Fecha`);
      const cachedFechaHasta = this.getItemWithExpiry(`${this.cacheName}_FechaHasta`);
      if (cachedFecha) {
          this._Fecha = cachedFecha;
      }
      
      if (cachedFechaHasta) {
          this._FechaHasta = cachedFechaHasta;
      }
  }

  private isValidDate(dateString: string): boolean {
      if (!dateString) {
          return false;
      }
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
  }

  private setItemWithExpiry(key, value, ttl) {
    const now = new Date().getTime();
    const item = {
        value: value,
        expiry: now + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

private getItemWithExpiry(key) {    
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}
}
