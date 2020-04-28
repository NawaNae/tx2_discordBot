const Path=require("../PathSetting");
const {Cmd} =require(`${Path.jsFolder}botHandler.js`);
const fs=require("fs");
const {random}=require(`${Path.jsFolder}util`);
class GetFile extends Cmd
{
    constructor(settingsManager,botHandler)
    {
        super(settingsManager,botHandler);
        this.name="getfile";
        this.defaultSetting.alias=["get"];
        this.defaultSetting.op=true;
        this.defaultSetting.filePath= __filename.slice(__dirname.length + 1);
        this.settingsProcess();
    }
    onmessage({cmd,args,msg})
    {
        if(!this.verifys(msg))return;
        let content=msg.content;
        let toCh;
        let files=args[0].split(",");
        files=files.filter(f=>fs.existsSync(Path.rootSpace+f)).map(f=>{
            let sp=f.split("/");
            return {attachment:f,name:sp[sp.length-1]}
        })
        msg.channel.send({files:files});
        
    }
}
module.exports=GetFile;