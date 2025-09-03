import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import appConfig from '@/config/appConfig';

const oidcSettings = {
    authority: appConfig.apiUrl + '/identity',
    client_id: appConfig.oidc.clientId,
    redirect_uri: appConfig.oidc.redirectUri,
    response_type: appConfig.oidc.responseType,
    scope: appConfig.oidc.scope,
    post_logout_redirect_uri: appConfig.oidc.postLogoutRedirectUri,
    response_mode: appConfig.oidc.responseMode,
    automaticSilentRenew: appConfig.oidc.automaticSilentRenew,
    silent_redirect_uri: appConfig.oidc.silentRedirectUri,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(oidcSettings);

export default userManager;