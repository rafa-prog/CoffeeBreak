import IBuilder from "../builder/IBuilder";

export default class Director {
  constructor(private _builder: IBuilder) {}

  constructAdmin() {
    // colocar gerencia
  }

  constructFuncionario() {
    // colocar comanda + config
  }
}
