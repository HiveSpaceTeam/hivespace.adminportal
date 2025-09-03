import userManager from "./user-manager";
// import store from "@/stores/store";

const oAuthSignin = async () => {
  // store.commit("moduleLoading/setLoading", true, { root: true });
  try {
    const user = await userManager.signinSilent();
    console.log("Silent signin successful", user);
  } catch (error) {
    console.warn("Silent signin failed, redirecting to login", error);
    await userManager.signinRedirect();
  }
  finally {
    // store.commit("moduleLoading/setLoading", false, { root: true });
  }
};

export { oAuthSignin };