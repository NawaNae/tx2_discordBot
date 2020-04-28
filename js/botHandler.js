const { red, green, blue, yellow, cyan } = require('chalk');
const TFsymbol=new Map([[true,":ballot_box_with_check:"],[false,":x:"]]);
const Path=require("../PathSetting");
const HelpTranslate=require(Path.rootSpace+"translate.json");
class BotCmdHandler
{
    constructor(bot,settingsManager)
    {
        this.loading();
        bot.on("message",msg=>this.messageAssignment(msg));
        bot.on("ready",()=>this.ready());
        this.bot=bot;
        this.settingsManager=settingsManager
        this.settings=settingsManager.settings;
        this.installedPath=[];
        this.functions=[];
    }
    loading()
    {
        console.log(cyan(`[bot] :: BotHandler is loading`));
    }
   ready()
    {
        for(let func of this.functions)
            func.onready();
        console.log(green(`[bot] :: ${this.bot.user.tag} is online and ready`));
        console.log(green(`[bot] :: my prefix is: ${this.settings.prefix}`));
        console.log(yellow('============================================================================'));
        //this.setStatus(`${this.settings.prefix}? bug report 繩繩#2404`);
    }
    setStatus(string)
    {
        this.bot.user.setPresence({ activity: { name: string,type:'WATCHING' }, game: { name: string,type:'WATCHING' }, status: 'online' });
    }
    installFunction(functionsObject)
    {

        if(this.functions.filter(func=>func.name==functionsObject.name).length>0)
        {
            if(this.installedPath.indexOf(functionsObject.settings.filePath)!=-1)
            {
                //same file installed 
            }
            else
                console.log(yellow(`[bot] :: [warning] load dupulicate function name from settings.json`))
        }
        else
        {

            this.functions.push(functionsObject);
            console.log(cyan(`[bot] :: load ${{"cmd":"command","func":"function"}[functionsObject.settings.type]} "${functionsObject.name}" ${functionsObject.settings.alias.length>0?`alias ${functionsObject.settings.alias}`:""}`));
            this.installedPath.push(functionsObject.settings.filePath);
        }
            
        
    }
    async messageAssignment(msg)
    {

        const content=msg.content;
        const mentions=msg.mentions;
        const tags=mentions.users
        let bot=this.bot;
        const botid=bot.user.id;
        const settings=this.settings;
        let cmd = content.split(" ")[0].slice(settings.prefix.length);
        let args = content.split(" ").slice(1);
        if(content.startsWith(settings.prefix))
            console.log((`[COMMAND RAN] :: ${content}`));
        else
            cmd="";
        let runnedCmd=false;
        for(let func of this.functions)
        {
            let alias=[func.name].concat(func.settings.alias);
            if(alias.indexOf(cmd)!=-1&&func.settings.type=="cmd"&&!runnedCmd)
            {
                func.onmessage({"cmd":cmd,"args":args,"msg":msg,"content":msg.content,"channel":msg.channel,"member":msg.member,"author":msg.author});
                runnedCmd=true;//only one command
            }
            else if(func.settings.type=="func")
                func.onmessage({"msg":msg,"content":msg.content,"member":msg.member,"channel":msg.channel,"author":msg.author});
            if(!msg)
                break;
                
        }
    }
}
class Functions
{
    constructor(settingsManager,botHandler)
    {
        this.botHandler=botHandler;
        this.bot=botHandler.bot;
        //call super(s) and settingProcess
        this.name="please set a name then call settingProcess()";
        this.defaultSetting=
        {
            "enable":true,
            "type":"func",
            "alias":[],
            "op":false,
            "selfcmd":true
        };
        this.settingsManager=settingsManager;
        this.formatHelpString="";
    }
    settingsProcess()
    {
        let settings=this.settingsManager.settings.functions[this.name];
        if(!settings)
            settings=this.defaultSetting;
        
        settings={...this.defaultSetting,...this.settingsManager.settings.functions[this.name]};
        this.settings=this.settingsManager.settings.functions[this.name];
        if(JSON.stringify(settings)!=JSON.stringify(this.settings))
        {
            this.settings=this.settingsManager.settings.functions[this.name]=settings;
            this.settingsManager.save();
        }
          
    }
    opVerify(user)
    {
        return !this.settings["op"]||(this.settings.op&&this.settingsManager.settings.ops.indexOf(user.id)!=-1);
    }
    selfcmdVerify(user)
    {
        return this.settings.selfcmd||user.id!=this.bot.user.id;
    }
    
