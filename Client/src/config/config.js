let CONFIG = null;

export const loadConfig = async ()=>{

    if(!CONFIG){
        const res = await fetch('/config.json?' + Date.now());
        CONFIG = await res.json();
    }

    return CONFIG;

}

export const getAPIBaseURL = ()=>{
    if(!CONFIG) throw new Error("Config not loaded");
    return CONFIG.apiUrl;
}