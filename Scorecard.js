//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
//request(url, cb);
function processSinglematch(url) {

    request(url, cb);
}


function cb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        
        dataExtractor(html);
    }
}
function dataExtractor(html){
        let searchTool = cheerio.load(html);
    
        let infoElem = searchTool(".event .match-info.match-info-MATCH .description");
        let matchInfo = infoElem.text().split(",");
        let venue = matchInfo[1].trim();
        
        let date = matchInfo[2].trim();
        //console.log(venue +" -- "+ date);
        let resultInfo = searchTool(".event .match-info.match-info-MATCH .status-text");
        let result = resultInfo.text().trim();
        //console.log(result);
        
        
        let bothInningArr = searchTool(".Collapsible h5");
        let batsmanTable = searchTool(".Collapsible .table.batsman");
        for(let i = 0; i < bothInningArr.length; i++){
            let allRows = searchTool(batsmanTable[i]).find("tbody tr");
            //console.log(allRows);
            for(let j = 0; j < allRows.length; j++){
                let allCols = searchTool(allRows[j]).find("td");
                //console.log(allCols);
                if(allCols.length == 8){
                    let myTeam = searchTool(bothInningArr[i]).text().split("INNINGS")[0].trim();
                    //console.log(myTeam);
                    let opponentTeam = i == 0 ? searchTool(bothInningArr[1]).text() : searchTool(bothInningArr[0]).text();
                    opponentTeam = opponentTeam.split("INNINGS")[0].trim();
                    //console.log(opponentTeam);
                    let playerName = searchTool(allCols[0]).text().trim();
                    let runs = searchTool(allCols[2]).text().trim();
                    let balls = searchTool(allCols[3]).text().trim();
                    let chauka = searchTool(allCols[5]).text().trim();
                    let chhakka = searchTool(allCols[6]).text().trim();
                    let ausat = searchTool(allCols[7]).text().trim();
                    console.log(myTeam + "--" + playerName + "--" + venue  + "--" + date + "--" + opponentTeam + "||" + result + "||" + runs + "--" + balls + "--" + chauka + "--" + chhakka + "--" + ausat);
                    console.log("**************************************************************************************************************************************************************************");
                    teamFolder(myTeam, playerName, venue, date, opponentTeam, result, runs, balls, chauka, chhakka, ausat);
                }
            }
        }
        //myTeam✔,name,venue✔,date✔,opponent✔,result✔,run,ball,fours,sixers,strikeRate        
 }
 function teamFolder(myTeam, playerName, venue, date, opponentTeam, result, runs, balls, chauka, chhakka, ausat){
    let teamFolderPath = path.join(__dirname,"IPL",myTeam);
    dirCreater(teamFolderPath);
    let playerNamePath = path.join(teamFolderPath,playerName + ".json");
    let contentinArr = [];
    let matchObject = {
        myTeam, playerName, venue, date, opponentTeam, result, runs, balls, chauka, chhakka, ausat
    }
    contentinArr.push(matchObject);
    if(fs.existsSync(playerNamePath)){
        let data = fs.readFileSync(playerNamePath);
        contentinArr = JSON.parse(data);
    }
    contentinArr.push(matchObject);
    fs.writeFileSync(playerNamePath, JSON.stringify(contentinArr));

 }
 function dirCreater(teamFolderPath){
     if(fs.existsSync(teamFolderPath) == false){
         fs.mkdirSync(teamFolderPath);
     }
 }
 module.exports = {
        processSinglematch
    }
