//New Atlantis plugin sample
class NewAtlantisPluginTest
{
    constructor(_NA) 
    {
        //dependency injection
        this.NA = _NA;   
    }
    
    //parse command from command line
    command(c)
    {
        if (c === "lock")
        {
            this.NA.Log("command lock OK!");
            return true;
        }
        return false;
    }

    //called once per frame
    update(dt)
    {
        //this.NA.Log("update from plugin");
    }
}
