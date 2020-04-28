const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
class Add extends Cmd
{
    constructor(settingsManager,bot)
    {
        super(settingsManager,bot);
        this.name="add";
        this.defaultSetting.alias=["A","push"];
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let func=args[0],key=`functions.${func}.${args[1]}`;
        let config=this.settingsManager.settings.functions;
        if(!config[func])
        {
            msg.channel.send(`no such a function name is called ${func}`);
            return ;
        }
        if(msg.mentions.channels.size>0)
        {
            for(let [id,value] of msg.mentions.channels)
            {
                this.settingsManager.manipulateArrayCD(key,id,"add")
            }
        }
        else
        {
            let chs=args[2].split(",");
            for(let id of chs)
                this.settingsManager.manipulateArrayCD(key,id,"add")
        }
    
    }
}
class Remove extends Cmd
{
    constructor(settingsManager,bot)
    {
        super(settingsManager,bot);
        this.name="remove";
        this.defaultSetting.alias=["rm","delete","D"];
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    async onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let bot=this.bot;
        let func=args[0],key=`functions.${func}.${args[1]}`;
        if(!isNaN(func))
        {
            let delNumbers=parseInt(func);
            let delCount=0;
            while(delNumbers>delCount)
            {

                let msgs=  await msg.channel.fetchMessages({limit:100});
                let botMsgs=msgs.filter(m => m.author.id === bot.user.id);
                if(botMsgs.size==0)break;
                for(let [key,m] of botMsgs)
                {
                    if(delCount>=delNumbers)
                    break;
                    m.delete();
                    delCount++;
                }
            }
            if(this.bot.user.id!=msg.author.id)
                msg.channel.send(`remove ${delCount} messages in ${msg.channel.name?msg.channel.name:"this channel"}\nautomatically delete this in 5s`)
                .then(replymsg=>
                    {
                        setTimeout(()=>replymsg.delete(),5000);
                    });
            
            return;
        }
        let config=this.settingsManager.settings.functions;
        if(!config[func])
        {
            msg.channel.send(`no such a function name is called ${func}`);
            return ;
        }
        else
        {
            if(!config[func][args[1]])
                 config[func][args[1]]=[];
        }
        if(msg.mentions.channels.size>0)
        {
            for(let [id,value] of msg.mentions.channels)
            {
                this.settingsManager.manipulateArrayCD(key,id,"delete")
            }
        }
        else
        {
            if(!args[2])
            {
                this.settingsManager.delete(key);
            }
            else
            {
                let chs=args[2].split(",");
                for(let id of chs)
                    this.settingsManager.manipulateArrayCD(key,id,"delete");
            }
            
        }
    
    }
}
module.exports={Add,Remove};