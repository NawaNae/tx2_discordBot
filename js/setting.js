const fs=require("fs");
const Path=require("../PathSetting");
var Setting=class Setting
{
    constructor(settingsPath=Path.settings)
    {
        this.settingsPath=settingsPath;
        this.parseSetting();
    }
    parseSetting()
    {
        this.settings=require(this.settingsPath);
    }
    save()
    {
        fs.writeFileSync(this.settingsPath,JSON.stringify(this.settings));
    }

    
    traverseKey(key)
    {
        let setting,keys;
        if(key.constructor.name==="String")
            if(key.split(".").length>1)
                keys=key.split(".");
            else
                keys=[key];
        if(key.constructor.name==="Array")
            keys=key;

        setting=this.settings;
        for(keys=keys.reverse(); keys.length>1; setting=setting[key])
            key=keys.pop();
            
        key=keys.pop();
        return {"setting":setting,"key":key};
    }
    set(key,value)
    {
        var {setting,key}=this.traverseKey(key);
        setting[key]=value;
        this.save();
    }
    delete(key)
    {
        var {setting,key}=this.traverseKey(key);
        delete setting[key];
        this.save();
    }
    manipulateArray(key,value,operator="add")
    {
        var {setting,key}=this.traverseKey(key);
        let temps=new Set(setting[key]);
        temps[operator](value);
        setting[key]=Array.from(temps);
        this.save();
    }
    /**
     *
     * "C"reate array when no properity
     * "D"elete properity when array = [] then called 
     *
     */
    manipulateArrayCD(key,value,operator="add")
    {
        var {setting,key}=this.traverseKey(key);
        if(setting[key]===undefined)
            setting[key]=[];
        if(setting[key].length==0&&operator=="delete")
        {
            delete setting[key];
            this.save();
            return;
        }
        let temps=new Set(setting[key]);
        temps[operator](value);
        setting[key]=Array.from(temps);
        this.save();
    }
    funcSet(key,value)
    {
        this.set(`functions.${key}`,value);
    }
    funcManipulateArray(key,value)
    {
        this.funcManipulateArray(`functions.${key}`,value);
    }
    funcAliassearch(alias)
    {
        for(let key in this.settings.functions)
        {
            let setting=this.settings.functions[key];
            if(setting.alias.indexOf(alias)!==-1)
                return key;
        }
        return undefined;
    }
}
module.exports=Setting;