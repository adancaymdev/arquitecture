import {IDatabase} from "@domain/interfaces/persistence/IDatabase";

export interface IMigration {
  up(db: IDatabase): Promise<void>;
  down(db: IDatabase): Promise<void>;
}
