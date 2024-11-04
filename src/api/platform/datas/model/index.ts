/*
 * @Author: lulifa 814570123@qq.com
 * @Date: 2024-11-04 15:23:36
 * @LastEditors: lulifa 814570123@qq.com
 * @LastEditTime: 2024-11-04 15:23:41
 * @FilePath: \RuiChen-Vue3\src\api\platform\datas\model\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface DataItem {
  id: string;
  allowBeNull: boolean;
  defaultValue?: string;
  description?: string;
  displayName: string;
  name: string;
  valueType: ValueType;
}

export interface Data {
  id: string;
  name: string;
  code: string;
  displayName: string;
  description?: string;
  parentId?: string;
  items: DataItem[];
}

export enum ValueType {
  String = 0,
  Numeic = 1,
  Boolean = 2,
  Date = 3,
  DateTime = 4,
  Array = 5,
  Object = 6
}

export interface GetDataByPaged extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface DataPagedResult extends PagedResultDto<Data> {}

export interface DataListResult extends ListResultDto<Data> {}

export class CreateOrUpdateData {
  name = "";
  displayName = "";
  description? = "";
}

export class CreateData extends CreateOrUpdateData {
  parentId?: string;
}

export class UpdateData extends CreateOrUpdateData {}

export class CreateOrUpdateDataItem {
  defaultValue = "";
  displayName = "";
  description? = "";
  allowBeNull = true;
  valueType = ValueType.String;
}

export class UpdateDataItem extends CreateOrUpdateDataItem {}

export class CreateDataItem extends CreateOrUpdateDataItem {
  name = "";
}
