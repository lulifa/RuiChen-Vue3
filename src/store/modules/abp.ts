import { defineStore } from "pinia";
import { ABP_APP_KEY, ABP_API_KEY } from "@/enums/cacheEnum";
import { i18n } from "@/plugins/i18n";
import { store, storageLocal } from "../utils";
import { getApplicationConfiguration } from "@/api/abp/abp-configuration";
import { getApiDefinition } from "@/api/abp/abp-definition";
import { ApplicationApiDescriptionModel } from "@/api/abp/abp-definition/model";

const ls = storageLocal();

const defaultApp = {};
const defaultApi = new ApplicationApiDescriptionModel();

const lsApplication = (ls.getItem(ABP_APP_KEY) ||
  defaultApp) as ApplicationConfigurationDto;
const lsApiDefinition = (ls.getItem(ABP_API_KEY) ||
  defaultApi) as ApplicationApiDescriptionModel;

interface AbpState {
  application: ApplicationConfigurationDto;
  apidefinition: ApplicationApiDescriptionModel;
}

export const useAbpStore = defineStore({
  id: "abp",
  state: (): AbpState => ({
    application: lsApplication,
    apidefinition: lsApiDefinition
  }),
  getters: {
    getApplication(state): ApplicationConfigurationDto {
      return state.application || ls.getItem(ABP_APP_KEY);
    },
    getApiDefinition(state): ApplicationApiDescriptionModel {
      return state.apidefinition || ls.getItem(ABP_API_KEY);
    }
  },
  actions: {
    setApplication(application: ApplicationConfigurationDto) {
      this.application = application;
      ls.setItem(ABP_APP_KEY, application);
    },
    removeApplication() {
      this.application = lsApplication;
      ls.removeItem(ABP_APP_KEY);
    },
    setApiDefinition(apidefinition: ApplicationApiDescriptionModel) {
      this.apidefinition = apidefinition;
      ls.setItem(ABP_API_KEY, apidefinition);
    },
    removeApiDefinition() {
      this.definition = lsApiDefinition;
      ls.removeItem(ABP_API_KEY);
    },
    mergeLocaleMessage(localization: ApplicationLocalizationConfigurationDto) {
      const { languagesMap, currentCulture, values } = localization;
      const pureAdminUi = languagesMap["pure-admin-ui"];
      if (!pureAdminUi) return;

      const transferCulture = pureAdminUi.find(
        x => x.value === currentCulture.cultureName
      );
      const transformAbpLocaleMessageDicToI18n = abpLocaleMessageDic => {
        return Object.fromEntries(
          Object.entries(abpLocaleMessageDic).map(([vKey, mValue]) => [
            vKey,
            Object.fromEntries(
              Object.entries(mValue).map(([mKey, msgValue]) => [
                mKey.endsWith(".") ? mKey.slice(0, -1) : mKey,
                msgValue
              ])
            )
          ])
        );
      };
      const targetCultureName = transferCulture
        ? transferCulture.name
        : currentCulture.cultureName;

      i18n.global.mergeLocaleMessage(
        targetCultureName,
        transformAbpLocaleMessageDicToI18n(values)
      );
    },
    async initlizeAbpApplication() {
      const application = await getApplicationConfiguration();
      this.setApplication(application);
      // 多语言合并设置 TO  多语言提示要怎么兼容下
      const { localization } = application;
      this.mergeLocaleMessage(localization);
    },
    async initlizaAbpApiDefinition() {
      const apidefinition = await getApiDefinition();
      this.setApiDefinition(apidefinition);
    }
  }
});

export function useAbpStoreWithOut() {
  return useAbpStore(store);
}
