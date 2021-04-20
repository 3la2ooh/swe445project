export enum OS {
  iOS,
  Android,
  Windows,
  WindowsPhone,
  MacOS
}

export interface Specification {
  display: number;
  camera: number;
  ram: number;
  os: OS;
}

export class CatalogItem {
  constructor(readonly name: string,
              readonly price: number,
              readonly imageUrl: string[],
              readonly rating: number,
              readonly description: string,
              readonly specifications: Specification,
              readonly id?: string,) {}
}