    whiteVerify(channelorGuild,key)
    {
        return (this.settings[key]&&this.settings[key].indexOf(channelorGuild.id)!=-1);
    }
    blackVerify(channelorGuild,key)
    {
        return (this.settings[key]&&this.settings[key].indexOf(channelorGuild.id)==-1);
    }
    parameterVerify(channelorGuild,key)
    {
        return !channelorGuild||!this.settings[key];
    }
    whitePVerify(channelorGuild,key)
    {
        return this.parameterVerify(channelorGuild,key)||this.whiteVerify(channelorGuild,key);
    }
    blackPVerify(channelorGuild,key)
    {
        return this.parameterVerify(channelorGuild,key)||this.blackVerify(channelorGuild,key);
    }
    /**
     * send msg to channel
     * @param {string|channel} channel
     * @param {string} content
     */
    sendOrEdit(channel,content="")
    {
        if(channel.constructor.name==="String")
            channel=this.bot.channels.get(channelId);
        if(!channel)return;
        if(channel.lastMessage.author.id===this.bot.user.id)
        {
            channel.lastMessage.edit(content);
            return false;
        }
        else
        {
            channel.send(content);
            return true;
        }
           
    }
    tryDelete(msg)
    {
            msg.delete().then(()=>{}).catch(()=>{});
   
    }
    verifys(msg)
    {
        const author=msg.author,channel=msg.channel,guild=msg.guild;
        if(!this.selfcmdVerify(author))return false;
        if(!(this.settings.enable)&&(this.opVerify(author)))return false;
        if(!this.parameterVerify(channel,"channels")&&!this.parameterVerify(guild,"bannedGuilds"))
            if(this.whiteVerify(channel,"channels"))
                return true;
        if(!(this.whitePVerify(channel,"channels")&&this.blackPVerify(channel,`bannedChannels`)))return false;
        if(!(this.whitePVerify(guild,"guilds")&&this.blackPVerify(guild,`bannedGuilds`)))return false;

        return true;
        
    }
    onmessage({cmd,args,msg,content,channel,author,member})
    {
       if(this.verifys(msg))
            return ;
        
                
            
    }
    onready()
    {

    }
    get stausString()
    {
        let ans=`${this.name}:${this.settings.alias.length>0?`\n    alias : ${this.settings.alias}`:""} 
    enable : ${TFsymbol.get(this.settings.enable)}    op : ${TFsymbol.get(this.settings.op)}
    type : ${{"cmd":"command","func":"function"}[this.settings.type]}
`;
        let chkey=["channels","bannedChannels"];
        for(let key of chkey)
        {
            if(this.settings[key])
            {
                ans+=`        ${key}\n`;
                let chs=this.settings[key];
                for(let ch of chs)
                {
                    let chO=this.bot.channels.get(ch)
                    if(chO)
                    {
                        
                        ans+=`            ${chO.guild.name}/${chO.name}\n`;
                    }
                }
            }
        }
        let gukey=["guilds","bannedGuilds"];
        for(let key of gukey)
        {
            if(this.settings[key])
            {
                ans+=`        ${key}\n`
                let gus=this.settings[key];
                for(let gu of gus)
                {
                    let guO=this.bot.guilds.get(gu)
                    if(guO)
                    {
                        ans+=`            ${guO.name}\n`;
                    }
                }
            }
        }
        let noShow=gukey.concat(chkey).concat(["type","enable","op","filePath","alias"]);
        let propProc=(setting=this.settings,tabSpace="    ")=>
        {
            for(let key in setting)
            {
                if(!noShow.find(k=>k==key))
                {
                    if(setting[key].constructor.name==="Object")
                    {
                        ans+=`${tabSpace}${key} : \n`
                        propProc(setting[key],tabSpace.concat("    "));
                    }
                    else if(setting[key].constructor.name==="Boolean")
                        ans+=`${tabSpace}${key} : ${TFsymbol.get(setting[key])}\n`;
                    else
                        ans+=`${tabSpace}${key} : ${setting[key]}\n`;
                }
            }
        }
        propProc();
        
        
        return ans;
    }
    get helpString()
    {
        return `${this.name}${this.settings.alias.length>0?`,${this.settings.alias}`:''}
    ${HelpTranslate[this.settingsManager.settings.translate][this.name]}${this.formatHelpString!=""?`\n\`${this.formatHelpString}\``:""}\n\n`;
    }
}
class Cmd extends Functions
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.defaultSetting=
        {
            "enable":true,
            "type":"cmd",
            "alias":[],
            "op":false,
            "selfcmd":true
        };
        //must call settingProcess(); after set a name
    }
}
module.exports={BotCmdHandler,Functions,Cmd};