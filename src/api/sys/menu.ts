import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GetAllMenu = '/menu',
  GetActiveMenu = '/menu/active',
  CreateMenu = '/menu',
  UpdateMenu = '/menu/:id',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

export const getActiveMenu = () => {
  return defHttp.get<getMenuListResultModel>({url: Api.GetActiveMenu});
}

export const createMenu = (data) => {
  return defHttp.post<getMenuListResultModel>({url: Api.CreateMenu, data});
}

export const updateMenu = ({data}) => {
  console.log('id:',  data.id)
  return defHttp.put<getMenuListResultModel>({url: Api.UpdateMenu.replace(':id', data.id.toString()), data });
}