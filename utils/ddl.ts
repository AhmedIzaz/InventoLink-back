import { IDDL } from "../interfaces/commonInterfaces/DDLInterface";

interface IMakeDDL<TObject> {
  objectList?: TObject[];
  labelField: keyof TObject;
  valueField: keyof TObject;
  giveOtherInformation?: boolean;
}
export const makeDDL = <TLabel, TValue, TObject>({
  objectList,
  labelField,
  valueField,
  giveOtherInformation = false,
}: IMakeDDL<TObject>): IDDL<TLabel, TValue, TObject>[] => {
  const ddl = objectList?.map((item: TObject) => ({
    ...(giveOtherInformation && { content: { ...item } }),
    label: item[labelField],
    value: item[valueField],
  }));
  return ddl as IDDL<TLabel, TValue, TObject>[];
};
